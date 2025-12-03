import { router } from '../router.js';

export default {
    name: 'LegalResearch',
    data() {
        return {
            activeTab: 'cases',
            searchQuery: '',
            suggestions: [
                '哪些属于夫妻共同财产',
                '收养未成年需要具备哪些条件',
                '无因管理如何认定',
                '劳动合同解除的法定条件'
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
        }
    },
    template: `
        <div class="smart-page">
            <div class="smart-container">
                <!-- 页面头部 -->
                <div class="smart-header">
                    <div class="smart-header-title-row">
                        <div class="smart-header-actions">
                            <button class="smart-btn-secondary" @click="alert('历史记录功能开发中')">
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
                    
                    <div class="smart-card-footer">
                        <div class="smart-search-actions">
                            <button class="smart-btn-pill">
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
        </div>
    `
};
