import { router } from '../router.js';

export default {
    name: 'CaseList',
    data() {
        return {
            cases: [
                {
                    id: 1,
                    name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                    code: 'CASE-2023-001',
                    type: '民事 · 合同纠纷',
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
                    lastUpdate: '2小时前'
                },
                {
                    id: 2,
                    name: '张三 诉 李四 借贷纠纷案',
                    code: 'CASE-2023-002',
                    type: '民事 · 民间借贷',
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
                    lastUpdate: '昨天'
                },
                {
                    id: 3,
                    name: '甲乙丙丁 劳动争议仲裁案',
                    code: 'CASE-2023-003',
                    type: '劳动仲裁',
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
                    lastUpdate: '2023-10-20'
                }
            ],
            searchQuery: ''
        };
    },
    computed: {
        filteredCases() {
            if (!this.searchQuery) {
                return this.cases;
            }
            const query = this.searchQuery.toLowerCase();
            return this.cases.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.code.toLowerCase().includes(query) ||
                c.client.toLowerCase().includes(query)
            );
        }
    },
    methods: {
        viewCase(caseId) {
            router.push('/detail/' + caseId);
        },
        editCase(caseId) {
            router.push('/edit/' + caseId);
        },
        deleteCase(caseItem) {
            if (confirm('确定要删除案件 ' + caseItem.code + ' 吗？此操作不可恢复。')) {
                this.cases = this.cases.filter(c => c.id !== caseItem.id);
                alert('案件已删除');
            }
        },
        createCase() {
            router.push('/create');
        },
        getStatusClass(status) {
            return `status-badge status-${status}`;
        }
    },
    template: `
        <div class="case-list-page">
            <header class="top-bar">
                <div class="page-title">案件列表</div>
                <div class="top-actions">
                    <button @click="createCase" class="primary-btn">
                        <i class="fas fa-plus"></i> 新建案件
                    </button>
                </div>
            </header>

            <div class="content-canvas">
                <div class="filter-bar">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="搜索案件名称、客户或编号..."
                        v-model="searchQuery"
                    >
                    <button class="filter-btn">
                        <i class="fas fa-filter"></i> 筛选
                    </button>
                    <button class="filter-btn">
                        <i class="fas fa-sort"></i> 排序
                    </button>
                </div>

                <table class="case-table">
                <thead>
                    <tr>
                        <th width="35%">案件信息</th>
                        <th width="12%">客户</th>
                        <th width="12%">状态</th>
                        <th width="12%">负责人</th>
                        <th width="12%">最后更新</th>
                        <th width="17%">操作</th>
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
                                <div class="case-name">{{ caseItem.name }}</div>
                                <div class="case-meta">
                                    {{ caseItem.code }} · {{ caseItem.type }}
                                    <span v-if="caseItem.court" style="margin-left: 8px; color: var(--text-secondary);">
                                        <i class="fas fa-balance-scale"></i> {{ caseItem.court }}
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
                            <td style="color: var(--text-secondary);">{{ caseItem.lastUpdate }}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn" @click.stop="viewCase(caseItem.id)" title="查看">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn" @click.stop="editCase(caseItem.id)" title="编辑">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <button class="action-btn delete" @click.stop="deleteCase(caseItem)" title="删除">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};
