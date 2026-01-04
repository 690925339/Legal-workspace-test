import { ref } from 'vue'

/**
 * 加载状态管理 Composable
 */
export function useLoading(initialState = false) {
  const loading = ref(initialState)
  const error = ref(null)

  /**
   * 包装异步操作，自动管理 loading 状态
   * @param {Function} asyncFn - 异步函数
   * @returns {Promise}
   */
  async function withLoading(asyncFn) {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      return result
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  function setLoading(value) {
    loading.value = value
  }

  function setError(err) {
    error.value = err
  }

  function clearError() {
    error.value = null
  }

  return {
    loading,
    error,
    withLoading,
    setLoading,
    setError,
    clearError
  }
}

export default useLoading

