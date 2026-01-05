import { ref } from 'vue'
import { stakeholderService } from '@/features/case/services'

/**
 * 当事人管理 Composable
 *
 * 职责：
 * - 管理当事人列表（原告/被告/第三人）
 * - 提供增删改查操作
 * - 支持从数据库加载和保存数据
 */
export function useStakeholders(initialData = {}) {
  const stakeholders = ref({
    plaintiffs: initialData.plaintiffs || [],
    defendants: initialData.defendants || [],
    thirdParties: initialData.thirdParties || []
  })

  const currentStakeholder = ref(null)
  const stakeholderType = ref('plaintiff')
  const loading = ref(false)

  /**
   * 从数据库加载当事人数据
   * @param {string} caseId - 案件 ID
   */
  const loadStakeholders = async caseId => {
    if (!caseId) return

    loading.value = true
    try {
      const data = await stakeholderService.getList(caseId)

      // 按类型分组
      stakeholders.value = {
        plaintiffs: data.filter(s => s.type === 'plaintiff').map(mapFromDb),
        defendants: data.filter(s => s.type === 'defendant').map(mapFromDb),
        thirdParties: data.filter(s => s.type === 'third_party').map(mapFromDb)
      }
    } catch (e) {
      console.error('加载当事人失败:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 数据库字段映射到前端字段
   */
  const mapFromDb = dbItem => ({
    id: dbItem.id,
    name: dbItem.name,
    type: dbItem.entity_type || (dbItem.id_number?.length === 18 ? 'person' : 'company'),
    idNumber: dbItem.id_number,
    creditCode: dbItem.id_number, // 复用字段
    phone: dbItem.contact,
    address: dbItem.address,
    isPrimary: dbItem.is_primary,
    role: dbItem.type === 'plaintiff' ? '原告' : dbItem.type === 'defendant' ? '被告' : '第三人',
    // 新增字段
    legalRepresentative: dbItem.legal_representative || '',
    contactName: dbItem.contact_name || '',
    contactRole: dbItem.contact_role || '',
    contactPhone: dbItem.contact_phone || '',
    contactEmail: dbItem.contact_email || ''
  })

  /**
   * 前端字段映射到数据库字段
   */
  const mapToDb = (item, type) => ({
    type: type === 'plaintiff' ? 'plaintiff' : type === 'defendant' ? 'defendant' : 'third_party',
    entity_type: item.type, // person 或 company
    name: item.name,
    id_number: item.type === 'person' ? item.idNumber : item.creditCode,
    contact: item.phone,
    address: item.address,
    is_primary: item.isPrimary || false,
    // 新增字段
    legal_representative: item.legalRepresentative || null,
    contact_name: item.contactName || null,
    contact_role: item.contactRole || null,
    contact_phone: item.contactPhone || null,
    contact_email: item.contactEmail || null
  })

  /**
   * 创建新当事人对象
   */
  const addStakeholder = type => {
    stakeholderType.value = type
    currentStakeholder.value = {
      id: null,
      name: '',
      type: 'person',
      idNumber: '',
      phone: '',
      address: '',
      role: type === 'plaintiff' ? '原告' : type === 'defendant' ? '被告' : '第三人',
      legalRepresentative: '',
      creditCode: '',
      lawyer: '',
      contactName: '',
      contactRole: '',
      contactPhone: '',
      contactEmail: ''
    }
    return currentStakeholder.value
  }

  /**
   * 编辑当事人
   */
  const editStakeholder = (type, stakeholder) => {
    stakeholderType.value = type
    currentStakeholder.value = JSON.parse(JSON.stringify(stakeholder))
    return currentStakeholder.value
  }

  /**
   * 删除当事人
   * @param {string} type - 当事人类型
   * @param {string} id - 当事人 ID
   * @param {string} caseId - 案件 ID（如需要数据库同步）
   */
  const deleteStakeholder = async (type, id, caseId = null) => {
    const listName =
      type === 'plaintiff' ? 'plaintiffs' : type === 'defendant' ? 'defendants' : 'thirdParties'

    // 如果有 caseId，说明需要同步删除数据库
    if (caseId && typeof id === 'string' && id.includes('-')) {
      try {
        await stakeholderService.delete(id)
      } catch (e) {
        console.error('删除当事人失败:', e)
        throw e
      }
    }

    stakeholders.value[listName] = stakeholders.value[listName].filter(item => item.id !== id)
  }

  /**
   * 保存当事人（新增或更新）
   * @param {string} caseId - 案件 ID（如需要数据库同步）
   */
  const saveStakeholder = async (caseId = null) => {
    if (!currentStakeholder.value?.name) {
      throw new Error('请输入姓名/名称')
    }

    const listName =
      stakeholderType.value === 'plaintiff'
        ? 'plaintiffs'
        : stakeholderType.value === 'defendant'
          ? 'defendants'
          : 'thirdParties'

    // 如果有 caseId，同步到数据库
    if (caseId) {
      const dbData = mapToDb(currentStakeholder.value, stakeholderType.value)

      try {
        if (
          currentStakeholder.value.id &&
          typeof currentStakeholder.value.id === 'string' &&
          currentStakeholder.value.id.includes('-')
        ) {
          // 更新
          await stakeholderService.update(currentStakeholder.value.id, dbData)
        } else {
          // 新增
          const created = await stakeholderService.create(caseId, dbData)
          currentStakeholder.value.id = created.id
        }
      } catch (e) {
        console.error('保存当事人失败:', e)
        throw e
      }
    }

    // 更新本地状态
    if (
      currentStakeholder.value.id &&
      typeof currentStakeholder.value.id === 'string' &&
      currentStakeholder.value.id.includes('-')
    ) {
      const index = stakeholders.value[listName].findIndex(
        item => item.id === currentStakeholder.value.id
      )
      if (index !== -1) {
        stakeholders.value[listName].splice(index, 1, currentStakeholder.value)
      } else {
        stakeholders.value[listName].push(currentStakeholder.value)
      }
    } else {
      currentStakeholder.value.id = currentStakeholder.value.id || Date.now()
      stakeholders.value[listName].push(currentStakeholder.value)
    }
  }

  /**
   * 生成当事人摘要信息
   */
  const getStakeholderSummary = s => {
    const parts = []
    if (s.idNumber) parts.push(`身份证: ${s.idNumber} `)
    if (s.creditCode) parts.push(`信用代码: ${s.creditCode} `)
    if (s.legalRepresentative) parts.push(`法定代表人: ${s.legalRepresentative} `)
    if (s.phone) parts.push(`电话: ${s.phone} `)
    return parts.join(' | ')
  }

  return {
    stakeholders,
    currentStakeholder,
    stakeholderType,
    loading,
    loadStakeholders,
    addStakeholder,
    editStakeholder,
    deleteStakeholder,
    saveStakeholder,
    getStakeholderSummary
  }
}
