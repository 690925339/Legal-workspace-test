<template>
  <CaseModuleLayout :case-id="caseId" active-module="financials" @case-loaded="onCaseLoaded">
    <div class="tab-pane">
      <div class="modern-card">
        <div class="card-header" style="background: transparent">
          <div class="card-title">财务信息</div>
          <button class="icon-btn" style="font-size: 14px" @click="editFinancials">
            <i class="fas fa-pen" />
          </button>
        </div>

        <!-- 1. 诉讼标的额 (自动汇总) -->
        <div class="info-row">
          <span class="label">诉讼标的额</span>
          <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 16px">{{
            formatCurrency(totalClaimAmount)
          }}</span>
        </div>

        <!-- 2. 标的组成 (动态列表) -->
        <div
          style="
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
            margin: 12px 0 24px 0;
            border: 1px solid #e2e8f0;
          "
        >
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px">标的组成详情：</div>
          <div
            v-if="financialsData.claimItems.length === 0"
            style="color: #cbd5e1; font-size: 13px; text-align: center"
          >
            无详情
          </div>
          <div
            v-for="(item, index) in financialsData.claimItems"
            :key="index"
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 13px;
              color: #475569;
            "
          >
            <span>{{ item.name }}</span>
            <span>{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>

        <!-- 3. 其他费用 -->
        <div class="info-row">
          <span class="label">律师费报价</span>
          <span class="value" style="display: flex; align-items: center; gap: 8px">
            {{ formatCurrency(financialsData.attorneyFee) }}
            <span
              v-if="financialsData.isAttorneyFeeIncluded"
              class="tag"
              style="
                background: #eef2ff;
                color: #6366f1;
                border: 1px solid #c7d2fe;
                margin: 0;
                font-size: 11px;
              "
            >
              已含在标的中
            </span>
          </span>
        </div>
        <div class="info-row">
          <span class="label">预估诉讼费</span>
          <span class="value"
            >{{ formatCurrency(financialsData.courtCost) }}
            <span style="font-size: 12px; color: #94a3b8">(仅供参考)</span></span
          >
        </div>
        <div class="info-row">
          <span class="label">计费时长</span>
          <span class="value">{{ financialsData.billableHours }} 小时</span>
        </div>

        <!-- 利息计算器入口 -->
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e2e8f0">
          <button
            class="smart-btn-secondary"
            style="
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px;
            "
            @click="openCalculator"
          >
            <i class="fas fa-calculator" />
            利息/违约金/占用费计算器
          </button>
        </div>
      </div>
    </div>

    <!-- Financials Edit Modal -->
    <div v-if="showFinancialsModal" class="modal-overlay" @click.self="showFinancialsModal = false">
      <div class="modal-container" style="width: 600px">
        <div class="modal-header">
          <div class="modal-title">编辑财务信息</div>
          <button class="modal-close" @click="showFinancialsModal = false">
            <i class="fas fa-times" />
          </button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto">
          <!-- 标的组成编辑 -->
          <div class="smart-form-group">
            <label class="smart-label" style="margin-bottom: 8px">标的组成 (Claim Items)</label>

            <div
              v-if="editForm.claimItems.length === 0"
              style="
                text-align: center;
                padding: 24px;
                color: #94a3b8;
                border: 1px dashed #cbd5e1;
                border-radius: 8px;
                background: #f8fafc;
                margin-bottom: 12px;
              "
            >
              <i
                class="fas fa-clipboard-list"
                style="font-size: 24px; margin-bottom: 8px; color: #cbd5e1"
              />
              <div style="font-size: 13px">暂无标的项，请添加</div>
            </div>

            <div
              v-else
              style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px"
            >
              <div
                v-for="(item, index) in editForm.claimItems"
                :key="index"
                style="
                  display: flex;
                  gap: 12px;
                  align-items: center;
                  background: #fff;
                  padding: 12px;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  transition: all 0.2s;
                "
              >
                <div style="flex: 2; display: flex; flex-direction: column; gap: 4px">
                  <label style="font-size: 11px; color: #64748b">名称</label>
                  <input
                    v-model="item.name"
                    type="text"
                    class="smart-input"
                    placeholder="如: 欠款本金"
                    style="border: 1px solid #e2e8f0; font-size: 13px; height: 32px"
                  />
                </div>

                <div style="flex: 1.5; display: flex; flex-direction: column; gap: 4px">
                  <label style="font-size: 11px; color: #64748b">金额 (元)</label>
                  <input
                    v-model="item.amount"
                    type="number"
                    class="smart-input"
                    placeholder="0"
                    style="border: 1px solid #e2e8f0; font-size: 13px; height: 32px"
                  />
                </div>

                <div style="display: flex; align-items: flex-end; padding-bottom: 4px">
                  <button
                    class="icon-btn"
                    style="color: #94a3b8; transition: color 0.2s; padding: 8px"
                    title="删除"
                    @click="removeClaimItem(index)"
                  >
                    <i class="fas fa-trash-alt" />
                  </button>
                </div>
              </div>
            </div>

            <button
              style="
                width: 100%;
                border: 1px dashed #cbd5e1;
                color: #64748b;
                padding: 10px;
                border-radius: 8px;
                background: #f8fafc;
                transition: all 0.2s;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              "
              @click="addClaimItem"
            >
              <i class="fas fa-plus-circle" /> 添加标的组成项
            </button>

            <div
              style="
                text-align: right;
                font-size: 14px;
                font-weight: 600;
                color: #334155;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dashed #e2e8f0;
              "
            >
              合计: <span style="color: #059669">{{ formatCurrency(editTotalAmount) }}</span>
            </div>
          </div>

          <div class="smart-form-group">
            <label class="smart-label">律师费报价</label>
            <input v-model="editForm.attorneyFee" type="number" class="smart-input" />
            <div style="margin-top: 8px">
              <label
                style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 13px;
                  color: #64748b;
                  cursor: pointer;
                "
              >
                <input v-model="editForm.isAttorneyFeeIncluded" type="checkbox" />
                律师费已包含在诉讼标的中
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
            <div class="smart-form-group">
              <label class="smart-label">预估诉讼费</label>
              <input v-model="editForm.courtCost" type="number" class="smart-input" />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">计费时长 (小时)</label>
              <input v-model="editForm.billableHours" type="number" class="smart-input" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showFinancialsModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveFinancials">
            <i class="fas fa-save" /> 保存
          </button>
        </div>
      </div>
    </div>

    <!-- 利息计算器组件 -->
    <InterestCalculator
      :visible="showCalculatorModal"
      :initial-principal="totalClaimAmount"
      @update:visible="showCalculatorModal = $event"
      @apply="handleInterestApplied"
    />
  </CaseModuleLayout>
</template>

<script>
import { ref, computed, watch } from 'vue'
import CaseModuleLayout from '@/components/case/CaseModuleLayout.js'
import InterestCalculator from '@/components/case/InterestCalculator.js'
import { useCaseData, useModal } from '@/features/case/composables'
import { financialService } from '@/features/case/services'

export default {
  name: 'CaseFinancials',

  components: {
    CaseModuleLayout,
    InterestCalculator
  },

  setup() {
    // 1. 上下文
    const { caseId, onCaseLoaded } = useCaseData()

    // 2. 模态框管理
    const { openModal, closeModal, isModalOpen } = useModal()

    const showFinancialsModal = computed({
      get: () => isModalOpen('financials'),
      set: val => (val ? openModal('financials') : closeModal('financials'))
    })

    const showCalculatorModal = computed({
      get: () => isModalOpen('calculator'),
      set: val => (val ? openModal('calculator') : closeModal('calculator'))
    })

    // 3. 财务数据（从数据库加载）
    const financialsLoading = ref(false)
    const financialsData = ref({
      claimItems: [],
      attorneyFee: 0,
      isAttorneyFeeIncluded: false,
      courtCost: 0,
      billableHours: 0
    })

    const editForm = ref({
      claimItems: []
    })

    // 加载财务数据
    const loadFinancials = async caseId => {
      if (!caseId) return
      financialsLoading.value = true
      try {
        const data = await financialService.get(caseId)
        // 映射数据库字段到前端结构
        financialsData.value = {
          claimItems: data.claim_items || [],
          attorneyFee: data.attorney_fee || 0,
          isAttorneyFeeIncluded: data.attorney_fee_included || false,
          courtCost: data.court_cost || 0,
          billableHours: data.billable_hours || 0
        }
      } catch (e) {
        console.error('加载财务数据失败:', e)
      } finally {
        financialsLoading.value = false
      }
    }

    // 监听 caseId 变化，加载真实数据
    watch(
      () => caseId.value,
      newCaseId => {
        if (newCaseId) {
          loadFinancials(newCaseId)
        }
      },
      { immediate: true }
    )

    // 4. 计算属性
    const totalClaimAmount = computed(() => {
      if (!financialsData.value.claimItems) return 0
      return financialsData.value.claimItems.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      )
    })

    const editTotalAmount = computed(() => {
      if (!editForm.value || !editForm.value.claimItems) return 0
      return editForm.value.claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    })

    // 5. 监听器 (联动逻辑)
    watch(
      () => editForm.value.isAttorneyFeeIncluded,
      val => {
        if (!editForm.value.claimItems) return
        const existingIndex = editForm.value.claimItems.findIndex(i => i.name === '律师费')

        if (val) {
          if (existingIndex === -1) {
            editForm.value.claimItems.push({
              name: '律师费',
              amount: editForm.value.attorneyFee || 0
            })
          }
        } else {
          if (existingIndex !== -1) {
            editForm.value.claimItems.splice(existingIndex, 1)
          }
        }
      }
    )

    watch(
      () => editForm.value.attorneyFee,
      val => {
        if (editForm.value.isAttorneyFeeIncluded) {
          const item = editForm.value.claimItems.find(i => i.name === '律师费')
          if (item) {
            item.amount = val || 0
          }
        }
      }
    )

    watch(
      () => editForm.value.claimItems,
      newVal => {
        if (!newVal) return
        const hasFee = newVal.some(i => i.name === '律师费')
        if (editForm.value.isAttorneyFeeIncluded !== hasFee) {
          editForm.value.isAttorneyFeeIncluded = hasFee
        }
      },
      { deep: true }
    )

    // 6. 方法
    const formatCurrency = value => {
      return '¥' + (Number(value) || 0).toLocaleString()
    }

    const editFinancials = () => {
      editForm.value = JSON.parse(JSON.stringify(financialsData.value))
      if (!editForm.value.claimItems) editForm.value.claimItems = []
      openModal('financials')
    }

    const addClaimItem = () => {
      if (!editForm.value.claimItems) editForm.value.claimItems = []
      editForm.value.claimItems.push({ name: '', amount: 0 })
    }

    const removeClaimItem = index => {
      editForm.value.claimItems.splice(index, 1)
    }

    const saveFinancials = async () => {
      if (editForm.value.claimItems.some(item => !item.name)) {
        alert('请输入完整的标的项名称')
        return
      }
      try {
        // 映射前端结构到数据库字段
        const dbData = {
          claim_items: editForm.value.claimItems,
          attorney_fee: Number(editForm.value.attorneyFee) || 0,
          attorney_fee_included: editForm.value.isAttorneyFeeIncluded,
          court_cost: Number(editForm.value.courtCost) || 0,
          billable_hours: Number(editForm.value.billableHours) || 0
        }
        await financialService.upsert(caseId.value, dbData)
        financialsData.value = JSON.parse(JSON.stringify(editForm.value))
        closeModal('financials')
      } catch (e) {
        alert('保存失败: ' + e.message)
      }
    }

    const openCalculator = () => {
      openModal('calculator')
    }

    const handleInterestApplied = amount => {
      const name = '利息/违约金'
      const existingIndex = financialsData.value.claimItems.findIndex(i => i.name === name)
      if (existingIndex !== -1) {
        financialsData.value.claimItems[existingIndex].amount = amount
      } else {
        financialsData.value.claimItems.push({ name: name, amount: amount })
      }
      closeModal('calculator')
    }

    return {
      caseId,
      onCaseLoaded,
      financialsData,
      editForm,
      totalClaimAmount,
      editTotalAmount,
      showFinancialsModal,
      showCalculatorModal,
      formatCurrency,
      editFinancials,
      addClaimItem,
      removeClaimItem,
      saveFinancials,
      openCalculator,
      handleInterestApplied
    }
  }
}
</script>
