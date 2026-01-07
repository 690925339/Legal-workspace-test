<template>
  <div class="smart-page">
    <div class="smart-container">
      <!-- 页面头部 -->
      <div class="smart-header">
        <div class="smart-header-title-row">
          <div class="smart-header-actions">
            <button class="smart-btn-secondary" @click="openHistory">
              <i class="fas fa-history" /> 历史记录
            </button>
          </div>
          <h1>文书生成，一键生成专属法律文书</h1>
        </div>
        <p>根据案情描述，自动总结法律诉求并撰写法律文书</p>

        <!-- 标签切换 -->
        <div class="smart-tabs">
          <button
            v-for="type in types"
            :key="type.id"
            :class="['smart-tab-btn', { active: activeType === type.id }]"
            @click="switchDocType(type.id)"
          >
            {{ type.name }}
          </button>
        </div>
      </div>

      <!-- 输入区域 -->
      <div v-if="!generatedDoc" class="smart-card">
        <!-- 报价书表单 -->
        <div v-if="activeType === 'quote'" style="padding: 24px">
          <div class="smart-form-grid" style="grid-template-columns: 1fr 1fr; gap: 20px">
            <div class="smart-form-group">
              <label class="smart-label required">客户名称</label>
              <input
                v-model="quoteForm.clientName"
                type="text"
                class="smart-input"
                placeholder="请输入客户名称"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">联系方式</label>
              <input
                v-model="quoteForm.clientContact"
                type="text"
                class="smart-input"
                placeholder="电话或邮箱"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">案件类型</label>
              <select v-model="quoteForm.caseType" class="smart-select">
                <option>合同纠纷</option>
                <option>劳动争议</option>
                <option>知识产权</option>
                <option>公司法务</option>
                <option>刑事辩护</option>
                <option>其他</option>
              </select>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">有效期（天）</label>
              <input
                v-model.number="quoteForm.validDays"
                type="number"
                class="smart-input"
                min="1"
                max="90"
              />
            </div>
          </div>

          <div class="smart-form-group" style="margin-top: 20px">
            <label class="smart-label required">案件描述</label>
            <textarea
              v-model="quoteForm.caseDescription"
              class="smart-textarea"
              rows="4"
              placeholder="请简要描述案件情况"
              style="border: 1px solid #ccc"
            />
          </div>

          <div class="smart-form-group" style="margin-top: 20px">
            <label class="smart-label">服务项目</label>
            <div
              style="
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                padding: 16px;
                background: #fafafa;
              "
            >
              <div
                v-for="(item, index) in quoteForm.serviceItems"
                :key="item.id"
                style="
                  display: flex;
                  align-items: center;
                  padding: 12px;
                  background: white;
                  border-radius: 6px;
                  margin-bottom: 12px;
                  border: 1px solid #e5e5e5;
                "
              >
                <input
                  v-model="item.selected"
                  type="checkbox"
                  style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer"
                />

                <div style="flex: 1; margin-right: 12px">
                  <input
                    v-if="item.isCustom"
                    v-model="item.name"
                    type="text"
                    class="smart-input"
                    placeholder="请输入项目名称"
                    style="width: 100%"
                  />
                  <div v-else style="font-weight: 500; color: #1a1a1a">
                    {{ item.name }}
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px">
                  <span style="color: #666">¥</span>
                  <input
                    v-model.number="item.price"
                    type="number"
                    style="
                      width: 120px;
                      padding: 6px 12px;
                      border: 1px solid #e5e5e5;
                      border-radius: 4px;
                      text-align: right;
                    "
                    :disabled="!item.selected"
                  />
                  <span style="color: #666">元/</span>
                  <input
                    v-if="item.isCustom"
                    v-model="item.unit"
                    type="text"
                    style="
                      width: 50px;
                      padding: 6px;
                      border: 1px solid #e5e5e5;
                      border-radius: 4px;
                      text-align: center;
                    "
                    placeholder="单位"
                  />
                  <span v-else style="color: #666; min-width: 30px">{{ item.unit }}</span>
                </div>

                <button
                  class="smart-btn-secondary"
                  style="
                    margin-left: 12px;
                    padding: 6px 10px;
                    color: #94a3b8;
                    border: none;
                    background: transparent;
                  "
                  title="删除此项"
                  @click="removeServiceItem(index)"
                >
                  <i class="fas fa-trash-alt" />
                </button>
              </div>

              <button
                class="smart-btn-secondary"
                style="width: 100%; border-style: dashed"
                @click="addServiceItem"
              >
                <i class="fas fa-plus" /> 添加自定义服务项目
              </button>
            </div>
          </div>

          <div class="smart-form-group" style="margin-top: 20px">
            <label class="smart-label">付款方式</label>
            <input
              v-model="quoteForm.paymentTerms"
              type="text"
              class="smart-input"
              placeholder="例如：签订委托协议后3个工作日内支付"
            />
          </div>

          <div class="smart-form-group" style="margin-top: 20px">
            <label class="smart-label">备注说明</label>
            <textarea
              v-model="quoteForm.remarks"
              class="smart-textarea"
              rows="3"
              placeholder="其他需要说明的事项（选填）"
              style="border: 1px solid #ccc"
            />
          </div>

          <div style="margin-top: 24px; display: flex; justify-content: flex-end">
            <button
              class="smart-btn-primary"
              :disabled="isGenerating"
              style="min-width: 140px"
              @click="generateDocument"
            >
              <i :class="isGenerating ? 'fas fa-spinner fa-spin' : 'fas fa-file-invoice'" />
              {{ isGenerating ? '生成中...' : '生成报价书' }}
            </button>
          </div>
        </div>

        <!-- 起诉状/答辩状表单 -->
        <div v-else>
          <textarea
            v-model="inputText"
            class="smart-textarea"
            :placeholder="
              activeType === 'complaint'
                ? '请您尽可能详细地描述案情事实和法律诉求，包括原告和被告的身份信息，事情发生的时间、地点、起因、经过和结果信息等。'
                : '请您尽可能详细地描述答辩理由，包括对原告诉讼请求的意见、事实依据和法律依据等。'
            "
          />

          <div class="smart-card-footer">
            <div class="smart-tips">
              <i class="fas fa-lightbulb" />
              <span>提示：描述越详细，生成的文书质量越高</span>
            </div>
            <button
              class="smart-btn-primary"
              :disabled="isGenerating || !inputText.trim()"
              @click="generateDocument"
            >
              <i :class="isGenerating ? 'fas fa-spinner fa-spin' : 'fas fa-magic'" />
              {{ isGenerating ? '生成中...' : '立即撰写' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 生成结果 -->
      <div v-else class="smart-result">
        <div class="smart-result-header">
          <h3>{{ generatedDoc.title }}</h3>
          <div class="smart-result-actions">
            <button class="smart-result-btn" @click="copyDocument">
              <i class="fas fa-copy" /> 复制
            </button>
            <button class="smart-result-btn" @click="downloadDocument">
              <i class="fas fa-download" /> 下载
            </button>
            <button class="smart-result-btn" @click="resetDocument">
              <i class="fas fa-redo" /> 重新生成
            </button>
          </div>
        </div>
        <div class="smart-result-content">
          <pre>{{ generatedDoc.content }}</pre>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="smart-footer-info">
        <i class="fas fa-info-circle" />
        <span>生成的文书仅供参考，请根据实际情况进行修改</span>
      </div>
    </div>

    <!-- 历史记录模态框 -->
    <HistoryModal
      v-model:visible="showHistoryModal"
      title="生成历史"
      :records="historyRecords"
      :tabs="['起诉状', '答辩状', '报价书']"
      @select="handleHistorySelect"
    />

    <ConfirmModal
      :is-open="modalState.visible"
      :title="modalState.title"
      :message="modalState.message"
      :type="modalState.type"
      :show-cancel="modalState.showCancel"
      :confirm-text="modalState.confirmText"
      @confirm="handleModalConfirm"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HistoryModal from '@/components/HistoryModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

// State
const activeType = ref('complaint')
const types = [
  { id: 'complaint', name: '起诉状' },
  { id: 'defense', name: '答辩状' },
  { id: 'quote', name: '报价书' }
]
const inputText = ref('')
const isGenerating = ref(false)
const generatedDoc = ref(null)
const showHistoryModal = ref(false)
const historyRecords = ref([])

const modalState = ref({
  visible: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: false,
  confirmText: '确定',
  onConfirm: null
})

const showMessage = (message, type = 'info') => {
  modalState.value = {
    visible: true,
    title: type === 'danger' ? '提示' : '成功',
    message,
    type,
    showCancel: false,
    confirmText: '确定',
    onConfirm: null
  }
}

const closeModal = () => {
  modalState.value.visible = false
}

const handleModalConfirm = () => {
  if (modalState.value.onConfirm) {
    modalState.value.onConfirm()
  }
  closeModal()
}

const quoteForm = ref({
  clientName: '',
  clientContact: '',
  caseType: '合同纠纷',
  caseDescription: '',
  serviceItems: [
    { id: 1, name: '法律咨询服务', price: 5000, unit: '次', selected: true },
    { id: 2, name: '诉讼代理费（一审）', price: 30000, unit: '件', selected: true },
    { id: 3, name: '证据收集与整理', price: 8000, unit: '项', selected: false },
    { id: 4, name: '法律文书起草', price: 3000, unit: '份', selected: false }
  ],
  validDays: 30,
  paymentTerms: '签订委托协议后3个工作日内支付',
  remarks: ''
})

const addServiceItem = () => {
  quoteForm.value.serviceItems.push({
    id: Date.now(),
    name: '',
    price: 1000,
    unit: '项',
    selected: true,
    isCustom: true
  })
}

const removeServiceItem = index => {
  quoteForm.value.serviceItems.splice(index, 1)
}

// Methods
const switchDocType = typeId => {
  activeType.value = typeId
  generatedDoc.value = null
}

const getMockDocument = type => {
  let content = ''
  const date = new Date().toLocaleDateString('zh-CN')
  const validDate = new Date()
  validDate.setDate(validDate.getDate() + quoteForm.value.validDays)

  if (type === 'complaint') {
    content = '原告：[原告姓名/公司名称]\n'
    content += '住所地：[地址]\n'
    content += '法定代表人：[姓名]，职务：[职务]\n\n'
    content += '被告：[被告姓名/公司名称]\n'
    content += '住所地：[地址]\n'
    content += '法定代表人：[姓名]，职务：[职务]\n\n'
    content += '诉讼请求：\n'
    content += '一、判令被告向原告支付欠款人民币____元；\n'
    content += '二、判令被告支付逾期付款利息____元；\n'
    content += '三、判令被告承担本案全部诉讼费用。\n\n'
    content += '事实与理由：\n'
    content += inputText.value + '\n\n'
    content +=
      '综上所述，被告的行为已构成违约，严重损害了原告的合法权益。为维护原告的合法权益，特依据《中华人民共和国民事诉讼法》相关规定，向贵院提起诉讼，恳请贵院依法支持原告的诉讼请求。\n\n'
    content += '此致\n'
    content += '[受理法院名称]\n\n'
    content += '具状人：[原告名称]\n'
    content += '日期：' + date
  } else if (type === 'defense') {
    content = '答辩人：[答辩人姓名/公司名称]\n'
    content += '住所地：[地址]\n'
    content += '法定代表人：[姓名]，职务：[职务]\n\n'
    content += '被答辩人：[被答辩人姓名/公司名称]\n'
    content += '住所地：[地址]\n\n'
    content += '答辩请求：\n'
    content += '一、请求依法驳回被答辩人的全部诉讼请求；\n'
    content += '二、本案诉讼费用由被答辩人承担。\n\n'
    content += '事实与理由：\n'
    content += inputText.value + '\n\n'
    content +=
      '综上所述，被答辩人的诉讼请求缺乏事实和法律依据，恳请贵院依法驳回其全部诉讼请求。\n\n'
    content += '此致\n'
    content += '[受理法院名称]\n\n'
    content += '答辩人：[答辩人名称]\n'
    content += '日期：' + date
  } else if (type === 'quote') {
    content = '═══════════════════════════════════════\n'
    content += '          法律服务报价书\n'
    content += '═══════════════════════════════════════\n\n'
    content += '致：' + quoteForm.value.clientName + '\n'
    content += '联系方式：' + (quoteForm.value.clientContact || '[客户联系方式]') + '\n'
    content += '报价日期：' + date + '\n'
    content += '有效期至：' + validDate.toLocaleDateString('zh-CN') + '\n\n'
    content += '───────────────────────────────────────\n'
    content += '一、案件基本情况\n'
    content += '───────────────────────────────────────\n\n'
    content += '案件类型：' + quoteForm.value.caseType + '\n'
    content += '案件描述：' + quoteForm.value.caseDescription + '\n\n'
    content += '───────────────────────────────────────\n'
    content += '二、服务项目及费用明细\n'
    content += '───────────────────────────────────────\n\n'

    let totalAmount = 0
    let itemIndex = 1
    quoteForm.value.serviceItems.forEach(item => {
      if (item.selected) {
        content += itemIndex + '. ' + item.name + '\n'
        content += '   收费标准：¥' + item.price.toLocaleString() + ' 元/' + item.unit + '\n\n'
        totalAmount += item.price
        itemIndex++
      }
    })

    content += '───────────────────────────────────────\n'
    content += '费用合计：¥' + totalAmount.toLocaleString() + ' 元\n'
    content += '───────────────────────────────────────\n\n'
    content += '三、付款方式\n\n'
    content += quoteForm.value.paymentTerms + '\n\n'
    content += '四、服务承诺\n\n'
    content += '1. 本所将指派专业律师团队为您提供优质法律服务；\n'
    content += '2. 严格遵守律师执业规范和职业道德；\n'
    content += '3. 及时向委托人通报案件进展情况；\n'
    content += '4. 保守委托人商业秘密和个人隐私。\n\n'

    if (quoteForm.value.remarks) {
      content += '五、备注说明\n\n'
      content += quoteForm.value.remarks + '\n\n'
    }

    content += '───────────────────────────────────────\n\n'
    content += '报价单位：ALPHA&LEADER 安华理达律师事务所\n'
    content += '联系电话：[律所电话]\n'
    content += '电子邮箱：[律所邮箱]\n'
    content += '地址：[律所地址]\n\n'
    content += '本报价书自出具之日起' + quoteForm.value.validDays + '日内有效。\n'
  }
  return content
}

const generateDocument = () => {
  // 报价书验证
  if (activeType.value === 'quote') {
    if (!quoteForm.value.clientName.trim()) {
      showMessage('请输入客户名称', 'danger')
      return
    }
    if (!quoteForm.value.caseDescription.trim()) {
      showMessage('请输入案件描述', 'danger')
      return
    }
  } else {
    if (!inputText.value.trim()) {
      showMessage('请输入案情描述', 'danger')
      return
    }
  }

  isGenerating.value = true

  setTimeout(() => {
    let docType = ''
    if (activeType.value === 'complaint') {
      docType = '起诉状'
    } else if (activeType.value === 'defense') {
      docType = '答辩状'
    } else if (activeType.value === 'quote') {
      docType = '报价书'
    }

    generatedDoc.value = {
      title: activeType.value === 'quote' ? docType : '民事' + docType,
      content: getMockDocument(activeType.value)
    }
    isGenerating.value = false
  }, 2000)
}

const copyDocument = () => {
  if (generatedDoc.value) {
    navigator.clipboard.writeText(generatedDoc.value.content)
    showMessage('文书内容已复制到剪贴板')
  }
}

const downloadDocument = () => {
  if (generatedDoc.value) {
    const blob = new Blob([generatedDoc.value.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = generatedDoc.value.title + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const resetDocument = () => {
  generatedDoc.value = null
}

const openHistory = () => {
  historyRecords.value = [
    { id: 1, title: '民事起诉状 - 借款合同纠纷', date: '2025-12-08T10:15:00', type: '起诉状' },
    { id: 2, title: '民事答辩状 - 房屋租赁纠纷', date: '2025-12-07T15:30:00', type: '答辩状' },
    { id: 3, title: '报价书 - ABC公司合同纠纷', date: '2025-12-07T14:20:00', type: '报价书' },
    { id: 4, title: '民事起诉状 - 劳动争议', date: '2025-12-06T09:45:00', type: '起诉状' },
    { id: 5, title: '民事答辩状 - 侵权责任纠纷', date: '2025-12-05T14:20:00', type: '答辩状' },
    { id: 6, title: '报价书 - 知识产权诉讼', date: '2025-12-05T10:30:00', type: '报价书' },
    { id: 7, title: '民事起诉状 - 离婚纠纷', date: '2025-12-04T16:00:00', type: '起诉状' },
    { id: 8, title: '民事答辩状 - 交通事故', date: '2025-12-03T11:10:00', type: '答辩状' }
  ]
  showHistoryModal.value = true
}

const handleHistorySelect = record => {
  if (record.type === '起诉状') {
    activeType.value = 'complaint'
  } else if (record.type === '答辩状') {
    activeType.value = 'defense'
  } else if (record.type === '报价书') {
    activeType.value = 'quote'
  }

  inputText.value = record.title + '的相关案情描述...'

  generatedDoc.value = {
    title: record.title,
    content: getMockDocument(activeType.value)
  }
}
</script>

<style scoped>
/* Scoped styles can be added here if needed to replace inline styles */
.smart-form-grid {
  display: grid;
}
</style>
