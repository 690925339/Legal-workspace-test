import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 案件数据管理 Composable
 *
 * 职责：
 * - 从路由提取案件 ID（响应式）
 * - 管理案件数据状态
 * - 提供状态样式映射
 */
export function useCaseData() {
  const route = useRoute()
  const caseData = ref({})
  const loading = ref(false)

  // 从路由参数获取案件 ID（响应式）
  const caseId = computed(() => {
    // 优先从路由参数获取
    if (route?.params?.id) {
      return route.params.id
    }
    // 降级：从 URL hash 提取
    const hash = window.location.hash
    const match = hash.match(/\/detail\/([^/]+)/)
    return match ? match[1] : null
  })

  // 状态选项配置
  const statusOptions = [
    { code: 'draft', text: '草稿', color: '#f3f4f6', textColor: '#4b5563' },
    { code: 'active', text: '进行中', color: '#dcfce7', textColor: '#15803d' },
    { code: 'closed', text: '已结案', color: '#fee2e2', textColor: '#b91c1c' }
  ]

  /**
   * 获取状态样式
   * @param {string} code - 状态代码
   * @returns {object} 样式对象 { backgroundColor, color }
   */
  const getStatusStyle = code => {
    const option = statusOptions.find(o => o.code === (code || 'active'))
    return option
      ? {
          backgroundColor: option.color,
          color: option.textColor
        }
      : {}
  }

  /**
   * 案件数据加载回调（兼容 CaseModuleLayout）
   * @param {object} data - 案件数据
   */
  const onCaseLoaded = data => {
    caseData.value = data
    loading.value = false
  }

  return {
    caseId,
    caseData,
    loading,
    statusOptions,
    getStatusStyle,
    onCaseLoaded
  }
}
