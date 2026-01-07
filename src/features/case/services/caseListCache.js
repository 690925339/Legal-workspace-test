/**
 * 案件列表缓存服务
 * 提供本地缓存功能，实现二次访问秒开
 */

const CACHE_KEY = 'case_list_cache_v1'
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

export const caseListCache = {
  /**
   * 获取缓存的案件列表
   * @returns {{ data: Array, timestamp: number } | null}
   */
  get() {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)

      // 检查是否过期
      if (Date.now() - timestamp > CACHE_DURATION) {
        this.clear()
        return null
      }

      return { data, timestamp }
    } catch (e) {
      console.warn('[caseListCache] 读取缓存失败:', e)
      return null
    }
  },

  /**
   * 保存案件列表到缓存
   * @param {Array} data - 案件列表数据
   */
  set(data) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      )
    } catch (e) {
      console.warn('[caseListCache] 保存缓存失败:', e)
    }
  },

  /**
   * 清除缓存
   */
  clear() {
    try {
      sessionStorage.removeItem(CACHE_KEY)
    } catch (e) {
      // 静默失败
    }
  },

  /**
   * 检查缓存是否需要刷新（过了一半有效期）
   * @returns {boolean}
   */
  isStale() {
    const cached = this.get()
    if (!cached) return true

    const age = Date.now() - cached.timestamp
    return age > CACHE_DURATION / 2
  },

  /**
   * 获取缓存年龄（毫秒）
   * @returns {number}
   */
  getAge() {
    const cached = this.get()
    if (!cached) return Infinity
    return Date.now() - cached.timestamp
  }
}

export default caseListCache
