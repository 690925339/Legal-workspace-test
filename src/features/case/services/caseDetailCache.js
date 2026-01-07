/**
 * 案件详情缓存服务
 * 提供按 caseId 的本地缓存功能，实现切换 Tab 秒开
 */

const CACHE_PREFIX = 'case_detail_cache_v1_'
const CACHE_DURATION = 10 * 60 * 1000 // 10分钟

export const caseDetailCache = {
  /**
   * 获取缓存的案件数据
   * @param {string} caseId - 案件ID
   * @returns {{ data: Object, timestamp: number } | null}
   */
  get(caseId) {
    if (!caseId) return null
    try {
      const cached = sessionStorage.getItem(CACHE_PREFIX + caseId)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)

      // 检查是否过期
      if (Date.now() - timestamp > CACHE_DURATION) {
        this.clear(caseId)
        return null
      }

      return { data, timestamp }
    } catch (e) {
      console.warn('[caseDetailCache] 读取缓存失败:', e)
      return null
    }
  },

  /**
   * 保存案件数据到缓存
   * @param {string} caseId - 案件ID
   * @param {Object} data - 案件数据
   */
  set(caseId, data) {
    if (!caseId) return
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + caseId,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      )
    } catch (e) {
      console.warn('[caseDetailCache] 保存缓存失败:', e)
    }
  },

  /**
   * 清除指定案件的缓存
   * @param {string} caseId - 案件ID
   */
  clear(caseId) {
    if (!caseId) return
    try {
      sessionStorage.removeItem(CACHE_PREFIX + caseId)
    } catch (e) {
      // 静默失败
    }
  },

  /**
   * 清除所有案件缓存
   */
  clearAll() {
    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (e) {
      // 静默失败
    }
  },

  /**
   * 检查缓存是否需要刷新（过了一半有效期）
   * @param {string} caseId - 案件ID
   * @returns {boolean}
   */
  isStale(caseId) {
    const cached = this.get(caseId)
    if (!cached) return true

    const age = Date.now() - cached.timestamp
    return age > CACHE_DURATION / 2
  },

  /**
   * 获取缓存年龄（毫秒）
   * @param {string} caseId - 案件ID
   * @returns {number}
   */
  getAge(caseId) {
    const cached = this.get(caseId)
    if (!cached) return Infinity
    return Date.now() - cached.timestamp
  }
}

export default caseDetailCache
