import { router } from '../router.js';

export default {
    name: 'LegalResearch',
    data() {
        return {
            activeTab: 'cases', // 'cases' or 'regulations'
            searchQuery: '',
            suggestions: [
                '哪些属于夫妻共同财产',
                '收养未成年需要具备哪些条件',
                '无因管理如何认定',
                '2023年3月，经朋友提醒，我得知，在游戏开黑软件上有一个以自己的...'
            ]
        };
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab;
        },
        handleSearch() {
            if (!this.searchQuery.trim()) return;
            alert('搜索功能开发中: ' + this.searchQuery);
        },
        refreshSuggestions() {
            // Mock refresh
            const newSuggestions = [
                '如何认定工伤赔偿标准',
                '知识产权侵权判定原则',
                '房屋租赁合同纠纷处理',
                '离婚诉讼中抚养权归属问题'
            ];
            this.suggestions = newSuggestions;
        }
    },
    template: `
        <div class="legal-research-page">
            <div class="content-canvas">
                <div class="research-container">
                    <div class="research-header">
                        <h1>法律检索，智能化检索法规和案例</h1>
                        <p>输入搜索内容检索相关司法案例、法律法规</p>
                        
                        <div class="research-tabs">
                            <button 
                                :class="['research-tab-btn', { active: activeTab === 'cases' }]"
                                @click="switchTab('cases')"
                            >
                                案例
                            </button>
                            <button 
                                :class="['research-tab-btn', { active: activeTab === 'regulations' }]"
                                @click="switchTab('regulations')"
                            >
                                法规
                            </button>
                        </div>
                    </div>

                    <div class="search-card">
                        <textarea 
                            class="search-textarea" 
                            placeholder="请输入需要检索的内容，支持按Shift+Enter换行"
                            v-model="searchQuery"
                            @keydown.enter.exact.prevent="handleSearch"
                        ></textarea>
                        
                        <div class="search-actions">
                            <button class="filter-btn-pill">
                                <i class="fas fa-filter"></i> 筛选
                            </button>
                            <button class="search-submit-btn" @click="handleSearch">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div class="suggestions-section">
                        <div class="suggestions-header">
                            <span>试试这么问：</span>
                            <button class="refresh-btn" @click="refreshSuggestions">
                                <i class="fas fa-sync-alt"></i> 换一批
                            </button>
                        </div>
                        <div class="suggestions-grid">
                            <div 
                                v-for="(suggestion, index) in suggestions" 
                                :key="index"
                                class="suggestion-card"
                                @click="searchQuery = suggestion"
                            >
                                {{ suggestion }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
