/**
 * 智能日期选择器组件 (基于 Flatpickr)
 * 依赖: flatpickr (CDN), flatpickr zh locale (CDN)
 */
export default {
  name: 'SmartDatePicker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      fp: null
    }
  },
  mounted() {
    this.initFlatpickr()
  },
  beforeUnmount() {
    if (this.fp) {
      this.fp.destroy()
    }
  },
  watch: {
    modelValue(newVal) {
      if (this.fp && newVal !== this.fp.input.value) {
        this.fp.setDate(newVal, false) // false = do not trigger onChange
      }
    },
    config: {
      handler() {
        // Re-init if config changes deeply (optional, but safer)
        if (this.fp) {
          this.fp.destroy()
          this.initFlatpickr()
        }
      },
      deep: true
    }
  },
  methods: {
    initFlatpickr() {
      if (!window.flatpickr) {
        console.warn('Flatpickr not found. Please ensure CDN is loaded.')
        return
      }

      const self = this
      const defaultConfig = {
        locale: 'zh',
        dateFormat: 'Y-m-d',
        allowInput: true,
        monthSelectorType: 'static', // 'dropdown' | 'static'
        disableMobile: true, // Ensure consistent UI on mobile
        defaultDate: this.modelValue,
        onChange(selectedDates, dateStr) {
          self.$emit('update:modelValue', dateStr)
        }
      }

      const mergedConfig = { ...defaultConfig, ...this.config }
      this.fp = window.flatpickr(this.$refs.dateInput, mergedConfig)
    }
  },
  template: `
        <div class="smart-date-picker" style="position: relative;">
            <input 
                ref="dateInput" 
                type="text" 
                class="smart-input" 
                :placeholder="placeholder"
                style="background-color: #fff; cursor: pointer;"
            >
            <i class="fas fa-calendar-alt" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none;"></i>
        </div>
    `
}
