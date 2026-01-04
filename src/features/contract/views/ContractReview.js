import router from '@/router/index.js'
import HistoryModal from '@/components/HistoryModal.vue';

export default {
    name: 'ContractReview',
    components: {
        HistoryModal
    },
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
                    title: '知识产权条款完善',
                    desc: '知识产权归属明确，符合法律规定'
                }
            ],
            showHistoryModal: false,
            historyRecords: []
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
            // 上传文件后直接跳转到审查结果页
            router.push('/contract-review-result');
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
            // 跳转到合同审查结果页
            router.push('/contract-review-result');
        },
        removeFile() {
            this.uploadedFile = null;
            this.fileName = '';
            this.fileSize = '';
        },
        openHistory() {
            // 模拟历史记录数据
            this.historyRecords = [
                { id: 1, title: '房屋租赁合同.docx', date: '2025-12-08T11:00:00', type: '合同审查' },
                { id: 2, title: '劳动合同模板.pdf', date: '2025-12-07T16:20:00', type: '合同审查' },
                { id: 3, title: '技术服务协议.doc', date: '2025-12-06T10:30:00', type: '合同审查' },
                { id: 4, title: '股权转让协议.pdf', date: '2025-12-05T14:15:00', type: '合同审查' },
                { id: 5, title: '采购合同范本.docx', date: '2025-12-04T09:30:00', type: '合同审查' },
                { id: 6, title: '保密协议.pdf', date: '2025-12-03T15:45:00', type: '合同审查' },
                { id: 7, title: '装修工程合同.doc', date: '2025-12-02T11:00:00', type: '合同审查' },
                { id: 8, title: '软件开发合同.pdf', date: '2025-12-01T13:20:00', type: '合同审查' }
            ];
            this.showHistoryModal = true;
        },
        handleHistorySelect(record) {
            // 跳转到审查结果页
            router.push('/contract-review-result');
        }
    },
    template: `
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
                    
                    <!-- 标签切换 -->
                    <!-- <div class="smart-tabs">
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
                    </div> -->
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
                                ref="fileInput"
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
    `
};
