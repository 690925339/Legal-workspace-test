import CaseModuleLayout from '../../components/case/CaseModuleLayout.js';
import { router } from '../../router.js';

/**
 * 证据管理模块
 */
export default {
    name: 'CaseEvidence',
    components: {
        CaseModuleLayout
    },
    data() {
        return {
            caseId: '',
            caseData: {},
            activeSubTab: 'evidence-list', // evidence-list, ai-evidence
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
            evidenceAnalysis: {
                stats: {
                    completeness: { value: '50%', label: '(3/6)' },
                    collected: { value: '100%', label: '(2/2)' },
                    missing: { value: '3 项' }
                },
                items: [
                    { id: 1, name: '合同原件或复印件', priority: 5, priorityLabel: '极高', priorityColor: '#dc3545', status: 'collected', statusText: '✓ 已收集', desc: '证明双方权利义务的核心证据', checked: true, bgClass: 'bg-red-light' },
                    { id: 2, name: '付款凭证（发票、转账记录）', priority: 5, priorityLabel: '极高', priorityColor: '#dc3545', status: 'collected', statusText: '✓ 已收集', desc: '证明履行义务的关键证据', checked: true, bgClass: 'bg-red-light' },
                    { id: 3, name: '往来函件、邮件记录', priority: 4, priorityLabel: '高', priorityColor: '#ff9800', status: 'missing', statusText: '✗ 未收集', desc: '证明双方沟通和违约事实', checked: false, bgClass: '' },
                    { id: 4, name: '会议纪要、录音', priority: 4, priorityLabel: '高', priorityColor: '#ff9800', status: 'collected', statusText: '✓ 已收集', desc: '补充证明双方协商过程', checked: true, bgClass: '' },
                    { id: 5, name: '催告函、律师函', priority: 3, priorityLabel: '中', priorityColor: '#2196f3', status: 'missing', statusText: '✗ 未收集', desc: '证明已履行催告义务', checked: false, bgClass: '' },
                    { id: 6, name: '公司营业执照、资质证明', priority: 2, priorityLabel: '低', priorityColor: '#4caf50', status: 'missing', statusText: '✗ 未收集', desc: '证明主体资格', checked: false, bgClass: '' }
                ]
            }
        };
    },
    created() {
        const hash = window.location.hash;
        const match = hash.match(/\/detail\/([^/]+)/);
        this.caseId = match ? match[1] : '1';
    },
    methods: {
        onCaseLoaded(data) {
            this.caseData = data;
        },
        switchSubTab(tabId) {
            this.activeSubTab = tabId;
        },
        navigateToEvidenceUpload() {
            router.push('/evidence-upload');
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

            const percentage = Math.round((collected / total) * 100);
            this.evidenceAnalysis.stats.completeness.value = `${percentage}%`;
            this.evidenceAnalysis.stats.completeness.label = `(${collected}/${total})`;

            const highPriorityItems = items.filter(i => i.priority >= 4);
            const highPriorityTotal = highPriorityItems.length;
            const highPriorityCollected = highPriorityItems.filter(i => i.status === 'collected').length;

            this.evidenceAnalysis.stats.collected.value = `${Math.round((highPriorityCollected / highPriorityTotal) * 100)}%`;
            this.evidenceAnalysis.stats.collected.label = `(${highPriorityCollected}/${highPriorityTotal})`;
            this.evidenceAnalysis.stats.missing.value = `${missing} 项`;
        },
        exportEvidenceList() {
            const items = this.evidenceAnalysis.items;
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            csvContent += "建议收集的证据,重要性评分,收集状态,说明\n";

            items.forEach(item => {
                const row = [item.name, item.priorityLabel, item.statusText, item.desc].map(field => `"${field}"`).join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "证据收集清单.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    template: `
        <CaseModuleLayout :case-id="caseId" active-module="evidence" @case-loaded="onCaseLoaded">
            <!-- Sub Tabs -->
            <div class="tabs-container" style="margin-top: -24px; margin-bottom: 16px;">
                <div class="smart-tabs">
                    <div 
                        :class="['tab-pill', { active: activeSubTab === 'evidence-list' }]"
                        @click="switchSubTab('evidence-list')"
                    >
                        证据清单
                    </div>
                    <div 
                        :class="['tab-pill', { active: activeSubTab === 'ai-evidence' }]"
                        @click="switchSubTab('ai-evidence')"
                    >
                        证据分析规划
                    </div>
                </div>
            </div>

            <!-- Evidence List Tab -->
            <div v-if="activeSubTab === 'evidence-list'" class="tab-pane">
                <div class="modern-card">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">
                            <i class="fas fa-list" style="margin-right: 8px;"></i>证据列表 ({{ evidenceFiles.length }})
                        </div>
                        <div class="list-actions" style="display: flex; gap: 8px;">
                            <button class="primary-btn" @click="navigateToEvidenceUpload" style="padding: 6px 16px; font-size: 13px;">
                                <i class="fas fa-upload"></i> 上传
                            </button>
                            <button class="filter-btn" style="padding: 6px 12px; font-size: 13px;"><i class="fas fa-filter"></i> 筛选</button>
                            <button class="filter-btn" style="padding: 6px 12px; font-size: 13px;"><i class="fas fa-sort"></i> 排序</button>
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
            </div>

            <div v-if="activeSubTab === 'ai-evidence'" class="tab-pane">
                <div class="modern-card">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">
                            <i class="fas fa-list-check" style="margin-right: 8px;"></i>证据收集清单
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="smart-btn-secondary" @click="exportEvidenceList" style="padding: 6px 12px; font-size: 13px;">
                                <i class="fas fa-download"></i> 导出
                            </button>
                            <button class="smart-btn-secondary" style="padding: 6px 12px; font-size: 13px;">
                                <i class="fas fa-sync-alt"></i> 重新分析
                            </button>
                        </div>
                    </div>

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
            </div>
        </CaseModuleLayout>
    `
};
