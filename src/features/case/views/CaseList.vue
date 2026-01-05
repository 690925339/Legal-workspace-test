<template>
  <div class="case-list-page">
    <header class="top-bar">
      <div class="page-title">案件列表</div>
      <div class="top-actions">
        <button class="primary-btn" @click="createCase"><i class="fas fa-plus" /> 新建案件</button>
      </div>
    </header>

    <div class="content-canvas">
      <div class="filter-bar">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索案件名称、客户或编号..."
        />
        <div class="filter-group">
          <select v-model="filterStatus" class="filter-select">
            <option value="all">所有状态</option>
            <option value="active">进行中</option>
            <option value="closed">已结案</option>
            <option value="draft">草稿</option>
          </select>
          <select v-model="filterType" class="filter-select">
            <option value="all">所有案由</option>
            <option value="civil">民事</option>
            <option value="criminal">刑事</option>
            <option value="administrative">行政</option>
            <option value="ip">知识产权</option>
          </select>
          <select v-model="sortBy" class="filter-select">
            <option value="update_desc">更新时间 ↓</option>
            <option value="update_asc">更新时间 ↑</option>
          </select>
        </div>
      </div>

      <table class="case-table">
        <thead>
          <tr>
            <th width="40%">案件信息</th>
            <th width="15%">客户</th>
            <th width="15%">状态</th>
            <th width="15%">最后更新</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="caseItem in filteredCases"
            :key="caseItem.id"
            class="case-row"
            @click="viewCase(caseItem.id)"
          >
            <td>
              <div class="case-name">
                {{ caseItem.name }}
              </div>
              <div class="case-meta">
                {{ caseItem.code }} · {{ caseItem.type }}
                <span v-if="caseItem.court" class="court-info">
                  {{ caseItem.court }}
                </span>
              </div>
            </td>
            <td>{{ caseItem.client }}</td>
            <td>
              <span :class="getStatusClass(caseItem.status)">
                {{ caseItem.statusText }}
              </span>
            </td>
            <td class="last-update">
              {{ caseItem.lastUpdate }}
            </td>
            <td>
              <div class="action-btns">
                <button
                  class="action-btn"
                  title="查看"
                  aria-label="查看案件"
                  @click.stop="viewCase(caseItem.id)"
                >
                  <i class="fas fa-eye" />
                </button>
                <button
                  class="action-btn"
                  title="编辑"
                  aria-label="编辑案件"
                  @click.stop="editCase(caseItem.id)"
                >
                  <i class="fas fa-pen" />
                </button>
                <button
                  v-if="caseItem.status === 'active'"
                  class="action-btn close-btn"
                  title="结案"
                  aria-label="结案"
                  @click.stop="closeCase(caseItem)"
                >
                  <i class="fas fa-folder-minus" />
                </button>
                <button
                  class="action-btn delete"
                  title="删除"
                  aria-label="删除案件"
                  @click.stop="deleteCase(caseItem)"
                >
                  <i class="fas fa-trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Case Form Modal -->
    <CaseForm
      :visible="showCaseModal"
      :edit-id="currentCaseId"
      @close="showCaseModal = false"
      @saved="onCaseSaved"
    />
  </div>
</template>

<script>
import CaseForm from './CaseForm.vue'
import { caseService } from '@/features/case/services'

export default {
  name: 'CaseList',
  components: {
    CaseForm
  },
  data() {
    return {
      cases: [],
      loading: false,
      searchQuery: '',
      filterStatus: 'all',
      filterType: 'all',
      sortBy: 'update_desc',
      showCaseModal: false,
      currentCaseId: null
    }
  },
  computed: {
    filteredCases() {
      let result = this.cases

      // 1. Search Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          c =>
            c.name.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.client.toLowerCase().includes(query)
        )
      }

      // 2. Status Filter
      if (this.filterStatus !== 'all') {
        result = result.filter(c => c.status === this.filterStatus)
      }

      // 3. Type Filter
      if (this.filterType !== 'all') {
        result = result.filter(c => c.category === this.filterType)
      }

      // 4. Sorting
      result = result.sort((a, b) => {
        if (this.sortBy === 'update_desc') {
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        } else if (this.sortBy === 'update_asc') {
          return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0)
        }
        return 0
      })

      return result
    }
  },
  async mounted() {
    await this.loadCases()
  },
  methods: {
    async loadCases() {
      this.loading = true
      try {
        const data = await caseService.getList()
        // 映射数据库字段到前端展示格式
        this.cases = (data || []).map(c => ({
          id: c.id,
          name: c.case_title,
          code: c.case_number || `CASE-${c.id.slice(0, 8)}`,
          type: c.case_type || '民事',
          category: 'civil',
          client: c.client_name || '-',
          status: c.status || 'draft',
          statusText: this.getStatusText(c.status),
          court: '-',
          lastUpdate: this.formatDate(c.updated_at),
          updatedAt: c.updated_at
        }))
      } catch (e) {
        console.error('加载案件列表失败:', e)
        // 如果加载失败，显示空列表
        this.cases = []
      } finally {
        this.loading = false
      }
    },
    getStatusText(status) {
      const map = {
        draft: '草稿',
        active: '进行中',
        closed: '已结案'
      }
      return map[status] || '草稿'
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
    viewCase(caseId) {
      this.$router.push('/detail/' + caseId)
    },
    editCase(caseId) {
      this.currentCaseId = caseId
      this.showCaseModal = true
    },
    async deleteCase(caseItem) {
      if (confirm('确定要删除案件 ' + caseItem.code + ' 吗？此操作不可恢复。')) {
        try {
          await caseService.delete(caseItem.id)
          this.cases = this.cases.filter(c => c.id !== caseItem.id)
          alert('案件已删除')
        } catch (e) {
          alert('删除失败: ' + e.message)
        }
      }
    },
    createCase() {
      this.currentCaseId = null
      this.showCaseModal = true
    },
    async onCaseSaved(caseData) {
      console.log('Case saved:', caseData)
      // 重新加载列表
      await this.loadCases()
      this.showCaseModal = false
    },
    getStatusClass(status) {
      return `status-badge status-${status}`
    },
    async closeCase(caseItem) {
      if (caseItem.status !== 'active') {
        alert('只有进行中的案件才能结案')
        return
      }
      if (confirm('确定要结案吗？\n\n注意：结案后案件信息将无法修改。')) {
        try {
          await caseService.update(caseItem.id, { status: 'closed' })
          caseItem.status = 'closed'
          caseItem.statusText = '已结案'
          caseItem.lastUpdate = '刚刚'
          caseItem.updatedAt = new Date().toISOString()
          alert('案件已结案')
        } catch (e) {
          alert('结案失败: ' + e.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.case-meta {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.court-info {
  margin-left: 8px;
  color: var(--text-secondary);
}

.last-update {
  color: var(--text-secondary);
}

.close-btn {
  color: #dc2626;
}
.filter-group {
  display: flex;
  gap: 10px;
}
.filter-select {
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  background-color: white;
  outline: none;
  cursor: pointer;
}
.filter-select:hover {
  border-color: #cbd5e1;
}
</style>
