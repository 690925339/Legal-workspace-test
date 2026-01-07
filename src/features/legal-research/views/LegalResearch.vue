<template>
  <div class="smart-page">
    <div class="smart-container">
      <!-- 页面头部 -->
      <div class="smart-header">
        <div class="smart-header-title-row">
          <div class="smart-header-actions">
            <button class="smart-btn-secondary" @click="openHistory">
              <i class="fas fa-history" /> 历史记录
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
      <div class="smart-card search-card">
        <textarea
          v-model="searchQuery"
          class="smart-textarea"
          placeholder="请输入需要检索的内容，例如：合同纠纷、劳动争议、知识产权侵权等..."
          @keydown.enter.exact.prevent="handleSearch"
        />

        <!-- 筛选条件面板 - 案例检索 -->
        <div v-if="showFilters && activeTab === 'cases'" class="filter-panel">
          <div class="smart-form-grid filter-grid">
            <div class="smart-form-group">
              <label class="smart-label">关键词</label>
              <input
                v-model="caseFilters.keywords"
                type="text"
                class="smart-input"
                placeholder="请输入关键词"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">法院层级</label>
              <div class="smart-select-wrapper">
                <select v-model="caseFilters.courtLevel" class="smart-select">
                  <option value="">全部</option>
                  <option v-for="opt in courtLevelOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="smart-form-group region-dropdown-container">
              <label class="smart-label">地域与法院</label>
              <div class="smart-select-wrapper" @click="toggleRegionDropdown">
                <input
                  v-model="regionSearchQuery"
                  type="text"
                  class="smart-input dropdown-input"
                  :placeholder="
                    caseFilters.regions.length > 0 ? caseFilters.regions.join(', ') : '请选择'
                  "
                  @focus="showRegionDropdown = true"
                  @click.stop
                />
                <i class="fas fa-search dropdown-icon" />
              </div>
              <div v-if="showRegionDropdown" class="dropdown-panel">
                <div
                  v-for="opt in filteredRegionOptions"
                  :key="opt.value"
                  class="dropdown-item"
                  :class="{ selected: caseFilters.regions.includes(opt.value) }"
                  @click.stop="toggleRegion(opt)"
                >
                  <i
                    :class="
                      caseFilters.regions.includes(opt.value)
                        ? 'fas fa-check-square'
                        : 'far fa-square'
                    "
                  />
                  <span>{{ opt.label }}</span>
                </div>
                <div v-if="filteredRegionOptions.length === 0" class="dropdown-empty">
                  无匹配结果
                </div>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">裁判年份</label>
              <div class="year-range">
                <div class="smart-select-wrapper">
                  <select v-model="caseFilters.yearStart" class="smart-select">
                    <option value="">开始年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <span class="range-separator">-</span>
                <div class="smart-select-wrapper">
                  <select v-model="caseFilters.yearEnd" class="smart-select">
                    <option value="">结束年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="smart-form-group procedure-dropdown-container">
              <label class="smart-label">审判程序</label>
              <div class="smart-select-wrapper" @click="toggleProcedureDropdown">
                <input
                  v-model="procedureSearchQuery"
                  type="text"
                  class="smart-input dropdown-input"
                  :placeholder="
                    caseFilters.procedures.length > 0 ? caseFilters.procedures.join(', ') : '请选择'
                  "
                  @focus="showProcedureDropdown = true"
                  @click.stop
                />
                <i class="fas fa-search dropdown-icon" />
              </div>
              <div v-if="showProcedureDropdown" class="dropdown-panel">
                <div
                  v-for="opt in filteredProcedureOptions"
                  :key="opt.value"
                  class="dropdown-item"
                  :class="{ selected: caseFilters.procedures.includes(opt.value) }"
                  @click.stop="toggleProcedure(opt)"
                >
                  <i
                    :class="
                      caseFilters.procedures.includes(opt.value)
                        ? 'fas fa-check-square'
                        : 'far fa-square'
                    "
                  />
                  <span>{{ opt.label }}</span>
                </div>
                <div v-if="filteredProcedureOptions.length === 0" class="dropdown-empty">
                  无匹配结果
                </div>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">文书类型</label>
              <div class="smart-select-wrapper">
                <select v-model="caseFilters.docType" class="smart-select">
                  <option value="">全部</option>
                  <option v-for="opt in docTypeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 筛选条件面板 - 法规检索 -->
        <div v-if="showFilters && activeTab === 'regulations'" class="filter-panel">
          <div class="smart-form-grid filter-grid">
            <div class="smart-form-group">
              <label class="smart-label">关键词</label>
              <input
                v-model="regulationFilters.keywords"
                type="text"
                class="smart-input"
                placeholder="请输入"
              />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">效力级别</label>
              <div class="smart-select-wrapper">
                <select v-model="regulationFilters.effectiveLevel" class="smart-select">
                  <option value="">请选择</option>
                  <option v-for="opt in effectiveLevelOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">发文机关</label>
              <div class="smart-select-wrapper">
                <select v-model="regulationFilters.issuingAuthority" class="smart-select">
                  <option value="">请选择</option>
                  <option v-for="opt in departmentOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">发布年份</label>
              <div class="year-range">
                <div class="smart-select-wrapper">
                  <select v-model="regulationFilters.publishYearStart" class="smart-select">
                    <option value="">开始年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <span class="range-separator">-</span>
                <div class="smart-select-wrapper">
                  <select v-model="regulationFilters.publishYearEnd" class="smart-select">
                    <option value="">结束年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">实施年份</label>
              <div class="year-range">
                <div class="smart-select-wrapper">
                  <select v-model="regulationFilters.effectiveYearStart" class="smart-select">
                    <option value="">开始年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <span class="range-separator">-</span>
                <div class="smart-select-wrapper">
                  <select v-model="regulationFilters.effectiveYearEnd" class="smart-select">
                    <option value="">结束年份</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">时效性</label>
              <div class="smart-select-wrapper">
                <select v-model="regulationFilters.timeliness" class="smart-select">
                  <option value="">请选择</option>
                  <option v-for="opt in timelinessOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="smart-card-footer">
          <div class="smart-search-actions">
            <button class="smart-btn-pill" :class="{ active: showFilters }" @click="toggleFilters">
              <i class="fas fa-filter" /> 筛选条件
            </button>
          </div>
          <button class="smart-btn-primary" :disabled="!searchQuery.trim()" @click="handleSearch">
            <i class="fas fa-search" /> 开始检索
          </button>
        </div>
      </div>

      <!-- 搜索建议 -->
      <div class="smart-suggestions">
        <div class="smart-suggestions-header">
          <span>试试这么问：</span>
          <button class="smart-btn-secondary" @click="refreshSuggestions">
            <i class="fas fa-sync-alt" /> 换一批
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
        <i class="fas fa-info-circle" />
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
</template>

<script>
import router from '@/router/index.js'
import { faruiCaseService } from '@/services/faruiService.js'
import { filterService } from '@/config/supabase.js'
import HistoryModal from '@/components/HistoryModal.vue'

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
      caseFilters: {
        keywords: '',
        courtLevel: '',
        regions: [],
        yearStart: '',
        yearEnd: '',
        procedures: [],
        docType: ''
      },
      expandedRegions: {},
      regulationFilters: {
        keywords: '',
        effectiveLevel: '',
        issuingAuthority: '',
        publishYearStart: '',
        publishYearEnd: '',
        effectiveYearStart: '',
        effectiveYearEnd: '',
        timeliness: ''
      },
      effectiveLevelOptions: [],
      timelinessOptions: [],
      departmentOptions: [],
      courtLevelOptions: [],
      regionOptions: [],
      procedureOptions: [],
      docTypeOptions: [],
      filtersLoading: false,
      regionSearchQuery: '',
      showRegionDropdown: false,
      procedureSearchQuery: '',
      showProcedureDropdown: false,
      suggestions: [
        '哪些属于夫妻共同财产',
        '收养未成年需要具备哪些条件',
        '无因管理如何认定',
        '劳动合同解除的法定条件'
      ],
      allSuggestions: [],
      showHistoryModal: false,
      historyRecords: []
    }
  },

  computed: {
    years() {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 30 }, (_, i) => currentYear - i)
    },
    filteredRegionOptions() {
      if (!this.regionSearchQuery) return this.regionOptions
      const query = this.regionSearchQuery.toLowerCase()
      return this.regionOptions.filter(opt => opt.label.toLowerCase().includes(query))
    },
    filteredProcedureOptions() {
      if (!this.procedureSearchQuery) return this.procedureOptions
      const query = this.procedureSearchQuery.toLowerCase()
      return this.procedureOptions.filter(opt => opt.label.toLowerCase().includes(query))
    }
  },

  async mounted() {
    this.loadFilterOptions()
    this.loadSuggestionsPool()
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    async loadFilterOptions() {
      this.filtersLoading = true
      try {
        const { data: caseOptions, error: caseError } = await filterService.getCaseFilterOptions()
        if (!caseError && caseOptions) {
          const grouped = filterService.groupByFilterKey(caseOptions)
          this.courtLevelOptions = grouped['court_level'] || []
          this.regionOptions = grouped['region'] || []
          this.procedureOptions = grouped['procedure'] || []
          this.docTypeOptions = grouped['doc_type'] || []
        }

        const { data: regOptions, error: regError } =
          await filterService.getRegulationFilterOptions()
        if (!regError && regOptions) {
          const grouped = filterService.groupByFilterKey(regOptions)
          this.effectiveLevelOptions = grouped['effective_level'] || []
          this.timelinessOptions = grouped['timeliness'] || []
          this.departmentOptions = grouped['issuing_authority'] || []
        }
      } catch (error) {
        console.error('加载筛选项失败:', error)
      } finally {
        this.filtersLoading = false
      }
    },

    handleClickOutside(event) {
      const regionDropdown = this.$el?.querySelector('.region-dropdown-container')
      const procedureDropdown = this.$el?.querySelector('.procedure-dropdown-container')

      if (this.showRegionDropdown && regionDropdown && !regionDropdown.contains(event.target)) {
        this.showRegionDropdown = false
        this.regionSearchQuery = ''
      }
      if (
        this.showProcedureDropdown &&
        procedureDropdown &&
        !procedureDropdown.contains(event.target)
      ) {
        this.showProcedureDropdown = false
        this.procedureSearchQuery = ''
      }
    },

    switchTab(tab) {
      this.activeTab = tab
      this.showFilters = false
    },

    toggleRegionDropdown() {
      this.showRegionDropdown = !this.showRegionDropdown
      this.showProcedureDropdown = false
    },

    toggleRegion(opt) {
      const index = this.caseFilters.regions.indexOf(opt.value)
      if (index === -1) {
        this.caseFilters.regions.push(opt.value)
      } else {
        this.caseFilters.regions.splice(index, 1)
      }
    },

    toggleProcedureDropdown() {
      this.showProcedureDropdown = !this.showProcedureDropdown
      this.showRegionDropdown = false
    },

    toggleProcedure(opt) {
      const index = this.caseFilters.procedures.indexOf(opt.value)
      if (index === -1) {
        this.caseFilters.procedures.push(opt.value)
      } else {
        this.caseFilters.procedures.splice(index, 1)
      }
    },

    handleSearch() {
      if (!this.searchQuery.trim()) return

      if (this.activeTab === 'cases') {
        const params = new URLSearchParams()
        params.set('q', this.searchQuery)
        if (this.caseFilters.keywords) params.set('keywords', this.caseFilters.keywords)
        if (this.caseFilters.courtLevel) params.set('courtLevel', this.caseFilters.courtLevel)
        if (this.caseFilters.regions.length > 0)
          params.set('regions', this.caseFilters.regions.join(','))
        if (this.caseFilters.yearStart) params.set('yearStart', this.caseFilters.yearStart)
        if (this.caseFilters.yearEnd) params.set('yearEnd', this.caseFilters.yearEnd)
        if (this.caseFilters.procedures.length > 0)
          params.set('procedures', this.caseFilters.procedures.join(','))
        if (this.caseFilters.docType) params.set('docType', this.caseFilters.docType)
        router.push(`/case-search-results?${params.toString()}`)
      } else if (this.activeTab === 'regulations') {
        const params = new URLSearchParams()
        params.set('q', this.searchQuery)
        if (this.regulationFilters.keywords) params.set('keywords', this.regulationFilters.keywords)
        if (this.regulationFilters.effectiveLevel)
          params.set('level', this.regulationFilters.effectiveLevel)
        if (this.regulationFilters.issuingAuthority)
          params.set('issuingAuthority', this.regulationFilters.issuingAuthority)
        if (this.regulationFilters.publishYearStart)
          params.set('publishYearStart', this.regulationFilters.publishYearStart)
        if (this.regulationFilters.publishYearEnd)
          params.set('publishYearEnd', this.regulationFilters.publishYearEnd)
        if (this.regulationFilters.effectiveYearStart)
          params.set('effectiveYearStart', this.regulationFilters.effectiveYearStart)
        if (this.regulationFilters.effectiveYearEnd)
          params.set('effectiveYearEnd', this.regulationFilters.effectiveYearEnd)
        if (this.regulationFilters.timeliness)
          params.set('timeliness', this.regulationFilters.timeliness)
        router.push(`/regulation-search-results?${params.toString()}`)
      }
    },

    toggleFilters() {
      this.showFilters = !this.showFilters
    },

    async loadSuggestionsPool() {
      try {
        this.allSuggestions = [...this.suggestions]
        const dbSuggestions = await faruiCaseService.getSearchSuggestions()
        if (dbSuggestions && dbSuggestions.length > 0) {
          const newSet = new Set([...this.allSuggestions, ...dbSuggestions])
          this.allSuggestions = Array.from(newSet)
        }
      } catch (error) {
        console.error('Failed to load suggestions pool:', error)
      }
    },

    refreshSuggestions() {
      if (this.allSuggestions.length <= 4) {
        const newSuggestions = [
          '如何认定工伤赔偿标准',
          '知识产权侵权判定原则',
          '房屋租赁合同纠纷处理',
          '离婚诉讼中抚养权归属问题',
          '民间借贷利息上限',
          '道路交通事故责任认定',
          '网络诽谤罪立案标准',
          '企业破产清算流程'
        ]
        this.suggestions = newSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4)
      } else {
        this.suggestions = this.allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4)
      }
    },

    useSuggestion(text) {
      this.searchQuery = text
    },

    async openHistory() {
      try {
        const history = await faruiCaseService.getSearchHistory(10)
        console.log('Fetched history:', history)

        if (Array.isArray(history)) {
          this.historyRecords = history.map(item => ({
            id: item.id,
            title: item.query,
            date: item.created_at,
            type: '案例检索',
            totalResults: item.total_results || 0
          }))
        } else {
          console.warn('History data is not an array:', history)
          this.historyRecords = []
        }
        this.showHistoryModal = true
      } catch (error) {
        console.error('Failed to load search history:', error)
        this.historyRecords = []
        this.showHistoryModal = true
      }
    },

    handleHistorySelect(record) {
      if (record.type === '案例检索') {
        router.push(`/case-search-results?q=${encodeURIComponent(record.title)}&fromHistory=true`)
      } else {
        router.push(
          `/regulation-search-results?q=${encodeURIComponent(record.title)}&fromHistory=true`
        )
      }
    },

    async handleHistoryDelete(record) {
      const previousRecords = [...this.historyRecords]
      this.historyRecords = this.historyRecords.filter(r => r.id !== record.id)

      try {
        await faruiCaseService.deleteSearchHistory(record.id, record.title)
      } catch (error) {
        console.error('Failed to delete history:', error)
        this.historyRecords = previousRecords
        alert('删除失败，请稀后重试')
      }
    }
  }
}
</script>

<style scoped>
.search-card {
  overflow: visible;
}

.filter-panel {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  overflow: visible;
}

.filter-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  overflow: visible;
}

.region-dropdown-container,
.procedure-dropdown-container {
  position: relative;
}

.dropdown-input {
  cursor: pointer;
  padding-right: 36px;
}

.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 280px;
  overflow-y: auto;
  margin-top: 4px;
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.dropdown-item:hover {
  background: #f9f9f9;
}

.dropdown-item.selected {
  background: #f5f5f5;
}

.dropdown-item i {
  color: #1a73e8;
  flex-shrink: 0;
}

.dropdown-item span {
  color: #1a1a1a;
  font-size: 14px;
}

.dropdown-empty {
  padding: 12px 16px;
  color: #999;
  text-align: center;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-range .smart-select-wrapper {
  flex: 1;
}

.range-separator {
  color: #666;
}

.smart-btn-pill.active {
  background: #e5e7eb;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
