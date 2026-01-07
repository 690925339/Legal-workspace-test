import router from '@/router/index.js'
import { caseService } from '@/features/case/services'
import { caseDetailCache } from '@/features/case/services/caseDetailCache'

/**
 * 案件模块共享布局组件
 * 提供公用的案件头部、Tab导航，通过 slot 渲染各模块内容
 */
export default {
  name: 'CaseModuleLayout',
  props: {
    caseId: {
      type: String,
      required: true
    },
    activeModule: {
      type: String,
      default: 'basic'
    }
  },
  data() {
    return {
      caseData: {
        id: '',
        caseNumber: '',
        courtCaseNumber: '', // 新增: 法院正式案号
        name: '',
        status: '',
        statusCode: '',
        type: '',
        category: '',
        stage: '',
        court: '',
        assignee: '',
        filingDate: '',
        deadline: '',
        description: '',
        disputeFocus: [],
        objective: '',
        lastUpdate: ''
      },
      loading: false,
      initialLoading: true, // 初次加载标志
      moduleNav: [
        { id: 'basic', name: '案件总览', icon: 'fas fa-file-alt', route: 'basic' },
        { id: 'financials', name: '财务信息', icon: 'fas fa-dollar-sign', route: 'financials' },
        { id: 'evidence', name: '证据管理', icon: 'fas fa-folder-open', route: 'evidence' },
        { id: 'advanced', name: '高级功能', icon: 'fas fa-tools', route: 'advanced' }
      ]
    }
  },
  created() {
    this.loadCaseData()
  },
  methods: {
    async loadCaseData() {
      if (!this.caseId) return

      // 1. 先尝试从缓存加载（秒开）
      const cached = caseDetailCache.get(this.caseId)
      if (cached && cached.data) {
        this.caseData = cached.data
        this.initialLoading = false
        this.$emit('case-loaded', this.caseData)
        console.log(
          '[CaseModuleLayout] 从缓存加载，年龄:',
          Math.round(caseDetailCache.getAge(this.caseId) / 1000),
          '秒'
        )

        // 2. 如果缓存未过期，后台静默刷新
        if (!caseDetailCache.isStale(this.caseId)) {
          this.refreshInBackground()
          return
        }
      }

      // 3. 缓存不存在或已过期，正常加载
      this.loading = true
      try {
        const data = await caseService.getById(this.caseId)
        this.mapAndSetCaseData(data)

        // 4. 保存到缓存
        caseDetailCache.set(this.caseId, this.caseData)

        // 向父组件发送数据
        this.$emit('case-loaded', this.caseData)
      } catch (e) {
        console.error('加载案件数据失败:', e)
      } finally {
        this.loading = false
        this.initialLoading = false
      }
    },

    // 后台静默刷新
    async refreshInBackground() {
      try {
        const data = await caseService.getById(this.caseId)
        this.mapAndSetCaseData(data)
        caseDetailCache.set(this.caseId, this.caseData)
        this.$emit('case-loaded', this.caseData)
        console.log('[CaseModuleLayout] 后台刷新完成')
      } catch (e) {
        console.error('后台刷新失败:', e)
      }
    },

    // 映射数据库字段到前端结构
    mapAndSetCaseData(data) {
      const statusMap = { draft: '草稿', active: '进行中', closed: '已结案' }
      this.caseData = {
        id: data.id,
        caseNumber: data.case_number || `case-${Date.now()}`,
        courtCaseNumber: data.court_case_number || '', // 新增: 法院正式案号
        name: data.case_title,
        status: statusMap[data.status] || data.status,
        statusCode: data.status || 'draft',
        type: data.case_type || '-',
        category: '民事',
        stage: data.stage || '-',
        court: data.court || '-',
        assignee: data.assignee || '-',
        filingDate: data.filing_date || '-',
        deadline: data.deadline || '-',
        description: data.description || '',
        disputeFocus: data.dispute_focus || [],
        objective: data.objective || '',
        lastUpdate: this.formatDate(data.updated_at)
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours < 1) return '刚刚'
      if (hours < 24) return `${hours}小时前`
      const days = Math.floor(hours / 24)
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      return date.toLocaleDateString('zh-CN')
    },
    goBack() {
      router.push('/')
    },
    goToOverview() {
      // 返回案件详情总览页
      router.push(`/detail/${this.caseId}`)
    },
    navigateTo(moduleId) {
      const basePath = `/detail/${this.caseId}`
      if (moduleId === 'advanced') {
        // 高级功能保持原有结构
        router.push(`${basePath}/advanced`)
      } else {
        router.push(`${basePath}/${moduleId}`)
      }
    },
    isActive(moduleId) {
      return this.activeModule === moduleId
    },
    getCurrentModuleName() {
      const module = this.moduleNav.find(m => m.id === this.activeModule)
      return module ? module.name : ''
    }
  },
  template: `
        <div class="case-detail-page">
            <header class="top-bar" style="border-bottom: 1px solid var(--border-light); height: 48px; padding: 0 24px;">
                <div class="breadcrumbs" style="display: flex; align-items: center; font-size: 14px;">
                    <span @click="goBack" class="breadcrumb-item" style="cursor: pointer; color: var(--text-secondary); display: flex; align-items: center;">
                        <i class="fas fa-home" style="margin-right: 8px; font-size: 14px;"></i>
                        <span style="font-weight: 400;">案件管理</span>
                    </span>
                    <span class="separator" style="margin: 0 10px; color: var(--border-medium); font-weight: 300;">/</span>
                    <span class="current" style="font-weight: 400; color: var(--text-primary);">{{ caseData.name || caseData.id }}</span>
                </div>
                <div class="top-actions">
                    <!-- 可扩展操作按钮 -->
                </div>
            </header>



            <!-- Module Navigation Tabs -->
            <div class="category-tabs">
                <div 
                    v-for="module in moduleNav" 
                    :key="module.id"
                    :class="['category-tab', { active: isActive(module.id) }]"
                    @click="navigateTo(module.id)"
                >
                    <i :class="module.icon" style="margin-right: 8px;"></i>
                    {{ module.name }}
                </div>
            </div>

            <!-- Content Canvas (Slot for module content) -->
            <div class="content-canvas">
                <slot></slot>
            </div>
        </div>
    `
}
