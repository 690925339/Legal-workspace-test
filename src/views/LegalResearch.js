import { router } from '../router.js';

export default {
    name: 'LegalResearch',
    data() {
        return {
            activeTab: 'cases',
            searchQuery: '',
            showFilters: false,
            filters: {
                keywords: '',
                courtLevel: '',
                region: '',
                yearStart: '',
                yearEnd: '',
                procedure: '',
                docType: ''
            },
            suggestions: [
                '哪些属于夫妻共同财产',
                '收养未成年需要具备哪些条件',
                '无因管理如何认定',
                '劳动合同解除的法定条件'
            ],
            showHistoryModal: false,
            historyRecords: []
        };
    },
    computed: {
        years() {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 30 }, (_, i) => currentYear - i);
        }
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab;
        },
        handleSearch() {
            if (!this.searchQuery.trim()) return;
            // 根据当前tab跳转到不同的结果页
            if (this.activeTab === 'cases') {
                router.push(`/case-search-results?q=${encodeURIComponent(this.searchQuery)}`);
            } else if (this.activeTab === 'regulations') {
                router.push(`/regulation-search-results?q=${encodeURIComponent(this.searchQuery)}`);
            }
        },
        toggleFilters() {
            this.showFilters = !this.showFilters;
        },
        refreshSuggestions() {
            var newSuggestions = [
                '如何认定工伤赔偿标准',
                '知识产权侵权判定原则',
                '房屋租赁合同纠纷处理',
                '离婚诉讼中抚养权归属问题'
            ];
            this.suggestions = newSuggestions;
        },
        useSuggestion(text) {
            this.searchQuery = text;
        },
        openHistory() {
            // 模拟历史记录数据
            this.historyRecords = [
                { id: 1, title: '劳动合同纠纷', date: '2025-12-08T09:30:00', type: '案例检索' },
                { id: 2, title: '知识产权侵权', date: '2025-12-07T14:20:00', type: '法规检索' },
                { id: 3, title: '房屋租赁合同', date: '2025-12-06T11:15:00', type: '案例检索' },
                { id: 4, title: '离婚财产分割', date: '2025-12-05T16:45:00', type: '法规检索' },
                { id: 5, title: '交通事故赔偿标准', date: '2025-12-04T10:00:00', type: '案例检索' },
                { id: 6, title: '民间借贷利息上限', date: '2025-12-03T09:00:00', type: '法规检索' },
                { id: 7, title: '公司股权转让流程', date: '2025-12-02T15:30:00', type: '案例检索' },
                { id: 8, title: '网络购物退货规定', date: '2025-12-01T11:20:00', type: '法规检索' },
                { id: 9, title: '医疗事故鉴定程序', date: '2025-11-30T14:00:00', type: '案例检索' },
                { id: 10, title: '建设工程施工合同', date: '2025-11-29T10:10:00', type: '案例检索' }
            ];
            this.showHistoryModal = true;
        },
        handleHistorySelect(record) {
            // 根据记录类型跳转到相应页面
            if (record.type === '案例检索') {
                router.push(`/case-search-results?q=${encodeURIComponent(record.title)}`);
            } else {
                router.push(`/regulation-search-results?q=${encodeURIComponent(record.title)}`);
            }
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
                        <h1>法律检索，智能化检索法规和案例</h1>
                    </div>
                    <p>输入搜索内容检索相关司法案例、法律法规</p>
                    
                    <!-- 标签切换 -->
                    <div class="smart-tabs">
                        <button 
                            :class="['smart-tab-btn', { active: activeTab === 'cases' }]"
                            @click="switchTab('cases')"
                        >
                            案例检索
                        </button>
                        <button 
                            :class="['smart-tab-btn', { active: activeTab === 'regulations' }]"
                            @click="switchTab('regulations')"
                        >
                            法规检索
                        </button>
                    </div>
                </div>

                <!-- 搜索卡片 -->
                <div class="smart-card">
                    <textarea 
                        class="smart-textarea" 
                        placeholder="请输入需要检索的内容，例如：合同纠纷、劳动争议、知识产权侵权等..."
                        v-model="searchQuery"
                        @keydown.enter.exact.prevent="handleSearch"
                    ></textarea>
                    
                    <!-- 筛选条件面板 -->
                    <div v-if="showFilters" style="padding: 20px; border-top: 1px solid #f0f0f0; background: #fafafa;">
                        <div class="smart-form-grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div class="smart-form-group">
                                <label class="smart-label">关键词</label>
                                <input type="text" v-model="filters.keywords" class="smart-input" placeholder="请输入关键词">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">法院层级</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="filters.courtLevel" class="smart-select">
                                        <option value="">全部</option>
                                        <option value="supreme">最高人民法院</option>
                                        <option value="high">高级人民法院</option>
                                        <option value="intermediate">中级人民法院</option>
                                        <option value="basic">基层人民法院</option>
                                    </select>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">地域与法院</label>
                                <input type="text" v-model="filters.region" class="smart-input" placeholder="例如：北京、上海">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">裁判年份</label>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="filters.yearStart" class="smart-select">
                                            <option value="">开始年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                    <span style="color: #666;">-</span>
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="filters.yearEnd" class="smart-select">
                                            <option value="">结束年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">审判程序</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="filters.procedure" class="smart-select">
                                        <option value="">全部</option>
                                        <option value="first">一审</option>
                                        <option value="second">二审</option>
                                        <option value="retrial">再审</option>
                                        <option value="execution">执行</option>
                                    </select>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">文书类型</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="filters.docType" class="smart-select">
                                        <option value="">全部</option>
                                        <option value="judgment">判决书</option>
                                        <option value="ruling">裁定书</option>
                                        <option value="mediation">调解书</option>
                                        <option value="decision">决定书</option>
                                        <option value="notice">通知书</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="smart-card-footer">
                        <div class="smart-search-actions">
                            <button class="smart-btn-pill" @click="toggleFilters" :style="showFilters ? 'background: #e5e7eb; color: #1a1a1a;' : ''">
                                <i class="fas fa-filter"></i> 筛选条件
                            </button>
                        </div>
                        <button class="smart-btn-primary" @click="handleSearch" :disabled="!searchQuery.trim()">
                            <i class="fas fa-search"></i> 开始检索
                        </button>
                    </div>
                </div>

                <!-- 搜索建议 -->
                <div class="smart-suggestions">
                    <div class="smart-suggestions-header">
                        <span>试试这么问：</span>
                        <button class="smart-btn-secondary" @click="refreshSuggestions">
                            <i class="fas fa-sync-alt"></i> 换一批
                        </button>
                    </div>
                    <div class="smart-suggestions-grid">
                        <div 
                            v-for="(suggestion, index) in suggestions" 
                            :key="index"
                            class="smart-suggestion-item"
                            @click="useSuggestion(suggestion)"
                        >
                            {{ suggestion }}
                        </div>
                    </div>
                </div>

                <!-- 底部提示 -->
                <div class="smart-footer-info">
                    <i class="fas fa-info-circle"></i>
                    <span>检索结果基于最新法律法规数据库，仅供参考</span>
                </div>
            </div>
            
            <!-- 历史记录模态框 -->
            <HistoryModal
                v-model:visible="showHistoryModal"
                title="检索历史"
                :records="historyRecords"
                :tabs="['案例检索', '法规检索']"
                @select="handleHistorySelect"
            />
        </div>
    `
};
