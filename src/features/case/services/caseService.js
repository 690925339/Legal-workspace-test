/**
 * 案件服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '@services/api-client'
import { API_ENDPOINTS } from '@shared/constants'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

export const caseService = {
  /**
   * 获取案件列表
   */
  async getList(filters = {}) {
    if (USE_BFF) {
      return apiClient.get(API_ENDPOINTS.CASES, { params: filters })
    }

    const supabase = getSupabaseClient()
    let query = supabase.from('cases').select('*')

    // 应用筛选条件
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.case_type) {
      query = query.eq('case_type', filters.case_type)
    }
    if (filters.search) {
      query = query.or(`case_title.ilike.%${filters.search}%,case_number.ilike.%${filters.search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
  },

  /**
   * 获取单个案件
   */
  async getById(id) {
    if (USE_BFF) {
      return apiClient.get(API_ENDPOINTS.CASE_BY_ID(id))
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * 创建案件
   */
  async create(caseData) {
    if (USE_BFF) {
      return apiClient.post(API_ENDPOINTS.CASES, caseData)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('cases')
      .insert(caseData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 更新案件
   */
  async update(id, updates) {
    if (USE_BFF) {
      return apiClient.put(API_ENDPOINTS.CASE_BY_ID(id), updates)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 删除案件
   */
  async delete(id) {
    if (USE_BFF) {
      return apiClient.delete(API_ENDPOINTS.CASE_BY_ID(id))
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

export default caseService

