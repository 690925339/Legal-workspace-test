<template>
  <div class="case-list-page">
    <header class="top-bar">
      <div class="page-title">
        案件列表
      </div>
      <div class="top-actions">
        <button
          class="primary-btn"
          @click="createCase"
        >
          <i class="fas fa-plus" /> 新建案件
        </button>
      </div>
    </header>

    <div class="content-canvas">
      <div class="filter-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="search-input"
          placeholder="搜索案件名称、客户或编号..."
        >
        <div class="filter-group">
          <select
            v-model="filterStatus"
            class="filter-select"
          >
            <option value="all">
              所有状态
            </option>
            <option value="active">
              进行中
            </option>
            <option value="closed">
              已结案
            </option>
            <option value="draft">
              草稿
            </option>
          </select>
          <select
            v-model="filterType"
            class="filter-select"
          >
            <option value="all">
              所有案由
            </option>
            <option value="civil">
              民事
            </option>
            <option value="criminal">
              刑事
            </option>
            <option value="administrative">
              行政
            </option>
            <option value="ip">
              知识产权
            </option>
          </select>
          <select
            v-model="sortBy"
            class="filter-select"
          >
            <option value="update_desc">
              更新时间 ↓
            </option>
            <option value="update_asc">
              更新时间 ↑
            </option>
          </select>
        </div>
      </div>

      <table class="case-table">
        <thead>
          <tr>
            <th width="35%">
              案件信息
            </th>
            <th width="12%">
              客户
            </th>
            <th width="12%">
              状态
            </th>
            <th width="12%">
              负责人
            </th>
            <th width="12%">
              最后更新
            </th>
            <th width="17%">
              操作
            </th>
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
                <span
                  v-if="caseItem.court"
                  class="court-info"
                >
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
            <td>
              <div class="avatar-stack">
                <div 
                  v-for="(assignee, index) in caseItem.assignees"
                  :key="index"
                  class="avatar-small"
                  :style="{ background: assignee.color, color: assignee.textColor }"
                >
                  {{ assignee.name }}
                </div>
              </div>
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
// 使用 this.$router 进行路由导航
import CaseForm from './CaseForm.vue'

export default {
  name: 'CaseList',
  components: {
    CaseForm
  },
  data() {
    return {
      cases: [
        {
          id: 1,
          name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
          code: 'CASE-2023-001',
          type: '民事 · 合同纠纷',
          category: 'civil',
          client: 'ABC 公司',
          opposingParty: 'XYZ 有限公司',
          court: '上海市浦东新区人民法院',
          filingDate: '2023-10-01',
          amount: '500,000.00 CNY',
          description: '因被告未按合同约定支付广告费用引发的纠纷。',
          status: 'active',
          statusText: '进行中',
          assignees: [
            { name: '张', color: '#dbeafe', textColor: '#1e40af' },
            { name: '李', color: '#fce7f3', textColor: '#9d174d' }
          ],
          assignees: [
            { name: '张', color: '#dbeafe', textColor: '#1e40af' },
            { name: '李', color: '#fce7f3', textColor: '#9d174d' }
          ],
          lastUpdate: '2小时前',
          updatedAt: '2023-12-29T09:30:00'
        },
        {
          id: 2,
          name: '张三 诉 李四 借贷纠纷案',
          code: 'CASE-2023-002',
          type: '民事 · 民间借贷',
          category: 'civil',
          client: '张三',
          opposingParty: '李四',
          court: '北京市朝阳区人民法院',
          filingDate: '2023-11-15',
          amount: '100,000.00 CNY',
          description: '被告借款逾期未还。',
          status: 'draft',
          statusText: '草稿',
          assignees: [
            { name: '张', color: '#dbeafe', textColor: '#1e40af' }
          ],
          assignees: [
            { name: '张', color: '#dbeafe', textColor: '#1e40af' }
          ],
          lastUpdate: '昨天',
          updatedAt: '2023-12-28T15:00:00'
        },
        {
          id: 3,
          name: '甲乙丙丁 劳动争议仲裁案',
          code: 'CASE-2023-003',
          type: '劳动仲裁',
          category: 'civil', // Approximation for demo
          client: '甲乙丙丁科技',
          opposingParty: '王五',
          court: '深圳市劳动人事争议仲裁委员会',
          filingDate: '2023-09-20',
          amount: 'N/A',
          description: '员工主张违法解除劳动合同赔偿金。',
          status: 'closed',
          statusText: '已结案',
          assignees: [
            { name: '李', color: '#fce7f3', textColor: '#9d174d' }
          ],
          assignees: [
            { name: '李', color: '#fce7f3', textColor: '#9d174d' }
          ],
          lastUpdate: '2023-10-20',
          updatedAt: '2023-10-20T10:00:00'
        }
      ],
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
      let result = this.cases;

      // 1. Search Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.client.toLowerCase().includes(query)
        );
      }

      // 2. Status Filter
      if (this.filterStatus !== 'all') {
        result = result.filter(c => c.status === this.filterStatus);
      }

      // 3. Type Filter
      if (this.filterType !== 'all') {
        result = result.filter(c => c.category === this.filterType);
      }

      // 4. Sorting
      result = result.sort((a, b) => {
        if (this.sortBy === 'update_desc') {
           return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        } else if (this.sortBy === 'update_asc') {
           return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        }
        return 0;
      });

      return result;
    }
  },
  methods: {
    viewCase(caseId) {
      this.$router.push('/detail/' + caseId)
    },
    editCase(caseId) {
      this.currentCaseId = caseId
      this.showCaseModal = true
    },
    deleteCase(caseItem) {
      if (confirm('确定要删除案件 ' + caseItem.code + ' 吗？此操作不可恢复。')) {
        this.cases = this.cases.filter(c => c.id !== caseItem.id)
        alert('案件已删除')
      }
    },
    createCase() {
      this.currentCaseId = null
      this.showCaseModal = true
    },
    onCaseSaved(caseData) {
      console.log('Case saved:', caseData)
      if (!this.currentCaseId) {
        this.cases.unshift({
          id: Date.now(),
          name: caseData.name,
          code: 'CASE-NEW-' + Math.floor(Math.random() * 1000),
          type: (caseData.type === 'civil' ? '民事' : caseData.type === 'criminal' ? '刑事' : caseData.type === 'administrative' ? '行政' : '知产') + ' · ' + (caseData.legalCause || '未分类'),
          category: caseData.type,
          client: caseData.clients[0]?.name || '新客户',
          status: 'active',
          statusText: '进行中',
          lastUpdate: '刚刚',
          updatedAt: new Date().toISOString(),
          assignees: [{ name: '我', color: '#dbeafe', textColor: '#1e40af' }]
        })
      }
      this.showCaseModal = false
    },
    getStatusClass(status) {
      return `status-badge status-${status}`
    },
    closeCase(caseItem) {
      if (caseItem.status !== 'active') {
        alert('只有进行中的案件才能结案')
        return
      }
      if (confirm('确定要结案吗？\n\n注意：结案后案件信息将无法修改。')) {
        caseItem.status = 'closed'
        caseItem.statusText = '已结案'
        caseItem.lastUpdate = '刚刚'
        caseItem.updatedAt = new Date().toISOString()
        alert('案件已结案')
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
