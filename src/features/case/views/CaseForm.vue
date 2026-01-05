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
                    <label class="smart-label">案件编号</label>
                    <input
                      v-model="form.caseId"
                      type="text"
                      placeholder="系统自动生成"
                      class="smart-input"
                      :disabled="isEdit"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label required">案由 (一级)</label>
                    <select v-model="form.type" class="smart-select">
                      <option value="">请选择...</option>
                      <option value="civil">民事</option>
                      <option value="criminal">刑事</option>
                      <option value="administrative">行政</option>
                      <option value="ip">知识产权</option>
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
                <div class="parties-grid">
                  <!-- Client Side -->
                  <div>
                    <div class="party-header">
                      <h4>我方客户</h4>
                      <button type="button" class="add-party-btn" @click="addClient">
                        <i class="fas fa-plus-circle" /> 添加
                      </button>
                    </div>

                    <div
                      v-for="(client, index) in form.clients"
                      :key="'client-' + index"
                      class="party-item"
                    >
                      <button
                        v-if="form.clients.length > 1"
                        type="button"
                        class="remove-btn"
                        @click="removeClient(index)"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input v-model="client.name" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="client.type" class="smart-select">
                          <option value="individual">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0">
                        <label class="smart-label">证件号码/信用代码</label>
                        <input v-model="client.id" type="text" class="smart-input" />
                      </div>

                      <!-- Contact Info for Client -->
                      <div class="party-contact-section">
                        <div class="contact-divider">联络人信息</div>
                        <div class="smart-form-group">
                          <label class="smart-label">姓名</label>
                          <div style="display: flex; gap: 8px">
                            <input
                              v-model="client.contactName"
                              type="text"
                              placeholder="姓名"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="client.contactRole"
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
                              v-model="client.contactPhone"
                              type="text"
                              placeholder="电话"
                              class="smart-input"
                              style="flex: 1"
                            />
                            <input
                              v-model="client.contactEmail"
                              type="text"
                              placeholder="邮箱"
                              class="smart-input"
                              style="flex: 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Opposing Side -->
                  <div>
                    <div class="party-header">
                      <h4>对方当事人</h4>
                      <button type="button" class="add-party-btn" @click="addOpposingParty">
                        <i class="fas fa-plus-circle" /> 添加
                      </button>
                    </div>

                    <div
                      v-for="(party, index) in form.opposingParties"
                      :key="'opposing-' + index"
                      class="party-item"
                    >
                      <button
                        v-if="form.opposingParties.length > 1"
                        type="button"
                        class="remove-btn"
                        @click="removeOpposingParty(index)"
                      >
                        <i class="fas fa-trash-alt" />
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input v-model="party.name" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="party.type" class="smart-select">
                          <option value="individual">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">法定代表人</label>
                        <input v-model="party.rep" type="text" class="smart-input" />
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0">
                        <label class="smart-label">对方代理律师</label>
                        <input v-model="party.counsel" type="text" class="smart-input" />
                      </div>

                      <!-- Contact Info for Opposing Party -->
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
  </div>
</template>

<script>
import { caseService } from '@/features/case/services'

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
        type: '',
        legalCause: '',
        caseStage: '',
        court: '',
        judge: '',
        filingDate: '',
        deadline: '',
        status: 'active',
        clients: [{ name: '', type: 'individual', id: '' }],
        opposingParties: [{ name: '', type: 'company', rep: '', counsel: '' }],
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
      saving: false // 添加保存状态
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
    resetForm() {
      this.form = {
        name: '',
        caseId: '',
        type: '',
        legalCause: '',
        caseStage: '',
        court: '',
        judge: '',
        filingDate: '',
        deadline: '',
        status: 'active',
        clients: [{ name: '', type: 'individual', id: '' }],
        opposingParties: [{ name: '', type: 'company', rep: '', counsel: '' }],
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
    },
    async loadCaseData(id) {
      console.log('Loading case data for:', id)
      try {
        const data = await caseService.getById(id)

        // 简单的类型映射逻辑
        let type = 'civil' // 默认为民事
        if (['criminal', 'administrative', 'ip'].includes(data.case_type)) {
          type = data.case_type
        }

        this.form = {
          name: data.case_title || '',
          caseId: data.case_number || '',
          type: type,
          legalCause: data.legal_cause || data.case_type || '', // 如果 case_type 是中文，存入具体案由
          caseStage: data.stage || '',
          court: data.court || '',
          judge: data.judge || '',
          filingDate: data.filing_date || '',
          deadline: data.deadline || '',
          status: data.status || 'active',
          clients: [{ name: data.client_name || '', type: 'individual', id: '' }],
          opposingParties: [{ name: '', type: 'company', rep: '', counsel: '' }],
          description: data.description || '',
          disputeFocus: Array.isArray(data.dispute_focus) ? data.dispute_focus.join(', ') : '',
          objective: data.objective || '',
          amount: 0,
          claimItems: [],
          attorneyFee: '',
          isAttorneyFeeIncluded: false,
          courtCost: '',
          billableHours: ''
        }
      } catch (e) {
        console.error('加载案件数据失败:', e)
        alert('加载案件数据失败')
      }
    },
    addClient() {
      this.form.clients.push({
        name: '',
        type: 'individual',
        id: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: ''
      })
    },
    removeClient(index) {
      if (this.form.clients.length > 1) {
        this.form.clients.splice(index, 1)
      }
    },
    addOpposingParty() {
      this.form.opposingParties.push({
        name: '',
        type: 'company',
        rep: '',
        counsel: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: ''
      })
    },
    removeOpposingParty(index) {
      if (this.form.opposingParties.length > 1) {
        this.form.opposingParties.splice(index, 1)
      }
    },
    async saveCase(status) {
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
          case_type: this.form.type,
          status: this.form.status,
          stage: this.form.caseStage,
          court: this.form.court,
          assignee: this.form.judge,
          filing_date: this.form.filingDate || null,
          deadline: this.form.deadline || null,
          description: this.form.description,
          dispute_focus: this.form.disputeFocus
            ? this.form.disputeFocus.split(',').map(s => s.trim())
            : [],
          objective: this.form.objective,
          client_name: this.form.clients[0]?.name || ''
        }

        if (this.isEdit) {
          await caseService.update(this.editId, dbData)
        } else {
          await caseService.create(dbData)
        }

        this.$emit('saved', this.form)
        this.close()
      } catch (e) {
        console.error('保存案件失败:', e)
        alert('保存失败: ' + e.message)
      } finally {
        this.saving = false // 结束保存
      }
    },
    close() {
      this.$emit('close')
    },
    validateForm() {
      if (!this.form.name) {
        alert('请输入案件名称')
        return false
      }
      if (!this.form.type) {
        alert('请选择案件类型')
        return false
      }
      // 案件阶段通常不是必填，但如果原来逻辑里有校验，在这里加上提示
      // 看起来上面的 validateForm 没有校验 caseStage，所以应该不是 stage 为空导致保存失败
      // 但用户提到“点击保存无反应”，说明进了 validateForm 失败分支的可能性很大

      for (let i = 0; i < this.form.clients.length; i++) {
        if (!this.form.clients[i].name) {
          alert(`请输入第 ${i + 1} 个客户的名称`)
          return false
        }
      }

      for (let i = 0; i < this.form.opposingParties.length; i++) {
        if (!this.form.opposingParties[i].name) {
          alert(`请输入第 ${i + 1} 个对方当事人的名称`)
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

.parties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.party-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.party-header h4 {
  margin: 0;
  font-size: 14px;
  color: #666;
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

.party-item {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
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
</style>
