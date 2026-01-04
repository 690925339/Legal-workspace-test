<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title">产品反馈</div>
        <button class="modal-close" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="smart-form-grid">
          <div class="smart-form-group">
            <label class="smart-label required">反馈类型</label>
            <div class="smart-select-wrapper">
              <select v-model="feedback.type" class="smart-select">
                <option value="feature">功能建议</option>
                <option value="bug">问题反馈</option>
                <option value="improvement">改进建议</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>

          <div class="smart-form-group">
            <label class="smart-label required">标题</label>
            <input 
              type="text" 
              class="smart-input" 
              v-model="feedback.title" 
              placeholder="请简要描述您的问题或建议"
            />
          </div>

          <div class="smart-form-group">
            <label class="smart-label required">详细描述</label>
            <textarea 
              class="smart-textarea" 
              v-model="feedback.description" 
              rows="6" 
              placeholder="请详细描述您遇到的问题或建议，如果是问题反馈，请包含复现步骤。"
            ></textarea>
          </div>

          <div class="smart-form-group">
            <label class="smart-label">附件（截图/文档）</label>
            <div class="upload-zone" @click="triggerFileUpload">
              <i class="fas fa-cloud-upload-alt"></i>
              <div class="upload-hint">点击上传文件，或将文件拖拽至此</div>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileChange" 
              multiple 
              style="display: none;"
            />
            
            <!-- Attachment List -->
            <div v-if="feedback.attachments.length > 0" class="attachment-list">
              <div 
                v-for="(file, index) in feedback.attachments" 
                :key="index" 
                class="attachment-item"
              >
                <span>{{ file.name }}</span>
                <i class="fas fa-times" @click="removeAttachment(index)"></i>
              </div>
            </div>
          </div>

          <div class="smart-form-group">
            <label class="smart-label">联系邮箱（选填）</label>
            <input 
              type="email" 
              class="smart-input" 
              v-model="feedback.email" 
              placeholder="方便我们进一步与您沟通"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="smart-btn-secondary" @click="close">取消</button>
        <button 
          class="smart-btn-primary" 
          @click="submitFeedback" 
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-paper-plane"></i>
          {{ isSubmitting ? '提交中...' : '提交反馈' }}
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="submitSuccess" class="success-toast">
      <i class="fas fa-check-circle"></i>
      感谢您的反馈，我们会尽快处理！
    </div>
  </div>
</template>

<script>
import { getSupabaseClient } from '@/config/supabase.js'
import { authStore } from '@/stores/auth.js'

export default {
  name: 'ProductFeedback',
  
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['close'],
  
  data() {
    return {
      feedback: {
        type: 'feature',
        title: '',
        description: '',
        email: '',
        attachments: []
      },
      isSubmitting: false,
      submitSuccess: false,
      authStore
    }
  },
  
  methods: {
    close() {
      this.$emit('close')
    },
    
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileChange(event) {
      const files = Array.from(event.target.files)
      this.feedback.attachments = [...this.feedback.attachments, ...files]
    },
    
    removeAttachment(index) {
      this.feedback.attachments.splice(index, 1)
    },
    
    async submitFeedback() {
      if (!this.feedback.title || !this.feedback.title.trim()) {
        alert('请填写标题')
        return
      }

      if (!this.feedback.description || !this.feedback.description.trim()) {
        alert('请填写详细描述')
        return
      }

      this.isSubmitting = true

      try {
        const supabase = getSupabaseClient()
        const userId = authStore.state.user?.id

        if (!userId) {
          alert('请先登录')
          this.isSubmitting = false
          return
        }

        const browserInfo = navigator.userAgent
        const pageUrl = window.location.href

        const feedbackData = {
          user_id: userId,
          type: this.feedback.type,
          title: this.feedback.title.trim(),
          description: this.feedback.description.trim(),
          user_email: this.feedback.email || authStore.state.user?.email || '',
          user_name: authStore.state.user?.user_metadata?.full_name || authStore.state.user?.email?.split('@')[0] || '匿名用户',
          browser_info: browserInfo,
          page_url: pageUrl,
          status: 'pending',
          priority: 'medium'
        }

        const { error } = await supabase
          .from('product_feedback')
          .insert([feedbackData])
          .select()

        if (error) {
          console.error('Error submitting feedback:', error)
          alert('提交失败，请重试：' + error.message)
          this.isSubmitting = false
          return
        }

        this.isSubmitting = false
        this.submitSuccess = true

        setTimeout(() => {
          this.submitSuccess = false
          this.feedback = {
            type: 'feature',
            title: '',
            description: '',
            email: '',
            attachments: []
          }
          this.close()
        }, 2000)

      } catch (err) {
        console.error('Failed to submit feedback:', err)
        alert('提交失败，请重试')
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.modal-container {
  width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.smart-form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.smart-textarea {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.smart-textarea:focus {
  outline: none;
  border-color: var(--primary, #1a73e8);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.upload-zone {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.upload-zone i {
  font-size: 24px;
  color: #9ca3af;
  margin-bottom: 8px;
  display: block;
}

.upload-hint {
  color: #6b7280;
  font-size: 14px;
}

.attachment-list {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-item {
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.attachment-item i {
  cursor: pointer;
  color: #9ca3af;
}

.attachment-item i:hover {
  color: #dc2626;
}

.smart-btn-primary i {
  margin-right: 8px;
}

.smart-btn-primary {
  min-width: 120px;
}

.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
