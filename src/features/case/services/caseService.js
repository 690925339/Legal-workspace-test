/**
 * 案件服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '../../../services/api-client'
import { API_ENDPOINTS } from '../../../shared/constants'
import { caseListCache } from './caseListCache'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

// 列表页只需要的字段（减少数据传输）
const LIST_FIELDS =
  'id, case_title, case_number, case_type, stage, status, court, created_at, updated_at'

export const caseService = {
  /**
   * 获取案件列表
   */
  async getList(filters = {}) {
    if (USE_BFF) {
      return apiClient.get(API_ENDPOINTS.CASES, { params: filters })
    }

    const supabase = getSupabaseClient()
    let query = supabase.from('cases').select(LIST_FIELDS)

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
    const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()

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
    const { data, error } = await supabase.from('cases').insert(caseData).select().single()

    if (error) throw error
    caseListCache.clear() // 清除列表缓存
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
    caseListCache.clear() // 清除列表缓存
    return data
  },

  /**
   * 删除案件
   */
  async delete(id) {
    console.log('[caseService] delete called with id:', id)
    const startTime = Date.now()

    if (USE_BFF) {
      console.log('[caseService] using BFF mode')
      return apiClient.delete(API_ENDPOINTS.CASE_BY_ID(id))
    }

    console.log('[caseService] using Supabase direct mode')
    const supabase = getSupabaseClient()

    // 并行删除关联数据（减少延迟）
    const [fResult, sResult, eResult] = await Promise.all([
      supabase.from('financials').delete().eq('case_id', id),
      supabase.from('stakeholders').delete().eq('case_id', id),
      supabase.from('evidences').delete().eq('case_id', id)
    ])

    // 检查关联数据删除是否有错误
    if (fResult.error) {
      console.error('删除财务信息失败:', fResult.error)
      throw new Error(`删除关联财务信息失败: ${fResult.error.message || fResult.error.details}`)
    }
    if (sResult.error) {
      console.error('删除当事人失败:', sResult.error)
      throw new Error(`删除关联当事人失败: ${sResult.error.message || sResult.error.details}`)
    }
    if (eResult.error) {
      console.error('删除证据失败:', eResult.error)
      throw new Error(`删除关联证据失败: ${eResult.error.message || eResult.error.details}`)
    }

    // 删除案件本身
    const { error } = await supabase.from('cases').delete().eq('id', id)

    if (error) {
      console.error('删除案件主体失败:', error)
      throw new Error(`删除案件主体失败: ${error.message || error.details}`)
    }

    console.log(`[caseService] delete completed in ${Date.now() - startTime}ms`)
    caseListCache.clear() // 清除列表缓存
    return true
  }
}

export default caseService
