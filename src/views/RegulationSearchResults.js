import { router } from '../router.js';

export default {
    name: 'RegulationSearchResults',
    data() {
        return {
            searchQuery: '',
            keywords: [],
            // 筛选条件（从 URL 参数解析）
            filterConditions: {
                keywords: '',
                effectiveLevel: '',
                issuingAuthority: '',
                publishYearStart: '',
                publishYearEnd: '',
                effectiveYearStart: '',
                effectiveYearEnd: '',
                timeliness: ''
            },
            sortBy: 'relevance',
            showSortDropdown: false,
            showEffectivenessDropdown: false,
            effectivenessFilters: {
                current: true,
                amended: true,
                abolished: true
            },
            showRegulationDetailModal: false,
            selectedRegulation: null,
            collapsedChapters: {},
            activeChapter: null,
            results: [
                {
                    id: 1,
                    title: '中华人民共和国民法典',
                    category: '法律',
                    publisher: '全国人民代表大会',
                    publisherCode: '中华人民共和国主席令第45号',
                    publishDate: '2020年05月28日',
                    effectiveDate: '2021年01月01日',
                    status: '现行有效',
                    content: '第九百七十九条 管理人没有法定的或者约定的义务，为避免他人利益受损失而管理他人事务的，可以请求受益人偿还因管理他人事务而支出的必要费用；管理人因管理事务受到损失的，可以请求受益人给予适当补偿。管理事务不符合受益人真实意思的，管理人不享有前款规定的权利；但是，受益人的真实意思违反法律或者违背公序良俗的除外。'
                },
                {
                    id: 2,
                    title: '中华人民共和国民法典',
                    category: '法律',
                    publisher: '全国人民代表大会',
                    publisherCode: '中华人民共和国主席令第45号',
                    publishDate: '2020年05月28日',
                    effectiveDate: '2021年01月01日',
                    status: '现行有效',
                    content: '第一百二十一条 没有法定的或者约定的义务，为避免他人利益受损失而进行管理的人，有权请求受益人偿还由此支出的必要费用。'
                },
                {
                    id: 3,
                    title: '中华人民共和国物权法',
                    category: '法律',
                    publisher: '全国人民代表大会',
                    publisherCode: '中华人民共和国主席令第62号',
                    publishDate: '2007年03月16日',
                    effectiveDate: '2007年10月01日',
                    status: '已失效',
                    content: '第三十条 因合法建造、拆除房屋等事实行为设立或者消灭物权的，自事实行为成就时发生效力。'
                }
            ],
            totalResults: 156
        };
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        this.searchQuery = urlParams.get('q') || '';

        // 解析筛选条件
        this.filterConditions.keywords = urlParams.get('keywords') || '';
        this.filterConditions.effectiveLevel = urlParams.get('level') || '';
        this.filterConditions.issuingAuthority = urlParams.get('issuingAuthority') || '';
        this.filterConditions.publishYearStart = urlParams.get('publishYearStart') || '';
        this.filterConditions.publishYearEnd = urlParams.get('publishYearEnd') || '';
        this.filterConditions.effectiveYearStart = urlParams.get('effectiveYearStart') || '';
        this.filterConditions.effectiveYearEnd = urlParams.get('effectiveYearEnd') || '';
        this.filterConditions.timeliness = urlParams.get('timeliness') || '';

        if (this.searchQuery) {
            this.keywords = this.extractLegalKeywords(this.searchQuery);
        }
    },
    methods: {
        extractLegalKeywords(text) {
            const legalTerms = [
                '无因管理', '不当得利', '合同', '侵权', '物权', '债权', '继承', '婚姻',
                '劳动', '行政', '刑事', '民事', '诉讼', '仲裁', '执行'
            ];
            const keywords = [];
            legalTerms.forEach(term => {
                if (text.includes(term)) {
                    keywords.push(term);
                }
            });
            if (keywords.length === 0) {
                const words = [];
                for (let len = 4; len >= 2; len--) {
                    for (let i = 0; i <= text.length - len; i++) {
                        const word = text.substring(i, i + len);
                        if (!['可以', '如何', '怎么', '什么', '哪些'].includes(word)) {
                            words.push(word);
                        }
                    }
                }
                keywords.push(...[...new Set(words)].slice(0, 7));
            }
            return [...new Set(keywords)].slice(0, 7);
        },
        newSearch() {
            router.push('/legal-research');
        },
        toggleSortDropdown() {
            this.showSortDropdown = !this.showSortDropdown;
        },
        changeSortBy(sort) {
            this.sortBy = sort;
            this.showSortDropdown = false;
        },
        toggleEffectivenessDropdown() {
            this.showEffectivenessDropdown = !this.showEffectivenessDropdown;
        },
        toggleEffectivenessFilter(filterKey) {
            this.effectivenessFilters[filterKey] = !this.effectivenessFilters[filterKey];
        },
        viewRegulationDetail(regId) {
            const regulation = this.results.find(r => r.id === regId);
            if (regulation) {
                this.selectedRegulation = {
                    ...regulation,
                    fullContent: this.generateFullRegulationContent(regulation),
                    chapters: this.generateChapters()
                };
                this.showRegulationDetailModal = true;
            }
        },
        closeRegulationDetailModal() {
            this.showRegulationDetailModal = false;
            this.selectedRegulation = null;
            this.collapsedChapters = {};
            this.activeChapter = null;
        },
        toggleChapter(chapterId) {
            this.$set(this.collapsedChapters, chapterId, !this.collapsedChapters[chapterId]);
        },
        scrollToChapter(chapterId) {
            this.activeChapter = chapterId;
            // 实际应用中，这里会滚动到对应的章节位置
            // 由于是模拟数据，这里只设置激活状态
        },
        isChapterVisible(chapter) {
            if (chapter.level === 1) return true;
            // 查找父章节
            const parentChapter = this.selectedRegulation.chapters.find(c =>
                c.level === chapter.level - 1 && c.id < chapter.id
            );
            if (!parentChapter) return true;
            return !this.collapsedChapters[parentChapter.id];
        },
        generateFullRegulationContent(regulation) {
            return `第一编 总则

第一章 基本规定

第一条
为了保护民事主体的合法权益，调整民事关系，维护社会和经济秩序，适应中国特色社会主义发展要求，弘扬社会主义核心价值观，根据宪法，制定本法。

第二条
民法调整平等主体的自然人、法人和非法人组织之间的人身关系和财产关系。

第三条
民事主体的人身权利、财产权利以及其他合法权益受法律保护，任何组织或者个人不得侵犯。

第四条
民事主体在民事活动中的法律地位一律平等。

第五条
民事主体从事民事活动，应当遵循自愿原则，按照自己的意思设立、变更、终止民事法律关系。`;
        },
        generateChapters() {
            return [
                { id: 1, title: '第一编 总则', level: 1 },
                { id: 2, title: '第一章 基本规定', level: 2 },
                { id: 3, title: '第二章 自然人', level: 2 },
                { id: 4, title: '第三章 法人', level: 2 },
                { id: 5, title: '第四章 非法人组织', level: 2 },
                { id: 6, title: '第五章 民事权利', level: 2 },
                { id: 7, title: '第六章 民事法律行为', level: 2 },
                { id: 8, title: '第七章 代理', level: 2 },
                { id: 9, title: '第八章 民事责任', level: 2 },
                { id: 10, title: '第九章 诉讼时效', level: 2 },
                { id: 11, title: '第十章 期间计算', level: 2 },
                { id: 12, title: '第二编 物权', level: 1 },
                { id: 13, title: '第一分编 通则', level: 2 },
                { id: 14, title: '第一章 一般规定', level: 3 }
            ];
        }
    },
    template: `
        <div class="smart-page" style="background: #fff;">
            <div class="smart-container" style="max-width: 1200px;">
                <!-- 顶部搜索栏 -->
                <div style="display: flex; align-items: center; gap: 16px; padding: 20px 0; border-bottom: 1px solid #e5e5e5;">
                    <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
                        <div style="flex: 1; font-size: 16px; color: #1a1a1a;">
                            {{ searchQuery }}
                        </div>
                        <button class="smart-btn-primary" @click="newSearch" style="padding: 8px 20px;">
                            <i class="fas fa-plus"></i> 新检索
                        </button>
                    </div>
                </div>

                <!-- 筛选条件标签 -->
                <div style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <!-- 智能提取的关键词 -->
                        <div v-if="keywords.length > 0" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">智能关键词：</span>
                            <span 
                                v-for="keyword in keywords" 
                                :key="keyword"
                                style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;"
                            >
                                {{ keyword }}
                            </span>
                        </div>
                        
                        <!-- 手动输入的关键词 -->
                        <div v-if="filterConditions.keywords" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">关键词：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.keywords }}
                            </span>
                        </div>

                        <!-- 效力级别 -->
                        <div v-if="filterConditions.effectiveLevel" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">效力级别：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.effectiveLevel }}
                            </span>
                        </div>

                        <!-- 发文机关 -->
                        <div v-if="filterConditions.issuingAuthority" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">发文机关：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.issuingAuthority }}
                            </span>
                        </div>

                        <!-- 发布年份 -->
                        <div v-if="filterConditions.publishYearStart || filterConditions.publishYearEnd" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">发布年份：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.publishYearStart || '...' }} - {{ filterConditions.publishYearEnd || '...' }}
                            </span>
                        </div>

                        <!-- 实施年份 -->
                        <div v-if="filterConditions.effectiveYearStart || filterConditions.effectiveYearEnd" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">实施年份：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.effectiveYearStart || '...' }} - {{ filterConditions.effectiveYearEnd || '...' }}
                            </span>
                        </div>

                        <!-- 时效性 -->
                        <div v-if="filterConditions.timeliness" style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #666; font-size: 14px;">时效性：</span>
                            <span style="padding: 4px 12px; background: #f5f5f5; border-radius: 4px; font-size: 14px; color: #1a1a1a;">
                                {{ filterConditions.timeliness }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 排序和筛选 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #e5e5e5;">
                    <div style="color: #666; font-size: 14px;">
                        共找到 {{ totalResults }} 条结果
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; position: relative;">
                        <!-- 相关度排序 -->
                        <div style="position: relative;">
                            <button class="smart-btn-secondary" @click="toggleSortDropdown" style="padding: 6px 16px; font-size: 14px;">
                                <i class="fas fa-sort-amount-down"></i> 相关度
                            </button>
                            <div v-if="showSortDropdown" style="position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid #e5e5e5; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000; min-width: 200px;">
                                <div 
                                    @click="changeSortBy('relevance')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                    :style="{ background: sortBy === 'relevance' ? '#f5f5f5' : 'white' }"
                                >
                                    <i class="fas fa-arrow-down" style="color: #666;"></i>
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">相关度</span>
                                    <i v-if="sortBy === 'relevance'" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click="changeSortBy('publish-desc')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                    :style="{ background: sortBy === 'publish-desc' ? '#f5f5f5' : 'white' }"
                                >
                                    <i class="fas fa-arrow-down" style="color: #666;"></i>
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">发布时间</span>
                                    <i v-if="sortBy === 'publish-desc'" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click="changeSortBy('publish-asc')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                    :style="{ background: sortBy === 'publish-asc' ? '#f5f5f5' : 'white' }"
                                >
                                    <i class="fas fa-arrow-up" style="color: #666;"></i>
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">发布时间</span>
                                    <i v-if="sortBy === 'publish-asc'" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click="changeSortBy('effective-desc')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                    :style="{ background: sortBy === 'effective-desc' ? '#f5f5f5' : 'white' }"
                                >
                                    <i class="fas fa-arrow-down" style="color: #666;"></i>
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">实施时间</span>
                                    <i v-if="sortBy === 'effective-desc'" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click="changeSortBy('effective-asc')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px;"
                                    :style="{ background: sortBy === 'effective-asc' ? '#f5f5f5' : 'white' }"
                                >
                                    <i class="fas fa-arrow-up" style="color: #666;"></i>
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">实施时间</span>
                                    <i v-if="sortBy === 'effective-asc'" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 时效性筛选 -->
                        <div style="position: relative;">
                            <button class="smart-btn-secondary" @click="toggleEffectivenessDropdown" style="padding: 6px 16px; font-size: 14px;">
                                时效性 <i class="fas fa-chevron-down"></i>
                            </button>
                            <div v-if="showEffectivenessDropdown" style="position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid #e5e5e5; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 1000; min-width: 180px;">
                                <div 
                                    @click.stop="toggleEffectivenessFilter('current')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                >
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">现行有效</span>
                                    <i v-if="effectivenessFilters.current" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click.stop="toggleEffectivenessFilter('amended')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;"
                                >
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">已被修改</span>
                                    <i v-if="effectivenessFilters.amended" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                                <div 
                                    @click.stop="toggleEffectivenessFilter('abolished')"
                                    style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px;"
                                >
                                    <span style="flex: 1; color: #1a1a1a; font-size: 14px;">已废止/失效</span>
                                    <i v-if="effectivenessFilters.abolished" class="fas fa-check" style="color: #1a73e8;"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 法规列表 -->
                <div style="padding: 20px 0; max-height: calc(100vh - 300px); overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none;">
                    <style>
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    </style>
                    <div 
                        v-for="result in results" 
                        :key="result.id"
                        style="padding: 24px; border-bottom: 1px solid #e5e5e5; cursor: pointer;"
                        @click="viewRegulationDetail(result.id)"
                    >
                        <!-- 标题和状态 -->
                        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                            <h3 style="flex: 1; font-size: 16px; font-weight: 500; color: #1a73e8; margin: 0; line-height: 1.5;">
                                {{ result.title }}
                            </h3>
                            <span :style="{
                                padding: '2px 8px',
                                background: result.status === '现行有效' ? '#e8f5e9' : '#ffebee',
                                color: result.status === '现行有效' ? '#2e7d32' : '#c62828',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                            }">
                                {{ result.status }}
                            </span>
                        </div>

                        <!-- 法规信息 -->
                        <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #666; flex-wrap: wrap;">
                            <span>{{ result.category }}</span>
                            <span>|</span>
                            <span>{{ result.publisher }}</span>
                            <span>|</span>
                            <span>{{ result.publisherCode }}</span>
                            <span>|</span>
                            <span>{{ result.publishDate }} 公布</span>
                            <span>|</span>
                            <span>{{ result.effectiveDate }} 施行</span>
                        </div>

                        <!-- 内容摘要 -->
                        <p style="font-size: 14px; color: #1a1a1a; line-height: 1.6; margin: 0;">
                            {{ result.content }}
                        </p>
                    </div>
                </div>

                <!-- 法规详情模态框 -->
                <div v-if="showRegulationDetailModal" @click="closeRegulationDetailModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div @click.stop style="background: white; border-radius: 12px; max-width: 1400px; width: 100%; max-height: 90vh; display: flex; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                        <!-- 左侧正文内容 -->
                        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                            <!-- 标题 -->
                            <div style="padding: 24px; border-bottom: 1px solid #e5e5e5; flex-shrink: 0;">
                                <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1a1a1a; text-align: center;">
                                    {{ selectedRegulation.title }}
                                </h2>
                            </div>

                            <!-- 正文内容 -->
                            <div style="flex: 1; overflow-y: auto; padding: 40px;">
                                <div style="max-width: 800px; margin: 0 auto; line-height: 2; color: #1a1a1a; white-space: pre-wrap; font-size: 15px;">{{ selectedRegulation.fullContent }}</div>
                            </div>

                            <!-- 关闭按钮 -->
                            <div style="padding: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: center; flex-shrink: 0;">
                                <button class="smart-btn-secondary" @click="closeRegulationDetailModal" style="padding: 8px 24px;">
                                    <i class="fas fa-times"></i> 关闭
                                </button>
                            </div>
                        </div>

                        <!-- 右侧目录 -->
                        <div style="width: 280px; border-left: 1px solid #e5e5e5; overflow-y: auto; flex-shrink: 0;">
                            <div style="padding: 12px;">
                                <div 
                                    v-for="chapter in selectedRegulation.chapters" 
                                    :key="chapter.id"
                                    v-show="isChapterVisible(chapter)"
                                    @click="scrollToChapter(chapter.id)"
                                    :style="{
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        fontSize: chapter.level === 1 ? '13px' : '12px',
                                        color: activeChapter === chapter.id ? '#1a73e8' : '#666',
                                        background: activeChapter === chapter.id ? '#f0f7ff' : 'transparent',
                                        borderRadius: '4px',
                                        marginLeft: (chapter.level - 1) * 12 + 'px',
                                        marginBottom: '2px',
                                        fontWeight: chapter.level === 1 ? '600' : '400',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }"
                                >
                                    <!-- 折叠图标（仅一级章节） -->
                                    <i 
                                        v-if="chapter.level === 1"
                                        @click.stop="toggleChapter(chapter.id)"
                                        :class="collapsedChapters[chapter.id] ? 'fas fa-chevron-right' : 'fas fa-chevron-down'"
                                        style="font-size: 10px; width: 12px;"
                                    ></i>
                                    <span style="flex: 1;">{{ chapter.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
