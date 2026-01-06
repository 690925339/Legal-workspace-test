/**
 * LPR利率服务 - 基于Tushare API
 *
 * Tushare API 文档: https://tushare.pro/document/2?doc_id=149
 * 接口: shibor_lpr
 * 需要: 120积分
 */

// Tushare API 配置
const TUSHARE_API_URL = 'http://api.tushare.pro'

// Supabase Client
// Supabase Client
import { getSupabaseClient } from '../config/supabase'

// 本地缓存
let lprCache = null
let cacheTimestamp = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时缓存

/**
 * 获取Tushare Token
 * 优先从环境变量获取，否则使用本地存储
 */
function getTushareToken() {
  // 1. 尝试从环境变量获取 (Vite)
  if (import.meta.env.VITE_TUSHARE_TOKEN) {
    return import.meta.env.VITE_TUSHARE_TOKEN
  }

  // 2. 尝试从localStorage获取
  const storedToken = localStorage.getItem('tushare_token')
  if (storedToken) {
    return storedToken
  }

  return null
}

/**
 * 设置Tushare Token (用于用户手动配置)
 */
export function setTushareToken(token) {
  localStorage.setItem('tushare_token', token)
}

/**
 * 检查Token是否已配置
 */
export function hasTushareToken() {
  return !!getTushareToken()
}

/**
 * 调用Tushare API
 */
async function callTushareApi(apiName, params = {}, fields = '') {
  const token = getTushareToken()
  if (!token) {
    throw new Error('Tushare Token未配置，请在设置中配置您的Token')
  }

  const response = await fetch(TUSHARE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_name: apiName,
      token: token,
      params: params,
      fields: fields
    })
  })

  if (!response.ok) {
    throw new Error(`Tushare API请求失败: ${response.status}`)
  }

  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(`Tushare API错误: ${result.msg}`)
  }

  return result.data
}

/**
 * 获取LPR历史数据
 * @param {string} startDate - 开始日期 (YYYYMMDD)
 * @param {string} endDate - 结束日期 (YYYYMMDD)
 * @returns {Promise<Array>} LPR数据列表
 */
export async function fetchLprRates(startDate = '20190820', endDate = '') {
  // 检查缓存
  if (lprCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('[LPR] 使用内存缓存数据')
    return lprCache
  }

  try {
    // 1. 尝试从 Supabase 获取
    console.log('[LPR] 尝试从 Supabase 获取数据...')
    const supabaseData = await getLprRatesFromSupabase()
    if (supabaseData && supabaseData.length > 0) {
      console.log(`[LPR] 从 Supabase 获取到 ${supabaseData.length} 条记录`)
      lprCache = supabaseData
      cacheTimestamp = Date.now()

      // 异步检查更新 (如果最新数据超过1个月)
      syncLprRates(false)

      return supabaseData
    }
  } catch (err) {
    console.warn('[LPR] Supabase 读取失败，尝试直接API:', err)
  }

  try {
    console.log('[LPR] 从Tushare获取数据...')

    const params = { start_date: startDate }
    if (endDate) {
      params.end_date = endDate
    }

    const data = await callTushareApi('shibor_lpr', params, 'date,1y,5y')

    if (!data || !data.items) {
      throw new Error('Tushare返回数据格式错误')
    }

    // 转换数据格式
    // data.fields = ['date', '1y', '5y']
    // data.items = [['20241021', 3.10, 3.60], ...]
    const fields = data.fields
    const rates = data.items.map(item => {
      const obj = {}
      fields.forEach((field, index) => {
        if (field === 'date') {
          // 转换日期格式 YYYYMMDD -> YYYY-MM-DD
          obj.date = `${item[index].slice(0, 4)}-${item[index].slice(4, 6)}-${item[index].slice(6, 8)}`
        } else {
          obj[field] = item[index]
        }
      })
      return obj
    })

    // 按日期降序排列
    rates.sort((a, b) => new Date(b.date) - new Date(a.date))

    // 保存到 Supabase
    await saveLprRatesToSupabase(rates)

    // 更新缓存
    lprCache = rates
    cacheTimestamp = Date.now()

    console.log(`[LPR] 获取到 ${rates.length} 条记录`)
    return rates
  } catch (error) {
    console.error('[LPR] 获取数据失败:', error)
    throw error
  }
}

/**
 * 获取指定日期的LPR利率
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {string} tier - 档次 ('1y' | '5y')
 * @returns {Promise<number>} 利率值 (小数形式)
 */
export async function getLprRateByDate(date, tier = '5y') {
  const rates = await fetchLprRates()

  const targetDate = new Date(date)

  // 找到生效日期不晚于目标日期的最近一条记录
  for (const rate of rates) {
    if (new Date(rate.date) <= targetDate) {
      return rate[tier] / 100 // 转换为小数
    }
  }

  // 如果没有找到，返回最早的记录
  if (rates.length > 0) {
    return rates[rates.length - 1][tier] / 100
  }

  throw new Error('无可用的LPR数据')
}

/**
 * 从 Supabase 获取 LPR 数据
 */
async function getLprRatesFromSupabase() {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  const { data, error } = await supabase
    .from('lpr_rates')
    .select('effective_date, rate_1y, rate_5y')
    .order('effective_date', { ascending: false })

  if (error) throw error

  return data.map(item => ({
    date: item.effective_date,
    '1y': Number(item.rate_1y),
    '5y': Number(item.rate_5y)
  }))
}

/**
 * 保存数据到 Supabase
 */
async function saveLprRatesToSupabase(rates) {
  const supabase = getSupabaseClient()
  if (!supabase || !rates || rates.length === 0) return

  // 准备数据
  const rows = rates.map(rate => ({
    effective_date: rate.date,
    rate_1y: rate['1y'],
    rate_5y: rate['5y']
  }))

  // 批量插入 (upsert)
  const { error } = await supabase.from('lpr_rates').upsert(rows, { onConflict: 'effective_date' })

  if (error) {
    console.error('[LPR] 保存到 Supabase 失败:', error)
  } else {
    console.log('[LPR] 数据已同步到 Supabase')
  }
}

/**
 * 检查并从Tushare同步最新数据
 * @param {boolean} force - 是否强制同步 (忽略日期检查)
 */
export async function syncLprRates(force = false) {
  if (!lprCache || lprCache.length === 0) {
    // 如果没有缓存，可能还没初始化，尝试直接 fetch
    // 但为了避免死循环，这里仅当有Token时尝试fetch
    if (hasTushareToken()) {
      // 此时 fetch 会自动触发 save
      await fetchLprRates()
      return
    }
    return
  }
  if (!hasTushareToken()) return

  const latestDate = new Date(lprCache[0].date)
  const now = new Date()

  // 根据截图规则：LPR于每月20日发布
  // 计算"理论上应该有的最新发布日期"
  let expectedReleaseDate = new Date(now.getFullYear(), now.getMonth(), 20)

  // 如果当前日期还没到本月20日 (或者刚到20日但还不到9:30，这里简单起见以天为单位，当天也尝试更新)
  if (now.getDate() < 20) {
    // 应该有的最新数据是上个月20号的
    expectedReleaseDate = new Date(now.getFullYear(), now.getMonth() - 1, 20)
  }

  // 节假日/周末处理 (遇节假日顺延)
  // 简单顺延处理:
  const dayOfWeek = expectedReleaseDate.getDay()
  if (dayOfWeek === 6) expectedReleaseDate.setDate(expectedReleaseDate.getDate() + 2)
  else if (dayOfWeek === 0) expectedReleaseDate.setDate(expectedReleaseDate.getDate() + 1)

  // 设置时间为0点以便比较日期
  expectedReleaseDate.setHours(0, 0, 0, 0)
  const latestDateTimestamp = new Date(latestDate).setHours(0, 0, 0, 0)

  // 如果现有数据的日期 早于 理论发布日期，说明数据过时，需要同步
  // 或者 force 为 true
  if (force || latestDateTimestamp < expectedReleaseDate.getTime()) {
    console.log(`[LPR] 同步触发 (强制: ${force}, 最新: ${lprCache[0].date}), 开始同步...`)
    try {
      // 获取最近1年的数据 (强制拉取时拉多一点，防止断档)
      // 原逻辑是2个月，如果 force 则拉 12个月
      const months = force ? 12 : 2
      const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')
      const params = { start_date: startDate }
      const data = await callTushareApi('shibor_lpr', params, 'date,1y,5y')

      if (data && data.items && data.items.length > 0) {
        const fields = data.fields
        const newRates = data.items.map(item => {
          const obj = {}
          fields.forEach((field, index) => {
            if (field === 'date')
              obj.date = `${item[index].slice(0, 4)}-${item[index].slice(4, 6)}-${item[index].slice(6, 8)}`
            else obj[field] = item[index]
          })
          return obj
        })

        // 检查是否有新数据
        const newLatestDate = newRates[0].date
        if (newLatestDate > lprCache[0].date) {
          await saveLprRatesToSupabase(newRates)
          // 更新内存缓存
          lprCache = newRates
          // 合并 fallback 数据防止某些早期数据缺失（可选，但这里我们主要关心最新的）
          console.log(`[LPR] 后台同步完成，更新至 ${newLatestDate}`)
        } else {
          console.log('[LPR] 后台同步完成，暂无更新数据')
        }
      }
    } catch (e) {
      console.warn('[LPR] 后台同步失败:', e)
    }
  }
}

/**
 * 清除缓存
 */
export function clearLprCache() {
  lprCache = null
  cacheTimestamp = null
}

/**
 * 获取最新LPR利率
 */
export async function getLatestLprRates() {
  const rates = await fetchLprRates()
  return rates.length > 0 ? rates[0] : null
}

// 内置备用数据 (当API不可用时使用) - 完整历史数据
export const FALLBACK_LPR_RATES = [
  { date: '2025-12-22', '1y': 3.0, '5y': 3.5 },
  { date: '2025-11-20', '1y': 3.0, '5y': 3.5 },
  { date: '2025-10-20', '1y': 3.0, '5y': 3.5 },
  { date: '2025-09-22', '1y': 3.0, '5y': 3.5 },
  { date: '2025-08-20', '1y': 3.0, '5y': 3.5 },
  { date: '2025-07-21', '1y': 3.0, '5y': 3.5 },
  { date: '2025-06-20', '1y': 3.0, '5y': 3.5 },
  { date: '2025-05-20', '1y': 3.0, '5y': 3.5 },
  { date: '2025-04-21', '1y': 3.1, '5y': 3.6 },
  { date: '2025-03-20', '1y': 3.1, '5y': 3.6 },
  { date: '2025-02-20', '1y': 3.1, '5y': 3.6 },
  { date: '2025-01-20', '1y': 3.1, '5y': 3.6 },
  { date: '2024-12-20', '1y': 3.1, '5y': 3.6 },
  { date: '2024-11-20', '1y': 3.1, '5y': 3.6 },
  { date: '2024-10-21', '1y': 3.1, '5y': 3.6 },
  { date: '2024-09-20', '1y': 3.35, '5y': 3.85 },
  { date: '2024-08-20', '1y': 3.35, '5y': 3.85 },
  { date: '2024-07-22', '1y': 3.35, '5y': 3.85 },
  { date: '2024-06-20', '1y': 3.45, '5y': 3.95 },
  { date: '2024-05-20', '1y': 3.45, '5y': 3.95 },
  { date: '2024-04-22', '1y': 3.45, '5y': 3.95 },
  { date: '2024-03-20', '1y': 3.45, '5y': 3.95 },
  { date: '2024-02-20', '1y': 3.45, '5y': 3.95 },
  { date: '2024-01-22', '1y': 3.45, '5y': 4.2 },
  { date: '2023-12-20', '1y': 3.45, '5y': 4.2 },
  { date: '2023-11-20', '1y': 3.45, '5y': 4.2 },
  { date: '2023-10-20', '1y': 3.45, '5y': 4.2 },
  { date: '2023-09-20', '1y': 3.45, '5y': 4.2 },
  { date: '2023-08-21', '1y': 3.45, '5y': 4.2 },
  { date: '2023-07-20', '1y': 3.55, '5y': 4.2 },
  { date: '2023-06-20', '1y': 3.55, '5y': 4.2 },
  { date: '2023-05-22', '1y': 3.65, '5y': 4.3 },
  { date: '2023-04-20', '1y': 3.65, '5y': 4.3 },
  { date: '2023-03-20', '1y': 3.65, '5y': 4.3 },
  { date: '2023-02-20', '1y': 3.65, '5y': 4.3 },
  { date: '2023-01-20', '1y': 3.65, '5y': 4.3 },
  { date: '2022-12-20', '1y': 3.65, '5y': 4.3 },
  { date: '2022-11-21', '1y': 3.65, '5y': 4.3 },
  { date: '2022-10-20', '1y': 3.65, '5y': 4.3 },
  { date: '2022-09-20', '1y': 3.65, '5y': 4.3 },
  { date: '2022-08-22', '1y': 3.65, '5y': 4.3 },
  { date: '2022-07-20', '1y': 3.7, '5y': 4.45 },
  { date: '2022-06-20', '1y': 3.7, '5y': 4.45 },
  { date: '2022-05-20', '1y': 3.7, '5y': 4.45 },
  { date: '2022-04-20', '1y': 3.7, '5y': 4.6 },
  { date: '2022-03-21', '1y': 3.7, '5y': 4.6 },
  { date: '2022-02-21', '1y': 3.7, '5y': 4.6 },
  { date: '2022-01-20', '1y': 3.7, '5y': 4.6 },
  { date: '2021-12-20', '1y': 3.8, '5y': 4.65 },
  { date: '2021-11-22', '1y': 3.85, '5y': 4.65 },
  { date: '2021-10-20', '1y': 3.85, '5y': 4.65 },
  { date: '2021-09-22', '1y': 3.85, '5y': 4.65 },
  { date: '2021-08-20', '1y': 3.85, '5y': 4.65 },
  { date: '2021-07-20', '1y': 3.85, '5y': 4.65 },
  { date: '2021-06-21', '1y': 3.85, '5y': 4.65 },
  { date: '2021-05-20', '1y': 3.85, '5y': 4.65 },
  { date: '2021-04-20', '1y': 3.85, '5y': 4.65 },
  { date: '2021-03-22', '1y': 3.85, '5y': 4.65 },
  { date: '2021-02-22', '1y': 3.85, '5y': 4.65 },
  { date: '2021-01-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-12-21', '1y': 3.85, '5y': 4.65 },
  { date: '2020-11-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-10-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-09-21', '1y': 3.85, '5y': 4.65 },
  { date: '2020-08-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-07-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-06-22', '1y': 3.85, '5y': 4.65 },
  { date: '2020-05-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-04-20', '1y': 3.85, '5y': 4.65 },
  { date: '2020-03-20', '1y': 4.05, '5y': 4.75 },
  { date: '2020-02-20', '1y': 4.05, '5y': 4.75 },
  { date: '2020-01-20', '1y': 4.15, '5y': 4.8 },
  { date: '2019-12-20', '1y': 4.15, '5y': 4.8 },
  { date: '2019-11-20', '1y': 4.15, '5y': 4.8 },
  { date: '2019-10-21', '1y': 4.2, '5y': 4.85 },
  { date: '2019-09-20', '1y': 4.2, '5y': 4.85 },
  { date: '2019-08-20', '1y': 4.25, '5y': 4.85 }
]

// 央行贷款基准利率 (2015-10-24起执行)
// 仅保留最新的作为默认导出，完整历史见 options
export const PBC_BENCHMARK_RATES = {
  '6m': 4.35, // 六个月以内
  '1y': 4.35, // 六个月至一年
  '1y-3y': 4.75, // 一至三年
  '3y-5y': 4.75, // 三至五年
  over5y: 4.9 // 五年以上
}

// 央行贷款基准利率历史数据 (用于"指定利率"选择)
export const PBC_BENCHMARK_HISTORY = [
  {
    date: '2015-10-24',
    rates: { '6m': 4.35, '1y': 4.35, '1y-3y': 4.75, '3y-5y': 4.75, over5y: 4.9 }
  },
  { date: '2015-08-26', rates: { '6m': 4.6, '1y': 4.6, '1y-3y': 5.0, '3y-5y': 5.0, over5y: 5.15 } },
  {
    date: '2015-06-28',
    rates: { '6m': 4.85, '1y': 4.85, '1y-3y': 5.25, '3y-5y': 5.25, over5y: 5.4 }
  },
  { date: '2015-05-11', rates: { '6m': 5.1, '1y': 5.1, '1y-3y': 5.5, '3y-5y': 5.5, over5y: 5.65 } },
  {
    date: '2015-03-01',
    rates: { '6m': 5.35, '1y': 5.35, '1y-3y': 5.75, '3y-5y': 5.75, over5y: 5.9 }
  },
  { date: '2014-11-22', rates: { '6m': 5.6, '1y': 5.6, '1y-3y': 6.0, '3y-5y': 6.0, over5y: 6.15 } },
  {
    date: '2012-07-06',
    rates: { '6m': 5.6, '1y': 6.0, '1y-3y': 6.15, '3y-5y': 6.4, over5y: 6.55 }
  },
  {
    date: '2012-06-08',
    rates: { '6m': 5.85, '1y': 6.31, '1y-3y': 6.4, '3y-5y': 6.65, over5y: 6.8 }
  },
  {
    date: '2011-07-07',
    rates: { '6m': 6.1, '1y': 6.56, '1y-3y': 6.65, '3y-5y': 6.9, over5y: 7.05 }
  }
]

// LPR改革切换日期
export const LPR_SWITCH_DATE = '2019-08-20'

/**
 * 获取具体日期的适用年化利率
 * @param {Date|string} date - 日期
 * @param {string} type - 'lpr' | 'benchmark' | 'segmented' (分段)
 * @param {string} tier - 档次 (lpr: '1y'/'5y'; benchmark: '1y'/'over5y'等)
 */
export async function getRateForDate(date, type = 'lpr', tier = '5y') {
  const d = new Date(date)
  const dateStr = d.toISOString().slice(0, 10)

  // 1. 自动分段模式
  if (type === 'segmented') {
    // 2019-08-20 之前使用基准利率
    if (dateStr < LPR_SWITCH_DATE) {
      // 映射 LPR档次 到 基准利率档次
      // 通常: LPR 1y -> Benchmark 1y; LPR 5y -> Benchmark over5y
      const benchmarkTier = tier === '1y' ? '1y' : 'over5y'
      return PBC_BENCHMARK_RATES[benchmarkTier] / 100
    } else {
      // 之后的使用 LPR
      return await getLprRateByDate(dateStr, tier)
    }
  }

  // 2. 纯基准利率模式
  if (type === 'benchmark') {
    const rate = PBC_BENCHMARK_RATES[tier] || PBC_BENCHMARK_RATES['over5y']
    return rate / 100
  }

  // 3. 纯 LPR 模式
  return await getLprRateByDate(dateStr, tier)
}
