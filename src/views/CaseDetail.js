import { router } from '../router.js'
import AIAnalysis from './refactor/AIAnalysis.js'
import AIAssistant from './refactor/AIAssistant.js'
import RelationshipGraph from './refactor/RelationshipGraph.js'
import EvidenceTimeline from './refactor/EvidenceTimeline.js'
import QuoteGenerator from './refactor/QuoteGenerator.js'
import CaseForm from './CaseForm.vue'

export default {
  name: 'CaseDetail',
  components: {
    AIAnalysis,
    AIAssistant,
    RelationshipGraph,
    EvidenceTimeline,
    QuoteGenerator,
    CaseForm
  },
  data() {
    return {
      activeTab: 'basic',
      activeCategory: 'basic',
      caseData: null,
      showEditModal: false,
      tabStructure: [
        { id: 'basic', name: '基础信息', icon: 'fas fa-file-alt', route: 'basic', items: [] },
        { id: 'case-facts', name: '案情描述', icon: 'fas fa-file-text', route: 'facts', items: [] },
        {
          id: 'stakeholders',
          name: '当事人信息',
          icon: 'fas fa-users',
          route: 'stakeholders',
          items: []
        },
        {
          id: 'evidence',
          name: '证据管理',
          icon: 'fas fa-folder-open',
          route: 'evidence',
          items: []
        },
        {
          id: 'financials',
          name: '财务信息',
          icon: 'fas fa-dollar-sign',
          route: 'financials',
          items: []
        },
        {
          id: 'refactor',
          name: '高级功能',
          icon: 'fas fa-tools',
          route: 'advanced',
          items: [
            { id: 'ai-analysis-refactor', name: 'AI可行性报告' },
            { id: 'ai-assistant-refactor', name: 'AI对话助手' },
            { id: 'relationship-graph-refactor', name: '关系洞察' },
            { id: 'timeline-refactor', name: '证据时间轴' },
            { id: 'quote-generator-refactor', name: '生成报价书' }
          ]
        }
      ]
    }
  },
  computed: {
    currentTabs() {
      const category = this.tabStructure.find(c => c.id === this.activeCategory)
      return category ? category.items : []
    }
  },
  created() {
    const hash = window.location.hash
    const parts = hash.split('/')
    const caseId = parts.length > 2 ? parts[2] : null
    this.loadCaseData(caseId)
  },
  methods: {
    loadCaseData(caseId) {
      this.caseData = {
        id: caseId || 'CASE-2023-001',
        name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
        status: '进行中',
        statusCode: 'active',
        type: '合同纠纷',
        category: '民事',
        lastUpdate: '2小时前',
        assignee: '张三'
      }
    },
    switchCategory(categoryId) {
      const category = this.tabStructure.find(c => c.id === categoryId)
      if (category?.route) {
        const hash = window.location.hash
        const match = hash.match(/\/detail\/([^/]+)/)
        const caseId = match ? match[1] : '1'
        router.push(`/detail/${caseId}/${category.route}`)
      } else {
        this.activeCategory = categoryId
        this.activeTab = category?.items?.[0]?.id || categoryId
      }
    },
    switchTab(tabId) {
      this.activeTab = tabId
    },
    goBack() {
      router.push('/')
    },
    onCaseSaved(updatedData) {
      this.caseData = { ...this.caseData, ...updatedData }
      this.showEditModal = false
    }
  },
  template: `
        <div class="case-detail-page" v-if="caseData">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span @click="goBack" style="cursor: pointer; color: var(--text-secondary);">案件</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span class="current">{{ caseData.id }}</span>
                </div>
            </header>

            <!-- Case Header -->
            <div class="case-header-area">
                <div class="case-title-wrapper">
                    <div>
                        <div class="case-tags" style="margin-bottom: 8px;">
                            <span :class="['tag', 'status-' + (caseData.statusCode || 'active')]">{{ caseData.status }}</span>
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

            <!-- Level 2 Tabs (Sub-items for refactor) -->
            <div class="tabs-container" v-if="currentTabs.length > 0">
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

            <!-- Content Canvas (仅高级功能) -->
            <div class="content-canvas">
                <div v-if="activeTab === 'ai-analysis-refactor'" class="tab-pane">
                    <AIAnalysis :case-data="caseData" />
                </div>
                <div v-if="activeTab === 'ai-assistant-refactor'" class="tab-pane">
                    <AIAssistant :case-data="caseData" />
                </div>
                <div v-if="activeTab === 'relationship-graph-refactor'" class="tab-pane">
                    <RelationshipGraph />
                </div>
                <div v-if="activeTab === 'timeline-refactor'" class="tab-pane">
                    <EvidenceTimeline />
                </div>
                <div v-if="activeTab === 'quote-generator-refactor'" class="tab-pane">
                    <QuoteGenerator :case-data="caseData" />
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
}
