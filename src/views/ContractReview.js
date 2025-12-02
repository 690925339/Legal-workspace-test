import { router } from '../router.js';

export default {
    name: 'ContractReview',
    data() {
        return {
            activeTab: 'single',
            uploadedFile: null,
            fileName: '',
            fileSize: '',
            isAnalyzing: false,
            analysisComplete: false,
            isDragging: false,
            riskItems: [
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
                    type: 'success',
                    title: '知识产权条款完善',
                    desc: '知识产权归属明确，符合法律规定'
                }
            ]
        };
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab;
            this.resetState();
        },
        resetState() {
            this.uploadedFile = null;
            this.fileName = '';
            this.fileSize = '';
            this.isAnalyzing = false;
            this.analysisComplete = false;
        },
        handleDragEnter(e) {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = true;
        },
        handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = false;
        },
        handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
        },
        handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = false;
            var files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        },
        handleFileUpload(event) {
            var file = event.target.files[0];
            if (file) {
                this.processFile(file);
            }
        },
        processFile(file) {
            this.uploadedFile = file;
            this.fileName = file.name;
            this.fileSize = this.formatFileSize(file.size);
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        startAnalysis() {
            if (!this.uploadedFile) {
                alert('请先上传合同文件');
                return;
            }
            this.isAnalyzing = true;
            setTimeout(() => {
                this.isAnalyzing = false;
                this.analysisComplete = true;
            }, 2000);
        },
        removeFile() {
            this.uploadedFile = null;
            this.fileName = '';
            this.fileSize = '';
        }
    },
    template: `
        <div class="smart-page">
            <div class="smart-container">
                <!-- 页面头部 -->
                <div class="smart-header">
                    <h1>合同审查，一键开启智能审查</h1>
                    <p>快速识别合同风险点，提供专业的法律审查建议</p>
                    
                    <!-- 标签切换 -->
                    <div class="smart-tabs">
                        <button 
                            :class="['smart-tab-btn', { active: activeTab === 'single' }]"
                            @click="switchTab('single')"
                        >
                            合同审查
                        </button>
                        <button 
                            :class="['smart-tab-btn', { active: activeTab === 'compare' }]"
                            @click="switchTab('compare')"
                        >
                            对比审查
                        </button>
                    </div>
                </div>

                <!-- 单文件审查 -->
                <template v-if="activeTab === 'single'">
                    <!-- 上传区域 -->
                    <div class="smart-card" v-if="!analysisComplete">
                        <div 
                            class="smart-upload-zone"
                            :class="{ dragging: isDragging }"
                            @dragenter="handleDragEnter"
                            @dragleave="handleDragLeave"
                            @dragover="handleDragOver"
                            @drop="handleDrop"
                            @click="triggerFileInput"
                        >
                            <input 
                                type="file" 
                                ref="fileInput"
                                @change="handleFileUpload"
                                accept=".pdf,.doc,.docx"
                                style="display: none;"
                            >
                            
                            <div class="smart-upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <h3>点击或拖拽文件到此区域上传</h3>
                            <p>支持格式：PDF、DOC、DOCX，单个文件不超过20MB</p>
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

                        <div class="smart-card-footer">
                            <div class="smart-tips">
                                <i class="fas fa-lightbulb"></i>
                                <span>AI 将自动识别合同类型并进行风险分析</span>
                            </div>
                            <button 
                                class="smart-btn-primary"
                                @click="startAnalysis"
                                :disabled="!uploadedFile || isAnalyzing"
                            >
                                <i :class="isAnalyzing ? 'fas fa-spinner fa-spin' : 'fas fa-magic'"></i>
                                {{ isAnalyzing ? '分析中...' : '开始审查' }}
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
                </template>

                <!-- 对比审查 -->
                <template v-if="activeTab === 'compare'">
                    <div class="smart-card">
                        <div class="smart-compare-grid">
                            <div class="smart-compare-card">
                                <h4>待审查文档</h4>
                                <p>上传需要审查的合同文档</p>
                                <button class="smart-btn-secondary">
                                    <i class="fas fa-upload"></i> 上传文件
                                </button>
                            </div>
                            <div class="smart-compare-card">
                                <h4>标准文档</h4>
                                <p>上传标准合同模板进行对比</p>
                                <button class="smart-btn-secondary">
                                    <i class="fas fa-upload"></i> 上传文件
                                </button>
                            </div>
                        </div>
                        <div class="smart-card-footer">
                            <div class="smart-tips">
                                <i class="fas fa-lightbulb"></i>
                                <span>对比审查可以快速发现合同与标准模板的差异</span>
                            </div>
                            <button class="smart-btn-primary" disabled>
                                <i class="fas fa-exchange-alt"></i> 开始对比
                            </button>
                        </div>
                    </div>
                </template>

                <!-- 底部提示 -->
                <div class="smart-footer-info">
                    <i class="fas fa-info-circle"></i>
                    <span>合同审查剩余额度：3 份</span>
                    <a href="#">了解更多 ></a>
                </div>
            </div>
        </div>
    `
};
