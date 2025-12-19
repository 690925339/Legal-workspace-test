import { router } from '../router.js';
import AIAnalysis from './refactor/AIAnalysis.js';
import AIAssistant from './refactor/AIAssistant.js';
import RelationshipGraph from './refactor/RelationshipGraph.js';
import EvidenceTimeline from './refactor/EvidenceTimeline.js';
import QuoteGenerator from './refactor/QuoteGenerator.js';

export default {
    name: 'CaseDetail',
    components: {
        AIAnalysis,
        AIAssistant,
        RelationshipGraph,
        EvidenceTimeline,
        QuoteGenerator
    },
    data() {
        return {
            activeTab: 'basic',
            activeCategory: 'basic',
            caseData: {
                id: 'CASE-2023-001',
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                status: '进行中',
                type: '合同纠纷',
                category: '民事',
                client: 'ABC 公司',
                opposingParty: 'XYZ 有限公司',
                court: '上海市浦东新区人民法院',
                filingDate: '2023-10-01',
                amount: '500,000.00 CNY',
                description: '因被告未按合同约定支付广告费用引发的纠纷。',
                lastUpdate: '2小时前',
                assignee: '张三'
            },
            showEditModal: false,
            showStatusDropdown: false,
            statusOptions: [
                { code: 'draft', text: '草稿', color: '#f3f4f6', textColor: '#4b5563' },
                { code: 'active', text: '进行中', color: '#dbeafe', textColor: '#1e40af' },
                { code: 'closed', text: '已结案', color: '#d1fae5', textColor: '#065f46' }
            ],
            stageOptions: [
                '咨询',
                '立案',
                '一审',
                '二审',
                '再审',
                '执行',
                '结案'
            ],
            tabStructure: [
                {
                    id: 'basic',
                    name: '基础信息',
                    icon: 'fas fa-file-alt',
                    items: []
                },
                {
                    id: 'case-facts',
                    name: '案情描述',
                    icon: 'fas fa-file-text',
                    items: []
                },
                {
                    id: 'stakeholders',
                    name: '当事人信息',
                    icon: 'fas fa-users',
                    items: []
                },
                {
                    id: 'evidence',
                    name: '证据管理',
                    icon: 'fas fa-folder-open',
                    items: [
                        { id: 'evidence-list', name: '证据清单' },
                        { id: 'ai-evidence', name: '证据分析规划' }
                    ]
                },
                {
                    id: 'financials',
                    name: '财务信息',
                    icon: 'fas fa-dollar-sign',
                    items: []
                },

                {
                    id: 'refactor',
                    name: '高级功能',
                    icon: 'fas fa-tools',
                    items: [
                        { id: 'ai-analysis-refactor', name: 'AI分析' },
                        { id: 'ai-assistant-refactor', name: 'AI对话助手' },
                        { id: 'relationship-graph-refactor', name: '关系洞察' },
                        { id: 'timeline-refactor', name: '证据时间轴' },
                        { id: 'quote-generator-refactor', name: '生成报价书' }
                    ]
                }
            ],
            // AI 证据分析数据
            evidenceAnalysis: {
                stats: {
                    completeness: { value: '50%', label: '(3/6)' },
                    collected: { value: '100%', label: '(2/2)' },
                    missing: { value: '3 项' }
                },
                items: [
                    {
                        id: 1,
                        name: '合同原件或复印件',
                        priority: 5,
                        priorityLabel: '极高',
                        priorityColor: '#dc3545',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '证明双方权利义务的核心证据',
                        checked: true,
                        bgClass: 'bg-red-light'
                    },
                    {
                        id: 2,
                        name: '付款凭证（发票、转账记录）',
                        priority: 5,
                        priorityLabel: '极高',
                        priorityColor: '#dc3545',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '证明履行义务的关键证据',
                        checked: true,
                        bgClass: 'bg-red-light'
                    },
                    {
                        id: 3,
                        name: '往来函件、邮件记录',
                        priority: 4,
                        priorityLabel: '高',
                        priorityColor: '#ff9800',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明双方沟通和违约事实',
                        checked: false,
                        bgClass: ''
                    },
                    {
                        id: 4,
                        name: '会议纪要、录音',
                        priority: 4,
                        priorityLabel: '高',
                        priorityColor: '#ff9800',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '补充证明双方协商过程',
                        checked: true,
                        bgClass: ''
                    },
                    {
                        id: 5,
                        name: '催告函、律师函',
                        priority: 3,
                        priorityLabel: '中',
                        priorityColor: '#2196f3',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明已履行催告义务',
                        checked: false,
                        bgClass: ''
                    },
                    {
                        id: 6,
                        name: '公司营业执照、资质证明',
                        priority: 2,
                        priorityLabel: '低',
                        priorityColor: '#4caf50',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明主体资格',
                        checked: false,
                        bgClass: ''
                    }
                ]
            },
            evidenceFiles: [
                {
                    id: 'ev001',
                    name: '购销合同.pdf',
                    type: 'pdf',
                    size: 2048576,
                    uploadTime: '2023-10-02 10:20',
                    category: 'contract',
                    status: 'success',
                    progress: 100,
                    confidence: 0.95
                },
                {
                    id: 'ev002',
                    name: '银行转账记录.png',
                    type: 'image',
                    size: 512000,
                    uploadTime: '2023-10-03 14:15',
                    category: 'payment',
                    status: 'success',
                    progress: 100,
                    confidence: 0.98
                }
            ],
            uploadingFiles: [],
            evidenceCategories: [
                { id: 'contract', name: '合同协议', color: '#e0f2fe', textColor: '#0369a1' },
                { id: 'payment', name: '支付凭证', color: '#dcfce7', textColor: '#15803d' },
                { id: 'correspondence', name: '往来函件', color: '#f3e8ff', textColor: '#7e22ce' },
                { id: 'other', name: '其他证据', color: '#f3f4f6', textColor: '#4b5563' }
            ],

            // 当事人信息数据
            stakeholders: {
                plaintiffs: [
                    {
                        id: 1,
                        name: '张三',
                        type: 'person',
                        idNumber: '110101198001011234',
                        phone: '13800138000',
                        address: '北京市朝阳区某某街道123号',
                        role: '原告'
                    }
                ],
                defendants: [
                    {
                        id: 1,
                        name: '某科技有限公司',
                        type: 'company',
                        legalRepresentative: '李四',
                        creditCode: '91110000MA01A2B3C4',
                        address: '北京市海淀区某某大厦10层',
                        lawyer: '王律师（某律所）',
                        role: '被告'
                    }
                ],
                thirdParties: []
            },
            showStakeholderModal: false,
            currentStakeholder: null,
            stakeholderType: 'plaintiff', // plaintiff, defendant, thirdParty

            // Section-specific edit modals
            showBasicInfoModal: false,
            showCaseFactsModal: false,
            showFinancialsModal: false,
            editForm: {},
            // Contact person
            showContactModal: false,
            contactData: {
                name: '王经理',
                role: '主要联络人',
                phone: '138-0000-1234',
                email: 'wang@abc.com',
                address: '上海市浦东新区...'
            },

        };
    },
    computed: {
        currentTabs() {
            if (!this.tabStructure) return [];
            const category = this.tabStructure.find(c => c.id === this.activeCategory);
            return category ? category.items : [];
        },
        currentTabName() {
            if (!this.tabStructure) return '';
            for (const category of this.tabStructure) {
                const tab = category.items.find(t => t.id === this.activeTab);
                if (tab) return tab.name;
            }
            return '';
        }
    },
    created() {
        // 解析 URL hash 获取 ID (例如 #/detail/4)
        const hash = window.location.hash;
        const parts = hash.split('/');
        const caseId = parts.length > 2 ? parts[2] : null;

        if (caseId) {
            this.loadCaseData(caseId);
        }
    },
    methods: {
        loadCaseData(id) {
            // 模拟根据ID加载数据
            // 默认加载案件1的数据
            // 默认案件数据 (ID 1)
            this.caseData = {
                id: 'CASE-2023-001',
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                status: '进行中',
                statusCode: 'active',
                type: '合同纠纷',
                category: '民事',
                client: 'ABC 公司',
                opposingParty: 'XYZ 有限公司',
                court: '上海市浦东新区人民法院',
                filingDate: '2023-10-01',
                amount: '500,000.00 CNY',
                description: '因被告未按合同约定支付广告费用引发的纠纷。',
                lastUpdate: '2小时前',
                assignee: '张三',
                stage: '一审'  // 添加案件阶段字段
            };
        },
        switchCategory(categoryId) {
            console.log('Switching to category:', categoryId);
            this.activeCategory = categoryId;
            const category = this.tabStructure.find(c => c.id === categoryId);
            console.log('Found category:', category);
            if (category && category.items.length > 0) {
                // 有子标签时，切换到第一个子标签
                this.activeTab = category.items[0].id;
            } else {
                // 没有子标签时，直接使用分类ID作为activeTab
                this.activeTab = categoryId;
            }
            console.log('Set activeTab to:', this.activeTab);
        },
        switchTab(tabId) {
            this.activeTab = tabId;
        },
        goBack() {
            router.push('/');
        },
        editCase() {
            this.showEditModal = true;
        },
        onCaseSaved(updatedData) {
            console.log('Case updated:', updatedData);
            // Update local data
            this.caseData = { ...this.caseData, ...updatedData };
            this.showEditModal = false;
            alert('案件信息已更新');
        },
        toggleStatusDropdown() {
            this.showStatusDropdown = !this.showStatusDropdown;
        },
        changeStatus(statusOption) {
            this.caseData.status = statusOption.text;
            this.caseData.statusCode = statusOption.code;
            this.showStatusDropdown = false;
            // 这里可以添加保存到后端的逻辑
            console.log('Status changed to:', statusOption);
        },
        getStarRating(priority) {
            return '★'.repeat(priority) + '☆'.repeat(5 - priority);
        },

        toggleStatus(item) {
            if (item.status === 'collected') {
                item.status = 'missing';
                item.statusText = '✗ 未收集';
                item.bgClass = '';
                item.checked = false;
            } else {
                item.status = 'collected';
                item.statusText = '✓ 已收集';
                item.bgClass = 'bg-red-light';
                item.checked = true;
            }
            this.updateEvidenceStats();
        },
        updateEvidenceStats() {
            const items = this.evidenceAnalysis.items;
            const total = items.length;
            const collected = items.filter(i => i.status === 'collected').length;
            const missing = total - collected;

            // Completeness
            const percentage = Math.round((collected / total) * 100);
            this.evidenceAnalysis.stats.completeness.value = `${percentage}%`;
            this.evidenceAnalysis.stats.completeness.label = `(${collected}/${total})`;

            // High Priority (Priority >= 4)
            const highPriorityItems = items.filter(i => i.priority >= 4);
            const highPriorityTotal = highPriorityItems.length;
            const highPriorityCollected = highPriorityItems.filter(i => i.status === 'collected').length;

            this.evidenceAnalysis.stats.collected.value = `${Math.round((highPriorityCollected / highPriorityTotal) * 100)}%`;
            this.evidenceAnalysis.stats.collected.label = `(${highPriorityCollected}/${highPriorityTotal})`;

            // Missing
            this.evidenceAnalysis.stats.missing.value = `${missing} 项`;
        },
        exportEvidenceList() {
            const items = this.evidenceAnalysis.items;
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel compatibility
            csvContent += "建议收集的证据,重要性评分,收集状态,说明\n";

            items.forEach(item => {
                const row = [
                    item.name,
                    item.priorityLabel,
                    item.statusText,
                    item.desc
                ].map(field => `"${field}"`).join(","); // Quote fields to handle commas
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "证据收集清单.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        // 证据管理方法
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            files.forEach(file => {
                this.uploadEvidence(file);
            });

            // 重置 input 以允许重复选择同一文件
            event.target.value = '';
        },
        uploadEvidence(file) {
            const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
            const uploadItem = {
                id: fileId,
                file: file,
                name: file.name,
                type: this.getFileType(file.name),
                size: file.size,
                progress: 0,
                status: 'uploading', // uploading, analyzing, success, error
                error: null
            };

            this.uploadingFiles.push(uploadItem);
            this.simulateUpload(uploadItem);
        },
        getFileType(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
            if (['pdf'].includes(ext)) return 'pdf';
            if (['doc', 'docx'].includes(ext)) return 'word';
            return 'other';
        },
        simulateUpload(item) {
            // 模拟上传进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 90) {
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
            // 模拟 AI 分析和分类
            setTimeout(() => {
                // 模拟 10% 的失败率
                if (Math.random() < 0.1) {
                    item.status = 'error';
                    item.error = '文件解析失败，请重试';
                    return;
                }

                item.progress = 100;
                item.status = 'success';

                // 模拟自动分类
                const categories = ['contract', 'payment', 'correspondence', 'other'];
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];

                // 添加到已完成列表
                this.evidenceFiles.unshift({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    size: item.size,
                    uploadTime: new Date().toLocaleString(),
                    category: randomCategory,
                    status: 'success',
                    progress: 100,
                    confidence: (0.8 + Math.random() * 0.2).toFixed(2)
                });

                // 从上传列表中移除
                const index = this.uploadingFiles.findIndex(f => f.id === item.id);
                if (index !== -1) {
                    this.uploadingFiles.splice(index, 1);
                }
            }, 1500);
        },
        retryUpload(item) {
            item.status = 'uploading';
            item.progress = 0;
            item.error = null;
            this.simulateUpload(item);
        },
        removeUploadingFile(item) {
            const index = this.uploadingFiles.findIndex(f => f.id === item.id);
            if (index !== -1) {
                this.uploadingFiles.splice(index, 1);
            }
        },
        formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getCategoryName(categoryId) {
            const category = this.evidenceCategories.find(c => c.id === categoryId);
            return category ? category.name : '未知';
        },
        getCategoryStyle(categoryId) {
            const category = this.evidenceCategories.find(c => c.id === categoryId);
            return category ? { backgroundColor: category.color, color: category.textColor } : {};
        },
        reclassifyEvidence(file, newCategoryId) {
            file.category = newCategoryId;
        },
        toggleProcess() {
            this.isProcessRunning = !this.isProcessRunning;
            if (this.isProcessRunning) {
                this.caseData.status = '处理中';
            } else {
                this.caseData.status = '已暂停';
            }
        },
        navigateToEvidenceUpload() {
            router.push('/evidence-upload');
        },
        // 当事人管理方法
        addStakeholder(type) {
            this.stakeholderType = type;
            this.currentStakeholder = {
                id: null,
                name: '',
                type: 'person', // person or company
                idNumber: '',
                phone: '',
                address: '',
                role: type === 'plaintiff' ? '原告' : (type === 'defendant' ? '被告' : '第三人'),
                // 公司特有字段
                legalRepresentative: '',
                creditCode: '',
                lawyer: ''
            };
            this.showStakeholderModal = true;
        },
        editStakeholder(type, stakeholder) {
            this.stakeholderType = type;
            this.currentStakeholder = JSON.parse(JSON.stringify(stakeholder)); // Deep copy
            this.showStakeholderModal = true;
        },
        deleteStakeholder(type, id) {
            if (!confirm('确定要删除该当事人吗？')) return;

            let listName = '';
            if (type === 'plaintiff') listName = 'plaintiffs';
            else if (type === 'defendant') listName = 'defendants';
            else listName = 'thirdParties';

            this.stakeholders[listName] = this.stakeholders[listName].filter(item => item.id !== id);
        },
        saveStakeholder() {
            if (!this.currentStakeholder.name) {
                alert('请输入姓名/名称');
                return;
            }

            let listName = '';
            if (this.stakeholderType === 'plaintiff') listName = 'plaintiffs';
            else if (this.stakeholderType === 'defendant') listName = 'defendants';
            else listName = 'thirdParties';

            if (this.currentStakeholder.id) {
                // 编辑
                const index = this.stakeholders[listName].findIndex(item => item.id === this.currentStakeholder.id);
                if (index !== -1) {
                    this.stakeholders[listName].splice(index, 1, this.currentStakeholder);
                }
            } else {
                // 新增
                this.currentStakeholder.id = Date.now();
                this.stakeholders[listName].push(this.currentStakeholder);
            }

            this.showStakeholderModal = false;
        },

        // Section-specific edit methods
        editBasicInfo() {
            this.editForm = {
                name: this.caseData.name,
                id: this.caseData.id,
                type: this.caseData.type,
                category: this.caseData.category,
                court: this.caseData.court,
                filingDate: this.caseData.filingDate,
                stage: this.caseData.stage || '咨询',
                // 联络人信息
                contactName: this.contactData.name,
                contactRole: this.contactData.role,
                contactPhone: this.contactData.phone,
                contactEmail: this.contactData.email,
                contactAddress: this.contactData.address
            };
            this.showBasicInfoModal = true;
        },
        saveBasicInfo() {
            // Update caseData with editForm values
            this.caseData.name = this.editForm.name;
            this.caseData.id = this.editForm.id;
            this.caseData.type = this.editForm.type;
            this.caseData.category = this.editForm.category;
            this.caseData.court = this.editForm.court;
            this.caseData.filingDate = this.editForm.filingDate;
            this.caseData.stage = this.editForm.stage;
            // Update contact data
            this.contactData.name = this.editForm.contactName;
            this.contactData.role = this.editForm.contactRole;
            this.contactData.phone = this.editForm.contactPhone;
            this.contactData.email = this.editForm.contactEmail;
            this.contactData.address = this.editForm.contactAddress;
            this.showBasicInfoModal = false;
            alert('基础信息已更新');
        },
        editCaseFacts() {
            this.editForm = {
                description: this.caseData.description || '',
                disputeFocus: '软件是否已实际交付, 质量验收是否合格, 违约损失金额',
                objective: '支付剩余款项50万元 + 违约金8万元 + 利息'
            };
            this.showCaseFactsModal = true;
        },
        saveCaseFacts() {
            this.caseData.description = this.editForm.description;
            this.showCaseFactsModal = false;
            alert('案情描述已更新');
        },
        editFinancials() {
            this.editForm = {
                amount: this.caseData.amount || '',
                attorneyFee: '85,000',
                courtCost: '11,300',
                billableHours: '45.5'
            };
            this.showFinancialsModal = true;
        },
        saveFinancials() {
            this.caseData.amount = this.editForm.amount;
            this.showFinancialsModal = false;
            alert('财务信息已更新');
        },

    },
    template: `
        <div class="case-detail-page">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span @click="goBack" style="cursor: pointer; color: var(--text-secondary);">案件</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span>详情</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span class="current">{{ caseData.id }}</span>
                </div>
                <div class="top-actions">
                    <!-- Edit button removed -->
                </div>
            </header>

            <!-- Case Header -->
            <div class="case-header-area">
                <div class="case-title-wrapper">
                    <div>
                        <div class="case-tags" style="margin-bottom: 8px;">
                            <span 
                                :class="['tag', 'status-' + (caseData.statusCode || 'active')]"
                            >
                                {{ caseData.status }}
                            </span>
                            <span class="tag">{{ caseData.type }}</span>
                            <span class="tag">{{ caseData.category }}</span>
                        </div>
                        <h1 class="case-title">{{ caseData.name }}</h1>
                        <div style="color: var(--text-secondary); font-size: 14px;">
                            <i class="far fa-clock" style="margin-right: 6px;"></i> 最后更新：{{ caseData.lastUpdate }}
                            <span style="margin: 0 8px; color: var(--border-medium);">|</span>
                            <i class="far fa-user" style="margin-right: 6px;"></i> 负责人：{{ caseData.assignee }}
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="icon-btn" style="border: 1px solid var(--border-medium); border-radius: 12px;">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>



            <!-- Level 1 Tabs (Categories) -->
            <div class="category-tabs">
                <div 
                    v-for="category in tabStructure" 
                    :key="category.id"
                    :class="['category-tab', { active: activeCategory === category.id }]"
                    @click="switchCategory(category.id)"
                >
                    <i :class="category.icon" style="margin-right: 8px;"></i>
                    {{ category.name }}
                </div>
            </div>

            <!-- Level 2 Tabs (Sub-items) -->
            <div class="tabs-container" v-if="currentTabs.length > 1">
                <div class="smart-tabs">
                    <div 
                        v-for="tab in currentTabs" 
                        :key="tab.id"
                        :class="['tab-pill', { active: activeTab === tab.id }]"
                        @click="switchTab(tab.id)"
                    >
                        {{ tab.name }}
                    </div>
                </div>
            </div>

            <!-- Content Canvas -->
            <div class="content-canvas">
                <!-- Tab: Basic Info -->
                <div v-if="activeTab === 'basic'" class="tab-pane">
                    <div class="dashboard-grid">
                        <!-- 基本信息卡片 -->
                        <div class="modern-card">
                            <div class="card-header">
                                <div class="card-title">基础信息</div>
                                <button class="icon-btn" style="font-size: 14px;" @click="editBasicInfo">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </div>
                            
                            <!-- 使用两列网格布局 -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px;">
                                <div class="info-row">
                                    <span class="label">案件标题</span>
                                    <span class="value">{{ caseData.name }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">案件编号</span>
                                    <span class="value">{{ caseData.id }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">案由</span>
                                    <span class="value">{{ caseData.type }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">具体案由</span>
                                    <span class="value">{{ caseData.category }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">案件阶段</span>
                                    <span class="value">{{ caseData.stage || '-' }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">管辖法院/仲裁委</span>
                                    <span class="value">{{ caseData.court }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">承办法官</span>
                                    <span class="value">{{ caseData.judge || '-' }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">立案日期</span>
                                    <span class="value">{{ caseData.filingDate }}</span>
                                </div>
                                <div class="info-row" style="grid-column: span 2;">
                                    <span class="label">诉讼时效/上诉截止日</span>
                                    <span class="value" style="color: #dc2626; font-weight: 500;">{{ caseData.deadline || '-' }}</span>
                                </div>
                                
                                <!-- 联络人信息分隔线 -->
                                <div style="grid-column: span 2; border-top: 1px solid #e5e5e5; margin: 12px 0;"></div>
                                <div style="grid-column: span 2; font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #666;">
                                    <i class="fas fa-address-book" style="margin-right: 8px;"></i>联络人信息
                                </div>
                                
                                <div class="info-row">
                                    <span class="label">姓名</span>
                                    <span class="value">{{ contactData.name }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">职位/角色</span>
                                    <span class="value">{{ contactData.role }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">电话</span>
                                    <span class="value">{{ contactData.phone }}</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">邮箱</span>
                                    <span class="value">{{ contactData.email }}</span>
                                </div>
                                <div class="info-row" style="grid-column: span 2;">
                                    <span class="label">地址</span>
                                    <span class="value">{{ contactData.address }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Case Facts -->
                <div v-if="activeTab === 'case-facts'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">案情描述</div>
                            <button class="icon-btn" style="font-size: 14px;" @click="editCaseFacts">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <div class="info-row" style="display: block;">
                            <span class="label" style="marginBottom: 8px;">案情摘要</span>
                            <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.8; font-size: 14px;">
                                2023年3月，原告张某与被告某科技有限公司签订软件开发合同，约定开发费用100万元。项目于2023年9月完成并交付，被告已支付50万元，剩余50万元尾款迟迟未支付。多次催款无果后，原告诉至法院。
                            </p>
                        </div>
                        <div class="info-row" style="display: block; margin-top: 16px;">
                            <span class="label">争议焦点</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    软件是否已实际交付
                                </span>
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    质量验收是否合格
                                </span>
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    违约损失金额
                                   </span>
                            </div>
                        </div>
                        <div class="info-row" style="margin-top: 16px;">
                            <span class="label">客户诉求</span>
                            <span class="value">支付剩余款项50万元 + 违约金8万元 + 利息</span>
                        </div>
                    </div>
                </div>

                <!-- Tab: Stakeholders -->
                <div v-if="activeTab === 'stakeholders'" class="tab-pane">
                    <!-- 原告列表 -->
                    <div class="modern-card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-user" style="margin-right: 8px; color: #4f46e5;"></i>
                                原告（我方客户）
                            </div>
                            <button class="smart-btn-secondary" style="font-size: 13px; padding: 6px 16px;" @click="addStakeholder('plaintiff')">
                                <i class="fas fa-plus"></i> 添加原告
                            </button>
                        </div>
                        <div v-for="(plaintiff, index) in stakeholders.plaintiffs" :key="plaintiff.id" 
                             :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">
                                    {{ plaintiff.type === 'person' ? '自然人' : '法人/组织' }} {{ index + 1 }}
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="icon-btn" style="font-size: 12px;" @click="editStakeholder('plaintiff', plaintiff)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-btn" style="font-size: 12px; color: #dc2626;" @click="deleteStakeholder('plaintiff', plaintiff.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="info-row">
                                <span class="label">姓名/名称</span>
                                <span class="value">{{ plaintiff.name }}</span>
                            </div>
                            <div class="info-row" v-if="plaintiff.type === 'person'">
                                <span class="label">身份证号</span>
                                <span class="value">{{ plaintiff.idNumber }}</span>
                            </div>
                            <div class="info-row" v-if="plaintiff.type === 'company'">
                                <span class="label">统一信用代码</span>
                                <span class="value">{{ plaintiff.creditCode }}</span>
                            </div>
                            <div class="info-row" v-if="plaintiff.phone">
                                <span class="label">联系电话</span>
                                <span class="value">{{ plaintiff.phone }}</span>
                            </div>
                            <div class="info-row" v-if="plaintiff.address">
                                <span class="label">地址</span>
                                <span class="value">{{ plaintiff.address }}</span>
                            </div>
                        </div>
                        <div v-if="stakeholders.plaintiffs.length === 0" style="text-align: center; padding: 40px 20px; color: #999;">
                            <i class="fas fa-user-plus" style="font-size: 32px; margin-bottom: 12px; opacity: 0.3;"></i>
                            <div>暂无原告信息，点击上方按钮添加</div>
                        </div>
                    </div>

                    <!-- 被告列表 -->
                    <div class="modern-card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-building" style="margin-right: 8px; color: #dc2626;"></i>
                                被告
                            </div>
                            <button class="smart-btn-secondary" style="font-size: 13px; padding: 6px 16px;" @click="addStakeholder('defendant')">
                                <i class="fas fa-plus"></i> 添加被告
                            </button>
                        </div>
                        <div v-for="(defendant, index) in stakeholders.defendants" :key="defendant.id"
                             :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">
                                    {{ defendant.type === 'person' ? '自然人' : '法人/组织' }} {{ index + 1 }}
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="icon-btn" style="font-size: 12px;" @click="editStakeholder('defendant', defendant)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-btn" style="font-size: 12px; color: #dc2626;" @click="deleteStakeholder('defendant', defendant.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="info-row">
                                <span class="label">{{ defendant.type === 'company' ? '公司名称' : '姓名' }}</span>
                                <span class="value">{{ defendant.name }}</span>
                            </div>
                            <div class="info-row" v-if="defendant.type === 'company' && defendant.legalRepresentative">
                                <span class="label">法定代表人</span>
                                <span class="value">{{ defendant.legalRepresentative }}</span>
                            </div>
                            <div class="info-row" v-if="defendant.type === 'company' && defendant.creditCode">
                                <span class="label">统一信用代码</span>
                                <span class="value">{{ defendant.creditCode }}</span>
                            </div>
                            <div class="info-row" v-if="defendant.type === 'person' && defendant.idNumber">
                                <span class="label">身份证号</span>
                                <span class="value">{{ defendant.idNumber }}</span>
                            </div>
                            <div class="info-row" v-if="defendant.address">
                                <span class="label">地址</span>
                                <span class="value">{{ defendant.address }}</span>
                            </div>
                            <div class="info-row" v-if="defendant.lawyer">
                                <span class="label">对方代理律师</span>
                                <span class="value">{{ defendant.lawyer }}</span>
                            </div>
                        </div>
                        <div v-if="stakeholders.defendants.length === 0" style="text-align: center; padding: 40px 20px; color: #999;">
                            <i class="fas fa-user-plus" style="font-size: 32px; margin-bottom: 12px; opacity: 0.3;"></i>
                            <div>暂无被告信息，点击上方按钮添加</div>
                        </div>
                    </div>

                    <!-- 第三人列表 -->
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-users" style="margin-right: 8px; color: #f59e0b;"></i>
                                第三人
                            </div>
                            <button class="smart-btn-secondary" style="font-size: 13px; padding: 6px 16px;" @click="addStakeholder('thirdParty')">
                                <i class="fas fa-plus"></i> 添加第三人
                            </button>
                        </div>
                        <div v-for="(thirdParty, index) in stakeholders.thirdParties" :key="thirdParty.id"
                             :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">
                                    {{ thirdParty.type === 'person' ? '自然人' : '法人/组织' }} {{ index + 1 }}
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="icon-btn" style="font-size: 12px;" @click="editStakeholder('thirdParty', thirdParty)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-btn" style="font-size: 12px; color: #dc2626;" @click="deleteStakeholder('thirdParty', thirdParty.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="info-row">
                                <span class="label">姓名/名称</span>
                                <span class="value">{{ thirdParty.name }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.type === 'person' && thirdParty.idNumber">
                                <span class="label">身份证号</span>
                                <span class="value">{{ thirdParty.idNumber }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.type === 'company' && thirdParty.creditCode">
                                <span class="label">统一信用代码</span>
                                <span class="value">{{ thirdParty.creditCode }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.address">
                                <span class="label">地址</span>
                                <span class="value">{{ thirdParty.address }}</span>
                            </div>
                        </div>
                        <div v-if="stakeholders.thirdParties.length === 0" style="text-align: center; padding: 40px 20px; color: #999;">
                            <i class="fas fa-user-plus" style="font-size: 32px; margin-bottom: 12px; opacity: 0.3;"></i>
                            <div>暂无第三人信息，点击上方按钮添加</div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Financials -->
                <div v-if="activeTab === 'financials'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">财务信息</div>
                            <button class="icon-btn" style="font-size: 14px;" @click="editFinancials">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <div class="info-row">
                            <span class="label">诉讼标的额</span>
                            <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">¥580,000</span>
                        </div>
                        <div style="padding: 12px; background: #f5f5f5; border-radius: 6px; margin: 12px 0; font-size: 13px; color: #666;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span>欠款本金</span>
                                <span>¥500,000</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>违约金</span>
                                <span>¥80,000</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <span class="label">律师费报价</span>
                            <span class="value">¥85,000</span>
                        </div>
                        <div class="info-row">
                            <span class="label">预估诉讼费</span>
                            <span class="value">¥11,300（按标的额计算）</span>
                        </div>
                        <div class="info-row">
                            <span class="label">计费时长</span>
                            <span class="value">45.5 小时</span>
                        </div>
                    </div>
                </div>



                <!-- Tab: AI Evidence Analysis -->
                <div v-if="activeTab === 'ai-evidence'" class="tab-pane">
                    <!-- Action Buttons -->
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 20px;">
                        <button class="smart-btn-secondary" @click="exportEvidenceList">
                            <i class="fas fa-download"></i> 导出清单
                        </button>
                        <button class="smart-btn-secondary">
                            <i class="fas fa-sync-alt"></i> 重新分析
                        </button>
                    </div>
                    
                    
                    <!-- Evidence Table -->
                    <h3 style="color: var(--text-primary); margin-bottom: 16px; font-size: 18px;">
                        <i class="fas fa-list-check" style="margin-right: 8px;"></i> 证据收集清单
                    </h3>

                    <div class="table-container">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th width="5%"><input type="checkbox"></th>
                                    <th width="30%">建议收集的证据</th>
                                    <th width="15%">重要性评分</th>
                                    <th width="15%">收集状态</th>
                                    <th width="20%">说明</th>
                                    <th width="15%">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in evidenceAnalysis.items" :key="item.id" :class="item.bgClass">
                                    <td><input type="checkbox" :checked="item.checked"></td>
                                    <td>
                                        <strong :style="{ color: item.priority >= 5 ? '#dc3545' : 'inherit' }">{{ item.name }}</strong>
                                    </td>
                                    <td>
                                        <div style="color: #ffc107; font-size: 14px; margin-bottom: 2px;">{{ getStarRating(item.priority) }}</div>
                                        <span class="priority-badge" :style="{ background: item.priorityColor }">{{ item.priorityLabel }}</span>
                                    </td>
                                    <td>
                                        <span :class="['status-badge-sm', item.status === 'collected' ? 'success' : 'secondary']">
                                            {{ item.statusText }}
                                        </span>
                                    </td>
                                    <td style="color: var(--text-secondary); font-size: 13px;">{{ item.desc }}</td>
                                    <td>
                                        <button 
                                            v-if="item.status === 'missing'"
                                            class="action-btn-pill success"
                                            @click="toggleStatus(item)"
                                        >
                                            <i class="fas fa-check"></i> 标记已收
                                        </button>
                                        <button 
                                            v-else
                                            class="action-btn-pill warning"
                                            @click="toggleStatus(item)"
                                        >
                                            <i class="fas fa-times"></i> 标记未收
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- AI Recommendations -->
                    <div class="ai-tips-box">
                        <h4 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                            <i class="fas fa-lightbulb" style="margin-right: 8px; color: #999;"></i> AI 建议
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); line-height: 1.6;">
                            <li>建议优先补充「往来函件、邮件记录」，这对证明违约事实至关重要</li>
                            <li>如有催告函或律师函，建议一并提交，可增强诉讼主张的合理性</li>
                            <li>当前证据完整度为 50%，建议至少达到 70% 以上再提起诉讼</li>
                        </ul>
                    </div>
                </div>






                <!-- Evidence List Tab -->
                <div v-if="activeTab === 'evidence-list'" class="tab-pane">
                    <!-- Evidence List -->
                    <div class="evidence-list-section">
                        <div class="section-header">
                            <h4 class="section-title">证据列表 ({{ evidenceFiles.length }})</h4>
                            <div class="list-actions">
                                <button class="primary-btn" @click="navigateToEvidenceUpload">
                                    <i class="fas fa-upload"></i> 上传证据
                                </button>
                                <button class="filter-btn"><i class="fas fa-filter"></i> 筛选</button>
                                <button class="filter-btn"><i class="fas fa-sort"></i> 排序</button>
                            </div>
                        </div>
                        
                        <div class="evidence-table-container">
                            <table class="evidence-table">
                                <thead>
                                    <tr>
                                        <th width="5%"><input type="checkbox"></th>
                                        <th width="35%">文件名称</th>
                                        <th width="15%">分类</th>
                                        <th width="12%">大小</th>
                                        <th width="18%">上传时间</th>
                                        <th width="15%">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="file in evidenceFiles" :key="file.id" class="evidence-row">
                                        <td><input type="checkbox"></td>
                                        <td>
                                            <div class="file-cell">
                                                <i :class="['fas', file.type === 'pdf' ? 'fa-file-pdf' : file.type === 'word' ? 'fa-file-word' : 'fa-file-image']" 
                                                   :style="{ color: file.type === 'pdf' ? '#ef4444' : file.type === 'word' ? '#3b82f6' : '#10b981' }"></i>
                                                <span class="file-name-text">{{ file.name }}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="category-tag-sm" :style="getCategoryStyle(file.category)">
                                                {{ getCategoryName(file.category) }}
                                            </span>
                                        </td>
                                        <td class="text-secondary">{{ formatSize(file.size) }}</td>
                                        <td class="text-secondary">{{ file.uploadTime }}</td>
                                        <td>
                                            <div class="table-actions">
                                                <button class="icon-btn-sm" title="预览"><i class="fas fa-eye"></i></button>
                                                <button class="icon-btn-sm" title="下载"><i class="fas fa-download"></i></button>
                                                <button class="icon-btn-sm" title="删除"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>







                <!-- Tab: Refactor (New) -->
                <div v-if="activeTab === 'refactor'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-tools" style="margin-right: 8px;"></i>
                                高级功能（重构）
                            </div>
                        </div>
                        <div style="padding: 40px; text-align: center;">
                            <div style="margin-bottom: 20px; color: #666;">
                                请从上方标签页选择具体的高级功能进行操作
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: AI Analysis (Refactor) -->
                <div v-if="activeTab === 'ai-analysis-refactor'" class="tab-pane">
                    <AIAnalysis :case-data="caseData" />
                </div>

                <!-- Tab: AI Assistant (Refactor) -->
                <div v-if="activeTab === 'ai-assistant-refactor'" class="tab-pane">
                    <AIAssistant :case-data="caseData" />
                </div>

                <!-- Tab: Relationship Graph (Refactor) -->
                <div v-if="activeTab === 'relationship-graph-refactor'" class="tab-pane">
                    <RelationshipGraph />
                </div>

                <!-- Tab: Evidence Timeline (Refactor) -->
                <div v-if="activeTab === 'timeline-refactor'" class="tab-pane">
                    <EvidenceTimeline />
                </div>

                <!-- Tab: Quote Generator (Refactor) -->
                <div v-if="activeTab === 'quote-generator-refactor'" class="tab-pane">
                    <QuoteGenerator :case-data="caseData" />
                </div>

            </div>
            <!-- Stakeholder Modal -->
            <div v-if="showStakeholderModal" class="modal-overlay" @click.self="showStakeholderModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">{{ currentStakeholder.id ? '编辑' : '添加' }}{{ currentStakeholder.role }}</div>
                        <button class="modal-close" @click="showStakeholderModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label">主体类型</label>
                            <div style="display: flex; gap: 16px;">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" v-model="currentStakeholder.type" value="person">
                                    <span>自然人</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" v-model="currentStakeholder.type" value="company">
                                    <span>法人/组织</span>
                                </label>
                            </div>
                        </div>

                        <div class="smart-form-group">
                            <label class="smart-label required">{{ currentStakeholder.type === 'company' ? '公司名称' : '姓名' }}</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.name" :placeholder="currentStakeholder.type === 'company' ? '请输入公司全称' : '请输入姓名'">
                        </div>

                        <!-- 自然人特有字段 -->
                        <template v-if="currentStakeholder.type === 'person'">
                            <div class="smart-form-group">
                                <label class="smart-label">身份证号</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.idNumber" placeholder="请输入身份证号">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">联系电话</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.phone" placeholder="请输入联系电话">
                            </div>
                        </template>

                        <!-- 公司特有字段 -->
                        <template v-if="currentStakeholder.type === 'company'">
                            <div class="smart-form-group">
                                <label class="smart-label">统一信用代码</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.creditCode" placeholder="请输入统一社会信用代码">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">法定代表人</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.legalRepresentative" placeholder="请输入法定代表人姓名">
                            </div>
                        </template>

                        <div class="smart-form-group">
                            <label class="smart-label">地址</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.address" placeholder="请输入联系地址">
                        </div>

                        <div class="smart-form-group" v-if="stakeholderType !== 'plaintiff'">
                            <label class="smart-label">代理律师</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.lawyer" placeholder="请输入对方代理律师信息">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showStakeholderModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveStakeholder"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>

            <!-- Basic Info Edit Modal -->
            <div v-if="showBasicInfoModal" class="modal-overlay" @click.self="showBasicInfoModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">编辑基础信息</div>
                        <button class="modal-close" @click="showBasicInfoModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label required">案件名称</label>
                            <input type="text" class="smart-input" v-model="editForm.name" placeholder="请输入案件名称">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案件编号</label>
                            <input type="text" class="smart-input" v-model="editForm.id" placeholder="请输入案件编号">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案由</label>
                            <input type="text" class="smart-input" v-model="editForm.type" placeholder="请输入案由">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">具体案由</label>
                            <input type="text" class="smart-input" v-model="editForm.category" placeholder="请输入具体案由">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">管辖法院/仲裁委</label>
                            <input type="text" class="smart-input" v-model="editForm.court" placeholder="请输入管辖法院或仲裁委">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">立案日期</label>
                            <input type="date" class="smart-input" v-model="editForm.filingDate">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案件阶段</label>
                            <select class="smart-select" v-model="editForm.stage">
                                <option v-for="stage in stageOptions" :key="stage" :value="stage">{{ stage }}</option>
                            </select>
                        </div>
                        
                        <!-- 联络人信息分隔 -->
                        <div style="grid-column: span 2; border-top: 1px solid #e5e5e5; margin: 16px 0;"></div>
                        <div style="grid-column: span 2; font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #666;">
                            <i class="fas fa-address-book" style="margin-right: 8px;"></i>联络人信息
                        </div>
                        
                        <div class="smart-form-group">
                            <label class="smart-label">姓名</label>
                            <input type="text" class="smart-input" v-model="editForm.contactName" placeholder="请输入联络人姓名">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">职位/角色</label>
                            <input type="text" class="smart-input" v-model="editForm.contactRole" placeholder="请输入职位或角色">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">电话</label>
                            <input type="text" class="smart-input" v-model="editForm.contactPhone" placeholder="请输入联系电话">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">邮箱</label>
                            <input type="email" class="smart-input" v-model="editForm.contactEmail" placeholder="请输入邮箱地址">
                        </div>
                        <div class="smart-form-group" style="grid-column: span 2;">
                            <label class="smart-label">地址</label>
                            <input type="text" class="smart-input" v-model="editForm.contactAddress" placeholder="请输入联系地址">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showBasicInfoModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveBasicInfo"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>

            <!-- Case Facts Edit Modal -->
            <div v-if="showCaseFactsModal" class="modal-overlay" @click.self="showCaseFactsModal = false">
                <div class="modal-container" style="width: 700px;">
                    <div class="modal-header">
                        <div class="modal-title">编辑案情描述</div>
                        <button class="modal-close" @click="showCaseFactsModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label">案情摘要</label>
                            <textarea class="smart-textarea" v-model="editForm.description" rows="6" placeholder="请详细描述案件的基本情况" style="border: 1px solid #ccc;"></textarea>
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">争议焦点</label>
                            <textarea class="smart-textarea" v-model="editForm.disputeFocus" rows="4" placeholder="请输入案件的主要争议焦点" style="border: 1px solid #ccc;"></textarea>
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">客户诉求</label>
                            <textarea class="smart-textarea" v-model="editForm.objective" rows="3" placeholder="请输入客户的诉讼目标和诉求" style="border: 1px solid #ccc;"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showCaseFactsModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveCaseFacts"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>

            <!-- Financials Edit Modal -->
            <div v-if="showFinancialsModal" class="modal-overlay" @click.self="showFinancialsModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">编辑财务信息</div>
                        <button class="modal-close" @click="showFinancialsModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label">诉讼标的额</label>
                            <input type="text" class="smart-input" v-model="editForm.amount" placeholder="请输入诉讼标的额">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">律师费报价</label>
                            <input type="text" class="smart-input" v-model="editForm.attorneyFee" placeholder="请输入律师费报价">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">预估诉讼费</label>
                            <input type="text" class="smart-input" v-model="editForm.courtCost" placeholder="请输入预估诉讼费">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">计费时长（小时）</label>
                            <input type="text" class="smart-input" v-model="editForm.billableHours" placeholder="请输入计费时长">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showFinancialsModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveFinancials"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>


            <!-- Case Form Modal -->
            <CaseForm 
                :visible="showEditModal" 
                :edit-id="caseData.id"
                @close="showEditModal = false"
                @saved="onCaseSaved"
            />
        </div>
    `
};
