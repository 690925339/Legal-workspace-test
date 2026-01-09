<template>
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
              <span class="count">({{ form.plaintiffs ? form.plaintiffs.length : 0 }})</span>
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
          <div v-if="!form.plaintiffs || form.plaintiffs.length === 0" class="empty-placeholder">
            暂无原告信息，点击"添加"按钮添加
          </div>
        </div>

        <!-- 被告 -->
        <div class="stakeholder-group">
          <div class="group-header">
            <h4>
              <span class="indicator" style="background: #dc2626" />被告
              <span class="count">({{ form.defendants ? form.defendants.length : 0 }})</span>
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
          <div v-if="!form.defendants || form.defendants.length === 0" class="empty-placeholder">
            暂无被告信息，点击"添加"按钮添加
          </div>
        </div>

        <!-- 第三人 -->
        <div class="stakeholder-group">
          <div class="group-header">
            <h4>
              <span class="indicator" style="background: #16a34a" />第三人
              <span class="count">({{ form.thirdParties ? form.thirdParties.length : 0 }})</span>
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
            <button type="button" class="remove-btn" @click="removeThirdParty(index)">
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
          <div
            v-if="!form.thirdParties || form.thirdParties.length === 0"
            class="empty-placeholder"
          >
            暂无第三人信息，点击"添加"按钮添加
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 当事人信息表单组件
 * 提取自 CaseForm.vue，保持完全相同的 UI 和行为
 * 通过 emit 更新父组件 form 状态，遵循 Vue 单向数据流
 */
export default {
  name: 'CaseStakeholderForm',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  emits: ['update:form'],
  methods: {
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
    emitFormUpdate(updates) {
      this.$emit('update:form', { ...this.form, ...updates })
    },
    addPlaintiff() {
      const plaintiffs = [...(this.form.plaintiffs || []), this.createEmptyStakeholder()]
      this.emitFormUpdate({ plaintiffs })
    },
    removePlaintiff(index) {
      if (this.form.plaintiffs && this.form.plaintiffs.length > 1) {
        const plaintiffs = this.form.plaintiffs.filter((_, i) => i !== index)
        this.emitFormUpdate({ plaintiffs })
      }
    },
    addDefendant() {
      const defendants = [...(this.form.defendants || []), this.createEmptyStakeholder()]
      this.emitFormUpdate({ defendants })
    },
    removeDefendant(index) {
      if (this.form.defendants && this.form.defendants.length > 1) {
        const defendants = this.form.defendants.filter((_, i) => i !== index)
        this.emitFormUpdate({ defendants })
      }
    },
    addThirdParty() {
      const thirdParties = [...(this.form.thirdParties || []), this.createEmptyStakeholder()]
      this.emitFormUpdate({ thirdParties })
    },
    removeThirdParty(index) {
      if (this.form.thirdParties) {
        const thirdParties = this.form.thirdParties.filter((_, i) => i !== index)
        this.emitFormUpdate({ thirdParties })
      }
    }
  }
}
</script>
