/**
 * 当事人数据缓存
 *
 * 按 caseId 缓存当事人数据，避免重复请求
 * - 5 分钟过期时间
 * - 最多缓存 20 个案件的当事人数据
 */

const CACHE_TTL = 5 * 60 * 1000 // 5 分钟
const MAX_CACHE_SIZE = 20

const cache = new Map()

export const stakeholderCache = {
  /**
   * 获取缓存的当事人数据
   * @param {string} caseId
   * @returns {Object|null} 当事人数据或 null
   */
  get(caseId) {
    const entry = cache.get(caseId)
    if (!entry) return null

    // 检查是否过期
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cache.delete(caseId)
      return null
    }

    console.log('[stakeholderCache] HIT:', caseId)
    return entry.data
  },

  /**
   * 设置缓存
   * @param {string} caseId
   * @param {Object} data 当事人数据 { plaintiffs, defendants, thirdParties }
   */
  set(caseId, data) {
    // 限制缓存大小
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
    }

    cache.set(caseId, {
      data,
      timestamp: Date.now()
    })
    console.log('[stakeholderCache] SET:', caseId)
  },

  /**
   * 使某个案件的缓存失效
   * @param {string} caseId
   */
  invalidate(caseId) {
    cache.delete(caseId)
    console.log('[stakeholderCache] INVALIDATE:', caseId)
  },

  /**
   * 清空所有缓存
   */
  clear() {
    cache.clear()
    console.log('[stakeholderCache] CLEAR')
  }
}
