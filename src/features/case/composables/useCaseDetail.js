import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { caseService } from '../services/caseService'
import { useLoading } from '@shared/composables'

/**
 * 案件详情 Composable
 * 提供案件数据加载和状态管理
 */
export function useCaseDetail(caseIdProp = null) {
  const route = useRoute()
  const { loading, error, withLoading, clearError } = useLoading()

  const caseData = ref(null)
  const caseId = ref(caseIdProp || route?.params?.id)

  /**
   * 加载案件数据
   */
  async function loadCase(id = null) {
    const targetId = id || caseId.value
    if (!targetId) return

    clearError()
    await withLoading(async () => {
      caseData.value = await caseService.getById(targetId)
    })
  }

  /**
   * 更新案件数据
   */
  async function updateCase(updates) {
    if (!caseId.value) return

    await withLoading(async () => {
      caseData.value = await caseService.update(caseId.value, updates)
    })
  }

  /**
   * 刷新案件数据
   */
  async function refresh() {
    await loadCase()
  }

  // 监听路由参数变化
  if (route) {
    watch(
      () => route.params.id,
      (newId) => {
        if (newId && newId !== caseId.value) {
          caseId.value = newId
          loadCase(newId)
        }
      }
    )
  }

  // 组件挂载时加载数据
  onMounted(() => {
    if (caseId.value) {
      loadCase()
    }
  })

  return {
    caseData,
    caseId,
    loading,
    error,
    loadCase,
    updateCase,
    refresh
  }
}

export default useCaseDetail

