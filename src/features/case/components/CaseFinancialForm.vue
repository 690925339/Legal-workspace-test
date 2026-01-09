<template>
  <div class="smart-card section-card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-calculator" />财务信息</div>
    </div>
    <div class="smart-card-content">
      <div class="smart-form-grid">
        <div class="smart-form-group full-width">
          <label class="smart-label">
            诉讼标的额 (CNY)
            <span style="float: right; color: #64748b; font-weight: normal"
              >总额: {{ formatCurrency(totalClaimAmount) }}</span
            >
          </label>
          <div
            style="
              background: #f8fafc;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            "
          >
            <div
              v-for="(item, index) in form.claimItems"
              :key="'claim-' + index"
              style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center"
            >
              <input
                v-model="item.name"
                type="text"
                class="smart-input"
                placeholder="项目名称 (如: 本金)"
                style="flex: 1"
              />
              <input
                v-model.number="item.amount"
                type="number"
                class="smart-input"
                placeholder="金额"
                style="width: 120px"
              />
              <button class="icon-btn" style="color: #ef4444" @click="removeClaimItem(index)">
                <i class="fas fa-trash-alt" />
              </button>
            </div>
            <button
              class="smart-btn-secondary"
              type="button"
              style="width: 100%; font-size: 12px; border-style: dashed"
              @click="addClaimItem"
            >
              <i class="fas fa-plus" /> 添加标的项
            </button>
          </div>
        </div>
        <div class="smart-form-group">
          <label class="smart-label">律师费报价 (CNY)</label>
          <div style="display: flex; align-items: center; gap: 12px">
            <input
              :value="form.attorneyFee"
              type="number"
              placeholder="0.00"
              class="smart-input"
              style="flex: 1"
              @input="$emit('update:form', { ...form, attorneyFee: $event.target.value })"
            />
            <label
              style="
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: #334155;
                cursor: pointer;
                user-select: none;
              "
              title="勾选后将自动添加到标的列表中"
            >
              <input
                :checked="form.isAttorneyFeeIncluded"
                type="checkbox"
                @change="
                  $emit('update:form', { ...form, isAttorneyFeeIncluded: $event.target.checked })
                "
              />
              包含在标的中
            </label>
          </div>
        </div>
        <div class="smart-form-group">
          <label class="smart-label">预估诉讼费 (CNY)</label>
          <input
            :value="form.courtCost"
            type="text"
            placeholder="0.00"
            class="smart-input"
            @input="$emit('update:form', { ...form, courtCost: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">计费时长 (小时)</label>
          <input
            :value="form.billableHours"
            type="number"
            placeholder="0.0"
            class="smart-input"
            @input="$emit('update:form', { ...form, billableHours: $event.target.value })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 财务信息表单组件
 * 提取自 CaseForm.vue，保持完全相同的 UI 和行为
 */
export default {
  name: 'CaseFinancialForm',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  emits: ['update:form'],
  computed: {
    totalClaimAmount() {
      if (!this.form.claimItems) return 0
      return this.form.claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    }
  },
  methods: {
    formatCurrency(value) {
      return '¥' + (Number(value) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
    },
    emitFormUpdate(updates) {
      this.$emit('update:form', { ...this.form, ...updates })
    },
    addClaimItem() {
      const claimItems = [...(this.form.claimItems || []), { name: '', amount: '' }]
      this.emitFormUpdate({ claimItems })
    },
    removeClaimItem(index) {
      if (this.form.claimItems) {
        const claimItems = this.form.claimItems.filter((_, i) => i !== index)
        this.emitFormUpdate({ claimItems })
      }
    }
  }
}
</script>
