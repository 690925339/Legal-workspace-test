import {
  fetchLprRates,
  hasTushareToken,
  FALLBACK_LPR_RATES,
  PBC_BENCHMARK_RATES,
  PBC_BENCHMARK_HISTORY
} from '../../services/lprService.js'
import SmartDatePicker from '../common/SmartDatePicker.js'

/**
 * 迟延履行利息计算器
 * 根据《最高人民法院关于执行程序中计算迟延履行期间的债务利息适用法律若干问题的解释》
 * 迟延履行期间的债务利息 = 一般债务利息 + 加倍部分债务利息
 * 加倍部分债务利息 = 债务本金 × 日万分之一点七五 × 迟延履行期间
 */
export default {
  name: 'DelayedInterestCalculator',
  components: {
    SmartDatePicker
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initialPrincipal: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:visible', 'apply'],
  data() {
    return {
      calculator: {
        // 1. 基础参数
        principal: 0, // 计算基数
        startDate: '', // 起始日期
        endDate: '', // 截止日期
        yearBasis: 360, // 一年天数：360 或 365

        // 2. 一般债务利息配置
        enableGeneralInterest: false, // 是否生效法律文书确定给付一般债务利息

        // 利率类型: 'fixed' | 'segmented' | 'lpr' | 'benchmark'
        rateType: 'fixed',

        // 固定利率选项
        fixedRate: 0, // 年利率大小 (%)
        fixedAdjustType: 'none', // 'none' | 'up' | 'down' | 'multiplier'
        fixedAdjustValue: 0, // 调整值

        // LPR 选项 (全国银行间同业拆借中心公布的贷款市场报价利率)
        lprTier: '1y', // '1y' | '5y'
        lprAdjustType: 'none', // 'none' | 'up' | 'down' | 'multiplier'
        lprAdjustValue: 0, // 调整值

        // 基准利率与LPR分段选项
        segmentedLprTier: '1y',
        segmentedLprAdjustType: 'none',
        segmentedLprAdjustValue: 0,

        // 中国人民银行同期贷款基准利率选项
        benchmarkTier: '6m', // '6m' | '1y' | '1y-3y' | '3y-5y' | 'over5y'
        benchmarkAdjustType: 'none',
        benchmarkAdjustValue: 0,

        // 计算结果
        result: null
      },
      lprRates: [],
      lprLoading: false,
      lprError: null,
      // 提示弹窗状态
      tipMessage: ''
    }
  },
  computed: {
    // 利率类型选项
    rateTypeOptions() {
      return [
        { value: 'fixed', label: '固定利率' },
        { value: 'segmented', label: '中国人民银行同期贷款基准利率与LPR分段' },
        { value: 'lpr', label: '全国银行间同业拆借中心公布的贷款市场报价利率(LPR)' },
        { value: 'benchmark', label: '中国人民银行同期贷款基准利率' }
      ]
    },
    // 利率调整方式选项
    adjustTypeOptions() {
      return [
        { value: 'none', label: '无' },
        { value: 'up', label: '上浮' },
        { value: 'down', label: '下浮' },
        { value: 'multiplier', label: '倍率' }
      ]
    },
    // 基准利率档次选项
    benchmarkTierOptions() {
      return [
        { value: '6m', label: '六个月以内' },
        { value: '1y', label: '六个月至一年' },
        { value: '1y-3y', label: '一至三年' },
        { value: '3y-5y', label: '三至五年' },
        { value: 'over5y', label: '五年以上' }
      ]
    },
    // 当前选中的利率类型标签
    selectedRateTypeLabel() {
      const found = this.rateTypeOptions.find(o => o.value === this.calculator.rateType)
      return found ? found.label : ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.initialPrincipal) {
          this.calculator.principal = this.initialPrincipal
        }
        // 设置默认日期
        const today = new Date().toISOString().slice(0, 10)
        if (!this.calculator.startDate) {
          this.calculator.startDate = today
        }
        if (!this.calculator.endDate) {
          this.calculator.endDate = today
        }
        this.calculator.result = null
        // 加载 LPR 数据
        if (this.lprRates.length === 0) {
          this.loadLprRates()
        }
      }
    }
  },
  methods: {
    async loadLprRates() {
      this.lprLoading = true
      this.lprError = null
      try {
        if (hasTushareToken()) {
          this.lprRates = await fetchLprRates()
        } else {
          this.lprRates = FALLBACK_LPR_RATES
        }
      } catch (error) {
        console.error('[DelayedInterestCalculator] LPR加载失败:', error)
        this.lprError = error.message
        this.lprRates = FALLBACK_LPR_RATES
      } finally {
        this.lprLoading = false
      }
    },

    // 获取指定日期的 LPR 利率记录
    getLprRecordForDate(dateStr) {
      // 合并 Supabase 数据与备用数据，确保历史数据完整
      const combinedRates = [...(this.lprRates || []), ...FALLBACK_LPR_RATES]
        // 去重（按日期取第一个）
        .filter((rate, index, arr) => arr.findIndex(r => r.date === rate.date) === index)
        // 按日期降序排列
        .sort((a, b) => b.date.localeCompare(a.date))

      if (combinedRates.length === 0) return null
      for (const rate of combinedRates) {
        if (rate.date <= dateStr) {
          return rate
        }
      }
      return combinedRates[combinedRates.length - 1]
    },

    // 获取指定日期的基准利率
    getBenchmarkRateForDate(dateStr, tier) {
      for (const record of PBC_BENCHMARK_HISTORY) {
        if (record.date <= dateStr) {
          return record.rates[tier] / 100
        }
      }
      return PBC_BENCHMARK_RATES[tier] / 100
    },

    // 应用调整到利率
    applyAdjustment(baseRate, adjustType, adjustValue) {
      if (adjustType === 'up') {
        return baseRate * (1 + adjustValue / 100)
      } else if (adjustType === 'down') {
        return baseRate * (1 - adjustValue / 100)
      } else if (adjustType === 'multiplier') {
        return baseRate * adjustValue
      }
      return baseRate
    },

    // 验证日期格式 (8位数字)
    validateDateFormat(dateStr) {
      if (!dateStr) return false
      // 支持 YYYY-MM-DD 格式
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      return datePattern.test(dateStr)
    },

    // 重置表单
    resetForm() {
      this.calculator = {
        principal: 0,
        startDate: '',
        endDate: '',
        yearBasis: 360,
        enableGeneralInterest: false,
        rateType: 'fixed',
        fixedRate: 0,
        fixedAdjustType: 'none',
        fixedAdjustValue: 0,
        lprTier: '1y',
        lprAdjustType: 'none',
        lprAdjustValue: 0,
        segmentedLprTier: '1y',
        segmentedLprAdjustType: 'none',
        segmentedLprAdjustValue: 0,
        benchmarkTier: '6m',
        benchmarkAdjustType: 'none',
        benchmarkAdjustValue: 0,
        result: null
      }
    },

    // 计算利息
    calculateInterest() {
      const calc = this.calculator

      // 验证必填字段
      if (!calc.principal || calc.principal <= 0) {
        this.showTip('请输入有效的计算基数')
        return
      }
      if (!calc.startDate || !calc.endDate) {
        this.showTip('请选择起始日期和截止日期')
        return
      }

      const start = new Date(calc.startDate)
      const end = new Date(calc.endDate)

      if (start > end) {
        this.showTip('截止日期不能早于起始日期')
        return
      }

      // 验证起始日期不能早于2014年8月1日（司法解释生效日期）
      if (calc.startDate < '2014-08-01') {
        this.showTip('目前仅支持2014年8月1日起的迟延履行利息计算!')
        return
      }

      // 如果启用一般债务利息且选择纯 LPR 利率类型，校验起始日期
      // 注意：segmented（分段）模式不需要此限制，因为它会自动使用基准利率处理 2019 年之前的日期
      if (calc.enableGeneralInterest && calc.rateType === 'lpr') {
        if (calc.startDate < '2019-08-20') {
          this.showTip('起始日期不能早于2019-08-20')
          return
        }
      }

      // 计算迟延履行天数 (起止日期均计算在内)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      const yearDays = calc.yearBasis

      // 1. 计算加倍部分债务利息 (固定: 日万分之一点七五)
      // 根据司法解释，加倍部分债务利息 = 债务本金 × 日万分之一点七五 × 迟延履行期间
      const doubleRateDaily = 0.000175 // 日万分之一点七五
      const doubleInterest = calc.principal * doubleRateDaily * days

      // 加倍部分债务利息详单
      const doubleDetail = {
        startDate: calc.startDate,
        endDate: calc.endDate,
        days: days,
        dailyRate: '1.75‰₀',
        interest: Math.round(doubleInterest * 100) / 100,
        formula: `= ${calc.principal.toLocaleString()} × 1.75‰₀ × ${days}`
      }

      // 2. 计算一般债务利息
      let generalInterest = 0
      let generalRateDesc = '--'
      let generalFormula = ''
      let generalPeriods = []

      if (calc.enableGeneralInterest) {
        let annualRate = 0

        switch (calc.rateType) {
          case 'fixed': {
            // 固定利率
            const baseRate = calc.fixedRate / 100
            annualRate = this.applyAdjustment(baseRate, calc.fixedAdjustType, calc.fixedAdjustValue)
            generalRateDesc = `${(annualRate * 100).toFixed(2)}%`
            generalInterest = (calc.principal * annualRate * days) / yearDays
            generalFormula = `= ${calc.principal.toLocaleString()} × (${calc.fixedRate}%${this.getAdjustmentDesc(calc.fixedAdjustType, calc.fixedAdjustValue)} ÷ ${yearDays}) × ${days}`

            generalPeriods = [
              {
                type: 'fixed',
                typeLabel: '固定利率',
                startDate: calc.startDate,
                endDate: calc.endDate,
                days: days,
                baseRate: calc.fixedRate + '%',
                adjustmentDesc: this.getAdjustmentDescText(
                  calc.fixedAdjustType,
                  calc.fixedAdjustValue
                ),
                adjustedRate: (annualRate * 100).toFixed(2) + '%',
                interest: Math.round(generalInterest * 100) / 100,
                formula: `= ${calc.principal.toLocaleString()} × (${calc.fixedRate}%${this.getAdjustmentDesc(calc.fixedAdjustType, calc.fixedAdjustValue)} ÷ ${yearDays}) × ${days}`
              }
            ]
            break
          }

          case 'lpr': {
            // 全国银行间同业拆借中心公布的LPR
            const lprResult = this.calculateLprInterestWithDetails(
              calc,
              start,
              days,
              yearDays,
              'lpr'
            )
            generalInterest = lprResult.totalInterest
            generalPeriods = lprResult.periods
            generalRateDesc = 'LPR分段计算'
            break
          }

          case 'segmented': {
            // 中国人民银行同期贷款基准利率与LPR分段
            const segResult = this.calculateSegmentedInterestWithDetails(
              calc,
              start,
              days,
              yearDays
            )
            generalInterest = segResult.totalInterest
            generalPeriods = segResult.periods
            generalRateDesc = '基准利率与LPR分段'
            break
          }

          case 'benchmark': {
            // 中国人民银行同期贷款基准利率
            const bmResult = this.calculateBenchmarkInterestWithDetails(calc, start, days, yearDays)
            generalInterest = bmResult.totalInterest
            generalPeriods = bmResult.periods
            generalRateDesc = '基准利率分段计算'
            break
          }
        }
      }

      // 设置计算结果
      calc.result = {
        days,
        startDate: calc.startDate,
        endDate: calc.endDate,
        principal: calc.principal,
        yearBasis: yearDays,
        generalInterest: Math.round(generalInterest * 100) / 100,
        doubleInterest: Math.round(doubleInterest * 100) / 100,
        totalInterest: Math.round((generalInterest + doubleInterest) * 100) / 100,
        generalRateDesc,
        doubleRateDesc: '日万分之一点七五',
        generalFormula,
        generalPeriods,
        doubleDetail
      }
    },

    // 获取调整方式文本描述（用于公式）
    getAdjustmentDesc(adjustType, adjustValue) {
      if (adjustType === 'none') return ''
      if (adjustType === 'up') return ` × (1 + ${adjustValue}%)`
      if (adjustType === 'down') return ` × (1 - ${adjustValue}%)`
      if (adjustType === 'multiplier') return ` × ${adjustValue}`
      return ''
    },

    // 获取调整方式显示文本
    getAdjustmentDescText(adjustType, adjustValue) {
      if (adjustType === 'none') return '无'
      if (adjustType === 'up') return `上浮${adjustValue}%`
      if (adjustType === 'down') return `下浮${adjustValue}%`
      if (adjustType === 'multiplier') return `${adjustValue}倍`
      return '无'
    },

    // 计算 LPR 利息并返回详单
    calculateLprInterestWithDetails(calc, startDate, days, yearDays, mode) {
      let totalInterest = 0
      const loopDate = new Date(startDate)
      const tier = mode === 'lpr' ? calc.lprTier : calc.segmentedLprTier
      const adjustType = mode === 'lpr' ? calc.lprAdjustType : calc.segmentedLprAdjustType
      const adjustValue = mode === 'lpr' ? calc.lprAdjustValue : calc.segmentedLprAdjustValue

      const periods = []
      let currentPeriod = null

      for (let i = 0; i < days; i++) {
        const dateStr = loopDate.toISOString().slice(0, 10)
        const lprRecord = this.getLprRecordForDate(dateStr)
        const baseRate = lprRecord ? lprRecord[tier] / 100 : FALLBACK_LPR_RATES[0][tier] / 100
        const annualRate = this.applyAdjustment(baseRate, adjustType, adjustValue)
        const dailyRate = annualRate / yearDays

        // 分组
        const rateKey = baseRate.toFixed(6)
        if (!currentPeriod || currentPeriod.rateKey !== rateKey) {
          if (currentPeriod) {
            currentPeriod.endDate = new Date(loopDate)
            currentPeriod.endDate.setDate(currentPeriod.endDate.getDate() - 1)
            periods.push(currentPeriod)
          }
          currentPeriod = {
            type: 'lpr',
            typeLabel: 'LPR',
            rateKey,
            startDate: new Date(loopDate),
            endDate: null,
            days: 0,
            baseRateVal: baseRate,
            adjustedRateVal: annualRate,
            dailyRate: dailyRate,
            adjustmentDesc: this.getAdjustmentDescText(adjustType, adjustValue),
            interest: 0
          }
        }
        currentPeriod.days++
        loopDate.setDate(loopDate.getDate() + 1)
      }

      if (currentPeriod) {
        currentPeriod.endDate = new Date(calc.endDate)
        periods.push(currentPeriod)
      }

      // 格式化与计算
      const formattedPeriods = periods.map(p => {
        // 分段计算利息并四舍五入
        const rawInterest = calc.principal * p.dailyRate * p.days
        const interest = Math.round(rawInterest * 100) / 100
        totalInterest += interest

        const roundedAdjustedRate = parseFloat((p.adjustedRateVal * 100).toFixed(4))

        return {
          ...p,
          startDate: p.startDate.toISOString().slice(0, 10),
          endDate: p.endDate.toISOString().slice(0, 10),
          baseRate: parseFloat((p.baseRateVal * 100).toFixed(4)) + '%',
          adjustedRate: roundedAdjustedRate + '%',
          interest: interest,
          formula: `= ${calc.principal.toLocaleString()} × (${roundedAdjustedRate}% ÷ ${yearDays}) × ${p.days}`
        }
      })

      return { totalInterest: Math.round(totalInterest * 100) / 100, periods: formattedPeriods }
    },

    // 计算分段利息并返回详单 (基准利率与LPR分段)
    calculateSegmentedInterestWithDetails(calc, startDate, days, yearDays) {
      let totalInterest = 0
      const loopDate = new Date(startDate)
      const LPR_REFORM_DATE = '2019-08-20'
      const adjustType = calc.segmentedLprAdjustType
      const adjustValue = calc.segmentedLprAdjustValue

      const periods = []
      let currentPeriod = null

      for (let i = 0; i < days; i++) {
        const dateStr = loopDate.toISOString().slice(0, 10)
        let baseRate = 0
        let periodType = ''

        if (dateStr < LPR_REFORM_DATE) {
          periodType = 'benchmark'
          const tier = calc.segmentedLprTier === '1y' ? '1y' : 'over5y'
          baseRate = this.getBenchmarkRateForDate(dateStr, tier)
        } else {
          periodType = 'lpr'
          const lprRecord = this.getLprRecordForDate(dateStr)
          const tier = calc.segmentedLprTier
          baseRate = lprRecord ? lprRecord[tier] / 100 : FALLBACK_LPR_RATES[0][tier] / 100
        }

        const annualRate = this.applyAdjustment(baseRate, adjustType, adjustValue)
        const dailyRate = annualRate / yearDays

        const rateKey = periodType + '-' + baseRate.toFixed(6)
        if (!currentPeriod || currentPeriod.rateKey !== rateKey) {
          if (currentPeriod) {
            currentPeriod.endDate = new Date(loopDate)
            currentPeriod.endDate.setDate(currentPeriod.endDate.getDate() - 1)
            periods.push(currentPeriod)
          }
          currentPeriod = {
            type: periodType,
            typeLabel: periodType === 'benchmark' ? '基准利率' : 'LPR',
            rateKey,
            startDate: new Date(loopDate),
            endDate: null,
            days: 0,
            baseRateVal: baseRate,
            adjustedRateVal: annualRate,
            dailyRate: dailyRate,
            adjustmentDesc: this.getAdjustmentDescText(adjustType, adjustValue),
            interest: 0
          }
        }
        currentPeriod.days++
        loopDate.setDate(loopDate.getDate() + 1)
      }

      if (currentPeriod) {
        currentPeriod.endDate = new Date(calc.endDate)
        periods.push(currentPeriod)
      }

      const formattedPeriods = periods.map(p => {
        const rawInterest = calc.principal * p.dailyRate * p.days
        const interest = Math.round(rawInterest * 100) / 100
        totalInterest += interest

        const roundedAdjustedRate = parseFloat((p.adjustedRateVal * 100).toFixed(4))

        return {
          ...p,
          startDate: p.startDate.toISOString().slice(0, 10),
          endDate: p.endDate.toISOString().slice(0, 10),
          baseRate: parseFloat((p.baseRateVal * 100).toFixed(4)) + '%',
          adjustedRate: roundedAdjustedRate + '%',
          interest: interest,
          formula: `= ${calc.principal.toLocaleString()} × (${roundedAdjustedRate}% ÷ ${yearDays}) × ${p.days}`
        }
      })

      return { totalInterest: Math.round(totalInterest * 100) / 100, periods: formattedPeriods }
    },

    // 计算基准利率利息并返回详单
    calculateBenchmarkInterestWithDetails(calc, startDate, days, yearDays) {
      let totalInterest = 0
      const loopDate = new Date(startDate)
      const adjustType = calc.benchmarkAdjustType
      const adjustValue = calc.benchmarkAdjustValue

      const periods = []
      let currentPeriod = null

      for (let i = 0; i < days; i++) {
        const dateStr = loopDate.toISOString().slice(0, 10)
        const baseRate = this.getBenchmarkRateForDate(dateStr, calc.benchmarkTier)
        const annualRate = this.applyAdjustment(baseRate, adjustType, adjustValue)
        const dailyRate = annualRate / yearDays

        const rateKey = baseRate.toFixed(6)
        if (!currentPeriod || currentPeriod.rateKey !== rateKey) {
          if (currentPeriod) {
            currentPeriod.endDate = new Date(loopDate)
            currentPeriod.endDate.setDate(currentPeriod.endDate.getDate() - 1)
            periods.push(currentPeriod)
          }
          currentPeriod = {
            type: 'benchmark',
            typeLabel: '基准利率',
            rateKey,
            startDate: new Date(loopDate),
            endDate: null,
            days: 0,
            baseRateVal: baseRate,
            adjustedRateVal: annualRate,
            dailyRate: dailyRate,
            adjustmentDesc: this.getAdjustmentDescText(adjustType, adjustValue),
            interest: 0
          }
        }
        currentPeriod.days++
        loopDate.setDate(loopDate.getDate() + 1)
      }

      if (currentPeriod) {
        currentPeriod.endDate = new Date(calc.endDate)
        periods.push(currentPeriod)
      }

      const formattedPeriods = periods.map(p => {
        const rawInterest = calc.principal * p.dailyRate * p.days
        const interest = Math.round(rawInterest * 100) / 100
        totalInterest += interest

        const roundedAdjustedRate = parseFloat((p.adjustedRateVal * 100).toFixed(4))

        return {
          ...p,
          startDate: p.startDate.toISOString().slice(0, 10),
          endDate: p.endDate.toISOString().slice(0, 10),
          baseRate: parseFloat((p.baseRateVal * 100).toFixed(4)) + '%',
          adjustedRate: roundedAdjustedRate + '%',
          interest: interest,
          formula: `= ${calc.principal.toLocaleString()} × (${roundedAdjustedRate}% ÷ ${yearDays}) × ${p.days}`
        }
      })

      return { totalInterest: Math.round(totalInterest * 100) / 100, periods: formattedPeriods }
    },

    // 应用到案件
    applyToCase() {
      if (!this.calculator.result) return
      this.$emit('apply', {
        generalInterest: this.calculator.result.generalInterest,
        doubleInterest: this.calculator.result.doubleInterest,
        totalInterest: this.calculator.result.totalInterest
      })
      this.$emit('update:visible', false)
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('update:visible', false)
    },

    // 显示提示弹窗
    showTip(message) {
      this.tipMessage = message
    },

    // 关闭提示弹窗
    closeTip() {
      this.tipMessage = ''
    },

    // 数字转中文大写金额
    toChineseCurrency(num) {
      if (num === 0 || !num) return '零元'
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const units = ['', '拾', '佰', '仟']
      const bigUnits = ['', '万', '亿', '兆']

      let result = ''
      const numStr = Math.abs(num).toFixed(2)
      const parts = numStr.split('.')
      const intPart = parts[0]
      const decPart = parts[1]

      // 整数部分
      if (intPart !== '0') {
        let intStr = ''
        const len = intPart.length
        for (let i = 0; i < len; i++) {
          const digit = parseInt(intPart[i])
          const pos = len - i - 1
          const unitPos = pos % 4
          const bigUnitPos = Math.floor(pos / 4)

          if (digit !== 0) {
            intStr += digits[digit] + units[unitPos]
          } else {
            if (intStr && !intStr.endsWith('零')) {
              intStr += '零'
            }
          }

          if (unitPos === 0 && bigUnitPos > 0 && intStr && !intStr.endsWith('零')) {
            intStr = intStr.replace(/零+$/, '') + bigUnits[bigUnitPos]
          }
        }
        result = intStr.replace(/零+$/, '') + '元'
      } else {
        result = ''
      }

      // 小数部分
      if (decPart && decPart !== '00') {
        const jiao = parseInt(decPart[0])
        const fen = parseInt(decPart[1])
        if (jiao > 0) {
          result += digits[jiao] + '角'
        } else if (result) {
          result += '零'
        }
        if (fen > 0) {
          result += digits[fen] + '分'
        }
      } else if (result) {
        result += '整'
      }

      return result || '零元'
    },

    // 下载计算详单
    downloadReport() {
      if (!this.calculator.result) return

      const result = this.calculator.result
      const now = new Date().toLocaleString('zh-CN')

      // 生成HTML报告
      const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>迟延履行利息计算详单</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Microsoft YaHei", "SimSun", sans-serif; padding: 40px; background: #fff; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
        .header h1 { font-size: 24px; color: #1a1a1a; margin-bottom: 10px; }
        .header .subtitle { font-size: 14px; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 15px; padding-left: 10px; border-left: 4px solid #f59e0b; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-bottom: 20px; }
        .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e5e5e5; }
        .info-label { color: #666; }
        .info-value { font-weight: 600; color: #1a1a1a; }
        .result-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .result-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #a7f3d0; }
        .result-row:last-child { border-bottom: none; }
        .result-label { color: #047857; }
        .result-value { font-weight: bold; }
        .result-value.green { color: #059669; font-size: 18px; }
        .result-value.orange { color: #f59e0b; font-size: 18px; }
        .result-value.red { color: #dc2626; font-size: 22px; }
        .chinese-amount { font-size: 12px; color: #666; margin-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 10px; text-align: left; border: 1px solid #e5e5e5; }
        th { background: #f8f8f8; font-weight: 600; }
        .table-title { background: #10b981; color: white; padding: 10px; font-weight: bold; text-align: center; }
        .table-title.orange { background: #f59e0b; }
        .formula { font-family: monospace; font-size: 12px; color: #666; margin-top: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; text-align: center; }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>迟延履行利息计算详单</h1>
        <div class="subtitle">生成时间：${now}</div>
    </div>
    
    <div class="section">
        <div class="section-title">基础信息</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">计算基数：</span>
                <span class="info-value">¥${result.principal?.toLocaleString() || this.calculator.principal.toLocaleString()}</span>
            </div>
            <div class="info-item">
                <span class="info-label">迟延履行天数：</span>
                <span class="info-value">${result.days} 天</span>
            </div>
            <div class="info-item">
                <span class="info-label">起始日期：</span>
                <span class="info-value">${result.startDate || this.calculator.startDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">截止日期：</span>
                <span class="info-value">${result.endDate || this.calculator.endDate}</span>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">计算结果</div>
        <div class="result-box">
            <div class="result-row">
                <span class="result-label">一般债务利息：</span>
                <span>
                    <span class="result-value green">${result.generalInterest.toLocaleString()} 元</span>
                    <span class="chinese-amount">${this.toChineseCurrency(result.generalInterest)}</span>
                </span>
            </div>
            <div class="result-row">
                <span class="result-label">加倍部分债务利息：</span>
                <span>
                    <span class="result-value orange">${result.doubleInterest.toLocaleString()} 元</span>
                    <span class="chinese-amount">${this.toChineseCurrency(result.doubleInterest)}</span>
                </span>
            </div>
            <div class="result-row">
                <span class="result-label">共计：</span>
                <span>
                    <span class="result-value red">${result.totalInterest.toLocaleString()} 元</span>
                    <span class="chinese-amount">${this.toChineseCurrency(result.totalInterest)}</span>
                </span>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">一般债务利息详单</div>
        <div class="table-title">一般债务利息</div>
        <table>
            <thead>
                <tr>
                    <th>时间段</th>
                    <th>天数</th>
                    <th>年利率</th>
                    <th>利率调整</th>
                    <th>金额</th>
                </tr>
            </thead>
            <tbody>
                ${
                  result.generalPeriods && result.generalPeriods.length > 0
                    ? result.generalPeriods
                        .map(
                          p => `
                        <tr>
                            <td>${p.startDate}<br/>${p.endDate}</td>
                            <td>${p.days}</td>
                            <td>${p.baseRate}</td>
                            <td>${p.adjustmentDesc}</td>
                            <td>
                                <strong>${p.interest.toLocaleString()} 元</strong>
                                <div class="formula">${p.formula}</div>
                            </td>
                        </tr>
                    `
                        )
                        .join('')
                    : '<tr><td colspan="5" style="text-align: center; color: #999;">未开启一般债务利息计算</td></tr>'
                }
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <div class="section-title">加倍部分债务利息详单</div>
        <div class="table-title orange">加倍部分债务利息</div>
        <table>
            <thead>
                <tr>
                    <th>时间段</th>
                    <th>天数</th>
                    <th>日利率</th>
                    <th>金额</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${result.doubleDetail.startDate}<br/>${result.doubleDetail.endDate}</td>
                    <td>${result.doubleDetail.days}</td>
                    <td>${result.doubleDetail.dailyRate}</td>
                    <td>
                        <strong>${result.doubleDetail.interest.toLocaleString()} 元</strong>
                        <div class="formula">${result.doubleDetail.formula}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>本计算结果依据《最高人民法院关于执行程序中计算迟延履行期间的债务利息适用法律若干问题的解释》</p>
        <p>迟延履行期间的债务利息 = 一般债务利息 + 加倍部分债务利息</p>
        <p>加倍部分债务利息 = 债务本金 × 日万分之一点七五 × 迟延履行期间</p>
        <p style="margin-top: 10px;">— AI法律助手 自动生成 —</p>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 30px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            打印 / 保存为PDF
        </button>
    </div>
</body>
</html>
            `

      // 创建Blob并下载
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      // 打开新窗口显示报告（用户可以打印为PDF）
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          URL.revokeObjectURL(url)
        }
      }
    }
  },
  template: `
        <div v-if="visible" class="modal-overlay" @click.self="closeModal">
            <div class="modal-container" style="width: 650px; max-width: 95vw;">
                <div class="modal-header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">
                    <div class="modal-title" style="color: white;">
                        <i class="fas fa-calculator" style="margin-right: 8px;"></i>
                        迟延履行利息计算器
                    </div>
                    <button class="modal-close" style="color: white; background: rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; transition: all 0.2s;" @click="closeModal">
                        <i class="fas fa-times" style="font-size: 16px;"></i>
                    </button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    
                    <!-- 1. 基础参数输入 -->
                    <div style="background: #fffbeb; padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #fcd34d;">
                        <div style="font-weight: 600; color: #92400e; margin-bottom: 12px;">
                            <i class="fas fa-calculator" style="margin-right: 6px;"></i>基础参数
                        </div>
                        
                        <div class="smart-form-group">
                            <label class="smart-label">计算基数 (元)</label>
                            <input type="number" class="smart-input" v-model.number="calculator.principal" 
                                   placeholder="请输入金额" style="border: 1px solid #e2e8f0;">
                            <div v-if="calculator.principal" style="color: #92400e; font-size: 12px; margin-top: 4px; padding-left: 2px;">{{ toChineseCurrency(calculator.principal) }}</div>
                        </div>
                        
                        <div style="font-size: 13px; font-weight: 600; color: #78716c; margin: 16px 0 8px 0;">迟延履行期间</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="smart-form-group">
                                <label class="smart-label">起始日期</label>
                                <SmartDatePicker v-model="calculator.startDate" placeholder="请输入或选择日期" />
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">截止日期</label>
                                <SmartDatePicker v-model="calculator.endDate" placeholder="请输入或选择日期" />
                            </div>
                        </div>
                        <div style="font-size: 11px; color: #d97706; margin-top: 4px;">
                            <i class="fas fa-info-circle"></i> 日期格式必须为八位数，如：20260104
                        </div>
                    </div>

                    <!-- 2. 一般债务利息配置 -->
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-weight: 600; color: #334155;">
                                <i class="fas fa-percentage" style="margin-right: 6px;"></i>
                                是否生效法律文书确定给付一般债务利息
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" v-model="calculator.enableGeneralInterest">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <!-- 开启后显示详细配置 -->
                        <template v-if="calculator.enableGeneralInterest">
                            
                            <!-- 利率类型选择 -->
                            <div class="smart-form-group" style="margin-bottom: 16px;">
                                <label class="smart-label">生效法律文书确定给付一般债务利率类型</label>
                                <select class="smart-input" v-model="calculator.rateType" style="border: 1px solid #e2e8f0;">
                                    <option v-for="opt in rateTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            
                            <!-- 固定利率配置 -->
                            <template v-if="calculator.rateType === 'fixed'">
                                <div style="padding: 12px; background: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1;">
                                    <div class="smart-form-group" style="margin-bottom: 12px;">
                                        <label class="smart-label">年利率大小</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <input type="number" step="0.01" class="smart-input" v-model.number="calculator.fixedRate" 
                                                   placeholder="请输入" style="flex: 1; border: 1px solid #e2e8f0;">
                                            <span style="color: #64748b;">%</span>
                                        </div>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">利率调整方式</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <select class="smart-input" v-model="calculator.fixedAdjustType" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <option v-for="opt in adjustTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                            </select>
                                            <template v-if="calculator.fixedAdjustType !== 'none'">
                                                <input type="number" step="0.1" class="smart-input" v-model.number="calculator.fixedAdjustValue" 
                                                       placeholder="请输入" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <span style="color: #64748b; font-size: 12px;">{{ calculator.fixedAdjustType === 'multiplier' ? '倍' : '%' }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <!-- LPR 配置 -->
                            <template v-if="calculator.rateType === 'lpr'">
                                <div style="padding: 12px; background: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1;">
                                    <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 12px;">更多自定义项</div>
                                    <div class="smart-form-group" style="margin-bottom: 12px;">
                                        <label class="smart-label">LPR档次</label>
                                        <div style="display: flex; gap: 16px; font-size: 13px;">
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.lprTier" value="1y"> 1年期LPR
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.lprTier" value="5y"> 5年期以上LPR
                                            </label>
                                        </div>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">LPR调整方式</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <select class="smart-input" v-model="calculator.lprAdjustType" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <option v-for="opt in adjustTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                            </select>
                                            <template v-if="calculator.lprAdjustType !== 'none'">
                                                <input type="number" step="0.1" class="smart-input" v-model.number="calculator.lprAdjustValue" 
                                                       placeholder="请输入" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <span style="color: #64748b; font-size: 12px;">{{ calculator.lprAdjustType === 'multiplier' ? '倍' : '%' }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <!-- 基准利率与LPR分段配置 -->
                            <template v-if="calculator.rateType === 'segmented'">
                                <div style="padding: 12px; background: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1;">
                                    <div style="background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; padding: 8px; font-size: 12px; border-radius: 4px; margin-bottom: 12px;">
                                        <i class="fas fa-info-circle"></i> 2019年8月20日前使用基准利率，之后使用LPR
                                    </div>
                                    <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 12px;">更多自定义项</div>
                                    <div class="smart-form-group" style="margin-bottom: 12px;">
                                        <label class="smart-label">LPR档次</label>
                                        <div style="display: flex; gap: 16px; font-size: 13px;">
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.segmentedLprTier" value="1y"> 1年期LPR
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.segmentedLprTier" value="5y"> 5年期以上LPR
                                            </label>
                                        </div>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">LPR调整方式</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <select class="smart-input" v-model="calculator.segmentedLprAdjustType" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <option v-for="opt in adjustTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                            </select>
                                            <template v-if="calculator.segmentedLprAdjustType !== 'none'">
                                                <input type="number" step="0.1" class="smart-input" v-model.number="calculator.segmentedLprAdjustValue" 
                                                       placeholder="请输入" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <span style="color: #64748b; font-size: 12px;">{{ calculator.segmentedLprAdjustType === 'multiplier' ? '倍' : '%' }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <!-- 基准利率配置 -->
                            <template v-if="calculator.rateType === 'benchmark'">
                                <div style="padding: 12px; background: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1;">
                                    <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 12px;">更多自定义项</div>
                                    <div class="smart-form-group" style="margin-bottom: 12px;">
                                        <label class="smart-label">中国人民银行贷款基准利率档次</label>
                                        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                                            <label v-for="opt in benchmarkTierOptions" :key="opt.value" 
                                                   style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.benchmarkTier" :value="opt.value"> {{ opt.label }}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">利率调整方式</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <select class="smart-input" v-model="calculator.benchmarkAdjustType" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <option v-for="opt in adjustTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                            </select>
                                            <template v-if="calculator.benchmarkAdjustType !== 'none'">
                                                <input type="number" step="0.1" class="smart-input" v-model.number="calculator.benchmarkAdjustValue" 
                                                       placeholder="请输入" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <span style="color: #64748b; font-size: 12px;">{{ calculator.benchmarkAdjustType === 'multiplier' ? '倍' : '%' }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <!-- 一年天数定义 -->
                            <div class="smart-form-group" style="margin-top: 16px;">
                                <label class="smart-label">一年为</label>
                                <div style="display: flex; gap: 16px; font-size: 13px;">
                                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                        <input type="radio" v-model.number="calculator.yearBasis" :value="360"> 360天
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                        <input type="radio" v-model.number="calculator.yearBasis" :value="365"> 365天
                                    </label>
                                </div>
                            </div>
                        </template>
                        
                        <template v-else>
                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px; font-size: 13px; color: #991b1b;">
                                <i class="fas fa-info-circle"></i> 关闭状态下，仅计算加倍部分债务利息
                            </div>
                        </template>
                    </div>

                    <!-- 3. 计算结果输出 -->
                    <div v-if="!calculator.result" style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-weight: 600; color: #334155; margin-bottom: 12px;">
                            <i class="fas fa-chart-bar" style="margin-right: 6px;"></i>计算结果
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                            <span style="color: #64748b;">一般债务利息：</span>
                            <span style="font-weight: 600; font-size: 18px; color: #94a3b8;">--元</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                            <span style="color: #64748b;">加倍部分债务利息：</span>
                            <span style="font-weight: 600; font-size: 18px; color: #94a3b8;">--元</span>
                        </div>
                    </div>
                    
                    <!-- 有计算结果时显示详细信息 -->
                    <div v-if="calculator.result" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; border: 1px solid #a7f3d0; animation: resultFadeIn 0.3s ease-out;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div style="font-weight: 600; color: #065f46;">
                                <i class="fas fa-check-circle" style="margin-right: 6px;"></i>计算结果
                            </div>
                            <button 
                                @click="downloadReport" 
                                style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: white; border: 1px solid #10b981; color: #059669; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s;"
                                title="下载计算详单"
                            >
                                <i class="fas fa-download"></i>
                                下载详单
                            </button>
                        </div>
                        
                        <!-- 结果摘要 -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #a7f3d0;">
                            <div>
                                <div style="color: #047857; font-size: 13px;">一般债务利息：</div>
                                <div style="font-weight: 700; font-size: 20px; color: #059669;">{{ calculator.result.generalInterest.toLocaleString() }}元</div>
                            </div>
                            <div style="text-align: right; color: #64748b; font-size: 12px;" v-if="calculator.enableGeneralInterest">
                                {{ toChineseCurrency(calculator.result.generalInterest) }}
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #a7f3d0;">
                            <div>
                                <div style="color: #047857; font-size: 13px;">加倍部分债务利息：</div>
                                <div style="font-weight: 700; font-size: 20px; color: #f59e0b;">{{ calculator.result.doubleInterest.toLocaleString() }}元</div>
                            </div>
                            <div style="text-align: right; color: #64748b; font-size: 12px;">
                                {{ toChineseCurrency(calculator.result.doubleInterest) }}
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0;">
                            <div>
                                <div style="color: #047857; font-size: 13px;">共计：</div>
                                <div style="font-weight: 700; font-size: 24px; color: #dc2626;">{{ calculator.result.totalInterest.toLocaleString() }}元</div>
                            </div>
                            <div style="text-align: right; color: #64748b; font-size: 12px;">
                                {{ toChineseCurrency(calculator.result.totalInterest) }}
                            </div>
                        </div>
                        
                        <!-- 计算详单 -->
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #a7f3d0;">
                            <div style="font-size: 13px; font-weight: 600; color: #065f46; margin-bottom: 12px;">
                                <i class="fas fa-list-alt" style="margin-right: 6px;"></i>计算详单：
                            </div>
                            
                            <!-- 一般债务利息详单 -->
                            <div style="margin-bottom: 16px;">
                                <div style="background: white; border-radius: 8px; border: 1px solid #10b981; overflow: hidden;">
                                    <div style="background: #10b981; color: white; padding: 10px 16px; font-weight: 600; font-size: 14px; text-align: center;">
                                        一般债务利息
                                    </div>
                                    <div style="padding: 12px;">
                                        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                            <thead>
                                                <tr style="background: #f0fdf4;">
                                                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #d1fae5; color: #065f46;">时间段</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">天数</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">
                                                        {{ calculator.rateType === 'benchmark' ? '基准利率' : (calculator.rateType === 'fixed' ? '年利率' : 'LPR值') }}
                                                    </th>

                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">利率调整</th>
                                                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #d1fae5; color: #065f46;">金额</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-if="calculator.result.generalPeriods && calculator.result.generalPeriods.length > 0">
                                                    <tr v-for="(period, idx) in calculator.result.generalPeriods" :key="'g-'+idx">
                                                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
                                                            <div>{{ period.startDate }}</div>
                                                            <div style="color: #94a3b8;">{{ period.endDate }}</div>
                                                        </td>
                                                        <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.days }}</td>
                                                        <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.baseRate }}</td>
                                                        <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.adjustmentDesc }}</td>
                                                        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                                                            <div style="font-weight: 600; color: #059669;">{{ period.interest.toLocaleString() }}元</div>
                                                            <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">{{ period.formula }}</div>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <tr v-else>
                                                    <td colspan="5" style="padding: 16px; text-align: center; color: #94a3b8;">
                                                        未开启一般债务利息计算
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 加倍部分债务利息详单 -->
                            <div>
                                <div style="background: white; border-radius: 8px; border: 1px solid #f59e0b; overflow: hidden;">
                                    <div style="background: #f59e0b; color: white; padding: 10px 16px; font-weight: 600; font-size: 14px; text-align: center;">
                                        加倍部分债务利息
                                    </div>
                                    <div style="padding: 12px;">
                                        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                            <thead>
                                                <tr style="background: #fffbeb;">
                                                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #fcd34d; color: #92400e;">时间段</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #fcd34d; color: #92400e;">天数</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #fcd34d; color: #92400e;">日利率</th>
                                                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #fcd34d; color: #92400e;">金额</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
                                                        <div>{{ calculator.result.doubleDetail.startDate }}</div>
                                                        <div style="color: #94a3b8;">{{ calculator.result.doubleDetail.endDate }}</div>
                                                    </td>
                                                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ calculator.result.doubleDetail.days }}</td>
                                                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ calculator.result.doubleDetail.dailyRate }}</td>
                                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                                                        <div style="font-weight: 600; color: #f59e0b;">{{ calculator.result.doubleDetail.interest.toLocaleString() }}元</div>
                                                        <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">{{ calculator.result.doubleDetail.formula }}</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer" style="gap: 12px;">
                    <button class="smart-btn-secondary" style="transition: all 0.2s; padding: 10px 20px;" @click="closeModal">关闭</button>
                    <button class="smart-btn-primary" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); transition: all 0.2s; padding: 10px 24px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);" @click="calculateInterest">
                        <i class="fas fa-calculator"></i> 计算
                    </button>
                    <button v-if="calculator.result" class="smart-btn-primary" style="transition: all 0.2s; padding: 10px 24px; box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);" @click="applyToCase">
                        <i class="fas fa-plus"></i> 应用到标的
                    </button>
                </div>
            </div>
        </div>

        <!-- 提示弹窗 -->
        <div v-if="tipMessage" class="modal-overlay" style="z-index: 10000;" @click.self="closeTip">
            <div style="
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                width: 320px;
                max-width: 85vw;
                overflow: hidden;
                animation: tipFadeIn 0.2s ease-out;
            ">
                <div style="padding: 28px 24px 20px 24px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">提示</div>
                    <div style="font-size: 16px; color: #475569; line-height: 1.7;">{{ tipMessage }}</div>
                </div>
                <div style="padding: 12px 24px 24px 24px; display: flex; justify-content: center;">
                    <button 
                        @click="closeTip" 
                        style="
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            border: none;
                            padding: 12px 48px;
                            border-radius: 6px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s;
                            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                        "
                    >确定</button>
                </div>
            </div>
        </div>
        
        <style>
        @keyframes tipFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes resultFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #cbd5e1;
            transition: 0.3s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }
        .toggle-switch input:checked + .toggle-slider {
            background-color: #10b981;
        }
        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(24px);
        }
        </style>
    `
}
