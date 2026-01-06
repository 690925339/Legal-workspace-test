/**
 * API 客户端基类
 * - 自动注入 JWT Token
 * - 统一错误处理
 * - 支持请求取消 (AbortController)
 * - 支持 SSE 流式请求
 * - 请求缓存
 * - 支持请求/响应拦截器
 */
import { getSupabaseClient } from '../config/supabase'
import { CACHE_CONFIG } from '../shared/constants'

class ApiClient {
  /**
   * @param {string} [baseUrl] - API 基础 URL
   */
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || ''
    this.pendingRequests = new Map() // 用于管理可取消的请求
    this.requestCache = new Map() // 请求缓存
    this.cacheExpiry = CACHE_CONFIG.DEFAULT_EXPIRY

    // 拦截器
    this.interceptors = {
      request: [],
      response: []
    }
  }

  /**
   * 添加请求拦截器
   * @param {(config: object) => object | Promise<object>} onFulfilled 
   * @param {(error: any) => any} [onRejected] 
   * @returns {number} 拦截器 ID
   */
  addRequestInterceptor(onFulfilled, onRejected) {
    this.interceptors.request.push({ onFulfilled, onRejected })
    return this.interceptors.request.length - 1
  }

  /**
   * 添加响应拦截器
   * @param {(response: Response) => Response | Promise<Response>} onFulfilled 
   * @param {(error: any) => any} [onRejected] 
   * @returns {number} 拦截器 ID
   */
  addResponseInterceptor(onFulfilled, onRejected) {
    this.interceptors.response.push({ onFulfilled, onRejected })
    return this.interceptors.response.length - 1
  }

  /**
   * 获取认证 Token
   * @returns {Promise<string|null>} Access Token
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
   * @returns {Promise<any>} 响应数据
   */
  async request(endpoint, options = {}) {
    let { requestId, ...fetchOptions } = options

    // 1. 构建初始配置
    let config = {
      url: `${this.baseUrl}${endpoint}`,
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
      }
    }

    // 自动注入 Token (可以通过拦截器覆盖)
    const token = await this.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. 执行请求拦截器
    try {
      for (const interceptor of this.interceptors.request) {
        if (interceptor.onFulfilled) {
          config = await interceptor.onFulfilled(config)
        }
      }
    } catch (error) {
      // 请求拦截器报错，直接抛出，不发请求
      return Promise.reject(this._handleError(error))
    }

    // 处理请求取消
    if (requestId) {
      // 如果有相同 requestId 的请求正在进行，先取消它
      if (this.pendingRequests.has(requestId)) {
        this.pendingRequests.get(requestId).abort()
      }
      const controller = new AbortController()
      this.pendingRequests.set(requestId, controller)
      config.signal = controller.signal
    }

    try {
      // 3. 发送请求
      let response = await fetch(config.url, config)

      // 4. 执行响应拦截器 (成功)
      for (const interceptor of this.interceptors.response) {
        if (interceptor.onFulfilled) {
          response = await interceptor.onFulfilled(response)
        }
      }

      if (!response.ok) {
        throw await this._parseError(response)
      }

      return response.json()
    } catch (error) {
      // 5. 执行响应拦截器 (失败)
      let handledError = error
      for (const interceptor of this.interceptors.response) {
        if (interceptor.onRejected) {
          try {
            // 拦截器可以处理错误并返回一个新的结果，或者重新抛出错误
            // 这里简化逻辑：如果拦截器返回了值，我们认为它处理了错误？
            // 通常拦截器抛出错误继续传播
            await interceptor.onRejected(handledError)
          } catch (e) {
            handledError = e
          }
        }
      }

      if (handledError.name === 'AbortError') {
        console.log(`Request ${requestId} was cancelled`)
        return null // 或者抛出特定 CancelToken
      }
      throw this._handleError(handledError)
    } finally {
      if (requestId) {
        this.pendingRequests.delete(requestId)
      }
    }
  }

  /**
   * GET 请求
   * @param {string} endpoint 
   * @param {object} options 
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST 请求
   * @param {string} endpoint 
   * @param {any} data 
   * @param {object} options 
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
   * @param {string} endpoint 
   * @param {any} data 
   * @param {object} options 
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
   * @param {string} endpoint 
   * @param {object} options 
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * 带缓存的 GET 请求
   * @param {string} endpoint 
   * @param {object} options 
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
   * @param {string} pattern - 匹配键及其子串
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
   * @param {string} requestId 
   */
  cancelRequest(requestId) {
    if (this.pendingRequests.has(requestId)) {
      this.pendingRequests.get(requestId).abort()
      this.pendingRequests.delete(requestId)
    }
  }

  /**
   * SSE 流式请求 (AI 对话等场景)
   * @param {string} endpoint 
   * @param {object} options 
   * @param {(chunk: string) => void} onChunk 
   * @param {(error: Error) => void} onError 
   */
  async streamRequest(endpoint, options = {}, onChunk, onError) {
    const token = await this.getToken()
    const controller = new AbortController()

    let config = {
      url: `${this.baseUrl}${endpoint}`,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    // 手动注入 Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 流式请求暂不完整支持通用拦截器，因为 fetch 处理方式不同
    // 但可以支持请求拦截器修改 headers
    try {
      for (const interceptor of this.interceptors.request) {
        if (interceptor.onFulfilled) {
          config = await interceptor.onFulfilled(config)
        }
      }
    } catch (error) {
      if (onError) onError(error)
      return () => { }
    }


    try {
      const response = await fetch(config.url, {
        ...config,
        headers: {
          ...config.headers,
          Accept: 'text/event-stream',
        },
        signal: controller.signal
      })

      if (!response.ok) {
        throw await this._parseError(response)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        onChunk(chunk)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (onError) onError(error)
        this._handleError(error) // log it
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
    // 执行响应拦截器的错误处理部分已经在 catch 中做了
    // 这里主要做兜底日志
    console.error('[ApiClient Error]', error)
    return error
  }
}

export const apiClient = new ApiClient()
export default ApiClient
