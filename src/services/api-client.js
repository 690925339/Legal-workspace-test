/**
 * API 客户端基类
 * - 自动注入 JWT Token
 * - 统一错误处理
 * - 支持请求取消 (AbortController)
 * - 支持 SSE 流式请求
 * - 请求缓存
 */
import { getSupabaseClient } from '@/config/supabase'
import { CACHE_CONFIG } from '@shared/constants'

class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || ''
    this.pendingRequests = new Map() // 用于管理可取消的请求
    this.requestCache = new Map() // 请求缓存
    this.cacheExpiry = CACHE_CONFIG.DEFAULT_EXPIRY
  }

  /**
   * 获取认证 Token
   */
  async getToken() {
    const supabase = getSupabaseClient()
    if (!supabase) return null
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  /**
   * 通用请求方法
   * @param {string} endpoint - API 端点
   * @param {object} options - fetch 选项
   * @param {string} [options.requestId] - 可选的请求 ID，用于取消请求
   */
  async request(endpoint, options = {}) {
    const { requestId, ...fetchOptions } = options

    // 如果有相同 requestId 的请求正在进行，先取消它
    if (requestId && this.pendingRequests.has(requestId)) {
      this.pendingRequests.get(requestId).abort()
    }

    const controller = new AbortController()
    if (requestId) {
      this.pendingRequests.set(requestId, controller)
    }

    try {
      const token = await this.getToken()
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal
      })

      if (!response.ok) {
        const error = await this._parseError(response)
        throw error
      }

      return response.json()
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Request ${requestId} was cancelled`)
        return null
      }
      throw this._handleError(error)
    } finally {
      if (requestId) {
        this.pendingRequests.delete(requestId)
      }
    }
  }

  /**
   * GET 请求
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST 请求
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT 请求
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE 请求
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * 带缓存的 GET 请求
   */
  async cachedGet(endpoint, options = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`
    const cached = this.requestCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }

    const data = await this.get(endpoint, options)
    this.requestCache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  }

  /**
   * 清除缓存 (写操作后调用)
   */
  invalidateCache(pattern) {
    for (const key of this.requestCache.keys()) {
      if (key.includes(pattern)) {
        this.requestCache.delete(key)
      }
    }
  }

  /**
   * 取消指定请求
   */
  cancelRequest(requestId) {
    if (this.pendingRequests.has(requestId)) {
      this.pendingRequests.get(requestId).abort()
      this.pendingRequests.delete(requestId)
    }
  }

  /**
   * SSE 流式请求 (AI 对话等场景)
   */
  async streamRequest(endpoint, options = {}, onChunk, onError) {
    const token = await this.getToken()
    const controller = new AbortController()

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
          ...options.headers
        },
        signal: controller.signal
      })

      if (!response.ok) {
        throw await this._parseError(response)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        onChunk(chunk)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (onError) onError(error)
        throw this._handleError(error)
      }
    }

    // 返回取消函数
    return () => controller.abort()
  }

  // ========== 私有方法 ==========

  async _parseError(response) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      message = body.message || body.error || message
    } catch {
      // 忽略解析错误
    }

    const error = new Error(message)
    error.status = response.status
    error.isApiError = true
    return error
  }

  _handleError(error) {
    // 可扩展：上报错误、显示 Toast 等
    console.error('[ApiClient Error]', error)
    return error
  }
}

export const apiClient = new ApiClient()
export default ApiClient

