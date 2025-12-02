import { router } from '../router.js';

export default {
    name: 'EvidenceUpload',
    data() {
        return {
            isDragging: false,
            uploadingFiles: [],
            completedFiles: [],
            evidenceCategories: [
                { id: 'contract', name: '合同协议', color: '#e0f2fe', textColor: '#0369a1', icon: 'fa-file-contract' },
                { id: 'payment', name: '支付凭证', color: '#dcfce7', textColor: '#15803d', icon: 'fa-receipt' },
                { id: 'correspondence', name: '往来函件', color: '#f3e8ff', textColor: '#7e22ce', icon: 'fa-envelope' },
                { id: 'identity', name: '身份证明', color: '#fef3c7', textColor: '#b45309', icon: 'fa-id-card' },
                { id: 'other', name: '其他证据', color: '#f3f4f6', textColor: '#4b5563', icon: 'fa-folder' }
            ],
            caseInfo: {
                id: 'CASE-2023-001',
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案'
            },
            // 编辑分类模态框
            showCategoryModal: false,
            editingFile: null,
            selectedCategory: null
        };
    },
    computed: {
        totalFiles() {
            return this.uploadingFiles.length + this.completedFiles.length;
        },
        successCount() {
            return this.completedFiles.filter(f => f.status === 'success').length;
        },
        failedCount() {
            return this.completedFiles.filter(f => f.status === 'error').length;
        },
        uploadingCount() {
            return this.uploadingFiles.filter(f => f.status === 'uploading' || f.status === 'analyzing').length;
        }
    },
    methods: {
        goBack() {
            router.push('/detail');
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
            
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(e) {
            const files = Array.from(e.target.files);
            this.processFiles(files);
            e.target.value = '';
        },
        processFiles(files) {
            files.forEach(file => {
                const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
                const uploadItem = {
                    id: fileId,
                    file: file,
                    name: file.name,
                    type: this.getFileType(file.name),
                    size: file.size,
                    progress: 0,
                    status: 'uploading',
                    error: null,
                    category: null,
                    confidence: null,
                    uploadTime: null
                };
                
                this.uploadingFiles.push(uploadItem);
                this.simulateUpload(uploadItem);
            });
        },
        getFileType(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
            if (['pdf'].includes(ext)) return 'pdf';
            if (['doc', 'docx'].includes(ext)) return 'word';
            if (['xls', 'xlsx'].includes(ext)) return 'excel';
            if (['mp3', 'wav', 'aac'].includes(ext)) return 'audio';
            if (['mp4', 'avi', 'mov'].includes(ext)) return 'video';
            return 'other';
        },
        getFileIcon(type) {
            const icons = {
                'image': 'fa-file-image',
                'pdf': 'fa-file-pdf',
                'word': 'fa-file-word',
                'excel': 'fa-file-excel',
                'audio': 'fa-file-audio',
                'video': 'fa-file-video',
                'other': 'fa-file'
            };
            return icons[type] || 'fa-file';
        },
        getFileIconColor(type) {
            const colors = {
                'image': '#10b981',
                'pdf': '#ef4444',
                'word': '#3b82f6',
                'excel': '#22c55e',
                'audio': '#f59e0b',
                'video': '#8b5cf6',
                'other': '#6b7280'
            };
            return colors[type] || '#6b7280';
        },
        simulateUpload(item) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 90) {
                    clearInterval(interval);
                    item.progress = 90;
                    item.status = 'analyzing';
                    this.simulateAnalysis(item);
                } else {
                    item.progress = Math.floor(progress);
                }
            }, 200);
        },
        simulateAnalysis(item) {
            setTimeout(() => {
                // 模拟 15% 的失败率
                if (Math.random() < 0.15) {
                    item.status = 'error';
                    item.progress = 0;
                    item.error = this.getRandomError();
                    this.moveToCompleted(item);
                    return;
                }

                item.progress = 100;
                item.status = 'success';
                
                // 模拟 AI 自动分类
                const categories = ['contract', 'payment', 'correspondence', 'identity', 'other'];
                item.category = categories[Math.floor(Math.random() * categories.length)];
                item.confidence = (0.75 + Math.random() * 0.24).toFixed(2);
                item.uploadTime = new Date().toLocaleString('zh-CN');
                
                this.moveToCompleted(item);
            }, 1500 + Math.random() * 1000);
        },
        getRandomError() {
            const errors = [
                '文件格式不支持',
                '文件解析失败',
                '网络连接中断',
                '文件大小超出限制',
                '服务器暂时不可用'
            ];
            return errors[Math.floor(Math.random() * errors.length)];
        },
        moveToCompleted(item) {
            const index = this.uploadingFiles.findIndex(f => f.id === item.id);
            if (index !== -1) {
                this.uploadingFiles.splice(index, 1);
                this.completedFiles.unshift(item);
            }
        },
        retryUpload(item) {
            // 从完成列表移除
            const index = this.completedFiles.findIndex(f => f.id === item.id);
            if (index !== -1) {
                this.completedFiles.splice(index, 1);
            }
            
            // 重置状态并重新上传
            item.status = 'uploading';
            item.progress = 0;
            item.error = null;
            this.uploadingFiles.push(item);
            this.simulateUpload(item);
        },
        removeFile(item, listType) {
            if (listType === 'uploading') {
                const index = this.uploadingFiles.findIndex(f => f.id === item.id);
                if (index !== -1) {
                    this.uploadingFiles.splice(index, 1);
                }
            } else {
                const index = this.completedFiles.findIndex(f => f.id === item.id);
                if (index !== -1) {
                    this.completedFiles.splice(index, 1);
                }
            }
        },
        formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getCategoryInfo(categoryId) {
            return this.evidenceCategories.find(c => c.id === categoryId) || this.evidenceCategories[4];
        },
        changeCategory(item, categoryId) {
            item.category = categoryId;
        },
        openCategoryModal(file) {
            this.editingFile = file;
            this.selectedCategory = file.category;
            this.showCategoryModal = true;
        },
        closeCategoryModal() {
            this.showCategoryModal = false;
            this.editingFile = null;
            this.selectedCategory = null;
        },
        selectCategory(categoryId) {
            this.selectedCategory = categoryId;
        },
        confirmCategory() {
            if (this.editingFile && this.selectedCategory) {
                this.editingFile.category = this.selectedCategory;
            }
            this.closeCategoryModal();
        },
        clearCompleted() {
            this.completedFiles = this.completedFiles.filter(f => f.status !== 'success');
        }
    },
    template: `
        <div class="evidence-upload-page">
            <!-- Header -->
            <header class="upload-header">
                <div class="header-left">
                    <button class="back-btn" @click="goBack">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="header-info">
                        <h1>上传证据</h1>
                        <p class="case-reference">
                            <i class="fas fa-folder-open"></i>
                            {{ caseInfo.name }}
                        </p>
                    </div>
                </div>
                <div class="header-right">
                    <div class="upload-stats" v-if="totalFiles > 0">
                        <div class="stat-item" v-if="uploadingCount > 0">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>{{ uploadingCount }} 上传中</span>
                        </div>
                        <div class="stat-item success" v-if="successCount > 0">
                            <i class="fas fa-check-circle"></i>
                            <span>{{ successCount }} 成功</span>
                        </div>
                        <div class="stat-item error" v-if="failedCount > 0">
                            <i class="fas fa-times-circle"></i>
                            <span>{{ failedCount }} 失败</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="upload-content">
                <!-- Drop Zone -->
                <div 
                    class="drop-zone"
                    :class="{ 'dragging': isDragging, 'has-files': totalFiles > 0 }"
                    @dragenter="handleDragEnter"
                    @dragleave="handleDragLeave"
                    @dragover="handleDragOver"
                    @drop="handleDrop"
                    @click="triggerFileInput"
                >
                    <input 
                        type="file" 
                        ref="fileInput" 
                        multiple 
                        @change="handleFileSelect"
                        style="display: none"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.mp3,.wav,.mp4,.avi"
                    >
                    
                    <div class="drop-zone-content">
                        <div class="drop-icon" :class="{ 'animate': isDragging }">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h3 v-if="!isDragging">拖拽文件到此处上传</h3>
                        <h3 v-else class="dragging-text">释放文件开始上传</h3>
                        <p>或点击选择文件</p>
                        <div class="supported-formats">
                            <span><i class="fas fa-file-pdf"></i> PDF</span>
                            <span><i class="fas fa-file-word"></i> Word</span>
                            <span><i class="fas fa-file-image"></i> 图片</span>
                            <span><i class="fas fa-file-excel"></i> Excel</span>
                            <span><i class="fas fa-file-audio"></i> 音频</span>
                            <span><i class="fas fa-file-video"></i> 视频</span>
                        </div>
                    </div>
                </div>

                <!-- Uploading Files -->
                <div class="file-section" v-if="uploadingFiles.length > 0">
                    <div class="section-header">
                        <h3><i class="fas fa-upload"></i> 上传中 ({{ uploadingFiles.length }})</h3>
                    </div>
                    <div class="file-list">
                        <div 
                            v-for="file in uploadingFiles" 
                            :key="file.id" 
                            class="file-item uploading"
                        >
                            <div class="file-icon" :style="{ color: getFileIconColor(file.type) }">
                                <i :class="['fas', getFileIcon(file.type)]"></i>
                            </div>
                            <div class="file-info">
                                <div class="file-name">{{ file.name }}</div>
                                <div class="file-meta">
                                    <span class="file-size">{{ formatSize(file.size) }}</span>
                                    <span class="file-status" v-if="file.status === 'uploading'">
                                        <i class="fas fa-spinner fa-spin"></i> 上传中...
                                    </span>
                                    <span class="file-status analyzing" v-else-if="file.status === 'analyzing'">
                                        <i class="fas fa-brain"></i> AI 分析中...
                                    </span>
                                </div>
                                <div class="progress-bar">
                                    <div 
                                        class="progress-fill"
                                        :class="{ 'analyzing': file.status === 'analyzing' }"
                                        :style="{ width: file.progress + '%' }"
                                    ></div>
                                </div>
                                <div class="progress-text">{{ file.progress }}%</div>
                            </div>
                            <button class="remove-btn" @click.stop="removeFile(file, 'uploading')" title="取消">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Completed Files -->
                <div class="file-section" v-if="completedFiles.length > 0">
                    <div class="section-header">
                        <h3><i class="fas fa-check-double"></i> 已完成 ({{ completedFiles.length }})</h3>
                        <button class="clear-btn" @click="clearCompleted" v-if="successCount > 0">
                            <i class="fas fa-broom"></i> 清除成功项
                        </button>
                    </div>
                    <div class="completed-table-container">
                        <table class="completed-table">
                            <thead>
                                <tr>
                                    <th width="50%">文件名称</th>
                                    <th width="15%">状态</th>
                                    <th width="15%">分类</th>
                                    <th width="20%">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="file in completedFiles" :key="file.id" :class="{ 'row-success': file.status === 'success', 'row-error': file.status === 'error' }">
                                    <td>
                                        <div class="file-name-cell">
                                            <i :class="['fas', getFileIcon(file.type)]" :style="{ color: getFileIconColor(file.type) }"></i>
                                            <span class="file-name-text">{{ file.name }}</span>
                                            <span class="file-size-text">({{ formatSize(file.size) }})</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="status-tag success" v-if="file.status === 'success'">
                                            <i class="fas fa-check-circle"></i> 成功
                                        </span>
                                        <span class="status-tag error" v-else>
                                            <i class="fas fa-times-circle"></i> 失败
                                        </span>
                                    </td>
                                    <td>
                                        <span 
                                            v-if="file.status === 'success'"
                                            class="category-tag-mini"
                                            :style="{ backgroundColor: getCategoryInfo(file.category).color, color: getCategoryInfo(file.category).textColor }"
                                        >
                                            {{ getCategoryInfo(file.category).name }}
                                        </span>
                                        <span v-else class="error-hint">{{ file.error }}</span>
                                    </td>
                                    <td>
                                        <div class="action-btns">
                                            <button v-if="file.status === 'success'" class="action-btn edit" @click="openCategoryModal(file)" title="编辑分类">
                                                <i class="fas fa-tag"></i>
                                            </button>
                                            <button v-if="file.status === 'error'" class="action-btn retry" @click="retryUpload(file)" title="重试">
                                                <i class="fas fa-redo"></i>
                                            </button>
                                            <button class="action-btn delete" @click="removeFile(file, 'completed')" title="删除">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Empty State -->
                <div class="empty-state" v-if="totalFiles === 0">
                    <div class="empty-icon">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <h3>暂无上传文件</h3>
                    <p>拖拽文件到上方区域或点击选择文件开始上传</p>
                </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="action-bar" v-if="successCount > 0">
                <div class="action-info">
                    <i class="fas fa-info-circle"></i>
                    已成功上传 {{ successCount }} 个文件，可返回案件详情查看
                </div>
                <button class="done-btn" @click="goBack">
                    <i class="fas fa-check"></i> 完成上传
                </button>
            </div>

            <!-- Category Edit Modal -->
            <div class="modal-overlay" v-if="showCategoryModal" @click.self="closeCategoryModal">
                <div class="category-modal">
                    <div class="modal-header">
                        <h3>编辑证据分类</h3>
                        <button class="modal-close" @click="closeCategoryModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="editing-file-info" v-if="editingFile">
                            <i :class="['fas', getFileIcon(editingFile.type)]" :style="{ color: getFileIconColor(editingFile.type) }"></i>
                            <span>{{ editingFile.name }}</span>
                        </div>
                        <div class="category-label">选择分类（单选）</div>
                        <div class="category-tags">
                            <div 
                                v-for="cat in evidenceCategories" 
                                :key="cat.id"
                                class="category-tag-option"
                                :class="{ selected: selectedCategory === cat.id }"
                                :style="selectedCategory === cat.id ? { backgroundColor: cat.color, color: cat.textColor, borderColor: cat.textColor } : {}"
                                @click="selectCategory(cat.id)"
                            >
                                <i :class="['fas', cat.icon]"></i>
                                <span>{{ cat.name }}</span>
                                <i v-if="selectedCategory === cat.id" class="fas fa-check selected-check"></i>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn cancel" @click="closeCategoryModal">取消</button>
                        <button class="modal-btn confirm" @click="confirmCategory" :disabled="!selectedCategory">确认</button>
                    </div>
                </div>
            </div>
        </div>
    `
};

