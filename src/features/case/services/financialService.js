/**
 * 财务服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '@services/api-client'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

// 财务缓存配置
const CACHE_PREFIX = 'financial_cache_v1_'
const CACHE_DURATION = 10 * 60 * 1000 // 10分钟

// 内部缓存方法
const financialCache = {
  get(caseId) {
    try {
      const cached = sessionStorage.getItem(CACHE_PREFIX + caseId)
      if (!cached) return null
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp > CACHE_DURATION) {
        sessionStorage.removeItem(CACHE_PREFIX + caseId)
        return null
      }
      return { data, timestamp }
    } catch (e) {
      return null
    }
  },
  set(caseId, data) {
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + caseId,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      )
    } catch (e) {
      /* ignore */
    }
  },
  clear(caseId) {
    try {
      sessionStorage.removeItem(CACHE_PREFIX + caseId)
    } catch (e) {
      /* ignore */
    }
  }
}

export const financialService = {
  /**
   * 获取案件财务信息（带缓存）
   * @param {string} caseId - 案件 ID
   */
  async get(caseId) {
    // 1. 先尝试从缓存获取
    const cached = financialCache.get(caseId)
    if (cached && cached.data) {
      console.log('[financialService] 从缓存加载财务数据')
      return cached.data
    }

    // 2. 从 API 获取
    let result
    if (USE_BFF) {
      result = await apiClient.get(`/api/v1/cases/${caseId}/financials`)
    } else {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('financials')
        .select('*')
        .eq('case_id', caseId)
        .single()

      // 如果不存在，返回默认结构
      if (error && error.code === 'PGRST116') {
        result = {
          case_id: caseId,
          claim_items: [],
          attorney_fee: 0,
          court_cost: 0,
          billable_hours: 0
        }
      } else if (error) {
        throw error
      } else {
        result = data
      }
    }

    // 3. 保存到缓存
    financialCache.set(caseId, result)
    return result
  },

  /**
   * 创建或更新财务信息 (健壮版本，处理重复数据)
   * @param {string} caseId - 案件 ID
   * @param {object} financials - 财务数据
   */
  async upsert(caseId, financials) {
    if (USE_BFF) {
      const result = await apiClient.put(`/api/v1/cases/${caseId}/financials`, financials)
      financialCache.clear(caseId)
      return result
    }

    const supabase = getSupabaseClient()

    // 1. 查询是否已存在记录
    const { data: existings, error: findError } = await supabase
      .from('financials')
      .select('id')
      .eq('case_id', caseId)

    if (findError) throw findError

    let resultData

    if (existings && existings.length > 0) {
      // 2a. 存在记录：更新第一条
      const targetId = existings[0].id
      const { data, error: updateError } = await supabase
        .from('financials')
        .update({
          ...financials,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId)
        .select()
        .single()

      if (updateError) throw updateError
      resultData = data

      // 3. 清理重复记录（如果有）
      if (existings.length > 1) {
        const duplicateIds = existings.slice(1).map(x => x.id)
        console.warn(`[financialService] 清理 ${duplicateIds.length} 条重复财务记录`)
        await supabase.from('financials').delete().in('id', duplicateIds)
      }
    } else {
      // 2b. 不存在记录：插入新记录
      const { data, error: insertError } = await supabase
        .from('financials')
        .insert({
          case_id: caseId,
          ...financials,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError
      resultData = data
    }

    // 清除缓存
    financialCache.clear(caseId)

    return resultData
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
