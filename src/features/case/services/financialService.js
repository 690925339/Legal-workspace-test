/**
 * 财务服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '@services/api-client'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

export const financialService = {
  /**
   * 获取案件财务信息
   * @param {string} caseId - 案件 ID
   */
  async get(caseId) {
    if (USE_BFF) {
      return apiClient.get(`/api/v1/cases/${caseId}/financials`)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('financials')
      .select('*')
      .eq('case_id', caseId)
      .single()

    // 如果不存在，返回默认结构
    if (error && error.code === 'PGRST116') {
      return {
        case_id: caseId,
        claim_items: [],
        attorney_fee: 0,
        court_cost: 0,
        billable_hours: 0
      }
    }
    if (error) throw error
    return data
  },

  /**
   * 创建或更新财务信息 (upsert)
   * @param {string} caseId - 案件 ID
   * @param {object} financials - 财务数据
   */
  async upsert(caseId, financials) {
    if (USE_BFF) {
      return apiClient.put(`/api/v1/cases/${caseId}/financials`, financials)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('financials')
      .upsert(
        {
          case_id: caseId,
          ...financials,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'case_id' }
      )
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 计算诉讼标的额
   * @param {Array} claimItems - 标的组成项 [{name, amount}, ...]
   */
  calculateTotalClaim(claimItems) {
    if (!claimItems || !Array.isArray(claimItems)) return 0
    return claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  },

  /**
   * 计算诉讼费 (简易版，仅供参考)
   * 按照《诉讼费用交纳办法》财产案件计算
   * @param {number} amount - 诉讼标的额
   */
  calculateCourtFee(amount) {
    if (!amount || amount <= 0) return 0

    let fee = 0
    if (amount <= 10000) {
      fee = 50
    } else if (amount <= 100000) {
      fee = (amount - 10000) * 0.025 + 50
    } else if (amount <= 200000) {
      fee = (amount - 100000) * 0.02 + 2300
    } else if (amount <= 500000) {
      fee = (amount - 200000) * 0.015 + 4300
    } else if (amount <= 1000000) {
      fee = (amount - 500000) * 0.01 + 8800
    } else if (amount <= 2000000) {
      fee = (amount - 1000000) * 0.009 + 13800
    } else if (amount <= 5000000) {
      fee = (amount - 2000000) * 0.008 + 22800
    } else if (amount <= 10000000) {
      fee = (amount - 5000000) * 0.007 + 46800
    } else if (amount <= 20000000) {
      fee = (amount - 10000000) * 0.006 + 81800
    } else {
      fee = (amount - 20000000) * 0.005 + 141800
    }

    return Math.round(fee)
  },

  /**
   * 格式化货币
   * @param {number} value - 金额
   */
  formatCurrency(value) {
    return '¥' + (Number(value) || 0).toLocaleString()
  }
}

export default financialService
