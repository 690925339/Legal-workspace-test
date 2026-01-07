<template>
  <CaseModuleLayout :case-id="caseId" active-module="stakeholders" @case-loaded="onCaseLoaded">
    <div class="tab-pane">
      <!-- 原告和被告并排显示 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px">
        <!-- 原告列 -->
        <div class="modern-card">
          <div class="card-header" style="background: transparent">
            <div class="card-title">原告（我方客户）</div>
            <button
              class="smart-btn-secondary"
              style="font-size: 13px; padding: 4px 12px"
              @click="addStakeholder('plaintiff')"
            >
              <i class="fas fa-plus" /> 添加
            </button>
          </div>
          <div
            v-for="(plaintiff, index) in stakeholders.plaintiffs"
            :key="plaintiff.id"
            :style="{
              borderTop: index > 0 ? '1px solid #e5e5e5' : 'none',
              paddingTop: index > 0 ? '16px' : '0',
              marginTop: index > 0 ? '16px' : '0'
            }"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <div style="font-weight: 600; font-size: 15px; color: #1a1a1a">
                {{ plaintiff.name }}
                <span
                  style="
                    display: inline-block;
                    background: #eef2ff;
                    color: #4f46e5;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-left: 8px;
                  "
                >
                  {{ plaintiff.type === 'person' ? '自然人' : '法人' }}
                </span>
              </div>
              <div style="display: flex; gap: 8px">
                <button class="icon-btn" @click="editStakeholder('plaintiff', plaintiff)">
                  <i class="fas fa-edit" />
                </button>
                <button
                  class="icon-btn"
                  style="color: #dc2626"
                  @click="deleteStakeholder('plaintiff', plaintiff.id)"
                >
                  <i class="fas fa-trash-alt" />
                </button>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px">
              <div v-if="plaintiff.type === 'person' && plaintiff.idNumber" class="info-row">
                <span class="label">身份证号</span>
                <span class="value">{{ plaintiff.idNumber }}</span>
              </div>
              <div v-if="plaintiff.type === 'company' && plaintiff.creditCode" class="info-row">
                <span class="label">信用代码</span>
                <span class="value">{{ plaintiff.creditCode }}</span>
              </div>
              <div v-if="plaintiff.phone" class="info-row">
                <span class="label">联系电话</span>
                <span class="value">{{ plaintiff.phone }}</span>
              </div>
              <div v-if="plaintiff.address" class="info-row" style="grid-column: span 2">
                <span class="label">地址</span>
                <span class="value">{{ plaintiff.address }}</span>
              </div>
            </div>
            <div
              v-if="plaintiff.contactName"
              style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e5e5"
            >
              <div style="font-size: 13px; color: #888; margin-bottom: 8px">
                <i class="fas fa-address-book" style="margin-right: 6px" />联系人
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px">
                <div class="info-row">
                  <span class="label">姓名</span>
                  <span class="value">{{ plaintiff.contactName }}</span>
                </div>
                <div v-if="plaintiff.contactRole" class="info-row">
                  <span class="label">职位</span>
                  <span class="value">{{ plaintiff.contactRole }}</span>
                </div>
                <div v-if="plaintiff.contactPhone" class="info-row">
                  <span class="label">电话</span>
                  <span class="value">{{ plaintiff.contactPhone }}</span>
                </div>
                <div v-if="plaintiff.contactEmail" class="info-row">
                  <span class="label">邮箱</span>
                  <span class="value">{{ plaintiff.contactEmail }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="stakeholders.plaintiffs.length === 0"
            style="text-align: center; padding: 32px 16px; color: #999"
          >
            <i
              class="fas fa-user-plus"
              style="font-size: 28px; margin-bottom: 12px; opacity: 0.3"
            />
            <div style="font-size: 14px">点击上方按钮添加原告</div>
          </div>
        </div>

        <!-- 被告列 -->
        <div class="modern-card">
          <div class="card-header" style="background: transparent">
            <div class="card-title">被告</div>
            <button
              class="smart-btn-secondary"
              style="font-size: 13px; padding: 4px 12px"
              @click="addStakeholder('defendant')"
            >
              <i class="fas fa-plus" /> 添加
            </button>
          </div>
          <div
            v-for="(defendant, index) in stakeholders.defendants"
            :key="defendant.id"
            :style="{
              borderTop: index > 0 ? '1px solid #e5e5e5' : 'none',
              paddingTop: index > 0 ? '16px' : '0',
              marginTop: index > 0 ? '16px' : '0'
            }"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <div style="font-weight: 600; font-size: 15px; color: #1a1a1a">
                {{ defendant.name }}
                <span
                  style="
                    display: inline-block;
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-left: 8px;
                  "
                >
                  {{ defendant.type === 'person' ? '自然人' : '法人' }}
                </span>
              </div>
              <div style="display: flex; gap: 8px">
                <button class="icon-btn" @click="editStakeholder('defendant', defendant)">
                  <i class="fas fa-edit" />
                </button>
                <button
                  class="icon-btn"
                  style="color: #dc2626"
                  @click="deleteStakeholder('defendant', defendant.id)"
                >
                  <i class="fas fa-trash-alt" />
                </button>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px">
              <div
                v-if="defendant.type === 'company' && defendant.legalRepresentative"
                class="info-row"
              >
                <span class="label">法定代表人</span>
                <span class="value">{{ defendant.legalRepresentative }}</span>
              </div>
              <div v-if="defendant.type === 'company' && defendant.creditCode" class="info-row">
                <span class="label">信用代码</span>
                <span class="value">{{ defendant.creditCode }}</span>
              </div>
              <div v-if="defendant.type === 'person' && defendant.idNumber" class="info-row">
                <span class="label">身份证号</span>
                <span class="value">{{ defendant.idNumber }}</span>
              </div>
              <div v-if="defendant.lawyer" class="info-row">
                <span class="label">对方律师</span>
                <span class="value">{{ defendant.lawyer }}</span>
              </div>
              <div v-if="defendant.address" class="info-row" style="grid-column: span 2">
                <span class="label">地址</span>
                <span class="value">{{ defendant.address }}</span>
              </div>
            </div>
            <div
              v-if="defendant.contactName"
              style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e5e5"
            >
              <div style="font-size: 13px; color: #888; margin-bottom: 8px">
                <i class="fas fa-address-book" style="margin-right: 6px" />联系人
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px">
                <div class="info-row">
                  <span class="label">姓名</span>
                  <span class="value">{{ defendant.contactName }}</span>
                </div>
                <div v-if="defendant.contactRole" class="info-row">
                  <span class="label">职位</span>
                  <span class="value">{{ defendant.contactRole }}</span>
                </div>
                <div v-if="defendant.contactPhone" class="info-row">
                  <span class="label">电话</span>
                  <span class="value">{{ defendant.contactPhone }}</span>
                </div>
                <div v-if="defendant.contactEmail" class="info-row">
                  <span class="label">邮箱</span>
                  <span class="value">{{ defendant.contactEmail }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="stakeholders.defendants.length === 0"
            style="text-align: center; padding: 32px 16px; color: #999"
          >
            <i
              class="fas fa-user-plus"
              style="font-size: 28px; margin-bottom: 12px; opacity: 0.3"
            />
            <div style="font-size: 14px">点击上方按钮添加被告</div>
          </div>
        </div>
      </div>

      <!-- 第三人列表 -->
      <div v-if="stakeholders.thirdParties.length > 0" class="modern-card">
        <div class="card-header" style="background: transparent">
          <div class="card-title">第三人</div>
          <button
            class="smart-btn-secondary"
            style="font-size: 13px; padding: 4px 12px"
            @click="addStakeholder('thirdParty')"
          >
            <i class="fas fa-plus" /> 添加
          </button>
        </div>
        <div
          v-for="(thirdParty, index) in stakeholders.thirdParties"
          :key="thirdParty.id"
          :style="{
            borderTop: index > 0 ? '1px solid #e5e5e5' : 'none',
            paddingTop: index > 0 ? '16px' : '0',
            marginTop: index > 0 ? '16px' : '0'
          }"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            "
          >
            <div style="font-weight: 600; font-size: 15px; color: #1a1a1a">
              {{ thirdParty.name }}
              <span
                style="
                  display: inline-block;
                  background: #fef3c7;
                  color: #d97706;
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 500;
                  margin-left: 8px;
                "
              >
                {{ thirdParty.type === 'person' ? '自然人' : '法人' }}
              </span>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="icon-btn" @click="editStakeholder('thirdParty', thirdParty)">
                <i class="fas fa-edit" />
              </button>
              <button
                class="icon-btn"
                style="color: #dc2626"
                @click="deleteStakeholder('thirdParty', thirdParty.id)"
              >
                <i class="fas fa-trash-alt" />
              </button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px">
            <div v-if="thirdParty.type === 'person' && thirdParty.idNumber" class="info-row">
              <span class="label">身份证号</span>
              <span class="value">{{ thirdParty.idNumber }}</span>
            </div>
            <div v-if="thirdParty.type === 'company' && thirdParty.creditCode" class="info-row">
              <span class="label">信用代码</span>
              <span class="value">{{ thirdParty.creditCode }}</span>
            </div>
            <div v-if="thirdParty.phone" class="info-row">
              <span class="label">联系电话</span>
              <span class="value">{{ thirdParty.phone }}</span>
            </div>
            <div v-if="thirdParty.address" class="info-row" style="grid-column: span 2">
              <span class="label">地址</span>
              <span class="value">{{ thirdParty.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加第三人按钮（当没有第三人时） -->
      <div v-if="stakeholders.thirdParties.length === 0" style="text-align: center; padding: 16px">
        <button
          class="smart-btn-secondary"
          style="font-size: 14px; padding: 8px 20px"
          @click="addStakeholder('thirdParty')"
        >
          <i class="fas fa-plus" /> 添加第三人
        </button>
      </div>
    </div>

    <!-- Stakeholder Modal -->
    <div
      v-if="showStakeholderModal"
      class="modal-overlay"
      @click.self="showStakeholderModal = false"
    >
      <div class="modal-container" style="width: 600px">
        <div class="modal-header">
          <div class="modal-title">
            {{ currentStakeholder.id ? '编辑' : '添加' }}{{ currentStakeholder.role }}
          </div>
          <button class="modal-close" @click="showStakeholderModal = false">
            <i class="fas fa-times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="smart-form-group">
            <label class="smart-label">主体类型</label>
            <div style="display: flex; gap: 16px">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer">
                <input v-model="currentStakeholder.type" type="radio" value="person" />
                <span>自然人</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer">
                <input v-model="currentStakeholder.type" type="radio" value="company" />
                <span>法人/组织</span>
              </label>
            </div>
          </div>

          <div class="smart-form-group">
            <label class="smart-label required">{{
              currentStakeholder.type === 'company' ? '公司名称' : '姓名'
            }}</label>
            <input
              v-model="currentStakeholder.name"
              type="text"
              class="smart-input"
              :placeholder="currentStakeholder.type === 'company' ? '请输入公司全称' : '请输入姓名'"
            />
          </div>

          <!-- 自然人特有字段 -->
          <template v-if="currentStakeholder.type === 'person'">
            <div class="smart-form-group">
              <label class="smart-label">身份证号</label>
              <input
                v-model="currentStakeholder.idNumber"
                type="text"
                class="smart-input"
                placeholder="请输入身份证号"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">联系电话</label>
              <input
                v-model="currentStakeholder.phone"
                type="text"
                class="smart-input"
                placeholder="请输入联系电话"
              />
            </div>
          </template>

          <!-- 公司特有字段 -->
          <template v-if="currentStakeholder.type === 'company'">
            <div class="smart-form-group">
              <label class="smart-label">统一信用代码</label>
              <input
                v-model="currentStakeholder.creditCode"
                type="text"
                class="smart-input"
                placeholder="请输入统一社会信用代码"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">法定代表人</label>
              <input
                v-model="currentStakeholder.legalRepresentative"
                type="text"
                class="smart-input"
                placeholder="请输入法定代表人姓名"
              />
            </div>
          </template>

          <div class="smart-form-group">
            <label class="smart-label">地址</label>
            <input
              v-model="currentStakeholder.address"
              type="text"
              class="smart-input"
              placeholder="请输入联系地址"
            />
          </div>

          <div v-if="stakeholderType !== 'plaintiff'" class="smart-form-group">
            <label class="smart-label">代理律师</label>
            <input
              v-model="currentStakeholder.lawyer"
              type="text"
              class="smart-input"
              placeholder="请输入对方代理律师信息"
            />
          </div>

          <!-- 联系人信息 -->
          <div style="border-top: 1px solid #e5e5e5; margin: 16px 0; padding-top: 16px">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #666">
              <i class="fas fa-address-book" style="margin-right: 8px" />联系人信息
            </div>
          </div>
          <div class="smart-form-group">
            <label class="smart-label">联系人姓名</label>
            <input
              v-model="currentStakeholder.contactName"
              type="text"
              class="smart-input"
              placeholder="请输入联系人姓名"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">联系人职位</label>
            <input
              v-model="currentStakeholder.contactRole"
              type="text"
              class="smart-input"
              placeholder="请输入职位或角色"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">联系人电话</label>
            <input
              v-model="currentStakeholder.contactPhone"
              type="text"
              class="smart-input"
              placeholder="请输入联系电话"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">联系人邮箱</label>
            <input
              v-model="currentStakeholder.contactEmail"
              type="email"
              class="smart-input"
              placeholder="请输入邮箱地址"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showStakeholderModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveStakeholder">
            <i class="fas fa-save" /> 保存
          </button>
        </div>
      </div>
    </div>
    <!-- Global Confirm Modal -->
    <ConfirmModal
      :is-open="confirmState.visible"
      :title="confirmState.title"
      :message="confirmState.message"
      :type="confirmState.type"
      @confirm="handleConfirm"
      @cancel="closeConfirm"
    />
  </CaseModuleLayout>
</template>

<script>
import { computed, watch, ref } from 'vue'
import CaseModuleLayout from '@/components/case/CaseModuleLayout.js'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useCaseData, useModal, useStakeholders } from '@/features/case/composables'

export default {
  name: 'CaseStakeholders',

  components: {
    CaseModuleLayout,
    ConfirmModal
  },

  setup() {
    // 1. 案件上下文
    const { caseId, caseData, onCaseLoaded } = useCaseData()

    // 2. 模态框管理
    const { openModal, closeModal, isModalOpen } = useModal()

    const showStakeholderModal = computed({
      get: () => isModalOpen('stakeholder'),
      set: val => (val ? openModal('stakeholder') : closeModal('stakeholder'))
    })

    // 3. 当事人管理（不传初始数据，从数据库加载）
    const {
      stakeholders,
      currentStakeholder,
      stakeholderType,
      loading,
      loadStakeholders,
      addStakeholder: _addStakeholder,
      editStakeholder: _editStakeholder,
      deleteStakeholder: _deleteStakeholder,
      saveStakeholder: _saveStakeholder
    } = useStakeholders()

    // 监听 caseId 变化，加载真实数据
    watch(
      () => caseId.value,
      newCaseId => {
        if (newCaseId) {
          loadStakeholders(newCaseId)
        }
      },
      { immediate: true }
    )

    // 包装交互逻辑
    const addStakeholder = type => {
      _addStakeholder(type)
      openModal('stakeholder')
    }

    const editStakeholder = (type, stakeholder) => {
      _editStakeholder(type, stakeholder)
      openModal('stakeholder')
    }

    // 4. 通用确认弹窗逻辑
    const confirmState = ref({
      visible: false,
      title: '确认',
      message: '',
      type: 'info',
      resolve: null,
      reject: null
    })

    const showConfirm = ({ title, message, type = 'danger' }) => {
      return new Promise((resolve, reject) => {
        confirmState.value = {
          visible: true,
          title,
          message,
          type,
          resolve,
          reject
        }
      })
    }

    const handleConfirm = () => {
      if (confirmState.value.resolve) {
        confirmState.value.resolve(true)
      }
      closeConfirm()
    }

    const closeConfirm = () => {
      confirmState.value = {
        visible: false,
        title: '',
        message: '',
        type: 'info',
        resolve: null,
        reject: null
      }
    }

    const deleteStakeholder = async (type, id) => {
      try {
        await showConfirm({
          title: '删除确认',
          message: '确定要删除该当事人吗？此操作无法撤销。',
          type: 'danger'
        })

        try {
          await _deleteStakeholder(type, id, caseId.value)
        } catch (e) {
          alert('删除失败: ' + e.message)
        }
      } catch (e) {
        // 用户取消
      }
    }

    const saveStakeholder = async () => {
      try {
        await _saveStakeholder(caseId.value)
        closeModal('stakeholder')
      } catch (e) {
        alert(e.message)
      }
    }

    return {
      caseId,
      caseData,
      onCaseLoaded,
      stakeholders,
      currentStakeholder,
      stakeholderType,
      loading,
      addStakeholder,
      editStakeholder,
      deleteStakeholder,
      saveStakeholder,
      showStakeholderModal,
      confirmState,
      handleConfirm,
      closeConfirm
    }
  }
}
</script>
