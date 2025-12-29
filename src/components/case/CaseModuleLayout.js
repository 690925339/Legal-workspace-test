import { router } from '../../router.js';

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
                name: '',
                status: '进行中',
                statusCode: 'active',
                type: '',
                category: '',
                lastUpdate: '',
                assignee: ''
            },
            moduleNav: [
                { id: 'basic', name: '基础信息', icon: 'fas fa-file-alt', route: 'basic' },
                { id: 'facts', name: '案情描述', icon: 'fas fa-file-text', route: 'facts' },
                { id: 'stakeholders', name: '当事人信息', icon: 'fas fa-users', route: 'stakeholders' },
                { id: 'financials', name: '财务信息', icon: 'fas fa-dollar-sign', route: 'financials' },
                { id: 'evidence', name: '证据管理', icon: 'fas fa-folder-open', route: 'evidence' },
                { id: 'advanced', name: '高级功能', icon: 'fas fa-tools', route: 'advanced' }
            ]
        };
    },
    created() {
        this.loadCaseData();
    },
    methods: {
        loadCaseData() {
            // 模拟加载案件基础数据（后续可对接 API）
            this.caseData = {
                id: this.caseId || 'CASE-2023-001',
                caseNumber: 'CASE-2023-001', // 添加真实案件编号
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                status: '进行中',
                statusCode: 'active',
                type: '合同纠纷',
                category: '民事',
                lastUpdate: '2小时前',
                assignee: '张三'
            };
            // 向父组件发送数据
            this.$emit('case-loaded', this.caseData);
        },
        goBack() {
            router.push('/');
        },
        goToOverview() {
            // 返回案件详情总览页
            router.push(`/detail/${this.caseId}`);
        },
        navigateTo(moduleId) {
            const basePath = `/detail/${this.caseId}`;
            if (moduleId === 'advanced') {
                // 高级功能保持原有结构
                router.push(`${basePath}/advanced`);
            } else {
                router.push(`${basePath}/${moduleId}`);
            }
        },
        isActive(moduleId) {
            return this.activeModule === moduleId;
        },
        getCurrentModuleName() {
            const module = this.moduleNav.find(m => m.id === this.activeModule);
            return module ? module.name : '';
        }
    },
    template: `
        <div class="case-detail-page">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span @click="goBack" style="cursor: pointer; color: var(--text-secondary);">案件</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span @click="goToOverview" style="cursor: pointer; color: var(--text-secondary);">{{ caseData.caseNumber || caseData.id }}</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span class="current">{{ getCurrentModuleName() }}</span>
                </div>
                <div class="top-actions">
                    <!-- 可扩展操作按钮 -->
                </div>
            </header>

            <!-- Case Header -->
            <div class="case-header-area">
                <div class="case-title-wrapper">
                    <div>
                        <div class="case-tags" style="margin-bottom: 8px;">
                            <span :class="['tag', 'status-' + (caseData.statusCode || 'active')]">
                                {{ caseData.status }}
                            </span>
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
};
