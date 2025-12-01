import { router } from '../../router.js';

export default {
    name: 'Sidebar',
    data() {
        return {
            currentPath: router.currentRoute
        };
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentPath = router.currentRoute;
        });
    },
    methods: {
        navigate(path) {
            router.push(path);
        },
        isActive(path) {
            return this.currentPath === path;
        }
    },
    template: `
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <span>LegalMind</span>
            </div>

            <div class="nav-group-title">工作台</div>
            <a @click.prevent="navigate('/')" 
               :class="['nav-item', { active: isActive('/') }]">
                <i class="fas fa-folder-open"></i>
                <span>案件管理</span>
            </a>
            <a href="#" class="nav-item">
                <i class="fas fa-file-alt"></i>
                <span>文档库</span>
            </a>
            <a href="#" class="nav-item">
                <i class="fas fa-check-square"></i>
                <span>待办事项</span>
            </a>

            <div class="nav-group-title" style="margin-top: 24px;">智能分析</div>
            <a href="#" class="nav-item">
                <i class="fas fa-chart-pie"></i>
                <span>数据洞察</span>
            </a>
            <a href="#" class="nav-item">
                <i class="fas fa-balance-scale"></i>
                <span>量刑预测</span>
            </a>

            <div class="sidebar-footer">
                <a @click.prevent="navigate('/login')" class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name">李律师</div>
                        <div class="user-role">高级合伙人</div>
                    </div>
                    <i class="fas fa-sign-out-alt" style="color: var(--text-tertiary);"></i>
                </a>
            </div>
        </aside>
    `
};
