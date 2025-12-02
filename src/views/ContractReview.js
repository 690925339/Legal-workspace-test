import { router } from '../router.js';

export default {
    name: 'ContractReview',
    data() {
        return {
            activeTab: 'upload',
            uploadedFile: null,
            fileName: '',
            fileSize: '',
            isAnalyzing: false,
            analysisComplete: false,
            riskCount: 3
        };
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab;
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.uploadedFile = file;
                this.fileName = file.name;
                this.fileSize = this.formatFileSize(file.size);
            }
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
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
            // Simulate analysis
            setTimeout(() => {
                this.isAnalyzing = false;
                this.analysisComplete = true;
            }, 2000);
        },
        viewHistory() {
            alert('查看历史记录功能开发中...');
        }
    },
    template: `
        <div class="contract-review-page">
            <div class="content-canvas">
                <div class="contract-container">
                    <div class="contract-header">
                        <h1>合同审查，一键开启审查</h1>
                        <p>快速识别高质量内容，提供专业的识别和检测建议</p>
                        
                        <div class="tab-switcher">
                            <button 
                                :class="['tab-btn', { active: activeTab === 'upload' }]"
                                @click="switchTab('upload')"
                            >
                                合同审查
                            </button>
                            <button 
                                :class="['tab-btn', { active: activeTab === 'compare' }]"
                                @click="switchTab('compare')"
                            >
                                对比审查
                            </button>
                        </div>
                    </div>

                    <div v-if="activeTab === 'upload'" class="upload-section">
                        <div class="upload-card">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <h3>点击或拖拽文件到此区域上传</h3>
                            <p>单个合同文件大小不超过20MB，格式支持：pdf/doc/docx</p>
                            
                            <input 
                                type="file" 
                                ref="fileInput"
                                @change="handleFileUpload"
                                accept=".pdf,.doc,.docx"
                                style="display: none;"
                            >
                            
                            <button class="upload-btn" @click="triggerFileInput">
                                <i class="fas fa-upload"></i> 选择文件
                            </button>

                            <div v-if="uploadedFile" class="file-info">
                                <div class="file-item">
                                    <i class="fas fa-file-pdf"></i>
                                    <div class="file-details">
                                        <div class="file-name">{{ fileName }}</div>
                                        <div class="file-meta">合同审查完整性评分：3 份</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom-section">
                            <div class="history-link">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>合同审查知识库</span>
                                <a href="#" @click.prevent="viewHistory">支持添加个性化知识问题 ></a>
                            </div>
                        </div>

                        <button 
                            v-if="uploadedFile && !analysisComplete" 
                            class="analyze-btn"
                            @click="startAnalysis"
                            :disabled="isAnalyzing"
                        >
                            <i class="fas fa-magic"></i>
                            {{ isAnalyzing ? '分析中...' : '开始审查' }}
                        </button>

                        <div v-if="analysisComplete" class="analysis-result">
                            <div class="result-header">
                                <h3>审查结果</h3>
                                <span class="risk-badge">发现 {{ riskCount }} 处风险点</span>
                            </div>
                            <div class="result-content">
                                <div class="risk-item">
                                    <div class="risk-icon warning">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div class="risk-details">
                                        <h4>违约责任条款不明确</h4>
                                        <p>建议明确违约责任的具体承担方式和赔偿标准</p>
                                    </div>
                                </div>
                                <div class="risk-item">
                                    <div class="risk-icon info">
                                        <i class="fas fa-info-circle"></i>
                                    </div>
                                    <div class="risk-details">
                                        <h4>付款条款建议优化</h4>
                                        <p>建议增加付款时间节点和逾期利息条款</p>
                                    </div>
                                </div>
                                <div class="risk-item">
                                    <div class="risk-icon success">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="risk-details">
                                        <h4>知识产权条款完善</h4>
                                        <p>知识产权归属明确，符合法律规定</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'compare'" class="compare-section">
                        <div class="compare-grid">
                            <div class="compare-card">
                                <div class="compare-card-header">
                                    <h4>待审查文档</h4>
                                    <p>在进行合同审查的同时，与标准文档比对差异，查看格式要求 <i class="fas fa-info-circle"></i></p>
                                </div>
                                <div class="compare-upload-area">
                                    <div class="placeholder-content">
                                        <div class="placeholder-lines">
                                            <div class="line short"></div>
                                            <div class="line long"></div>
                                            <div class="line medium"></div>
                                        </div>
                                        <button class="upload-btn-small">
                                            <i class="fas fa-upload"></i> 上传文件
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="compare-card">
                                <div class="compare-card-header">
                                    <h4>标准文档</h4>
                                    <p>使用该文档对比与待审查文档的差异点，查看格式要求 <i class="fas fa-info-circle"></i></p>
                                </div>
                                <div class="compare-upload-area">
                                    <div class="placeholder-content">
                                        <div class="placeholder-lines">
                                            <div class="line short"></div>
                                            <div class="line long"></div>
                                            <div class="line medium"></div>
                                            <div class="highlight-circle"></div>
                                        </div>
                                        <button class="upload-btn-small">
                                            <i class="fas fa-upload"></i> 上传文件
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="compare-footer">
                            <div class="footer-info">
                                合同审查剩余额度：3 份 <i class="fas fa-info-circle"></i>
                            </div>
                            <button class="start-compare-btn">开始审查</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
