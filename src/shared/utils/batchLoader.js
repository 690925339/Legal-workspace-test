/**
 * 前端批量加载器 (配合 BFF DataLoader)
 * 收集短时间内的请求，合并为一次批量请求
 */
export function createBatchLoader(batchFn, options = {}) {
  const { delay = 10, maxBatchSize = 100 } = options
  let queue = []
  let timeoutId = null

  async function flush() {
    const batch = queue
    queue = []
    timeoutId = null

    if (batch.length === 0) return

    try {
      const ids = batch.map(item => item.id)
      const results = await batchFn(ids)

      batch.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      batch.forEach(item => {
        item.reject(error)
      })
    }
  }

  return {
    load(id) {
      return new Promise((resolve, reject) => {
        queue.push({ id, resolve, reject })

        if (queue.length >= maxBatchSize) {
          clearTimeout(timeoutId)
          flush()
        } else if (!timeoutId) {
          timeoutId = setTimeout(flush, delay)
        }
      })
    },

    // 手动清空队列
    clear() {
      clearTimeout(timeoutId)
      queue = []
      timeoutId = null
    }
  }
}

export default createBatchLoader

