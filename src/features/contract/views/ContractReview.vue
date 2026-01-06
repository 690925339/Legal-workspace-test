<template>
  <div class="smart-page">
    <div class="smart-container">
      <!-- 页面头部 -->
      <div class="smart-header">
        <div class="smart-header-title-row">
          <div class="smart-header-actions">
            <button class="smart-btn-secondary" @click="openHistory">
              <i class="fas fa-history"></i> 历史记录
            </button>
          </div>
          <h1>合同审查，一键开启智能审查</h1>
        </div>
        <p>快速识别合同风险点，提供专业的法律审查建议</p>
      </div>

      <!-- 单文件审查 -->
      <!-- 上传区域 -->
      <div class="smart-card" v-if="!analysisComplete" style="flex: 1; display: flex; flex-direction: column;">
        <div 
          class="smart-upload-zone"
          :class="{ dragging: isDragging }"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @click="triggerFileInput"
          style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; border: 2px dashed #e0e0e0; background: #fafafa;"
        >
          <input 
            type="file" 
            ref="fileInputRef"
            @change="handleFileUpload"
            accept=".pdf,.doc,.docx"
            style="display: none;"
          >
          
          <div class="smart-upload-icon" style="margin-bottom: 24px;">
            <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #999;"></i>
          </div>
          <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">点击或拖拽文件到此区域上传</h3>
          <p style="font-size: 14px; color: #666;">支持格式：PDF、DOC、DOCX，单个文件不超过20MB</p>
        </div>

        <!-- 已上传文件 -->
        <div class="smart-file-info" v-if="uploadedFile">
          <div class="smart-file-icon">
            <i class="fas fa-file-pdf"></i>
          </div>
          <div class="smart-file-details">
            <div class="smart-file-name">{{ fileName }}</div>
            <div class="smart-file-meta">{{ fileSize }}</div>
          </div>
          <button class="smart-btn-secondary" @click.stop="removeFile">
            <i class="fas fa-times"></i> 移除
          </button>
        </div>
      </div>

      <!-- 审查结果 -->
      <div class="smart-result" v-if="analysisComplete">
        <div class="smart-result-header">
          <h3>审查结果 - {{ fileName }}</h3>
          <div class="smart-result-actions">
            <button class="smart-result-btn">
              <i class="fas fa-download"></i> 导出报告
            </button>
            <button class="smart-result-btn" @click="resetState">
              <i class="fas fa-redo"></i> 重新审查
            </button>
          </div>
        </div>
        <div class="smart-risk-list">
          <div 
            v-for="(item, index) in riskItems" 
            :key="index"
            class="smart-risk-item"
          >
            <div :class="['smart-risk-icon', item.type]">
              <i :class="['fas', item.type === 'warning' ? 'fa-exclamation-triangle' : item.type === 'info' ? 'fa-info-circle' : 'fa-check-circle']"></i>
            </div>
            <div class="smart-risk-details">
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 历史记录模态框 -->
    <HistoryModal
      v-model:visible="showHistoryModal"
      title="审查历史"
      :records="historyRecords"
      @select="handleHistorySelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HistoryModal from '@/components/HistoryModal.vue'

const router = useRouter()
const fileInputRef = ref(null)

// State
const activeTab = ref('single')
const uploadedFile = ref(null)
const fileName = ref('')
const fileSize = ref('')
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const isDragging = ref(false)
const showHistoryModal = ref(false)
const historyRecords = ref([])

const riskItems = ref([
  {
    type: 'warning',
    title: '违约责任条款不明确',
    desc: '建议明确违约责任的具体承担方式和赔偿标准'
  },
  {
    type: 'info',
    title: '付款条款建议优化',
    desc: '建议增加付款时间节点和逾期利息条款'
  },
  {
    title: '知识产权条款完善',
    desc: '知识产权归属明确，符合法律规定'
  }
])

// Methods
const switchTab = (tab) => {
  activeTab.value = tab
  resetState()
}

const resetState = () => {
  uploadedFile.value = null
  fileName.value = ''
  fileSize.value = ''
  isAnalyzing.value = false
  analysisComplete.value = false
}

const handleDragEnter = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
}

const handleDragOver = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const processFile = (file) => {
  uploadedFile.value = file
  fileName.value = file.name
  fileSize.value = formatFileSize(file.size)
  // 上传文件后直接跳转到审查结果页
  router.push('/contract-review-result')
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const startAnalysis = () => {
  if (!uploadedFile.value) {
    alert('请先上传合同文件')
    return
  }
  // 跳转到合同审查结果页
  router.push('/contract-review-result')
}

const removeFile = () => {
  uploadedFile.value = null
  fileName.value = ''
  fileSize.value = ''
}

const openHistory = () => {
  // 模拟历史记录数据
  historyRecords.value = [
    { id: 1, title: '房屋租赁合同.docx', date: '2025-12-08T11:00:00', type: '合同审查' },
    { id: 2, title: '劳动合同模板.pdf', date: '2025-12-07T16:20:00', type: '合同审查' },
    { id: 3, title: '技术服务协议.doc', date: '2025-12-06T10:30:00', type: '合同审查' },
    { id: 4, title: '股权转让协议.pdf', date: '2025-12-05T14:15:00', type: '合同审查' },
    { id: 5, title: '采购合同范本.docx', date: '2025-12-04T09:30:00', type: '合同审查' },
    { id: 6, title: '保密协议.pdf', date: '2025-12-03T15:45:00', type: '合同审查' },
    { id: 7, title: '装修工程合同.doc', date: '2025-12-02T11:00:00', type: '合同审查' },
    { id: 8, title: '软件开发合同.pdf', date: '2025-12-01T13:20:00', type: '合同审查' }
  ]
  showHistoryModal.value = true
}

const handleHistorySelect = (_record) => {
  // 跳转到审查结果页
  router.push('/contract-review-result')
}
</script>

<style scoped>
.smart-upload-zone {
  transition: all 0.3s ease;
  cursor: pointer;
}

.smart-upload-zone:hover {
  border-color: #1a73e8 !important;
  background: #f0f7ff !important;
}

.smart-upload-zone.dragging {
  border-color: #1a73e8 !important;
  background: #f0f7ff !important;
  transform: scale(1.02);
}

.smart-file-info {
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.smart-file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdf2f2;
  border-radius: 8px;
  margin-right: 16px;
}

.smart-file-icon i {
  color: #e53e3e;
  font-size: 20px;
}

.smart-file-details {
  flex: 1;
}

.smart-file-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.smart-file-meta {
  font-size: 12px;
  color: #999;
}

.smart-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.smart-result-actions {
  display: flex;
  gap: 12px;
}

.smart-result-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
}

.smart-result-btn:hover {
  color: #1a73e8;
  border-color: #1a73e8;
  background: #f0f7ff;
}

.smart-risk-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.smart-risk-item {
  display: flex;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.smart-risk-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 16px;
  flex-shrink: 0;
}

.smart-risk-icon.warning {
  background: #fff7ed;
  color: #f97316;
}

.smart-risk-icon.info {
  background: #eff6ff;
  color: #3b82f6;
}

.smart-risk-details h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #333;
}

.smart-risk-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
