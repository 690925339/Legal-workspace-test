<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container case-form-modal">
      <div class="modal-header">
        <div class="modal-title">
          {{ isEdit ? '编辑案件' : '新建案件' }}
        </div>
        <button class="modal-close" @click="close">
          <i class="fas fa-times" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent>
          <fieldset :disabled="form.status === 'closed'" class="form-fieldset">
            <!-- 1. 基础信息 -->
            <CaseBasicInfoForm v-model:form="form" />

            <!-- 2. 当事人信息 -->
            <CaseStakeholderForm v-model:form="form" />

            <!-- 3. 案情描述 -->
            <CaseDescriptionForm v-model:form="form" />

            <!-- 4. 财务信息 -->
            <CaseFinancialForm v-model:form="form" />
          </fieldset>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="smart-btn-secondary" @click="close">
          {{ form.status === 'closed' ? '关闭' : '取消' }}
        </button>

        <!-- New Case Buttons -->
        <template v-if="!isEdit">
          <button
            type="button"
            class="smart-btn-secondary"
            :disabled="saving"
            @click="saveCase('draft')"
          >
            保存草稿
          </button>
          <button
            type="button"
            class="smart-btn-primary"
            :disabled="saving"
            @click="saveCase('active')"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin" />
            {{ saving ? '提交中...' : '提交' }}
          </button>
        </template>

        <!-- Edit Case Buttons -->
        <button
          v-if="isEdit && form.status !== 'closed'"
          type="button"
          class="smart-btn-primary"
          :disabled="saving"
          @click="saveCase()"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin" />
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <!-- Toast Component -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <i
        class="fas"
        :class="toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"
      />
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { caseService, financialService, stakeholderService } from '@/features/case/services'
import CaseBasicInfoForm from '../components/CaseBasicInfoForm.vue'
import CaseStakeholderForm from '../components/CaseStakeholderForm.vue'
import CaseDescriptionForm from '../components/CaseDescriptionForm.vue'
import CaseFinancialForm from '../components/CaseFinancialForm.vue'

export default {
  name: 'CaseForm',
  components: {
    CaseBasicInfoForm,
    CaseStakeholderForm,
    CaseDescriptionForm,
    CaseFinancialForm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [String, Number],
      default: null
    },
    initialData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  data() {
    return {
      form: {
        name: '',
        caseId: '',
        courtCaseNumber: '',
        type: '',
        legalCause: '',
        caseStage: '',
        court: '',
        judge: '',
        filingDate: '',
        deadline: '',
        status: 'active',
        plaintiffs: [],
        defendants: [],
        thirdParties: [],
        description: '',
        disputeFocus: '',
        objective: '',
        amount: 0,
        claimItems: [],
        attorneyFee: '',
        isAttorneyFeeIncluded: false,
        courtCost: '',
        billableHours: ''
      },
      saving: false,
      toast: {
        show: false,
        message: '',
        type: 'error'
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.editId
    },
    totalClaimAmount() {
      if (!this.form.claimItems) return 0
      return this.form.claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (this.editId) {
          // 检查是否是预加载的完整数据（包含 caseData, financials, stakeholders）
          if (this.initialData && this.initialData.caseData) {
            // 使用预加载的完整数据，无需再请求
            this.applyPreloadedData(this.initialData)
          } else if (this.initialData) {
            // 兼容旧的基础数据格式
            this.applyInitialData(this.initialData)
            this.loadCaseData(this.editId)
          } else {
            this.loadCaseData(this.editId)
          }
        } else {
          this.resetForm()
        }
      }
    },
    'form.isAttorneyFeeIncluded'(val) {
      if (!this.form.claimItems) return
      const existingIndex = this.form.claimItems.findIndex(i => i.name === '律师费')

      if (val) {
        // Checked: Add if missing
        if (existingIndex === -1) {
          this.form.claimItems.push({ name: '律师费', amount: this.form.attorneyFee || 0 })
        }
        // Also update amount if it exists but might be stale (corner case)
        else {
          this.form.claimItems[existingIndex].amount = this.form.attorneyFee || 0
        }
      } else {
        // Unchecked: Remove if exists
        if (existingIndex !== -1) {
          this.form.claimItems.splice(existingIndex, 1)
        }
      }
    },
    'form.attorneyFee'(val) {
      if (this.form.isAttorneyFeeIncluded) {
        const item = this.form.claimItems.find(i => i.name === '律师费')
        if (item) {
          item.amount = val || 0
        }
      }
    },
    'form.claimItems': {
      handler(newVal) {
        if (!newVal) return
        const hasFee = newVal.some(i => i.name === '律师费')
        if (this.form.isAttorneyFeeIncluded !== hasFee) {
          this.form.isAttorneyFeeIncluded = hasFee
        }
      },
      deep: true
    }
  },
  methods: {
    // 使用缓存数据快速填充基础表单字段（秒开）
    applyInitialData(data) {
      // 映射列表数据格式到表单格式
      this.form.name = data.name || ''
      this.form.caseId = data.code || ''
      this.form.type = data.type || ''
      this.form.caseStage = data.stage || ''
      this.form.court = data.court || ''
      this.form.status = data.status || 'active'
      // 其他字段（财务、当事人等）将由 loadCaseData 加载
      console.log('[CaseForm] 使用缓存数据秒开')
    },
    // 使用预加载的完整数据填充表单（零延迟）
    applyPreloadedData({ caseData, financials, stakeholders }) {
      console.log('[CaseForm] 使用预加载完整数据')
      const data = caseData
      const fin = financials || {
        claim_items: [],
        attorney_fee: '',
        attorney_fee_included: false,
        court_cost: '',
        billable_hours: ''
      }

      // 类型映射
      const typeMap = { civil: '民事', criminal: '刑事', administrative: '行政', ip: '知识产权' }
      const type = typeMap[data.case_type] || data.case_type || '民事'

      // 处理当事人分类
      let plaintiffs = []
      let defendants = []
      let thirdParties = []
      const emptyStakeholder = () => ({
        name: '',
        entityType: 'person',
        idNumber: '',
        legalRepresentative: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: ''
      })
      ;(stakeholders || []).forEach(s => {
        const item = {
          id: s.id,
          name: s.name,
          entityType: s.entity_type || 'person',
          idNumber: s.id_number || '',
          legalRepresentative: s.legal_representative || '',
          contactName: s.contact_name || '',
          contactRole: s.contact_role || '',
          contactPhone: s.contact_phone || '',
          contactEmail: s.contact_email || ''
        }
        if (s.type === 'plaintiff') plaintiffs.push(item)
        else if (s.type === 'defendant') defendants.push(item)
        else if (s.type === 'third_party') thirdParties.push(item)
      })
      if (plaintiffs.length === 0) plaintiffs.push(emptyStakeholder())
      if (defendants.length === 0) defendants.push(emptyStakeholder())

      this.form = {
        name: data.case_title || '',
        caseId: data.case_number || '',
        courtCaseNumber: data.court_case_number || '',
        type: type,
        legalCause: data.legal_cause || data.case_type || '',
        caseStage: data.stage || '',
        court: data.court || '',
        judge: data.judge || data.assignee || '',
        filingDate: data.filing_date || '',
        deadline: data.deadline || '',
        status: data.status || 'active',
        plaintiffs: plaintiffs,
        defendants: defendants,
        thirdParties: thirdParties,
        description: data.description || '',
        disputeFocus: Array.isArray(data.dispute_focus) ? data.dispute_focus.join(', ') : '',
        objective: data.objective || '',
        amount: 0,
        claimItems: fin.claim_items || [],
        attorneyFee: fin.attorney_fee || '',
        isAttorneyFeeIncluded: fin.attorney_fee_included || false,
        courtCost: fin.court_cost || '',
        billableHours: fin.billable_hours || ''
      }
    },
    async resetForm() {
      const emptyStakeholder = () => ({
        name: '',
        entityType: 'person',
        idNumber: '',
        legalRepresentative: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: ''
      })

      this.form = {
        name: '',
        caseId: '生成中...',
        courtCaseNumber: '',
        type: '',
        legalCause: '',
        caseStage: '',
        court: '',
        judge: '',
        filingDate: '',
        deadline: '',
        status: 'active',
        plaintiffs: [emptyStakeholder()],
        defendants: [emptyStakeholder()],
        thirdParties: [],
        description: '',
        disputeFocus: '',
        objective: '',
        amount: 0,
        claimItems: [{ name: '', amount: '' }],
        attorneyFee: '',
        isAttorneyFeeIncluded: false,
        courtCost: '',
        billableHours: ''
      }

      try {
        this.form.caseId = await caseService.generateCaseNumber()
      } catch (e) {
        console.error('生成案件ID失败:', e)
        this.form.caseId = `CASE-${Date.now()}`
      }
    },
    async loadCaseData(id) {
      console.log('Loading case data for:', id)
      try {
        // 并行加载所有数据，减少总等待时间
        const [data, financials, stakeholders] = await Promise.all([
          caseService.getById(id),
          financialService.get(id).catch(err => {
            console.warn('Failed to load financials:', err)
            return {
              claim_items: [],
              attorney_fee: '',
              attorney_fee_included: false,
              court_cost: '',
              billable_hours: ''
            }
          }),
          stakeholderService.getList(id).catch(err => {
            console.warn('Failed to load stakeholders:', err)
            return []
          })
        ])

        // 类型映射：兼容英文旧数据
        const typeMap = { civil: '民事', criminal: '刑事', administrative: '行政', ip: '知识产权' }
        let type = typeMap[data.case_type] || data.case_type || '民事'

        // 处理当事人分类
        let plaintiffs = []
        let defendants = []
        let thirdParties = []
        ;(stakeholders || []).forEach(s => {
          const item = {
            id: s.id,
            name: s.name,
            entityType: s.entity_type || 'person',
            idNumber: s.id_number || '',
            legalRepresentative: s.legal_representative || '',
            contactName: s.contact_name || '',
            contactRole: s.contact_role || '',
            contactPhone: s.contact_phone || '',
            contactEmail: s.contact_email || ''
          }
          if (s.type === 'plaintiff') {
            plaintiffs.push(item)
          } else if (s.type === 'defendant') {
            defendants.push(item)
          } else if (s.type === 'third_party') {
            thirdParties.push(item)
          }
        })

        // 定义空当事人模板
        const emptyStakeholder = () => ({
          name: '',
          entityType: 'person',
          idNumber: '',
          legalRepresentative: '',
          contactName: '',
          contactRole: '',
          contactPhone: '',
          contactEmail: ''
        })

        // 保证原告和被告至少有一行
        if (plaintiffs.length === 0) plaintiffs.push(emptyStakeholder())
        if (defendants.length === 0) defendants.push(emptyStakeholder())

        this.form = {
          name: data.case_title || '',
          caseId: data.case_number || '',
          courtCaseNumber: data.court_case_number || '',
          type: type,
          legalCause: data.legal_cause || data.case_type || '',
          caseStage: data.stage || '',
          court: data.court || '',
          judge: data.judge || data.assignee || '',
          filingDate: data.filing_date || '',
          deadline: data.deadline || '',
          status: data.status || 'active',
          plaintiffs: plaintiffs,
          defendants: defendants,
          thirdParties: thirdParties,
          description: data.description || '',
          disputeFocus: Array.isArray(data.dispute_focus) ? data.dispute_focus.join(', ') : '',
          objective: data.objective || '',
          amount: 0,
          claimItems: financials.claim_items || [],
          attorneyFee: financials.attorney_fee || '',
          isAttorneyFeeIncluded: financials.attorney_fee_included || false,
          courtCost: financials.court_cost || '',
          billableHours: financials.billable_hours || ''
        }
      } catch (e) {
        console.error('加载案件数据失败:', e)
        alert('加载案件数据失败')
      }
    },
    showToast(message, type = 'error') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },
    createEmptyStakeholder() {
      return {
        name: '',
        entityType: 'person',
        idNumber: '',
        legalRepresentative: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: ''
      }
    },
    addPlaintiff() {
      this.form.plaintiffs.push(this.createEmptyStakeholder())
    },
    removePlaintiff(index) {
      if (this.form.plaintiffs.length > 1) {
        this.form.plaintiffs.splice(index, 1)
      }
    },
    addDefendant() {
      this.form.defendants.push(this.createEmptyStakeholder())
    },
    removeDefendant(index) {
      if (this.form.defendants.length > 1) {
        this.form.defendants.splice(index, 1)
      }
    },
    addThirdParty() {
      this.form.thirdParties.push(this.createEmptyStakeholder())
    },
    removeThirdParty(index) {
      this.form.thirdParties.splice(index, 1)
    },
    async saveCase(status) {
      // 防止重复提交
      if (this.saving) {
        console.log('正在保存中，请勿重复提交')
        return
      }

      if (!this.validateForm()) {
        // 添加显式的错误提示，让用户知道为什么没反应
        return
      }

      if (status && typeof status === 'string') {
        this.form.status = status
      }

      this.saving = true // 开始保存
      try {
        // 映射前端字段到数据库结构
        const dbData = {
          case_title: this.form.name,
          case_number: this.form.caseId || null,
          court_case_number: this.form.courtCaseNumber || null,
          case_type: this.form.type,
          status: this.form.status,
          stage: this.form.caseStage,
          court: this.form.court,
          judge: this.form.judge,
          filing_date: this.form.filingDate || null,
          deadline: this.form.deadline || null,
          description: this.form.description,
          dispute_focus: this.form.disputeFocus
            ? this.form.disputeFocus.split(',').map(s => s.trim())
            : [],
          objective: this.form.objective
        }

        let savedCaseId = this.editId

        if (this.isEdit) {
          await caseService.update(this.editId, dbData)
        } else {
          const newCase = await caseService.create(dbData)
          savedCaseId = newCase.id
        }

        // 保存财务信息
        if (savedCaseId) {
          const financialData = {
            claim_items: this.form.claimItems,
            attorney_fee: this.form.attorneyFee ? Number(this.form.attorneyFee) : null,
            attorney_fee_included: this.form.isAttorneyFeeIncluded,
            court_cost: this.form.courtCost ? Number(this.form.courtCost) : null,
            billable_hours: this.form.billableHours ? Number(this.form.billableHours) : null
          }
          await financialService.upsert(savedCaseId, financialData)

          // 保存当事人信息的辅助函数
          const saveStakeholders = async (list, type) => {
            for (const party of list) {
              if (!party.name) continue
              const payload = {
                name: party.name,
                type: type,
                entity_type: party.entityType || 'person',
                id_number: party.idNumber || null,
                legal_representative: party.legalRepresentative || null,
                contact_name: party.contactName || null,
                contact_role: party.contactRole || null,
                contact_phone: party.contactPhone || null,
                contact_email: party.contactEmail || null
              }
              if (party.id) {
                await stakeholderService.update(party.id, payload)
              } else {
                await stakeholderService.create(savedCaseId, payload)
              }
            }
          }

          // 保存原告
          await saveStakeholders(this.form.plaintiffs, 'plaintiff')
          // 保存被告
          await saveStakeholders(this.form.defendants, 'defendant')
          // 保存第三人
          await saveStakeholders(this.form.thirdParties, 'third_party')
        }

        this.$emit('saved', this.form)
        this.close()
      } catch (e) {
        console.error('保存案件失败:', e)
        console.error('保存案件失败:', e)
        this.showToast('保存失败: ' + e.message, 'error')
      } finally {
        this.saving = false // 结束保存
      }
    },
    close() {
      this.$emit('close')
    },
    validateForm() {
      if (!this.form.name) {
        this.showToast('请输入案件名称', 'error')
        return false
      }
      if (!this.form.type) {
        this.showToast('请选择案件类型', 'error')
        return false
      }

      // 校验原告
      for (let i = 0; i < this.form.plaintiffs.length; i++) {
        if (!this.form.plaintiffs[i].name) {
          this.showToast(`请输入第 ${i + 1} 个原告的名称/姓名`, 'error')
          return false
        }
      }

      // 校验被告
      for (let i = 0; i < this.form.defendants.length; i++) {
        if (!this.form.defendants[i].name) {
          this.showToast(`请输入第 ${i + 1} 个被告的名称/姓名`, 'error')
          return false
        }
      }

      // 校验第三人
      for (let i = 0; i < this.form.thirdParties.length; i++) {
        if (!this.form.thirdParties[i].name) {
          this.showToast(`请输入第 ${i + 1} 个第三人的名称/姓名`, 'error')
          return false
        }
      }

      return true
    },
    addClaimItem() {
      if (!this.form.claimItems) this.form.claimItems = []
      this.form.claimItems.push({ name: '', amount: '' })
    },
    removeClaimItem(index) {
      this.form.claimItems.splice(index, 1)
    },
    formatCurrency(value) {
      return '¥' + (Number(value) || 0).toLocaleString()
    }
  }
}
</script>

<style scoped>
.case-form-modal {
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
  min-inline-size: min-content;
  width: 100%;
}

.section-card {
  margin-bottom: 24px;
  box-shadow: none;
  border: 1px solid #e5e5e5;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
}

.card-title i {
  margin-right: 8px;
  color: #1a1a1a;
}

/* 当事人信息区域 */
.stakeholders-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stakeholder-group {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.group-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-header h4 .indicator {
  display: inline-block;
  width: 4px;
  height: 14px;
  border-radius: 2px;
}

.group-header h4 .count {
  font-weight: normal;
  color: #94a3b8;
  font-size: 13px;
}

.add-party-btn {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-party-btn:hover {
  color: #1d4ed8;
}

.party-item {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
  border: 1px solid #e2e8f0;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
}

.remove-btn:hover {
  color: #dc2626;
}

.bordered-textarea {
  border: 1px solid #ccc;
}

.party-contact-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e5e5;
}

.contact-divider {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
}

.empty-placeholder {
  padding: 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.toast-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}

.toast-notification.success {
  background: #10b981;
  color: white;
}

.toast-notification.error {
  background: #ef4444;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
</style>
