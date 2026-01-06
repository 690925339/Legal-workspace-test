/**
 * 案件服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '../../../services/api-client'
import { API_ENDPOINTS } from '../../../shared/constants'

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
   * 生成案件编号
   * 格式: CASE-YYYYMMDD-nnn (如: CASE-20260105-001)
   * nnn 为当日递增序号
   */
  async generateCaseNumber() {
    const supabase = getSupabaseClient()
    const now = new Date()
    const pad = (n, len = 2) => String(n).padStart(len, '0')
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    const prefix = `CASE-${dateStr}-`

    // 查询当日最大序号
    const { data, error } = await supabase
      .from('cases')
      .select('case_number')
      .like('case_number', `${prefix}%`)
      .order('case_number', { ascending: false })
      .limit(1)

    let nextSeq = 1
    if (!error && data && data.length > 0) {
      const lastNumber = data[0].case_number
      const lastSeq = parseInt(lastNumber.split('-').pop(), 10)
      if (!isNaN(lastSeq)) {
        nextSeq = lastSeq + 1
      }
    }

    return `${prefix}${pad(nextSeq, 3)}`
  },

  /**
   * 创建案件
   */
  async create(caseData) {
    // 如果没有提供案件编号，自动生成
    if (!caseData.case_number) {
      caseData.case_number = await this.generateCaseNumber()
    }

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
    console.log('[caseService] delete called with id:', id)
    if (USE_BFF) {
      console.log('[caseService] using BFF mode')
      return apiClient.delete(API_ENDPOINTS.CASE_BY_ID(id))
    }

    console.log('[caseService] using Supabase direct mode')
    const supabase = getSupabaseClient()

    // 1. 手动删除关联的财务信息
    const { error: fError } = await supabase.from('financials').delete().eq('case_id', id)
    if (fError) {
      console.error('删除财务信息失败:', fError)
      throw new Error(`删除关联财务信息失败: ${fError.message || fError.details}`)
    }

    // 2. 手动删除关联的当事人
    const { error: sError } = await supabase.from('stakeholders').delete().eq('case_id', id)
    if (sError) {
      console.error('删除当事人失败:', sError)
      throw new Error(`删除关联当事人失败: ${sError.message || sError.details}`)
    }

    // 3. 手动删除关联的证据
    const { error: eError } = await supabase.from('evidences').delete().eq('case_id', id)
    if (eError) {
      console.error('删除证据失败:', eError)
      throw new Error(`删除关联证据失败: ${eError.message || eError.details}`)
    }

    // 4. 删除案件本身
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除案件主体失败:', error)
      throw new Error(`删除案件主体失败: ${error.message || error.details}`)
    }

    return true
  }
}

export default caseService

