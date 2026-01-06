<template>
  <div class="modern-card">
    <div class="card-header" style="background: transparent;">
      <div class="card-title">
        <i class="fas fa-file-invoice-dollar" style="margin-right: 8px;"></i>
        生成报价书
      </div>
      <!-- 自动填充按钮 -->
      <button class="smart-btn-secondary smart-btn-sm" @click="autoFillQuote" title="根据案件信息自动填充">
        <i class="fas fa-magic"></i> 自动填充
      </button>
    </div>
    
    <div v-if="!generatedQuote">
      <div class="smart-form-grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="smart-form-group">
          <label class="smart-label required">客户名称</label>
          <input type="text" class="smart-input" v-model="quoteForm.clientName" placeholder="请输入客户名称">
        </div>
        <div class="smart-form-group">
          <label class="smart-label">联系方式</label>
          <input type="text" class="smart-input" v-model="quoteForm.clientContact" placeholder="电话或邮箱">
        </div>
        <div class="smart-form-group">
          <label class="smart-label">案件类型</label>
          <select class="smart-select" v-model="quoteForm.caseType">
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
          <input type="number" class="smart-input" v-model.number="quoteForm.validDays" min="1" max="90">
        </div>
      </div>
      
      <div class="smart-form-group" style="margin-top: 20px;">
        <label class="smart-label required">案件描述</label>
        <textarea class="smart-textarea" v-model="quoteForm.caseDescription" rows="4" placeholder="请简要描述案件情况" style="border: 1px solid #ccc;"></textarea>
      </div>
      
      <div class="smart-form-group" style="margin-top: 20px;">
        <label class="smart-label">服务项目</label>
        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; background: #fafafa;">
          <div v-for="(item, index) in quoteForm.serviceItems" :key="item.id" 
                style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 6px; margin-bottom: 12px; border: 1px solid #e5e5e5;">
            <input type="checkbox" v-model="item.selected" style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer;">
            <div style="flex: 1; margin-right: 12px;">
                <input v-if="item.isCustom" type="text" v-model="item.name" class="smart-input" placeholder="请输入项目名称" style="width: 100%;">
                <div v-else style="font-weight: 500; color: #1a1a1a;">{{ item.name }}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #666;">¥</span>
              <input type="number" v-model.number="item.price" 
                      style="width: 120px; padding: 6px 12px; border: 1px solid #e5e5e5; border-radius: 4px; text-align: right;"
                      :disabled="!item.selected">
              <span style="color: #666;">元/</span>
              <input v-if="item.isCustom" type="text" v-model="item.unit" style="width: 50px; padding: 6px; border: 1px solid #e5e5e5; border-radius: 4px; text-align: center;" placeholder="单位">
              <span v-else style="color: #666; min-width: 30px;">{{ item.unit }}</span>
            </div>
            <button class="icon-btn" style="color: #94a3b8; margin-left: 12px;" @click="removeServiceItem(index)" title="删除此项">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <button class="smart-btn-secondary" style="width: 100%; border-style: dashed;" @click="addServiceItem">
              <i class="fas fa-plus"></i> 添加自定义服务项目
          </button>
        </div>
      </div>
      
      <div class="smart-form-group" style="margin-top: 20px;">
        <label class="smart-label">付款方式</label>
        <input type="text" class="smart-input" v-model="quoteForm.paymentTerms" placeholder="例如：签订委托协议后3个工作日内支付">
      </div>
      
      <div class="smart-form-group" style="margin-top: 20px;">
        <label class="smart-label">备注说明</label>
        <textarea class="smart-textarea" v-model="quoteForm.remarks" rows="3" placeholder="其他需要说明的事项（选填）" style="border: 1px solid #ccc;"></textarea>
      </div>
      
      <div style="margin-top: 24px; display: flex; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #eee;">
        <button 
          class="smart-btn-primary"
          @click="generateQuote"
          :disabled="isGeneratingQuote"
          style="padding: 10px 30px;"
        >
          <i :class="isGeneratingQuote ? 'fas fa-spinner fa-spin' : 'fas fa-file-invoice'"></i>
          {{ isGeneratingQuote ? '生成中...' : '生成报价书' }}
        </button>
      </div>
    </div>
    
    <!-- 生成结果预览 -->
    <div v-else>
      <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; white-space: pre-wrap; font-family: 'SimSun', serif; line-height: 1.8; color: #333; max-height: 600px; overflow-y: auto;">{{ generatedQuote }}</div>
      
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button class="smart-btn-secondary" @click="generatedQuote = null">
          <i class="fas fa-arrow-left"></i> 返回修改
        </button>
        <button class="smart-btn-secondary" @click="copyQuote">
          <i class="fas fa-copy"></i> 复制内容
        </button>
        <button class="smart-btn-primary" @click="downloadQuote">
          <i class="fas fa-download"></i> 下载文书
        </button>
      </div>
    </div>

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
import { ref, defineProps } from 'vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const props = defineProps(['caseData'])

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

const generatedQuote = ref(null)
const isGeneratingQuote = ref(false)

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

const autoFillQuote = () => {
  quoteForm.value.clientName = '华商科技股份有限公司' // 示例数据
  quoteForm.value.clientContact = props.caseData.contactName || ''
  quoteForm.value.caseType = props.caseData.type || '合同纠纷'
  quoteForm.value.caseDescription = props.caseData.description || ''
  showMessage('已自动填充案件信息', 'success')
}

const generateQuote = () => {
  if (!quoteForm.value.clientName.trim()) {
    showMessage('请输入客户名称', 'danger')
    return
  }

  isGeneratingQuote.value = true

  setTimeout(() => {
    const date = new Date().toLocaleDateString('zh-CN')
    const validDate = new Date()
    validDate.setDate(validDate.getDate() + quoteForm.value.validDays)

    let content = '═══════════════════════════════════════\n'
    content += '          报价书\n'
    content += '═══════════════════════════════════════\n\n'
    content += '致：' + quoteForm.value.clientName + '\n'
    content += '联系方式：' + (quoteForm.value.clientContact || '[客户联系方式]') + '\n'
    content += '报价日期：' + date + '\n'
    content += '有效期至：' + validDate.toLocaleDateString('zh-CN') + '\n\n'
    content += '───────────────────────────────────────\n'
    content += '一、案件基本情况\n'
    content += '───────────────────────────────────────\n\n'
    content += '案件类型：' + quoteForm.value.caseType + '\n'
    content += '案件描述：' + (quoteForm.value.caseDescription || '（未填写）') + '\n\n'
    content += '───────────────────────────────────────\n'
    content += '二、服务项目及费用明细\n'
    content += '───────────────────────────────────────\n\n'

    var totalAmount = 0
    var itemIndex = 1
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

    generatedQuote.value = content
    isGeneratingQuote.value = false
  }, 1500)
}

const copyQuote = () => {
  if (generatedQuote.value) {
    navigator.clipboard.writeText(generatedQuote.value)
      .then(() => showMessage('报价书内容已复制到剪贴板', 'success'))
      .catch(() => showMessage('复制失败，请手动复制', 'danger'))
  }
}

const downloadQuote = () => {
  if (generatedQuote.value) {
    const blob = new Blob([generatedQuote.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `法律服务报价书_${quoteForm.value.clientName}_${new Date().toLocaleDateString('zh-CN')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}

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

const removeServiceItem = (index) => {
  quoteForm.value.serviceItems.splice(index, 1)
}
</script>

<style scoped>
.modern-card {
  width: 100%;
}
.smart-form-grid {
  display: grid;
}
</style>
