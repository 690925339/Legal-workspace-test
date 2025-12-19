import { router } from '../router.js';
import { faruiCaseService } from '../services/faruiService.js';
import { filterService } from '../config/supabase.js';
import HistoryModal from '../components/HistoryModal.vue';

export default {
    name: 'LegalResearch',
    components: {
        HistoryModal
    },
    data() {
        return {
            activeTab: 'cases',
            searchQuery: '',
            showFilters: false,
            // 案例检索筛选条件
            caseFilters: {
                keywords: '',
                courtLevel: '',
                regions: [],        // 地域与法院（多选）
                yearStart: '',
                yearEnd: '',
                procedures: [],     // 审判程序（多选）
                docType: ''
            },
            // 展开的地域节点（用于层级结构）
            expandedRegions: {},
            // 法规检索筛选条件（匹配通义法睿 API 及新 UI）
            regulationFilters: {
                keywords: '',             // 关键词
                effectiveLevel: '',       // 效力级别
                issuingAuthority: '',     // 发文机关
                publishYearStart: '',     // 发布年份起
                publishYearEnd: '',       // 发布年份止
                effectiveYearStart: '',   // 实施年份起
                effectiveYearEnd: '',     // 实施年份止
                timeliness: ''            // 时效性
            },
            // 效力级别选项（从 Supabase 加载）
            effectiveLevelOptions: [],
            // 时效性选项（从 Supabase 加载）
            timelinessOptions: [],
            // 颁布部门/发文机关选项（从 Supabase 加载）
            departmentOptions: [],
            // 案例检索 - 法院层级选项（从 Supabase 加载）
            courtLevelOptions: [],
            // 案例检索 - 地域与法院选项（从 Supabase 加载）
            regionOptions: [],
            // 案例检索 - 审判程序选项（从 Supabase 加载）
            procedureOptions: [],
            // 案例检索 - 文书类型选项（从 Supabase 加载）
            docTypeOptions: [],
            // 筛选项加载状态
            filtersLoading: false,
            // 地域与法院搜索框
            regionSearchQuery: '',
            showRegionDropdown: false,
            // 审判程序搜索框
            procedureSearchQuery: '',
            showProcedureDropdown: false,
            suggestions: [
                '哪些属于夫妻共同财产',
                '收养未成年需要具备哪些条件',
                '无因管理如何认定',
                '劳动合同解除的法定条件'
            ],
            // 所有的推荐池（包含从后台获取的）
            allSuggestions: [],
            showHistoryModal: false,
            historyRecords: []
        };
    },
    async mounted() {
        this.loadFilterOptions();
        // 预加载推荐数据（后台静默加载，不阻塞渲染）
        this.loadSuggestionsPool();

        // 添加点击外部关闭下拉框的事件监听
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    computed: {
        years() {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 30 }, (_, i) => currentYear - i);
        },
        // 地域与法院筛选后的选项
        filteredRegionOptions() {
            if (!this.regionSearchQuery) return this.regionOptions;
            const query = this.regionSearchQuery.toLowerCase();
            return this.regionOptions.filter(opt => opt.label.toLowerCase().includes(query));
        },
        // 审判程序筛选后的选项
        filteredProcedureOptions() {
            if (!this.procedureSearchQuery) return this.procedureOptions;
            const query = this.procedureSearchQuery.toLowerCase();
            return this.procedureOptions.filter(opt => opt.label.toLowerCase().includes(query));
        }
    },
    methods: {
        async loadFilterOptions() {
            this.filtersLoading = true;
            try {
                // 加载案例检索筛选项
                const { data: caseOptions, error: caseError } = await filterService.getCaseFilterOptions();
                if (!caseError && caseOptions) {
                    const grouped = filterService.groupByFilterKey(caseOptions);
                    this.courtLevelOptions = grouped['court_level'] || [];
                    this.regionOptions = grouped['region'] || [];
                    this.procedureOptions = grouped['procedure'] || [];
                    this.docTypeOptions = grouped['doc_type'] || [];
                }

                // 加载法规检索筛选项
                const { data: regOptions, error: regError } = await filterService.getRegulationFilterOptions();
                if (!regError && regOptions) {
                    const grouped = filterService.groupByFilterKey(regOptions);
                    this.effectiveLevelOptions = grouped['effective_level'] || [];
                    this.timelinessOptions = grouped['timeliness'] || [];
                    this.departmentOptions = grouped['issuing_authority'] || [];
                }
            } catch (error) {
                console.error('加载筛选项失败:', error);
            } finally {
                this.filtersLoading = false;
            }
        },
        // 点击外部关闭下拉框
        handleClickOutside(event) {
            // 检查点击是否在下拉框区域外
            const regionDropdown = this.$el?.querySelector('.region-dropdown-container');
            const procedureDropdown = this.$el?.querySelector('.procedure-dropdown-container');

            if (this.showRegionDropdown && regionDropdown && !regionDropdown.contains(event.target)) {
                this.showRegionDropdown = false;
                this.regionSearchQuery = '';
            }
            if (this.showProcedureDropdown && procedureDropdown && !procedureDropdown.contains(event.target)) {
                this.showProcedureDropdown = false;
                this.procedureSearchQuery = '';
            }
        },
        switchTab(tab) {
            this.activeTab = tab;
            this.showFilters = false;  // 切换时关闭筛选面板
        },
        // 地域与法院下拉框方法
        toggleRegionDropdown() {
            this.showRegionDropdown = !this.showRegionDropdown;
            this.showProcedureDropdown = false;
        },
        // 切换地域选中状态（多选）
        toggleRegion(opt) {
            const index = this.caseFilters.regions.indexOf(opt.value);
            if (index === -1) {
                this.caseFilters.regions.push(opt.value);
            } else {
                this.caseFilters.regions.splice(index, 1);
            }
        },
        // 展开/收起地域节点
        toggleRegionExpand(region) {
            this.expandedRegions[region] = !this.expandedRegions[region];
        },
        // 审判程序下拉框方法
        toggleProcedureDropdown() {
            this.showProcedureDropdown = !this.showProcedureDropdown;
            this.showRegionDropdown = false;
        },
        // 切换审判程序选中状态（多选）
        toggleProcedure(opt) {
            const index = this.caseFilters.procedures.indexOf(opt.value);
            if (index === -1) {
                this.caseFilters.procedures.push(opt.value);
            } else {
                this.caseFilters.procedures.splice(index, 1);
            }
        },
        toggleEffectiveLevel(level) {
            const index = this.regulationFilters.effectiveLevel.indexOf(level);
            if (index === -1) {
                this.regulationFilters.effectiveLevel.push(level);
            } else {
                this.regulationFilters.effectiveLevel.splice(index, 1);
            }
        },
        toggleTimeliness(status) {
            const index = this.regulationFilters.timeliness.indexOf(status);
            if (index === -1) {
                this.regulationFilters.timeliness.push(status);
            } else {
                this.regulationFilters.timeliness.splice(index, 1);
            }
        },
        handleSearch() {
            if (!this.searchQuery.trim()) return;
            // 根据当前tab跳转到不同的结果页
            if (this.activeTab === 'cases') {
                // 案例检索带上筛选条件
                const params = new URLSearchParams();
                params.set('q', this.searchQuery);
                if (this.caseFilters.keywords) {
                    params.set('keywords', this.caseFilters.keywords);
                }
                if (this.caseFilters.courtLevel) {
                    params.set('courtLevel', this.caseFilters.courtLevel);
                }
                if (this.caseFilters.regions.length > 0) {
                    params.set('regions', this.caseFilters.regions.join(','));
                }
                if (this.caseFilters.yearStart) {
                    params.set('yearStart', this.caseFilters.yearStart);
                }
                if (this.caseFilters.yearEnd) {
                    params.set('yearEnd', this.caseFilters.yearEnd);
                }
                if (this.caseFilters.procedures.length > 0) {
                    params.set('procedures', this.caseFilters.procedures.join(','));
                }
                if (this.caseFilters.docType) {
                    params.set('docType', this.caseFilters.docType);
                }
                router.push(`/case-search-results?${params.toString()}`);
            } else if (this.activeTab === 'regulations') {
                // 法规检索带上筛选条件
                const params = new URLSearchParams();
                params.set('q', this.searchQuery);

                if (this.regulationFilters.keywords) {
                    params.set('keywords', this.regulationFilters.keywords);
                }
                if (this.regulationFilters.effectiveLevel) {
                    params.set('level', this.regulationFilters.effectiveLevel);
                }
                if (this.regulationFilters.issuingAuthority) {
                    params.set('issuingAuthority', this.regulationFilters.issuingAuthority);
                }
                if (this.regulationFilters.publishYearStart) {
                    params.set('publishYearStart', this.regulationFilters.publishYearStart);
                }
                if (this.regulationFilters.publishYearEnd) {
                    params.set('publishYearEnd', this.regulationFilters.publishYearEnd);
                }
                if (this.regulationFilters.effectiveYearStart) {
                    params.set('effectiveYearStart', this.regulationFilters.effectiveYearStart);
                }
                if (this.regulationFilters.effectiveYearEnd) {
                    params.set('effectiveYearEnd', this.regulationFilters.effectiveYearEnd);
                }
                if (this.regulationFilters.timeliness) {
                    params.set('timeliness', this.regulationFilters.timeliness);
                }

                router.push(`/regulation-search-results?${params.toString()}`);
            }
        },
        toggleFilters() {
            this.showFilters = !this.showFilters;
        },
        async loadSuggestionsPool() {
            try {
                // 将默认的建议也加入池子
                this.allSuggestions = [...this.suggestions];

                // 从后台获取更多推荐
                const dbSuggestions = await faruiCaseService.getSearchSuggestions();
                if (dbSuggestions && dbSuggestions.length > 0) {
                    // 合并并去重
                    const newSet = new Set([...this.allSuggestions, ...dbSuggestions]);
                    this.allSuggestions = Array.from(newSet);
                }
            } catch (error) {
                console.error('Failed to load suggestions pool:', error);
            }
        },
        refreshSuggestions() {
            // 如果池子太小，还是使用默认的随机逻辑（这里简单模拟）
            if (this.allSuggestions.length <= 4) {
                var newSuggestions = [
                    '如何认定工伤赔偿标准',
                    '知识产权侵权判定原则',
                    '房屋租赁合同纠纷处理',
                    '离婚诉讼中抚养权归属问题',
                    '民间借贷利息上限',
                    '道路交通事故责任认定',
                    '网络诽谤罪立案标准',
                    '企业破产清算流程'
                ];
                // 随机取4个
                this.suggestions = newSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
            } else {
                // 从大池子中随机取4个
                this.suggestions = this.allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
            }
        },
        useSuggestion(text) {
            this.searchQuery = text;
        },
        async openHistory() {
            try {
                // 从数据库加载真实的搜索历史
                const history = await faruiCaseService.getSearchHistory(10);

                // 转换为页面需要的格式
                this.historyRecords = history.map(item => ({
                    id: item.id,
                    title: item.query,
                    date: item.created_at,
                    type: '案例检索',
                    totalResults: item.total_results
                }));

                this.showHistoryModal = true;
            } catch (error) {
                console.error('Failed to load search history:', error);
                // 如果加载失败，显示空列表
                this.historyRecords = [];
                this.showHistoryModal = true;
            }
        },
        handleHistorySelect(record) {
            // 根据记录类型跳转到相应页面，添加fromHistory标记以从缓存加载
            if (record.type === '案例检索') {
                router.push(`/case-search-results?q=${encodeURIComponent(record.title)}&fromHistory=true`);
            } else {
                router.push(`/regulation-search-results?q=${encodeURIComponent(record.title)}&fromHistory=true`);
            }
        },
        async handleHistoryDelete(record) {
            // 乐观UI更新：立即从列表中移除，无需等待后台返回
            const previousRecords = [...this.historyRecords];
            this.historyRecords = this.historyRecords.filter(r => r.id !== record.id);

            try {
                // 后台异步执行物理删除
                await faruiCaseService.deleteSearchHistory(record.id, record.title);
            } catch (error) {
                console.error('Failed to delete history:', error);
                // 如果失败则回滚状态（极少发生）
                this.historyRecords = previousRecords;
                alert('删除失败，请稍后重试');
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
                <div class="smart-card" style="overflow: visible;">
                    <textarea 
                        class="smart-textarea" 
                        placeholder="请输入需要检索的内容，例如：合同纠纷、劳动争议、知识产权侵权等..."
                        v-model="searchQuery"
                        @keydown.enter.exact.prevent="handleSearch"
                    ></textarea>
                    
                    <!-- 筛选条件面板 - 案例检索 -->
                    <div v-if="showFilters && activeTab === 'cases'" style="padding: 20px; border-top: 1px solid #f0f0f0; background: #fafafa; overflow: visible;">
                        <div class="smart-form-grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px; overflow: visible;">
                            <div class="smart-form-group">
                                <label class="smart-label">关键词</label>
                                <input type="text" v-model="caseFilters.keywords" class="smart-input" placeholder="请输入关键词">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">法院层级</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="caseFilters.courtLevel" class="smart-select">
                                        <option value="">全部</option>
                                        <option v-for="opt in courtLevelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="smart-form-group region-dropdown-container" style="position: relative;">
                                <label class="smart-label">地域与法院</label>
                                <div class="smart-select-wrapper" @click="toggleRegionDropdown" style="cursor: pointer; position: relative;">
                                    <input 
                                        type="text" 
                                        v-model="regionSearchQuery" 
                                        class="smart-input" 
                                        :placeholder="caseFilters.regions.length > 0 ? caseFilters.regions.join(', ') : '请选择'"
                                        @focus="showRegionDropdown = true"
                                        @click.stop
                                        style="cursor: pointer; padding-right: 36px;"
                                    >
                                    <i class="fas fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999; pointer-events: none;"></i>
                                </div>
                                <div v-if="showRegionDropdown" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e5e5; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000; max-height: 280px; overflow-y: auto; margin-top: 4px;">
                                    <div 
                                        v-for="opt in filteredRegionOptions" 
                                        :key="opt.value"
                                        @click.stop="toggleRegion(opt)"
                                        style="padding: 10px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f5f5f5;"
                                        :style="{ background: caseFilters.regions.includes(opt.value) ? '#f5f5f5' : 'white' }"
                                    >
                                        <i :class="caseFilters.regions.includes(opt.value) ? 'fas fa-check-square' : 'far fa-square'" style="color: #1a73e8; flex-shrink: 0;"></i>
                                        <span style="color: #1a1a1a; font-size: 14px;">{{ opt.label }}</span>
                                    </div>
                                    <div v-if="filteredRegionOptions.length === 0" style="padding: 12px 16px; color: #999; text-align: center;">
                                        无匹配结果
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">裁判年份</label>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="caseFilters.yearStart" class="smart-select">
                                            <option value="">开始年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                    <span style="color: #666;">-</span>
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="caseFilters.yearEnd" class="smart-select">
                                            <option value="">结束年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group procedure-dropdown-container" style="position: relative;">
                                <label class="smart-label">审判程序</label>
                                <div class="smart-select-wrapper" @click="toggleProcedureDropdown" style="cursor: pointer; position: relative;">
                                    <input 
                                        type="text" 
                                        v-model="procedureSearchQuery" 
                                        class="smart-input" 
                                        :placeholder="caseFilters.procedures.length > 0 ? caseFilters.procedures.join(', ') : '请选择'"
                                        @focus="showProcedureDropdown = true"
                                        @click.stop
                                        style="cursor: pointer; padding-right: 36px;"
                                    >
                                    <i class="fas fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999; pointer-events: none;"></i>
                                </div>
                                <div v-if="showProcedureDropdown" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e5e5; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000; max-height: 280px; overflow-y: auto; margin-top: 4px;">
                                    <div 
                                        v-for="opt in filteredProcedureOptions" 
                                        :key="opt.value"
                                        @click.stop="toggleProcedure(opt)"
                                        style="padding: 10px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f5f5f5;"
                                        :style="{ background: caseFilters.procedures.includes(opt.value) ? '#f5f5f5' : 'white' }"
                                    >
                                        <i :class="caseFilters.procedures.includes(opt.value) ? 'fas fa-check-square' : 'far fa-square'" style="color: #1a73e8; flex-shrink: 0;"></i>
                                        <span style="color: #1a1a1a; font-size: 14px;">{{ opt.label }}</span>
                                    </div>
                                    <div v-if="filteredProcedureOptions.length === 0" style="padding: 12px 16px; color: #999; text-align: center;">
                                        无匹配结果
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">文书类型</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="caseFilters.docType" class="smart-select">
                                        <option value="">全部</option>
                                        <option v-for="opt in docTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <!-- 筛选条件面板 - 法规检索（匹配通义法睿 API 及新 UI） -->
                    <div v-if="showFilters && activeTab === 'regulations'" style="padding: 20px; border-top: 1px solid #f0f0f0; background: #fafafa;">
                        <div class="smart-form-grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <!-- 第一行：关键词、效力级别、发文机关 -->
                            <div class="smart-form-group">
                                <label class="smart-label">关键词</label>
                                <input type="text" v-model="regulationFilters.keywords" class="smart-input" placeholder="请输入">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">效力级别</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="regulationFilters.effectiveLevel" class="smart-select">
                                        <option value="">请选择</option>
                                        <option v-for="opt in effectiveLevelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">发文机关</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="regulationFilters.issuingAuthority" class="smart-select">
                                        <option value="">请选择</option>
                                        <option v-for="opt in departmentOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- 第二行：发布年份、实施年份、时效性 -->
                            <div class="smart-form-group">
                                <label class="smart-label">发布年份</label>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="regulationFilters.publishYearStart" class="smart-select">
                                            <option value="">开始年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                    <span style="color: #666;">-</span>
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="regulationFilters.publishYearEnd" class="smart-select">
                                            <option value="">结束年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">实施年份</label>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="regulationFilters.effectiveYearStart" class="smart-select">
                                            <option value="">开始年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                    <span style="color: #666;">-</span>
                                    <div class="smart-select-wrapper" style="flex: 1;">
                                        <select v-model="regulationFilters.effectiveYearEnd" class="smart-select">
                                            <option value="">结束年份</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">时效性</label>
                                <div class="smart-select-wrapper">
                                    <select v-model="regulationFilters.timeliness" class="smart-select">
                                        <option value="">请选择</option>
                                        <option v-for="opt in timelinessOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
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
                @delete="handleHistoryDelete"
            />
        </div>
    `
};
