<template>
  <div class="modal-overlay" v-if="visible" @click.self="close">
    <div class="modal-container case-form-modal">
      <div class="modal-header">
        <div class="modal-title">{{ isEdit ? '编辑案件' : '新建案件' }}</div>
        <button class="modal-close" @click="close"><i class="fas fa-times"></i></button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent>
          <fieldset :disabled="form.status === 'closed'" class="form-fieldset">
            <!-- 1. 基础信息 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title">
                  <i class="fas fa-file-alt"></i>基础信息
                </div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-grid">
                  <div class="smart-form-group full-width">
                    <label class="smart-label required">案件名称</label>
                    <input type="text" v-model="form.name" placeholder="例如：ABC 公司诉 XYZ 有限公司合同纠纷案" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">案件编号</label>
                    <input type="text" v-model="form.caseId" placeholder="系统自动生成" class="smart-input" :disabled="isEdit">
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
                    <input type="text" v-model="form.legalCause" placeholder="例如：买卖合同纠纷" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">案件阶段</label>
                    <select v-model="form.caseStage" class="smart-select">
                      <option value="">请选择...</option>
                      <option value="consultation">咨询</option>
                      <option value="filing">立案</option>
                      <option value="first_instance">一审</option>
                      <option value="second_instance">二审</option>
                      <option value="execution">执行</option>
                      <option value="closed">结案</option>
                    </select>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">管辖法院/机构</label>
                    <input type="text" v-model="form.court" placeholder="请输入受理法院" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">承办法官</label>
                    <input type="text" v-model="form.judge" placeholder="请输入法官姓名" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">立案日期</label>
                    <input type="date" v-model="form.filingDate" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">诉讼时效/截止日</label>
                    <input type="date" v-model="form.deadline" class="smart-input">
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. 当事人信息 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title">
                  <i class="fas fa-users"></i>当事人信息
                </div>
              </div>
              <div class="smart-card-content">
                <div class="parties-grid">
                  <!-- Client Side -->
                  <div>
                    <div class="party-header">
                      <h4>我方客户</h4>
                      <button type="button" @click="addClient" class="add-party-btn">
                        <i class="fas fa-plus-circle"></i> 添加
                      </button>
                    </div>
                    
                    <div v-for="(client, index) in form.clients" :key="'client-'+index" class="party-item">
                      <button v-if="form.clients.length > 1" type="button" @click="removeClient(index)" class="remove-btn">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                      
                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input type="text" v-model="client.name" class="smart-input">
                      </div>
                      <div class="smart-form-group">
                        <label class="smart-label">主体类型</label>
                        <select v-model="client.type" class="smart-select">
                          <option value="individual">自然人</option>
                          <option value="company">法人企业</option>
                          <option value="org">非法人组织</option>
                        </select>
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0;">
                        <label class="smart-label">证件号码/信用代码</label>
                        <input type="text" v-model="client.id" class="smart-input">
                      </div>
                    </div>
                  </div>

                  <!-- Opposing Side -->
                  <div>
                    <div class="party-header">
                      <h4>对方当事人</h4>
                      <button type="button" @click="addOpposingParty" class="add-party-btn">
                        <i class="fas fa-plus-circle"></i> 添加
                      </button>
                    </div>

                    <div v-for="(party, index) in form.opposingParties" :key="'opposing-'+index" class="party-item">
                      <button v-if="form.opposingParties.length > 1" type="button" @click="removeOpposingParty(index)" class="remove-btn">
                        <i class="fas fa-trash-alt"></i>
                      </button>

                      <div class="smart-form-group">
                        <label class="smart-label required">名称/姓名</label>
                        <input type="text" v-model="party.name" class="smart-input">
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
                        <input type="text" v-model="party.rep" class="smart-input">
                      </div>
                      <div class="smart-form-group" style="margin-bottom: 0;">
                        <label class="smart-label">对方代理律师</label>
                        <input type="text" v-model="party.counsel" class="smart-input">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. 案情描述 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title">
                  <i class="fas fa-align-left"></i>案情描述
                </div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-group full-width">
                  <label class="smart-label">案情摘要</label>
                  <textarea v-model="form.description" class="smart-textarea bordered-textarea" rows="4" placeholder="请输入案件的详细背景和经过..."></textarea>
                </div>
                <div class="smart-form-group full-width">
                  <label class="smart-label">争议焦点</label>
                  <input type="text" v-model="form.disputeFocus" placeholder="多个焦点请用逗号分隔" class="smart-input">
                </div>
                <div class="smart-form-group full-width">
                  <label class="smart-label">客户诉求</label>
                  <textarea v-model="form.objective" class="smart-textarea bordered-textarea" rows="2" placeholder="请输入客户的具体诉求..."></textarea>
                </div>
              </div>
            </div>

            <!-- 4. 财务信息 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title">
                  <i class="fas fa-calculator"></i>财务信息
                </div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-grid">
                  <div class="smart-form-group">
                    <label class="smart-label">诉讼标的额 (CNY)</label>
                    <input type="text" v-model="form.amount" placeholder="0.00" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">律师费报价 (CNY)</label>
                    <input type="text" v-model="form.attorneyFee" placeholder="0.00" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">预估诉讼费 (CNY)</label>
                    <input type="text" v-model="form.courtCost" placeholder="0.00" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">计费时长 (小时)</label>
                    <input type="number" v-model="form.billableHours" placeholder="0.0" class="smart-input">
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. 联络人信息 -->
            <div class="smart-card section-card">
              <div class="card-header">
                <div class="card-title">
                  <i class="fas fa-address-book"></i>联络人信息
                </div>
              </div>
              <div class="smart-card-content">
                <div class="smart-form-grid">
                  <div class="smart-form-group">
                    <label class="smart-label">姓名</label>
                    <input type="text" v-model="form.contactName" placeholder="请输入联络人姓名" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">职位/角色</label>
                    <input type="text" v-model="form.contactRole" placeholder="请输入职位或角色" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">电话</label>
                    <input type="text" v-model="form.contactPhone" placeholder="请输入联系电话" class="smart-input">
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">邮箱</label>
                    <input type="email" v-model="form.contactEmail" placeholder="请输入邮箱地址" class="smart-input">
                  </div>
                  <div class="smart-form-group full-width">
                    <label class="smart-label">地址</label>
                    <input type="text" v-model="form.contactAddress" placeholder="请输入联系地址" class="smart-input">
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
          <button type="button" class="smart-btn-secondary" @click="saveCase('draft')">
            保存草稿
          </button>
          <button type="button" class="smart-btn-primary" @click="saveCase('active')">
            提交
          </button>
        </template>

        <!-- Edit Case Buttons -->
        <button v-if="isEdit && form.status !== 'closed'" type="button" class="smart-btn-primary" @click="saveCase()">
          <i class="fas fa-save"></i> 保存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
        clients: [
          { name: '', type: 'individual', id: '' }
        ],
        opposingParties: [
          { name: '', type: 'company', rep: '', counsel: '' }
        ],
        description: '',
        disputeFocus: '',
        objective: '',
        amount: '',
        attorneyFee: '',
        courtCost: '',
        billableHours: '',
        contactName: '',
        contactRole: '',
        contactPhone: '',
        contactEmail: '',
        contactAddress: ''
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.editId
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
    }
  },
  methods: {
    resetForm() {
      this.form = {
        name: '', caseId: '', type: '', legalCause: '', caseStage: '', court: '', judge: '', filingDate: '', deadline: '', status: 'active',
        clients: [{ name: '', type: 'individual', id: '' }],
        opposingParties: [{ name: '', type: 'company', rep: '', counsel: '' }],
        description: '', disputeFocus: '', objective: '',
        amount: '', attorneyFee: '', courtCost: '', billableHours: '',
        contactName: '', contactRole: '', contactPhone: '', contactEmail: '', contactAddress: ''
      }
    },
    loadCaseData(id) {
      console.log('Loading case data for:', id)
      this.form = {
        name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
        caseId: 'CASE-2023-001',
        type: 'civil',
        legalCause: '买卖合同纠纷',
        caseStage: 'first_instance',
        court: '上海市浦东新区人民法院',
        judge: '张法官',
        filingDate: '2023-10-01',
        deadline: '2024-10-01',
        status: 'active',
        clients: [
          { name: 'ABC 公司', type: 'company', id: '91310000XXXXXXXXXX' }
        ],
        opposingParties: [
          { name: 'XYZ 有限公司', type: 'company', rep: '李四', counsel: '王律师' }
        ],
        description: '因被告未按合同约定支付广告费用引发的纠纷。',
        disputeFocus: '合同履行情况, 违约金计算标准',
        objective: '支付欠款及违约金',
        amount: '500,000.00',
        attorneyFee: '50,000.00',
        courtCost: '8,800.00',
        billableHours: '12.5'
      }

      if (id == 2) {
        this.form.status = 'draft'
        this.form.name = '张三 诉 李四 借贷纠纷案'
        this.form.caseId = 'CASE-2023-002'
      } else if (id == 3) {
        this.form.status = 'closed'
        this.form.name = '甲乙丙丁 劳动争议仲裁案'
        this.form.caseId = 'CASE-2023-003'
      } else {
        this.form.status = 'active'
      }
    },
    addClient() {
      this.form.clients.push({ name: '', type: 'individual', id: '' })
    },
    removeClient(index) {
      if (this.form.clients.length > 1) {
        this.form.clients.splice(index, 1)
      }
    },
    addOpposingParty() {
      this.form.opposingParties.push({ name: '', type: 'company', rep: '', counsel: '' })
    },
    removeOpposingParty(index) {
      if (this.form.opposingParties.length > 1) {
        this.form.opposingParties.splice(index, 1)
      }
    },
    saveCase(status) {
      if (!this.validateForm()) return

      if (status && typeof status === 'string') {
        this.form.status = status
      }

      this.$emit('saved', this.form)
      this.close()
    },
    close() {
      this.$emit('close')
    },
    validateForm() {
      if (!this.form.name) { alert('请输入案件名称'); return false }
      if (!this.form.type) { alert('请选择案件类型'); return false }

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
</style>
