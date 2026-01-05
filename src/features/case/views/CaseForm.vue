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
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title"><i class="fas fa-file-alt" />基础信息</div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-grid">
                  <div class="smart-form-group full-width">
                    <label class="smart-label required">案件名称</label>
                    <input
                      v-model="form.name"
                      type="text"
                      placeholder="例如：ABC 公司诉 XYZ 有限公司合同纠纷案"
                      class="smart-input"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">案件ID</label>
                    <input
                      v-model="form.caseId"
                      type="text"
                      class="smart-input"
                      disabled
                      style="background: #f1f5f9; cursor: not-allowed; font-family: monospace; font-size: 12px"
                    />
                    <span style="font-size: 11px; color: #94a3b8; margin-top: 4px">系统自动生成</span>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">案号</label>
                    <input
                      v-model="form.courtCaseNumber"
                      type="text"
                      placeholder="如 (2025)京0105民初67890号"
                      class="smart-input"
                    />
                    <span style="font-size: 11px; color: #94a3b8; margin-top: 4px">法院正式案号，立案后填写</span>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label required">案由 (一级)</label>
                    <select v-model="form.type" class="smart-select">
                      <option value="">请选择...</option>
                      <option value="民事">民事</option>
                      <option value="刑事">刑事</option>
                      <option value="行政">行政</option>
                      <option value="知识产权">知识产权</option>
                    </select>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">具体案由</label>
                    <input
                      v-model="form.legalCause"
                      type="text"
                      placeholder="例如：买卖合同纠纷"
                      class="smart-input"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">案件阶段</label>
                    <select v-model="form.caseStage" class="smart-select">
                      <option value="">请选择...</option>
                      <option value="咨询">咨询</option>
                      <option value="立案">立案</option>
                      <option value="一审">一审</option>
                      <option value="二审">二审</option>
                      <option value="执行">执行</option>
                      <option value="结案">结案</option>
                    </select>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">管辖法院/机构</label>
                    <input
                      v-model="form.court"
                      type="text"
                      placeholder="请输入受理法院"
                      class="smart-input"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">承办法官</label>
                    <input
                      v-model="form.judge"
                      type="text"
                      placeholder="请输入法官姓名"
                      class="smart-input"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">立案日期</label>
                    <input v-model="form.filingDate" type="date" class="smart-input" />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">诉讼时效/截止日</label>
                    <input v-model="form.deadline" type="date" class="smart-input" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. 当事人信息 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title"><i class="fas fa-users" />当事人信息</div>
              </div>
              <div class="smart-card-content">
                <div class="stakeholders-section">
                  <!-- 原告 -->
                  <div class="stakeholder-group">
                    <div class="group-header">
                      <h4>
                        <span class="indicator" style="background: #4f46e5" />原告
                        <span class="count">({{ form.plaintiffs.length }})</span>
                      </h4>
                      <button type="button" class="add-party-btn" @click="addPlaintiff">
                        <i class="fas fa-plus-circle" /> 添加
                      </button>
                    </div>

                    <div
                      v-for="(party, index) in form.plaintiffs"
                      :key="'plaintiff-' + index"
                      class="party-item"
                    >
                      <button
                        v-if="form.plaintiffs.length > 1"
                        type="button"
                        class="remove-btn"
                        @click="removePlaintiff(index)"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input v-model="party.name" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="party.entityType" class="smart-select">
                          <option value="person">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">证件号码/信用代码</label>
                        <input v-model="party.idNumber" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0">
                        <label class="smart-label">法定代表人</label>
                        <input v-model="party.legalRepresentative" type="text" class="smart-input" />
                      </div>

                      <!-- Contact Info -->
                      <div class="party-contact-section">
                        <div class="contact-divider">联络人信息</div>
                        <div class="smart-form-group">
                          <label class="smart-label">姓名</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactName"
                              type="text"
                              placeholder="姓名"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactRole"
                              type="text"
                              placeholder="职位"
                              class="smart-input"
                              style="width: 80px"
                            />
                          </div>
                        </div>
                        <div class="smart-form-group" style="margin-bottom: 0">
                          <label class="smart-label">联系方式</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactPhone"
                              type="text"
                              placeholder="电话"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactEmail"
                              type="text"
                              placeholder="邮箱"
                              class="smart-input"
                              style="flex: 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="form.plaintiffs.length === 0" class="empty-placeholder">
                      暂无原告信息，点击"添加"按钮添加
                    </div>
                  </div>

                  <!-- 被告 -->
                  <div class="stakeholder-group">
                    <div class="group-header">
                      <h4>
                        <span class="indicator" style="background: #dc2626" />被告
                        <span class="count">({{ form.defendants.length }})</span>
                      </h4>
                      <button type="button" class="add-party-btn" @click="addDefendant">
                        <i class="fas fa-plus-circle" /> 添加
                      </button>
                    </div>

                    <div
                      v-for="(party, index) in form.defendants"
                      :key="'defendant-' + index"
                      class="party-item"
                    >
                      <button
                        v-if="form.defendants.length > 1"
                        type="button"
                        class="remove-btn"
                        @click="removeDefendant(index)"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input v-model="party.name" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="party.entityType" class="smart-select">
                          <option value="person">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">证件号码/信用代码</label>
                        <input v-model="party.idNumber" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0">
                        <label class="smart-label">法定代表人</label>
                        <input v-model="party.legalRepresentative" type="text" class="smart-input" />
                      </div>

                      <!-- Contact Info -->
                      <div class="party-contact-section">
                        <div class="contact-divider">联络人信息</div>
                        <div class="smart-form-group">
                          <label class="smart-label">姓名</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactName"
                              type="text"
                              placeholder="姓名"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactRole"
                              type="text"
                              placeholder="职位"
                              class="smart-input"
                              style="width: 80px"
                            />
                          </div>
                        </div>
                        <div class="smart-form-group" style="margin-bottom: 0">
                          <label class="smart-label">联系方式</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactPhone"
                              type="text"
                              placeholder="电话"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactEmail"
                              type="text"
                              placeholder="邮箱"
                              class="smart-input"
                              style="flex: 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="form.defendants.length === 0" class="empty-placeholder">
                      暂无被告信息，点击"添加"按钮添加
                    </div>
                  </div>

                  <!-- 第三人 -->
                  <div class="stakeholder-group">
                    <div class="group-header">
                      <h4>
                        <span class="indicator" style="background: #16a34a" />第三人
                        <span class="count">({{ form.thirdParties.length }})</span>
                      </h4>
                      <button type="button" class="add-party-btn" @click="addThirdParty">
                        <i class="fas fa-plus-circle" /> 添加
                      </button>
                    </div>

                    <div
                      v-for="(party, index) in form.thirdParties"
                      :key="'thirdParty-' + index"
                      class="party-item"
                    >
                      <button
                        type="button"
                        class="remove-btn"
                        @click="removeThirdParty(index)"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input v-model="party.name" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="party.entityType" class="smart-select">
                          <option value="person">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">证件号码/信用代码</label>
                        <input v-model="party.idNumber" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0">
                        <label class="smart-label">法定代表人</label>
                        <input v-model="party.legalRepresentative" type="text" class="smart-input" />
                      </div>

                      <!-- Contact Info -->
                      <div class="party-contact-section">
                        <div class="contact-divider">联络人信息</div>
                        <div class="smart-form-group">
                          <label class="smart-label">姓名</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactName"
                              type="text"
                              placeholder="姓名"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactRole"
                              type="text"
                              placeholder="职位"
                              class="smart-input"
                              style="width: 80px"
                            />
                          </div>
                        </div>
                        <div class="smart-form-group" style="margin-bottom: 0">
                          <label class="smart-label">联系方式</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="party.contactPhone"
                              type="text"
                              placeholder="电话"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="party.contactEmail"
                              type="text"
                              placeholder="邮箱"
                              class="smart-input"
                              style="flex: 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="form.thirdParties.length === 0" class="empty-placeholder">
                      暂无第三人信息，点击"添加"按钮添加
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. 案情描述 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title"><i class="fas fa-align-left" />案情描述</div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-group full-width">
                  <label class="smart-label">案情摘要</label>
                  <textarea
                    v-model="form.description"
                    class="smart-textarea bordered-textarea"
                    rows="4"
                    placeholder="请输入案件的详细背景和经过..."
                  />
                </div>
                <div class="smart-form-group full-width">
                  <label class="smart-label">争议焦点</label>
                  <input
                    v-model="form.disputeFocus"
                    type="text"
                    placeholder="多个焦点请用逗号分隔"
                    class="smart-input"
                  />
                </div>
                <div class="smart-form-group full-width">
                  <label class="smart-label">客户诉求</label>
                  <textarea
                    v-model="form.objective"
                    class="smart-textarea bordered-textarea"
                    rows="2"
                    placeholder="请输入客户的具体诉求..."
                  />
                </div>
              </div>
            </div>

            <!-- 4. 财务信息 -->
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
                        <button
                          class="icon-btn"
                          style="color: #ef4444"
                          @click="removeClaimItem(index)"
                        >
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
                        v-model="form.attorneyFee"
                        type="number"
                        placeholder="0.00"
                        class="smart-input"
                        style="flex: 1"
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
                        <input v-model="form.isAttorneyFeeIncluded" type="checkbox" />
                        包含在标的中
                      </label>
                    </div>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">预估诉讼费 (CNY)</label>
                    <input
                      v-model="form.courtCost"
                      type="text"
                      placeholder="0.00"
                      class="smart-input"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">计费时长 (小时)</label>
                    <input
                      v-model="form.billableHours"
                      type="number"
                      placeholder="0.0"
                      class="smart-input"
                    />
                  </div>
                </div>
              </div>
            </div>
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
      <i class="fas" :class="toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { caseService, financialService, stakeholderService } from '@/features/case/services'
import { ref } from 'vue'

export default {
  name: 'CaseForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [String, Number],
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
          this.loadCaseData(this.editId)
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
        const data = await caseService.getById(id)
        
        // 类型映射：兼容英文旧数据
        const typeMap = { civil: '民事', criminal: '刑事', administrative: '行政', ip: '知识产权' }
        let type = typeMap[data.case_type] || data.case_type || '民事'

        // 加载财务信息
        let financials = {
            claim_items: [],
            attorney_fee: '',
            attorney_fee_included: false,
            court_cost: '',
            billable_hours: ''
        };
        try {
            financials = await financialService.get(id) || financials;
        } catch (err) {
            console.warn('Failed to load financials:', err);
        }

        // 加载当事人信息
        let plaintiffs = [];
        let defendants = [];
        let thirdParties = [];
        try {
            const stakeholders = await stakeholderService.getList(id) || [];
            // 根据 type 字段分类
            stakeholders.forEach(s => {
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
                };
                if (s.type === 'plaintiff') {
                    plaintiffs.push(item);
                } else if (s.type === 'defendant') {
                    defendants.push(item);
                } else if (s.type === 'third_party') {
                    thirdParties.push(item);
                }
            });
        } catch (err) {
            console.warn('Failed to load stakeholders:', err);
        }
        
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
        if (plaintiffs.length === 0) plaintiffs.push(emptyStakeholder());
        if (defendants.length === 0) defendants.push(emptyStakeholder());

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
                    if (!party.name) continue;
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
                    };
                    if (party.id) {
                        await stakeholderService.update(party.id, payload);
                    } else {
                        await stakeholderService.create(savedCaseId, payload);
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
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
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
