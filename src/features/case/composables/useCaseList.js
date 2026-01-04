import { ref, computed } from 'vue'
import { caseService } from '../services/caseService'
import { useLoading } from '@shared/composables'

/**
 * 案件列表 Composable
 * 提供案件列表加载、筛选和分页
 */
export function useCaseList() {
  const { loading, error, withLoading, clearError } = useLoading()

  const cases = ref([])
  const filters = ref({
    status: '',
    case_type: '',
    search: ''
  })

  // 计算属性：筛选后的案件数量
  const totalCount = computed(() => cases.value.length)

  // 计算属性：按状态分组统计
  const statusCounts = computed(() => {
    return cases.value.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {})
  })

  /**
   * 加载案件列表
   */
  async function loadCases() {
    clearError()
    await withLoading(async () => {
      cases.value = await caseService.getList(filters.value)
    })
  }

  /**
   * 更新筛选条件并重新加载
   */
  async function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    await loadCases()
  }

  /**
   * 清除筛选条件
   */
  async function clearFilters() {
    filters.value = { status: '', case_type: '', search: '' }
    await loadCases()
  }

  /**
   * 删除案件
   */
  async function deleteCase(id) {
    await withLoading(async () => {
      await caseService.delete(id)
      cases.value = cases.value.filter(c => c.id !== id)
    })
  }

  /**
   * 刷新列表
   */
  async function refresh() {
    await loadCases()
  }

  return {
    cases,
    filters,
    loading,
    error,
    totalCount,
    statusCounts,
    loadCases,
    setFilters,
    clearFilters,
    deleteCase,
    refresh
  }
}

export default useCaseList

