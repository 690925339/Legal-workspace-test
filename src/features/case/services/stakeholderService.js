/**
 * 当事人服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '@services/api-client'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

export const stakeholderService = {
  /**
   * 获取案件的所有当事人
   * @param {string} caseId - 案件 ID
   */
  async getList(caseId) {
    if (USE_BFF) {
      return apiClient.get(`/api/v1/cases/${caseId}/stakeholders`)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('stakeholders')
      .select('*')
      .eq('case_id', caseId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * 按类型获取当事人
   * @param {string} caseId - 案件 ID
   * @param {string} type - 类型: plaintiff, defendant, third_party
   */
  async getByType(caseId, type) {
    if (USE_BFF) {
      return apiClient.get(`/api/v1/cases/${caseId}/stakeholders?type=${type}`)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('stakeholders')
      .select('*')
      .eq('case_id', caseId)
      .eq('type', type)
      .order('is_primary', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * 添加当事人
   * @param {string} caseId - 案件 ID
   * @param {object} stakeholder - 当事人数据
   */
  async create(caseId, stakeholder) {
    if (USE_BFF) {
      return apiClient.post(`/api/v1/cases/${caseId}/stakeholders`, stakeholder)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('stakeholders')
      .insert({ ...stakeholder, case_id: caseId })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 更新当事人
   * @param {string} id - 当事人 ID
   * @param {object} updates - 更新数据
   */
  async update(id, updates) {
    if (USE_BFF) {
      return apiClient.put(`/api/v1/stakeholders/${id}`, updates)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('stakeholders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 删除当事人
   * @param {string} id - 当事人 ID
   */
  async delete(id) {
    if (USE_BFF) {
      return apiClient.delete(`/api/v1/stakeholders/${id}`)
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.from('stakeholders').delete().eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * 生成当事人摘要描述
   * @param {object} stakeholder - 当事人对象
   */
  getSummary(stakeholder) {
    if (!stakeholder) return ''
    const parts = []
    if (stakeholder.id_number) parts.push(stakeholder.id_number)
    if (stakeholder.contact) parts.push(stakeholder.contact)
    if (stakeholder.address) parts.push(stakeholder.address)
    return parts.join(' | ') || '暂无详细信息'
  }
}

export default stakeholderService
