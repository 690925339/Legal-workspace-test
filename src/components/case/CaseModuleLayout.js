import router from '@/router/index.js'

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
                { id: 'basic', name: '案件总览', icon: 'fas fa-file-alt', route: 'basic' },
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
};
