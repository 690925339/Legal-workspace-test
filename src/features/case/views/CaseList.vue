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
            <option value="default">默认排列</option>
            <option value="update_desc">更新时间 ↓</option>
            <option value="update_asc">更新时间 ↑</option>
          </select>
        </div>
      </div>

      <table class="case-table">
        <thead>
          <tr>
            <th width="35%">案件信息</th>
            <th width="15%">案由</th>
            <th width="12%">案件阶段</th>
            <th width="12%">状态</th>
            <th width="13%">最后更新</th>
            <th width="13%">操作</th>
          </tr>
        </thead>
        <!-- 骨架屏：仅在初次加载无缓存时显示 -->
        <CaseListSkeleton v-if="initialLoading && cases.length === 0" />
        <tbody v-else>
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
                {{ caseItem.code }}
                <span v-if="caseItem.court && caseItem.court !== '-'" class="court-info">
                  · {{ caseItem.court }}
                </span>
              </div>
            </td>
            <td>{{ caseItem.type || '-' }}</td>
            <td>{{ caseItem.stage || '-' }}</td>
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
                  v-if="caseItem.status !== 'closed'"
                  class="action-btn"
                  :class="{ loading: editingCaseId === caseItem.id }"
                  title="编辑"
                  aria-label="编辑案件"
                  :disabled="editingCaseId === caseItem.id"
                  @click.stop="editCase(caseItem)"
                >
                  <i v-if="editingCaseId === caseItem.id" class="fas fa-spinner fa-spin" />
                  <i v-else class="fas fa-pen" />
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
      :initial-data="currentCaseData"
      @close="showCaseModal = false"
      @saved="onCaseSaved"
    />
    <!-- Custom Confirm Modal -->
    <ConfirmModal
      :is-open="confirmState.visible"
      :title="confirmState.title"
      :message="confirmState.message"
      :type="confirmState.type"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      @confirm="handleConfirm(true)"
      @cancel="handleConfirm(false)"
    />
  </div>
</template>

<script>
import CaseForm from './CaseForm.vue'
import { caseService, financialService, stakeholderService } from '@/features/case/services'
import { caseListCache } from '@/features/case/services/caseListCache'
import CaseListSkeleton from '../components/CaseListSkeleton.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'CaseList',
  components: {
    CaseForm,
    CaseListSkeleton,
    ConfirmModal
  },
  data() {
    return {
      cases: [],
      loading: false,
      initialLoading: true, // 初次加载标志
      searchQuery: '',
      filterStatus: 'all',
      filterType: 'all',
      sortBy: 'default',
      showCaseModal: false,
      currentCaseId: null,
      currentCaseData: null,
      editingCaseId: null, // 编辑按钮 loading 状态
      confirmState: {
        visible: false,
        message: '',
        type: 'warning',
        resolve: null
      },
      pendingOperations: 0 // 乐观更新计数器，阻止后台刷新覆盖
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
            (c.client && c.client.toLowerCase().includes(query))
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
        if (this.sortBy === 'default') {
          // Default: Status (Draft -> Active -> Closed) then CreatedAt Desc
          const statusWeight = {
            draft: 0,
            active: 1,
            closed: 2
          }
          const wA = statusWeight[a.status] !== undefined ? statusWeight[a.status] : 99
          const wB = statusWeight[b.status] !== undefined ? statusWeight[b.status] : 99

          if (wA !== wB) return wA - wB

          // Secondary: Created Time Desc
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        } else if (this.sortBy === 'update_desc') {
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
      // 1. 先尝试从缓存加载（秒开）
      const cached = caseListCache.get()
      if (cached && cached.data) {
        this.cases = cached.data
        this.initialLoading = false
        console.log('[CaseList] 从缓存加载，年龄:', Math.round(caseListCache.getAge() / 1000), '秒')

        // 2. 如果缓存未过期，后台静默刷新
        if (!caseListCache.isStale()) {
          this.refreshInBackground()
          return
        }
      }

      // 3. 缓存不存在或已过期，显示加载状态
      this.loading = true
      try {
        const data = await caseService.getList()
        const mappedCases = this.mapCasesData(data)
        this.cases = mappedCases

        // 4. 保存到缓存
        caseListCache.set(mappedCases)
      } catch (e) {
        console.error('加载案件列表失败:', e)
        this.cases = []
      } finally {
        this.loading = false
        this.initialLoading = false
      }
    },

    // 后台静默刷新
    async refreshInBackground() {
      // 如果有乐观操作正在进行，跳过本次刷新以避免覆盖 UI
      if (this.pendingOperations > 0) {
        console.log('[CaseList] 跳过后台刷新：有乐观操作正在进行')
        return
      }
      try {
        const data = await caseService.getList()
        // 再次检查，避免竞态
        if (this.pendingOperations > 0) {
          console.log('[CaseList] 放弃后台刷新结果：有乐观操作正在进行')
          return
        }
        const mappedCases = this.mapCasesData(data)
        this.cases = mappedCases
        caseListCache.set(mappedCases)
        console.log('[CaseList] 后台刷新完成')
      } catch (e) {
        console.error('后台刷新失败:', e)
      }
    },

    // 映射数据库字段到前端展示格式
    mapCasesData(data) {
      return (data || []).map(c => ({
        id: c.id,
        name: c.case_title,
        code: c.case_number || `CASE-${c.id.slice(0, 8)}`,
        type: c.case_type || '民事',
        stage: c.stage || '',
        category: 'civil',
        status: c.status || 'draft',
        statusText: this.getStatusText(c.status),
        court: c.court || '-',
        lastUpdate: this.formatDate(c.updated_at),
        updatedAt: c.updated_at,
        createdAt: c.created_at
      }))
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
    async editCase(caseItem) {
      // 显示 loading 状态
      this.editingCaseId = caseItem.id

      try {
        // 并行预加载所有数据
        const [caseData, financials, stakeholders] = await Promise.all([
          caseService.getById(caseItem.id),
          financialService.get(caseItem.id).catch(() => null),
          stakeholderService.getList(caseItem.id).catch(() => [])
        ])

        // 数据准备完成，打开模态框
        this.currentCaseId = caseItem.id
        this.currentCaseData = { caseData, financials, stakeholders }
        this.showCaseModal = true
      } catch (e) {
        console.error('加载案件数据失败:', e)
        alert('加载失败，请重试')
      } finally {
        this.editingCaseId = null
      }
    },
    async deleteCase(caseItem) {
      console.log('Button clicked: deleteCase', caseItem.id)
      const confirmed = await this.showConfirm('确定要删除这个案件吗？此操作无法撤销。', 'danger')
      if (!confirmed) return

      // 乐观更新：先从 UI 移除，同时更新缓存
      const originalCases = [...this.cases]
      this.cases = this.cases.filter(c => c.id !== caseItem.id)
      caseListCache.set(this.cases)
      this.pendingOperations++ // 标记有乐观操作进行中

      // 异步执行删除，不阻塞 UI
      caseService
        .delete(caseItem.id)
        .then(() => {
          console.log('[CaseList] 删除成功:', caseItem.id)
        })
        .catch(e => {
          console.error('删除失败，回滚:', e)
          this.cases = originalCases
          caseListCache.set(originalCases)
          alert(`删除失败: ${e.message || '请检查网络连接'}\n\n数据已恢复。`)
        })
        .finally(() => {
          this.pendingOperations-- // 完成后减少计数
        })
    },
    createCase() {
      this.currentCaseId = null
      this.showCaseModal = true
    },
    async onCaseSaved(caseData) {
      console.log('Case saved:', caseData)
      // 清除缓存并重新加载列表
      caseListCache.clear()
      await this.loadCases()
      this.showCaseModal = false
    },
    getStatusClass(status) {
      return `status-badge status-${status}`
    },
    async closeCase(caseItem) {
      console.log('Button clicked: closeCase', caseItem.id)
      if (caseItem.status !== 'active') {
        alert('只有进行中的案件才能结案')
        return
      }

      const confirmed = await this.showConfirm(
        '确定要结案吗？\n\n注意：结案后案件信息将无法修改。',
        'warning'
      )
      if (!confirmed) return

      // 乐观更新：先更新 UI 状态，再异步请求后端
      const originalStatus = caseItem.status
      const originalStatusText = caseItem.statusText
      const originalLastUpdate = caseItem.lastUpdate
      const originalUpdatedAt = caseItem.updatedAt

      caseItem.status = 'closed'
      caseItem.statusText = '已结案'
      caseItem.lastUpdate = '刚刚'
      caseItem.updatedAt = new Date().toISOString()
      caseListCache.set(this.cases)
      this.pendingOperations++ // 标记有乐观操作进行中

      // 异步执行更新，不阻塞 UI
      caseService
        .update(caseItem.id, { status: 'closed' })
        .then(() => {
          console.log('[CaseList] 结案成功:', caseItem.id)
        })
        .catch(e => {
          console.error('结案失败，回滚:', e)
          caseItem.status = originalStatus
          caseItem.statusText = originalStatusText
          caseItem.lastUpdate = originalLastUpdate
          caseItem.updatedAt = originalUpdatedAt
          caseListCache.set(this.cases)
          alert(`结案失败: ${e.message || '请检查网络连接'}\n\n状态已恢复。`)
        })
        .finally(() => {
          this.pendingOperations-- // 完成后减少计数
        })
    },
    // Custom Confirm Modal Logic
    showConfirm(message, type = 'warning') {
      return new Promise(resolve => {
        this.confirmState = {
          visible: true,
          message,
          type,
          resolve
        }
      })
    },
    handleConfirm(result) {
      this.confirmState.visible = false
      if (this.confirmState.resolve) {
        this.confirmState.resolve(result)
        this.confirmState.resolve = null
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

.confirm-modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: scaleIn 0.2s ease-out;
}

.confirm-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.confirm-icon.warning {
  background: #fff7ed;
  color: #ea580c;
}

.confirm-icon.danger {
  background: #fef2f2;
  color: #dc2626;
}

.confirm-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1e293b;
}

.confirm-content p {
  margin: 0 0 24px 0;
  color: #64748b;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.confirm-actions button {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn.warning {
  background: #ea580c;
  color: white;
}

.confirm-btn.danger {
  background: #dc2626;
  color: white;
}

.confirm-btn:hover {
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
