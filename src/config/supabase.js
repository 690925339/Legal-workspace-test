// Supabase 配置 - 从环境变量读取
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 验证环境变量
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env file contains:')
  console.error('  - VITE_SUPABASE_URL')
  console.error('  - VITE_SUPABASE_ANON_KEY')
}

let supabaseClient = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      console.log('✅ Supabase client initialized')
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error)
      return null
    }
  }
  return supabaseClient
}

// 用户认证相关函数
export const authService = {
  // 注册新用户
  async signUp(email, password, metadata = {}) {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // 登录
  async signIn(email, password) {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 登出
  async signOut() {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase client not initialized' } }

    // 使用 'global' scope 确保服务器端会话也被清除
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    return { error }
  },

  // 获取当前用户
  async getCurrentUser() {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: { user: null } }

    const {
      data: { user }
    } = await supabase.auth.getUser()
    return { data: { user } }
  },

  // 获取当前会话
  async getSession() {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: { session: null } }

    const {
      data: { session }
    } = await supabase.auth.getSession()
    return { data: { session } }
  },

  // 监听认证状态变化
  onAuthStateChange(callback) {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: { subscription: null } }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(callback)
    return subscription
  },

  // 重置密码
  async resetPassword(email) {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  // 更新用户信息
  async updateUser(updates) {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase.auth.updateUser(updates)
    return { data, error }
  }
}

// 筛选项服务
export const filterService = {
  // 获取案例检索筛选项
  async getCaseFilterOptions() {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: [], error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase
      .from('search_filter_options')
      .select('filter_key, label, value, display_order')
      .eq('category', 'case')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return { data, error }
  },

  // 获取法规检索筛选项
  async getRegulationFilterOptions() {
    const supabase = getSupabaseClient()
    if (!supabase) return { data: [], error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase
      .from('search_filter_options')
      .select('filter_key, label, value, display_order')
      .eq('category', 'regulation')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return { data, error }
  },

  // 按 filter_key 分组获取筛选项
  groupByFilterKey(options) {
    if (!options) return {}
    return options.reduce((acc, item) => {
      if (!acc[item.filter_key]) {
        acc[item.filter_key] = []
      }
      acc[item.filter_key].push({ label: item.label, value: item.value })
      return acc
    }, {})
  }
}

// 品牌设置服务
export const brandService = {
  // 缓存品牌设置
  _storageKey: 'brand_settings_v3', // 本地存储键名
  _cacheDuration: 30 * 60 * 1000, // 30分钟缓存

  // 获取所有品牌设置
  async getBrandSettings() {
    // 1. 检查内存缓存
    if (this._cache && this._cacheTime && Date.now() - this._cacheTime < this._cacheDuration) {
      return { data: this._cache, error: null }
    }

    // 2. 检查本地存储（实现秒开，避免闪烁）
    try {
      const stored = localStorage.getItem(this._storageKey)
      if (stored) {
        const { data, timestamp } = JSON.parse(stored)
        if (data && timestamp && Date.now() - timestamp < this._cacheDuration) {
          this._cache = data
          this._cacheTime = timestamp
          // 返回本地数据，同时并在后台静默更新（可选，这里简化为直接返回有效数据）
          return { data: this._cache, error: null }
        }
      }
    } catch (e) {
      console.warn('Failed to load brand settings from localStorage', e)
    }

    const supabase = getSupabaseClient()
    if (!supabase) return { data: {}, error: { message: 'Supabase client not initialized' } }

    const { data, error } = await supabase
      .from('brand_settings')
      .select('setting_key, setting_value, setting_type')

    if (!error && data) {
      // 转换为键值对象
      this._cache = data.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value
        return acc
      }, {})
      this._cacheTime = Date.now()

      // 3. 更新本地存储
      try {
        localStorage.setItem(
          this._storageKey,
          JSON.stringify({
            data: this._cache,
            timestamp: this._cacheTime
          })
        )
      } catch (e) {
        console.warn('Failed to save brand settings to localStorage', e)
      }
    }

    return { data: this._cache || {}, error }
  },

  // 获取单个设置
  async getSetting(key, defaultValue = '') {
    const { data } = await this.getBrandSettings()
    return data[key] || defaultValue
  },

  // 清除缓存
  clearCache() {
    this._cache = null
    this._cacheTime = null
    try {
      localStorage.removeItem(this._storageKey)
    } catch (e) {
      // Ignore localStorage removal errors
    }
  }
}

// 用户资料服务（带缓存，避免闪烁）
export const profileService = {
  _cache: null,
  _cacheTime: null,
  _storageKey: 'user_profile_v1',
  _cacheDuration: 30 * 60 * 1000, // 30分钟缓存

  /**
   * 获取用户资料（缓存优先）
   * @param {string} userId - 用户ID
   * @returns {Promise<{data: object|null, error: object|null, fromCache: boolean}>}
   */
  async getProfile(userId) {
    if (!userId) return { data: null, error: { message: 'No user ID' }, fromCache: false }

    const cacheKey = `${this._storageKey}_${userId}`

    // 1. 检查内存缓存
    if (this._cache && this._cacheTime && Date.now() - this._cacheTime < this._cacheDuration) {
      return { data: this._cache, error: null, fromCache: true }
    }

    // 2. 检查 localStorage 缓存（实现秒开）
    try {
      const stored = localStorage.getItem(cacheKey)
      if (stored) {
        const { data, timestamp } = JSON.parse(stored)
        if (data && timestamp && Date.now() - timestamp < this._cacheDuration) {
          this._cache = data
          this._cacheTime = timestamp
          // 返回缓存数据，后台静默更新
          this._silentRefresh(userId, cacheKey)
          return { data: this._cache, error: null, fromCache: true }
        }
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage:', e)
    }

    // 3. 从远程加载
    return await this._fetchFromRemote(userId, cacheKey)
  },

  /**
   * 后台静默刷新数据
   */
  async _silentRefresh(userId, cacheKey) {
    try {
      await this._fetchFromRemote(userId, cacheKey)
    } catch (e) {
      console.warn('Silent refresh failed:', e)
    }
  },

  /**
   * 从 Supabase 获取数据并更新缓存
   */
  async _fetchFromRemote(userId, cacheKey) {
    const supabase = getSupabaseClient()
    if (!supabase)
      return { data: null, error: { message: 'Supabase not initialized' }, fromCache: false }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && profile) {
      this._cache = profile
      this._cacheTime = Date.now()

      // 更新 localStorage
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: profile,
            timestamp: this._cacheTime
          })
        )
      } catch (e) {
        console.warn('Failed to save profile to localStorage:', e)
      }
    }

    return { data: profile, error, fromCache: false }
  },

  /**
   * 更新用户资料（同步更新缓存）
   * @param {string} userId - 用户ID
   * @param {object} updates - 更新内容
   */
  async updateProfile(userId, updates) {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: { message: 'Supabase not initialized' } }

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      ...updates
    })

    if (!error) {
      // 立即更新缓存
      const cacheKey = `${this._storageKey}_${userId}`
      this._cache = { ...this._cache, ...updates, id: userId }
      this._cacheTime = Date.now()

      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: this._cache,
            timestamp: this._cacheTime
          })
        )
      } catch (e) {
        console.warn('Failed to update profile cache:', e)
      }
    }

    return { error }
  },

  /**
   * 清除缓存
   * @param {string} userId - 用户ID（可选）
   */
  clearCache(userId) {
    this._cache = null
    this._cacheTime = null
    if (userId) {
      try {
        localStorage.removeItem(`${this._storageKey}_${userId}`)
      } catch (e) {
        // Ignore
      }
    }
  }
}

export default {
  getSupabaseClient,
  authService,
  filterService,
  brandService,
  profileService
}
