import {
  fetchLprRates,
  hasTushareToken,
  FALLBACK_LPR_RATES,
  PBC_BENCHMARK_RATES,
  PBC_BENCHMARK_HISTORY
} from '../../services/lprService.js'
import SmartDatePicker from '../common/SmartDatePicker.js'

export default {
  name: 'InterestCalculator',
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
        principal: 0, // 计算基数
        startDate: '', // 起始日期 (YYYY-MM-DD)
        endDate: '', // 截止日期
        dateBoundary: 'both', // 'both' | 'startOnly' | 'endOnly' | 'neither'
        yearBasis: 360, // 360 | 365
        rateType: 'lpr', // 'lpr' | 'benchmark' | 'custom'
        // LPR选项
        lprTier: '5y', // '1y' | '5y'
        lprCalcMethod: 'segmented', // 'segmented' (分段) | 'specified' (指定)
        selectedLprDate: '', // 指定LPR日期
        // LPR 调整方式
        lprBpAdjustType: 'none', // 'none' | 'up' (上浮/加) | 'down' (下浮/减)
        lprBasisPoints: 0, // 基点数值
        lprFloatType: 'none', // 'none' | 'multiplier' (倍率)
        lprMultiplier: 1, // 浮动倍率
        // 贷款基准利率选项
        benchmarkTier: 'over5y', // '6m' | '1y' | '1y-3y' | '3y-5y' | 'over5y'
        benchmarkCalcMethod: 'segmented', // 'segmented' (分段) | 'specified' (指定)
        selectedBenchmarkDate: '2015-10-24', // 指定利率时的基准日期 (or 'custom')
        benchmarkCustomRate: 4.9, // 自定义基准利率
        benchmarkAdjustmentType: 'none', // 'none' | 'up' | 'down' | 'multiplier'
        benchmarkAdjustmentValue: 0, // 调整值 (百分比或倍数)
        // 自定义利率
        customRate: 0,
        customRateUnit: 'permille', // 'percent' | 'permille' | 'permyriad'
        customTimeBasis: 'month', // 'year' | 'month' | 'day'
        customDurationType: 'dateRange', // 'dateRange' | 'days' | 'months' | 'years'
        customDuration: 0, // 天数/月数/年数
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
    benchmarkHistoryOptions() {
      const options = PBC_BENCHMARK_HISTORY.map(item => ({ value: item.date, label: item.date }))
      options.unshift({ value: 'custom', label: '自定义利率' })
      return options
    },
    lprDateOptions() {
      if (!this.lprRates || this.lprRates.length === 0) return []
      return this.lprRates.map(item => item.date)
    },
    showBenchmarkOptions() {
      if (this.calculator.rateType !== 'segmented') return false
      // 如果没有选择日期，默认显示
      if (!this.calculator.startDate) return true
      // 如果起始日期在 LPR 改革日之前，需要显示基准利率选项
      return this.calculator.startDate < '2019-08-20'
    },
    showLprOptions() {
      // 对于纯 LPR 模式，始终显示
      if (this.calculator.rateType === 'lpr') return true
      // 对于分段模式，检查日期
      if (this.calculator.rateType !== 'segmented') return false
      // 如果没有选择日期，默认显示
      if (!this.calculator.endDate) return true
      // 如果截止日期在 LPR 改革日及之后，需要显示 LPR 选项
      return this.calculator.endDate >= '2019-08-20'
    },
    currentBenchmarkRateSummary() {
      let rates = null
      const benchmarkDate = this.calculator.selectedBenchmarkDate

      if (benchmarkDate === 'custom') {
        return null // 自定义时不显示摘要
      }

      // 查找对应日期的利率记录
      if (this.calculator.benchmarkCalcMethod === 'specified' && benchmarkDate) {
        const record = PBC_BENCHMARK_HISTORY.find(r => r.date === benchmarkDate)
        if (record) rates = record.rates
      } else {
        // 分段模式下，根据起始日期查找
        const startDate = this.calculator.startDate
        if (startDate) {
          for (const record of PBC_BENCHMARK_HISTORY) {
            if (record.date <= startDate) {
              rates = record.rates
              break
            }
          }
        }
      }

      // 如果没找到，使用默认利率
      if (!rates) rates = PBC_BENCHMARK_RATES

      // 生成摘要文本
      return `一年以内${rates['6m'] || rates['1y']}%，一至五年为${rates['1y-3y']}%，五年以上为${rates['over5y']}%`
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 打开时重置或初始化
        if (this.initialPrincipal) {
          this.calculator.principal = this.initialPrincipal
        }

        // 设置默认日期，避免显示 yyyy/mm/dd
        const today = new Date().toISOString().slice(0, 10)
        if (!this.calculator.startDate) {
          this.calculator.startDate = today
        }
        if (!this.calculator.endDate) {
          this.calculator.endDate = today
        }

        this.calculator.result = null
        // 确保LPR数据已加载
        if (this.lprRates.length === 0) {
          this.loadLprRates()
        }
      }
    },
    // 当切换到"指定LPR"模式时，自动设置默认日期
    'calculator.lprCalcMethod'(newVal) {
      if (newVal === 'specified' && this.lprRates && this.lprRates.length > 0) {
        if (!this.calculator.selectedLprDate) {
          this.calculator.selectedLprDate = this.lprRates[0].date
        }
      }
    }
  },
  methods: {
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

    async loadLprRates() {
      this.lprLoading = true
      this.lprError = null
      try {
        if (hasTushareToken()) {
          this.lprRates = await fetchLprRates()
          // 设置默认选中最新日期
          if (this.lprRates.length > 0 && !this.calculator.selectedLprDate) {
            this.calculator.selectedLprDate = this.lprRates[0].date
          }
        } else {
          this.lprRates = FALLBACK_LPR_RATES
        }
      } catch (error) {
        console.error('[InterestCalculator] LPR加载失败:', error)
        this.lprError = error.message
        this.lprRates = FALLBACK_LPR_RATES
      } finally {
        this.lprLoading = false
      }
    },
    getLprRate(date, tier) {
      // 获取指定日期的LPR利率
      const targetDate = new Date(date)
      for (const rate of this.lprRates) {
        if (new Date(rate.date) <= targetDate) {
          return rate[tier] / 100 // 转换为小数
        }
      }
      return this.lprRates[this.lprRates.length - 1][tier] / 100
    },
    // 获取指定日期（或之前最近）的LPR记录对象
    getLprRecordForDate(dateStr) {
      // 合并 Supabase 数据与备用数据，确保历史数据完整
      const combinedRates = [...(this.lprRates || []), ...FALLBACK_LPR_RATES]
        // 去重（按日期取第一个）
        .filter((rate, index, arr) => arr.findIndex(r => r.date === rate.date) === index)
        // 按日期降序排列
        .sort((a, b) => b.date.localeCompare(a.date))

      if (combinedRates.length === 0) return null
      // 查找第一个 <= dateStr 的记录
      for (const rate of combinedRates) {
        if (rate.date <= dateStr) {
          return rate
        }
      }
      // 如果日期太早，返回最老的记录
      return combinedRates[combinedRates.length - 1]
    },
    calculateInterest() {
      const calc = this.calculator

      // 验证逻辑
      let isValid = false
      if (calc.rateType === 'custom' && calc.customDurationType !== 'dateRange') {
        // 自定义利率且为数量模式：校验本金和数量
        isValid = calc.principal && calc.customDuration > 0
      } else {
        // 其他模式：校验本金和起止日期
        isValid = calc.principal && calc.startDate && calc.endDate
      }

      if (!isValid) {
        this.showTip('请填写完整的计算参数')
        return
      }

      // 特殊校验：起始日期不得早于 1991-04-21
      if (
        calc.startDate &&
        calc.startDate < '1991-04-21' &&
        (calc.rateType !== 'custom' || calc.customDurationType === 'dateRange')
      ) {
        this.showTip('起始日期不能早于 1991年4月21日')
        return
      }

      // LPR模式校验：起始日期不得早于 2019-08-20
      if (calc.startDate && calc.startDate < '2019-08-20' && calc.rateType === 'lpr') {
        this.showTip('起始日期不能早于2019-08-20,因为LPR自2019年8月20起每月公布!')
        return
      }

      let start, end
      const yearDays = calc.yearBasis || 360
      let days = 0

      if (calc.rateType === 'custom' && calc.customDurationType !== 'dateRange') {
        // 自定义利率使用天数/月数/年数
        if (calc.customDurationType === 'days') {
          days = calc.customDuration || 0
        } else if (calc.customDurationType === 'months') {
          days = (calc.customDuration || 0) * 30 // 每月按30天
        } else if (calc.customDurationType === 'years') {
          days = (calc.customDuration || 0) * yearDays // 每年按yearDays天
        }
      } else {
        // 使用起止日期计算
        start = new Date(calc.startDate)
        end = new Date(calc.endDate)

        // 日期边界处理
        if (calc.dateBoundary === 'startOnly') end.setDate(end.getDate() - 1)
        else if (calc.dateBoundary === 'endOnly') start.setDate(start.getDate() + 1)
        else if (calc.dateBoundary === 'neither') {
          start.setDate(start.getDate() + 1)
          end.setDate(end.getDate() - 1)
        }

        days = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
      }

      let rate = 0

      if (calc.rateType === 'lpr' && calc.lprCalcMethod === 'specified') {
        // 如果 calc.rateType === 'lpr' 且 calc.lprCalcMethod === 'specified' -> 固定利率
        const targetDate = calc.selectedLprDate || (this.lprRates[0] ? this.lprRates[0].date : '')
        const lprRecord =
          this.lprRates.find(r => r.date === targetDate) || this.getLprRecordForDate(targetDate)
        const lprValue = lprRecord ? lprRecord[calc.lprTier] : FALLBACK_LPR_RATES[calc.lprTier]
        let annualRate = lprValue / 100

        // 1. 先应用基点调整
        if (calc.lprBpAdjustType === 'up') {
          annualRate = annualRate + calc.lprBasisPoints / 10000
        } else if (calc.lprBpAdjustType === 'down') {
          annualRate = annualRate - calc.lprBasisPoints / 10000
        }

        // 2. 再应用浮动或倍率
        if (calc.lprFloatType === 'multiplier') {
          annualRate = annualRate * calc.lprMultiplier
        } else if (calc.lprFloatType === 'up') {
          annualRate = annualRate * (1 + calc.lprMultiplier / 100)
        } else if (calc.lprFloatType === 'down') {
          annualRate = annualRate * (1 - calc.lprMultiplier / 100)
        }
        rate = annualRate
      } else if (
        calc.rateType === 'segmented' ||
        (calc.rateType === 'lpr' && calc.lprCalcMethod === 'segmented')
      ) {
        // 自动分段 (逐日累加)
        let totalInterest = 0
        const loopDate = new Date(start)

        // 期间明细收集
        const periods = []
        let currentPeriod = null

        for (let i = 0; i < days; i++) {
          const dateStr = loopDate.toISOString().slice(0, 10)
          let dailyRate = 0
          let periodType = '' // 'benchmark' or 'lpr'
          let baseRate = 0
          let adjustedRate = 0
          let adjustmentDesc = ''

          // 判断适用逻辑
          let useBenchmark = false
          if (calc.rateType === 'segmented' && dateStr < '2019-08-20') {
            useBenchmark = true
          }

          if (useBenchmark) {
            periodType = 'benchmark'
            // 使用基准利率
            let annualRate = 0
            const benchmarkTier = calc.benchmarkTier || (calc.lprTier === '1y' ? '1y' : 'over5y')

            if (calc.benchmarkCalcMethod === 'segmented') {
              const historyItem = PBC_BENCHMARK_HISTORY.find(item => item.date <= dateStr)
              if (historyItem) {
                annualRate = historyItem.rates[benchmarkTier] / 100
              } else {
                annualRate = PBC_BENCHMARK_RATES[benchmarkTier] / 100
              }
            } else {
              if (calc.selectedBenchmarkDate === 'custom') {
                annualRate = calc.benchmarkCustomRate / 100
              } else {
                const historyRecord = PBC_BENCHMARK_HISTORY.find(
                  r => r.date === calc.selectedBenchmarkDate
                )
                if (historyRecord) {
                  annualRate = historyRecord.rates[benchmarkTier] / 100
                } else {
                  annualRate = PBC_BENCHMARK_RATES[benchmarkTier] / 100
                }
              }
            }

            baseRate = annualRate * 100 // 存储百分比形式

            // 应用基准利率调整
            if (calc.benchmarkAdjustmentType === 'up') {
              annualRate = annualRate * (1 + calc.benchmarkAdjustmentValue / 100)
              adjustmentDesc = `上浮${calc.benchmarkAdjustmentValue}%`
            } else if (calc.benchmarkAdjustmentType === 'down') {
              annualRate = annualRate * (1 - calc.benchmarkAdjustmentValue / 100)
              adjustmentDesc = `下浮${calc.benchmarkAdjustmentValue}%`
            } else if (calc.benchmarkAdjustmentType === 'multiplier') {
              annualRate = annualRate * calc.benchmarkAdjustmentValue
              adjustmentDesc = `${calc.benchmarkAdjustmentValue}倍`
            }

            adjustedRate = annualRate * 100
            dailyRate = annualRate / yearDays
          } else {
            periodType = 'lpr'
            // 使用LPR
            let annualRate = 0
            if (calc.lprCalcMethod === 'segmented') {
              const lprRecord = this.getLprRecordForDate(dateStr)
              const val = lprRecord ? lprRecord[calc.lprTier] : FALLBACK_LPR_RATES[calc.lprTier]
              annualRate = val / 100
            } else {
              const targetDate =
                calc.selectedLprDate || (this.lprRates[0] ? this.lprRates[0].date : '')
              const lprRecord =
                this.lprRates.find(r => r.date === targetDate) ||
                this.getLprRecordForDate(targetDate)
              const val = lprRecord ? lprRecord[calc.lprTier] : FALLBACK_LPR_RATES[calc.lprTier]
              annualRate = val / 100
            }

            baseRate = annualRate * 100

            // LPR调整
            let bpDesc = ''
            let floatDesc = ''

            if (calc.lprBpAdjustType === 'up') {
              annualRate = annualRate + calc.lprBasisPoints / 10000
              bpDesc = `加${calc.lprBasisPoints}BP`
            } else if (calc.lprBpAdjustType === 'down') {
              annualRate = annualRate - calc.lprBasisPoints / 10000
              bpDesc = `减${calc.lprBasisPoints}BP`
            }

            if (calc.lprFloatType === 'multiplier') {
              annualRate = annualRate * calc.lprMultiplier
              floatDesc = `再${calc.lprMultiplier}倍`
            } else if (calc.lprFloatType === 'up') {
              annualRate = annualRate * (1 + calc.lprMultiplier / 100)
              floatDesc = `再上浮${calc.lprMultiplier}%`
            } else if (calc.lprFloatType === 'down') {
              annualRate = annualRate * (1 - calc.lprMultiplier / 100)
              floatDesc = `再下浮${calc.lprMultiplier}%`
            }

            adjustmentDesc = [bpDesc, floatDesc].filter(s => s).join('')
            adjustedRate = annualRate * 100
            dailyRate = annualRate / yearDays
          }

          // 期间分组逻辑 - 当类型或利率发生变化时创建新期间
          const rateChanged = currentPeriod && Math.abs(currentPeriod.baseRate - baseRate) > 0.001
          if (!currentPeriod || currentPeriod.type !== periodType || rateChanged) {
            if (currentPeriod) {
              currentPeriod.endDate = new Date(loopDate)
              currentPeriod.endDate.setDate(currentPeriod.endDate.getDate() - 1)
              periods.push(currentPeriod)
            }
            currentPeriod = {
              type: periodType,
              startDate: new Date(loopDate),
              endDate: null,
              days: 0,
              baseRate: baseRate,
              adjustedRate: adjustedRate,
              adjustmentDesc: adjustmentDesc || '无',
              dailyRate: dailyRate // 暂存日利率用于后续计算
            }
          }

          currentPeriod.days++
          // 不在按日累加利息，改为分段结算

          loopDate.setDate(loopDate.getDate() + 1)
        }

        if (currentPeriod) {
          currentPeriod.endDate = new Date(end)
          periods.push(currentPeriod)
        }

        // 统一计算每段利息并累加 (解决精度差异)
        periods.forEach(p => {
          // 分段利息 = 本金 * 日利率 * 天数
          const rawInterest = calc.principal * p.dailyRate * p.days
          // 关键：每一段的利息先四舍五入保留两位小数
          p.interest = Math.round(rawInterest * 100) / 100

          // 格式化日期和利率
          p.startDate = p.startDate.toISOString().slice(0, 10)
          p.endDate = p.endDate.toISOString().slice(0, 10)
          p.baseRate = parseFloat(p.baseRate.toFixed(4)) + '%'
          p.adjustedRate = parseFloat(p.adjustedRate.toFixed(4)) + '%'
          p.typeLabel = p.type === 'benchmark' ? '央行基准' : 'LPR'

          // 生成公式
          // 公式: 本金 × (年利率% ÷ 360) × 天数
          const annualRate = (p.dailyRate * yearDays * 100).toFixed(4)
          p.formula = `= ${calc.principal} × (${parseFloat(annualRate)}% ÷ ${yearDays}) × ${p.days}`

          // 累加到总利息
          totalInterest += p.interest
        })

        this.calculator.result = {
          days: days,
          rate: '-', // 混合利率不显示单一数值
          interest: Math.round(totalInterest * 100) / 100, // 总额再次确保两位小数
          periods: periods
        }
        return
      } else if (calc.rateType === 'benchmark') {
        // 中国人民银行同期贷款基准利率
        let annualRate = 0

        if (calc.benchmarkCalcMethod === 'specified') {
          if (calc.selectedBenchmarkDate === 'custom') {
            annualRate = calc.benchmarkCustomRate / 100
          } else {
            const historyRecord = PBC_BENCHMARK_HISTORY.find(
              r => r.date === calc.selectedBenchmarkDate
            )
            if (historyRecord) {
              annualRate = historyRecord.rates[calc.benchmarkTier] / 100
            } else {
              annualRate = PBC_BENCHMARK_RATES[calc.benchmarkTier] / 100
            }
          }
        } else {
          // 分段利率模式 - 简化处理：使用起始日期的历史利率
          const startDateStr = calc.startDate
          let historyRecord = null
          for (const record of PBC_BENCHMARK_HISTORY) {
            if (record.date <= startDateStr) {
              historyRecord = record
              break
            }
          }
          if (historyRecord) {
            annualRate = historyRecord.rates[calc.benchmarkTier] / 100
          } else {
            annualRate = PBC_BENCHMARK_RATES[calc.benchmarkTier] / 100
          }
        }

        if (calc.benchmarkAdjustmentType === 'up') {
          annualRate = annualRate * (1 + calc.benchmarkAdjustmentValue / 100)
        } else if (calc.benchmarkAdjustmentType === 'down') {
          annualRate = annualRate * (1 - calc.benchmarkAdjustmentValue / 100)
        } else if (calc.benchmarkAdjustmentType === 'multiplier') {
          annualRate = annualRate * calc.benchmarkAdjustmentValue
        }

        rate = annualRate
      } else if (calc.rateType === 'custom') {
        let baseRate = calc.customRate
        if (calc.customRateUnit === 'percent') baseRate = baseRate / 100
        else if (calc.customRateUnit === 'permille') baseRate = baseRate / 1000
        else if (calc.customRateUnit === 'permyriad') baseRate = baseRate / 10000

        const daysInYear = calc.yearBasis || 360

        if (calc.customTimeBasis === 'year') {
          rate = baseRate
        } else if (calc.customTimeBasis === 'month') {
          rate = baseRate * 12
        } else if (calc.customTimeBasis === 'day') {
          rate = baseRate * daysInYear
        }
      }

      // 计算利息
      const interest = (calc.principal * rate * days) / yearDays

      // 生成公式字符串
      const ratePercent = (rate * 100).toFixed(2)
      const formula = `${calc.principal.toLocaleString()} × (${ratePercent}% ÷ ${yearDays}) × ${days}`

      calc.result = {
        days,
        rate: (rate * 100).toFixed(4),
        interest: Math.round(interest * 100) / 100,
        formula: formula
      }
    },
    applyToCase() {
      if (!this.calculator.result) return
      this.$emit('apply', this.calculator.result.interest)
      this.$emit('update:visible', false)
    },
    showTip(message) {
      this.tipMessage = message
    },
    closeTip() {
      this.tipMessage = ''
    }
  },
  template: `
        <div v-if="visible" class="modal-overlay" @click.self="$emit('update:visible', false)">
            <div class="modal-container" style="width: 650px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">
                    <div class="modal-title" style="color: white;">
                        <i class="fas fa-calculator" style="margin-right: 8px;"></i>
                        利息/违约金/占用费计算器
                    </div>
                    <button class="modal-close" style="color: white; background: rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 10px; transition: all 0.2s;" @click="$emit('update:visible', false)">
                        <i class="fas fa-times" style="font-size: 16px;"></i>
                    </button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    
                    <!-- 基础参数 -->
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <div style="font-weight: 600; color: #334155; margin-bottom: 12px;"><i class="fas fa-calculator" style="margin-right: 6px;"></i>基础参数</div>
                        
                        <div class="smart-form-group">
                            <label class="smart-label">计算基数 (元)</label>
                            <input type="number" class="smart-input" v-model.number="calculator.principal" placeholder="请输入金额" style="border: 1px solid #e2e8f0;">
                            <div v-if="calculator.principal" style="color: #64748b; font-size: 12px; margin-top: 4px; padding-left: 2px;">{{ toChineseCurrency(calculator.principal) }}</div>
                        </div>
                        
                        <!-- 利率类型 -->
                        <div class="smart-form-group">
                            <label class="smart-label">生效法律文书确定的利率类型</label>
                            <select class="smart-input" v-model="calculator.rateType" style="border: 1px solid #e2e8f0;">
                                <option value="custom">自定义利率</option>
                                <option value="segmented">中国人民银行同期贷款基准利率与LPR自动分段</option>
                                <option value="lpr">全国银行间同业拆借中心公布的贷款市场报价利率（LPR）</option>
                                <option value="benchmark">中国人民银行同期贷款基准利率</option>
                            </select>
                        </div>
                        
                        <!-- 自定义利率设置 (嵌入在基础参数中) -->
                        <template v-if="calculator.rateType === 'custom'">
                            <div style="margin-top: 12px; padding: 12px; background: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1;">
                                <div style="font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 12px;">自定义利率设置</div>
                                
                                <div class="smart-form-group" style="margin-bottom: 12px;">
                                    <label class="smart-label">利率大小</label>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <select class="smart-input" v-model="calculator.customTimeBasis" style="width: 70px; border: 1px solid #e2e8f0;">
                                            <option value="year">年</option>
                                            <option value="month">月</option>
                                            <option value="day">日</option>
                                        </select>
                                        <select class="smart-input" v-model="calculator.customRateUnit" style="width: 110px; border: 1px solid #e2e8f0;">
                                            <option value="percent">百分之 (%)</option>
                                            <option value="permille">千分之 (‰)</option>
                                            <option value="permyriad">万分之 (‱)</option>
                                        </select>
                                        <input type="number" step="0.01" class="smart-input" v-model.number="calculator.customRate" 
                                               placeholder="数值" style="width: 80px; border: 1px solid #e2e8f0;">
                                    </div>
                                </div>
                                
                                <div class="smart-form-group">
                                    <label class="smart-label">时间类型</label>
                                    <div style="display: flex; gap: 12px; font-size: 13px; flex-wrap: wrap; margin-bottom: 8px;">
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" v-model="calculator.customDurationType" value="dateRange"> 起止日期
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" v-model="calculator.customDurationType" value="days"> 天数
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" v-model="calculator.customDurationType" value="months"> 月数
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" v-model="calculator.customDurationType" value="years"> 年数
                                        </label>
                                    </div>
                                    
                                    <div v-if="calculator.customDurationType === 'dateRange'">
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                                            <div>
                                                <SmartDatePicker v-model="calculator.startDate" placeholder="起始日期" />
                                            </div>
                                            <div>
                                                <SmartDatePicker v-model="calculator.endDate" placeholder="截止日期" />
                                            </div>
                                        </div>
                                        <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px;">
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.dateBoundary" value="both"> 起止日期均计算在内
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.dateBoundary" value="startOnly"> 起始计算，截止不计
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.dateBoundary" value="endOnly"> 起始不计，截止计算
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.dateBoundary" value="neither"> 起止日期均不计算
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div v-else>
                                        <input type="number" step="1" class="smart-input" v-model.number="calculator.customDuration" 
                                               :placeholder="calculator.customDurationType === 'days' ? '输入天数' : calculator.customDurationType === 'months' ? '输入月数' : '输入年数'" 
                                               style="width: 100%; border: 1px solid #e2e8f0;">
                                    </div>
                                </div>
                            </div>
                        </template>
                        
                        <!-- 通用起止日期 (非自定义利率时显示) -->
                        <template v-if="calculator.rateType !== 'custom'">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div class="smart-form-group">
                                    <label class="smart-label">起始日期</label>
                                    <SmartDatePicker v-model="calculator.startDate" placeholder="请选择起始日期" />
                                </div>
                                <div class="smart-form-group">
                                    <label class="smart-label">截止日期</label>
                                    <SmartDatePicker v-model="calculator.endDate" placeholder="请选择截止日期" />
                                </div>
                            </div>
                            
                            <div class="smart-form-group">
                                <label class="smart-label">起止日期选项</label>
                                <select class="smart-input" v-model="calculator.dateBoundary" style="border: 1px solid #e2e8f0;">
                                    <option value="both">起止日期均计算在内</option>
                                    <option value="startOnly">起始计算，截止不计</option>
                                    <option value="endOnly">起始不计，截止计算</option>
                                    <option value="neither">起止日期均不计算</option>
                                </select>
                            </div>
                        </template>
                        
                        <div class="smart-form-group">
                            <label class="smart-label">一年为</label>
                            <select class="smart-input" v-model.number="calculator.yearBasis" style="width: 120px; border: 1px solid #e2e8f0;">
                                <option :value="360">360天</option>
                                <option :value="365">365天</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 利率类型细节设置 (非自定义时显示) -->
                    <div v-if="calculator.rateType !== 'custom'" style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <div style="font-weight: 600; color: #334155; margin-bottom: 12px;">
                            <i class="fas fa-percentage" style="margin-right: 6px;"></i>利率设置
                        </div>
                        
                        <div v-if="lprError" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 10px; margin-bottom: 12px; font-size: 12px; color: #b91c1c;">
                            <i class="fas fa-exclamation-triangle"></i> {{ lprError }}，已使用备用数据
                        </div>
                        
                        <template v-if="calculator.rateType === 'lpr' || calculator.rateType === 'segmented'">
                             <div class="smart-form-group">
                                <div v-if="calculator.rateType === 'segmented'" style="background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; padding: 8px; font-size: 12px; border-radius: 4px; margin-bottom: 12px;">
                                    <i class="fas fa-info-circle"></i> 2019年8月20日前使用基准利率，之后使用逐日LPR
                                </div>
                                
                                <div v-if="showBenchmarkOptions" style="margin-bottom: 16px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px;">
                                    <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px;">贷款基准利率选项</div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">贷款基准利率计算方式</label>
                                        <div style="display: flex; gap: 16px; font-size: 13px;">
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.benchmarkCalcMethod" value="segmented"> 分段利率 (推荐)
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" v-model="calculator.benchmarkCalcMethod" value="specified"> 指定利率
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div v-if="calculator.benchmarkCalcMethod === 'specified'" class="smart-form-group">
                                        <label class="smart-label">选择贷款基准利率版本</label>
                                        <select class="smart-input" v-model="calculator.selectedBenchmarkDate" style="border: 1px solid #e2e8f0;">
                                            <option v-for="opt in benchmarkHistoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                        </select>
                                    </div>
                                    
                                    <div v-if="calculator.benchmarkCalcMethod === 'specified' && calculator.selectedBenchmarkDate === 'custom'" class="smart-form-group">
                                        <label class="smart-label">输入年化利率 (%)</label>
                                        <input type="number" step="0.01" class="smart-input" v-model.number="calculator.benchmarkCustomRate" placeholder="如: 4.90" style="border: 1px solid #e2e8f0;">
                                    </div>
                                    
                                    <div v-if="currentBenchmarkRateSummary && calculator.selectedBenchmarkDate !== 'custom'" 
                                         style="margin-bottom: 12px; padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; font-size: 12px; color: #166534;">
                                        {{ currentBenchmarkRateSummary }}
                                    </div>
                                    
                                    <div class="smart-form-group" v-if="calculator.selectedBenchmarkDate !== 'custom'">
                                        <label class="smart-label">贷款基准利率档次</label>
                                        <select class="smart-input" v-model="calculator.benchmarkTier" style="border: 1px solid #e2e8f0;">
                                            <option value="6m">六个月以内</option>
                                            <option value="1y">六个月至一年</option>
                                            <option value="1y-3y">一至三年</option>
                                            <option value="3y-5y">三至五年</option>
                                            <option value="over5y">五年以上</option>
                                        </select>
                                    </div>
                                    
                                    <div class="smart-form-group">
                                        <label class="smart-label">利率调整方式</label>
                                        <div style="display: flex; gap: 8px; align-items: center;">
                                            <select class="smart-input" v-model="calculator.benchmarkAdjustmentType" style="width: 100px; border: 1px solid #e2e8f0;">
                                                <option value="none">无</option>
                                                <option value="up">上浮</option>
                                                <option value="down">下浮</option>
                                                <option value="multiplier">倍率</option>
                                            </select>
                                            <div v-if="calculator.benchmarkAdjustmentType !== 'none'" style="flex: 1; display: flex; align-items: center; gap: 4px;">
                                                <input type="number" step="0.1" class="smart-input" v-model.number="calculator.benchmarkAdjustmentValue" placeholder="数值" style="border: 1px solid #e2e8f0;">
                                                <span v-if="calculator.benchmarkAdjustmentType === 'multiplier'" style="font-size: 12px; color: #64748b;">倍</span>
                                                <span v-else style="font-size: 12px; color: #64748b;">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <template v-if="showLprOptions">
                                    <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px;">LPR选项</div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">LPR计算方式</label>
                                        <div style="display: flex; gap: 16px; font-size: 13px;">
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" name="lprMethod" v-model="calculator.lprCalcMethod" value="segmented"> 分段LPR
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                                <input type="radio" name="lprMethod" v-model="calculator.lprCalcMethod" value="specified"> 指定LPR
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div v-if="calculator.lprCalcMethod === 'specified'" class="smart-form-group">
                                        <label class="smart-label">选择LPR公布日期</label>
                                        <select class="smart-input" v-model="calculator.selectedLprDate" style="border: 1px solid #e2e8f0;">
                                            <option v-for="date in lprDateOptions" :key="date" :value="date">{{ date }}</option>
                                        </select>
                                        <div v-if="calculator.selectedLprDate && getLprRecordForDate(calculator.selectedLprDate)" style="margin-top: 4px; font-size: 12px; color: #64748b;">
                                            1年期: {{ getLprRecordForDate(calculator.selectedLprDate)['1y'] }}% | 
                                            5年期: {{ getLprRecordForDate(calculator.selectedLprDate)['5y'] }}%
                                        </div>
                                    </div>
                                    
                                    <label class="smart-label">LPR档次</label>
                                    <div style="display: flex; gap: 16px; font-size: 13px;">
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" name="lprTier" v-model="calculator.lprTier" value="1y"> 1年期LPR
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" name="lprTier" v-model="calculator.lprTier" value="5y"> 5年期以上LPR
                                        </label>
                                    </div>
                                </template>
                            </div>
                            
                             <div class="smart-form-group" style="margin-top: 12px; padding: 12px; background: #f8fafc; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">LPR调整方式</div>
                                 <div class="smart-form-group" style="margin-bottom: 12px;">
                                    <label class="smart-label">基点 (1个BP=0.01%)</label>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <select class="smart-input" v-model="calculator.lprBpAdjustType" style="width: 100px; border: 1px solid #e2e8f0;">
                                            <option value="none">无</option>
                                            <option value="up">上浮 (+)</option>
                                            <option value="down">下浮 (-)</option>
                                        </select>
                                        <template v-if="calculator.lprBpAdjustType !== 'none'">
                                            <input type="number" class="smart-input" v-model.number="calculator.lprBasisPoints" 
                                                   placeholder="0" style="width: 80px; border: 1px solid #e2e8f0;">
                                            <span style="font-size: 12px; color: #64748b;">BP</span>
                                        </template>
                                    </div>
                                </div>
                                <div class="smart-form-group">
                                    <label class="smart-label">浮动或倍率</label>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <select class="smart-input" v-model="calculator.lprFloatType" style="width: 100px; border: 1px solid #e2e8f0;">
                                            <option value="none">无</option>
                                            <option value="up">上浮</option>
                                            <option value="down">下浮</option>
                                            <option value="multiplier">倍率</option>
                                        </select>
                                        <template v-if="calculator.lprFloatType !== 'none'">
                                            <input type="number" step="0.01" class="smart-input" v-model.number="calculator.lprMultiplier" 
                                                   placeholder="1" style="width: 80px; border: 1px solid #e2e8f0;">
                                            <span style="font-size: 12px; color: #64748b;">{{ calculator.lprFloatType === 'multiplier' ? '倍' : '%' }}</span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="calculator.rateType === 'benchmark'">
                             <div style="padding: 12px; background: #f8fafc; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 12px;">贷款基准利率选项</div>
                                <div class="smart-form-group" style="margin-bottom: 12px;">
                                    <label class="smart-label">贷款基准利率计算方式</label>
                                    <div style="display: flex; gap: 16px; font-size: 13px;">
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" name="pureBenchmarkMethod" v-model="calculator.benchmarkCalcMethod" value="segmented"> 分段利率
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                                            <input type="radio" name="pureBenchmarkMethod" v-model="calculator.benchmarkCalcMethod" value="specified"> 指定利率
                                        </label>
                                    </div>
                                </div>
                                <div v-if="calculator.benchmarkCalcMethod === 'specified'" class="smart-form-group" style="margin-bottom: 12px;">
                                    <label class="smart-label">选择贷款基准利率公布日期</label>
                                    <select class="smart-input" v-model="calculator.selectedBenchmarkDate" style="border: 1px solid #e2e8f0;">
                                        <option v-for="opt in benchmarkHistoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>
                                </div>
                                <div v-if="calculator.benchmarkCalcMethod === 'specified' && calculator.selectedBenchmarkDate === 'custom'" class="smart-form-group" style="margin-bottom: 12px;">
                                    <label class="smart-label">输入年化利率 (%)</label>
                                    <input type="number" step="0.01" class="smart-input" v-model.number="calculator.benchmarkCustomRate" placeholder="如: 4.90" style="border: 1px solid #e2e8f0;">
                                </div>
                                <div v-if="currentBenchmarkRateSummary && calculator.selectedBenchmarkDate !== 'custom'" 
                                     style="margin-bottom: 12px; padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; font-size: 12px; color: #166534;">
                                    {{ currentBenchmarkRateSummary }}
                                </div>
                                <div class="smart-form-group" v-if="calculator.selectedBenchmarkDate !== 'custom'" style="margin-bottom: 12px;">
                                    <label class="smart-label">贷款基准利率档次</label>
                                    <select class="smart-input" v-model="calculator.benchmarkTier" style="border: 1px solid #e2e8f0;">
                                        <option value="6m">六个月以内</option>
                                        <option value="1y">六个月至一年</option>
                                        <option value="1y-3y">一至三年</option>
                                        <option value="3y-5y">三至五年</option>
                                        <option value="over5y">五年以上</option>
                                    </select>
                                </div>
                                <div class="smart-form-group">
                                    <label class="smart-label">利率调整方式</label>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <select class="smart-input" v-model="calculator.benchmarkAdjustmentType" style="width: 100px; border: 1px solid #e2e8f0;">
                                            <option value="none">无</option>
                                            <option value="up">上浮</option>
                                            <option value="down">下浮</option>
                                            <option value="multiplier">倍率</option>
                                        </select>
                                        <template v-if="calculator.benchmarkAdjustmentType !== 'none'">
                                            <input type="number" step="0.1" class="smart-input" v-model.number="calculator.benchmarkAdjustmentValue" 
                                                   placeholder="数值" style="width: 80px; border: 1px solid #e2e8f0;">
                                            <span style="font-size: 12px; color: #64748b;">{{ calculator.benchmarkAdjustmentType === 'multiplier' ? '倍' : '%' }}</span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- 3. 计算结果 - 空状态 -->
                    <div v-if="!calculator.result" style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-weight: 600; color: #334155; margin-bottom: 12px;">
                            <i class="fas fa-chart-bar" style="margin-right: 6px;"></i>计算结果
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                            <div>
                                <div style="font-size: 12px; color: #64748b;">计息天数</div>
                                <div style="font-size: 18px; font-weight: 600; color: #94a3b8;">-- 天</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #64748b;">适用利率</div>
                                <div style="font-size: 18px; font-weight: 600; color: #94a3b8;">--%</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #64748b;">利息金额</div>
                                <div style="font-size: 20px; font-weight: 600; color: #94a3b8;">¥--</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 3. 计算结果 - 有数据 -->
                    <div v-if="calculator.result" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; border: 1px solid #a7f3d0; animation: resultFadeIn 0.3s ease-out;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div style="font-weight: 600; color: #065f46;">
                                <i class="fas fa-check-circle" style="margin-right: 6px;"></i>计算结果
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                            <div>
                                <div style="font-size: 12px; color: #047857;">计息天数</div>
                                <div style="font-size: 20px; font-weight: 700; color: #065f46;">{{ calculator.result.days }} 天</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #047857;">适用利率</div>
                                <div style="font-size: 20px; font-weight: 700; color: #065f46;">{{ calculator.result.rate }}%</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #047857;">利息金额</div>
                                <div style="font-size: 24px; font-weight: 700; color: #059669;">¥{{ calculator.result.interest.toLocaleString() }}</div>
                                <div style="font-size: 11px; color: #047857; margin-top: 2px;">{{ toChineseCurrency(calculator.result.interest) }}</div>
                            </div>
                        </div>
                        
                        <template v-if="calculator.result.formula && !calculator.result.periods">
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #a7f3d0;">
                                <div style="font-size: 13px; font-weight: 600; color: #065f46; margin-bottom: 8px;">
                                    <i class="fas fa-calculator" style="margin-right: 6px;"></i>计算公式
                                </div>
                                <div style="background: white; border-radius: 6px; padding: 12px; border: 1px solid #d1fae5; font-family: monospace; font-size: 12px; color: #64748b;">
                                    {{ calculator.result.formula }} = ¥{{ calculator.result.interest.toLocaleString() }}
                                </div>
                            </div>
                        </template>
                        
                        <template v-if="calculator.result.periods && calculator.result.periods.length > 0">
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #a7f3d0;">
                                <div style="font-size: 13px; font-weight: 600; color: #065f46; margin-bottom: 12px;">
                                    <i class="fas fa-list-alt" style="margin-right: 6px;"></i>计算详单
                                </div>
                                
                                <div style="background: white; border-radius: 8px; border: 1px solid #10b981; overflow: hidden;">
                                    <div style="background: #10b981; color: white; padding: 10px 16px; font-weight: 600; font-size: 14px; text-align: center;">
                                        利息计算明细
                                    </div>
                                    <div style="padding: 12px; overflow-x: auto;">
                                        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                            <thead>
                                                <tr style="background: #f0fdf4;">
                                                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #d1fae5; color: #065f46;">时间段</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">天数</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">LPR值</th>
                                                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid #d1fae5; color: #065f46;">利率调整</th>
                                                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #d1fae5; color: #065f46;">金额</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(period, idx) in calculator.result.periods" :key="idx">
                                                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
                                                        <div>
                                                            <div>{{ period.startDate }}</div>
                                                            <div style="color: #94a3b8;">{{ period.endDate }}</div>
                                                        </div>
                                                    </td>
                                                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.days }}</td>
                                                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.baseRate }}</td>
                                                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">{{ period.adjustmentDesc }}</td>
                                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                                                        <div style="font-weight: 600; color: #059669;">¥{{ period.interest.toLocaleString() }}</div>
                                                        <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">{{ period.formula }}</div>
                                                    </td>
                                                </tr>
                                                <tr style="background: #f0fdf4;">
                                                    <td colspan="4" style="padding: 10px 8px; text-align: right; font-weight: 600; color: #065f46;">合计</td>
                                                    <td style="padding: 10px 8px; text-align: right; font-weight: 700; font-size: 14px; color: #059669;">¥{{ calculator.result.interest.toLocaleString() }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                </div>
                <div class="modal-footer" style="gap: 12px;">
                    <button class="smart-btn-secondary" style="transition: all 0.2s; padding: 10px 20px;" @click="$emit('update:visible', false)">关闭</button>
                    <button class="smart-btn-primary" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); transition: all 0.2s; padding: 10px 24px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);" @click="calculateInterest">
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
        </style>
    `
}
