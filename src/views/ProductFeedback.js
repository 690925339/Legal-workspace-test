import { router } from '../router.js';

export default {
    name: 'ProductFeedback',
    data() {
        return {
            feedback: {
                type: 'suggestion', // suggestion, bug, other
                title: '',
                description: '',
                email: '',
                attachments: []
            },
            isSubmitting: false,
            submitSuccess: false
        };
    },
    methods: {
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const files = Array.from(event.target.files);
            this.feedback.attachments = [...this.feedback.attachments, ...files];
        },
        removeAttachment(index) {
            this.feedback.attachments.splice(index, 1);
        },
        submitFeedback() {
            if (!this.feedback.title || !this.feedback.description) {
                alert('请填写标题和描述');
                return;
            }

            this.isSubmitting = true;

            // Simulate API call
            setTimeout(() => {
                this.isSubmitting = false;
                this.submitSuccess = true;

                // Reset form after 2 seconds
                setTimeout(() => {
                    this.submitSuccess = false;
                    this.feedback = {
                        type: 'suggestion',
                        title: '',
                        description: '',
                        email: '',
                        attachments: []
                    };
                    router.push('/'); // Optional: redirect to home or stay
                }, 2000);
            }, 1500);
        }
    },
    template: `
        <div class="smart-page" style="overflow-y: auto;">
            <div class="smart-container">
                <div class="smart-header">
                    <div class="header-left">
                        <div class="smart-breadcrumb">
                            <span class="breadcrumb-item">工作台</span>
                            <i class="fas fa-chevron-right separator"></i>
                            <span class="breadcrumb-item active">产品反馈</span>
                        </div>
                        <h1 class="page-title">产品反馈</h1>
                        <p style="color: var(--text-secondary); margin-top: 8px;">您的反馈将帮助我们不断改进产品体验</p>
                    </div>
                </div>

                <div class="smart-content" style="max-width: 800px; margin: 0 auto;">
                    <div class="modern-card">
                        <div class="card-body">
                            <div class="smart-form-grid" style="grid-template-columns: 1fr;">
                                <div class="smart-form-group">
                                    <label class="smart-label required">反馈类型</label>
                                    <div style="display: flex; gap: 16px;">
                                        <label class="radio-card" :class="{ active: feedback.type === 'suggestion' }">
                                            <input type="radio" v-model="feedback.type" value="suggestion" style="display: none;">
                                            <div class="radio-content">
                                                <i class="fas fa-lightbulb" style="color: #f59e0b;"></i>
                                                <span>功能建议</span>
                                            </div>
                                        </label>
                                        <label class="radio-card" :class="{ active: feedback.type === 'bug' }">
                                            <input type="radio" v-model="feedback.type" value="bug" style="display: none;">
                                            <div class="radio-content">
                                                <i class="fas fa-bug" style="color: #ef4444;"></i>
                                                <span>问题反馈</span>
                                            </div>
                                        </label>
                                        <label class="radio-card" :class="{ active: feedback.type === 'other' }">
                                            <input type="radio" v-model="feedback.type" value="other" style="display: none;">
                                            <div class="radio-content">
                                                <i class="fas fa-comment-dots" style="color: #3b82f6;"></i>
                                                <span>其他</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div class="smart-form-group">
                                    <label class="smart-label required">标题</label>
                                    <input type="text" class="smart-input" v-model="feedback.title" placeholder="请简要描述您的问题或建议">
                                </div>

                                <div class="smart-form-group">
                                    <label class="smart-label required">详细描述</label>
                                    <textarea class="smart-textarea" v-model="feedback.description" rows="6" placeholder="请详细描述您遇到的问题或建议，如果是问题反馈，请包含复现步骤。"></textarea>
                                </div>

                                <div class="smart-form-group">
                                    <label class="smart-label">附件（截图/文档）</label>
                                    <div class="upload-zone" @click="triggerFileUpload" style="border: 2px dashed #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#2563eb'; this.style.background='#f0f9ff'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='transparent'">
                                        <i class="fas fa-cloud-upload-alt" style="font-size: 24px; color: #9ca3af; margin-bottom: 8px;"></i>
                                        <div style="color: #6b7280; font-size: 14px;">点击上传文件，或将文件拖拽至此</div>
                                    </div>
                                    <input type="file" ref="fileInput" @change="handleFileChange" multiple style="display: none;">
                                    
                                    <!-- Attachment List -->
                                    <div v-if="feedback.attachments.length > 0" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
                                        <div v-for="(file, index) in feedback.attachments" :key="index" style="background: #f3f4f6; padding: 6px 12px; border-radius: 4px; font-size: 13px; display: flex; align-items: center;">
                                            <span style="margin-right: 8px;">{{ file.name }}</span>
                                            <i class="fas fa-times" @click="removeAttachment(index)" style="cursor: pointer; color: #9ca3af;"></i>
                                        </div>
                                    </div>
                                </div>

                                <div class="smart-form-group">
                                    <label class="smart-label">联系邮箱（选填）</label>
                                    <input type="email" class="smart-input" v-model="feedback.email" placeholder="方便我们进一步与您沟通">
                                </div>

                                <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                                    <button class="smart-btn-primary" @click="submitFeedback" :disabled="isSubmitting" style="min-width: 120px;">
                                        <i v-if="isSubmitting" class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>
                                        {{ isSubmitting ? '提交中...' : '提交反馈' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Success Toast -->
            <div v-if="submitSuccess" style="position: fixed; top: 24px; right: 24px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; gap: 8px; animation: slideIn 0.3s ease-out;">
                <i class="fas fa-check-circle"></i>
                感谢您的反馈，我们会尽快处理！
            </div>

            <style>
                .radio-card {
                    flex: 1;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .radio-card:hover {
                    border-color: #2563eb;
                    background: #f0f9ff;
                }
                .radio-card.active {
                    border-color: #2563eb;
                    background: #eff6ff;
                    box-shadow: 0 0 0 1px #2563eb;
                }
                .radio-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }
            </style>
        </div>
    `
};
