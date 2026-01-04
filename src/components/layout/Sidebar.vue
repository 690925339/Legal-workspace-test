<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <div class="brand" style="position: relative; padding-right: 0">
      <div v-if="brand.logoUrl" class="brand-icon">
        <img :src="brand.logoUrl" alt="Logo" style="max-width: 32px; max-height: 32px" />
      </div>
      <div v-else class="brand-icon">
        <i class="fas fa-gavel" />
      </div>
      <div v-show="!isCollapsed" class="brand-text">
        <div class="brand-name">
          {{ brand.name }}
        </div>
        <div class="brand-subtitle">
          {{ brand.subtitle }}
        </div>
      </div>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" aria-label="折叠侧边栏" @click="toggleCollapse">
        <i class="fas fa-chevron-left" />
      </button>
    </div>

    <div v-show="!isCollapsed" class="nav-group-title">工作台</div>
    <a
      :class="['nav-item', { active: isActive('/') }]"
      aria-label="案件管理"
      @click.prevent="navigate('/')"
    >
      <i class="fas fa-folder-open" />
      <span v-show="!isCollapsed">案件管理</span>
    </a>

    <div v-show="!isCollapsed" class="nav-group-title" style="margin-top: 24px">智能分析</div>
    <a
      :class="['nav-item', { active: isActive('/legal-research') }]"
      aria-label="法律检索"
      @click.prevent="navigate('/legal-research')"
    >
      <i class="fas fa-search" />
      <span v-show="!isCollapsed">法律检索</span>
    </a>
    <a
      :class="['nav-item', { active: isActive('/contract-review') }]"
      aria-label="合同审查"
      @click.prevent="navigate('/contract-review')"
    >
      <i class="fas fa-file-contract" />
      <span v-show="!isCollapsed">合同审查</span>
    </a>
    <a
      :class="['nav-item', { active: isActive('/doc-generate') }]"
      aria-label="文书生成"
      @click.prevent="navigate('/doc-generate')"
    >
      <i class="fas fa-pen-fancy" />
      <span v-show="!isCollapsed">文书生成</span>
    </a>

    <div class="sidebar-footer" style="position: relative">
      <div v-if="showUserMenu" class="user-menu-popover">
        <a class="menu-item" @click.prevent="navigate('/profile')">
          <i class="fas fa-user-circle" />
          个人资料
        </a>

        <a
          href="http://localhost:5174/getting-started"
          target="_blank"
          class="menu-item"
          @click="showUserMenu = false"
        >
          <i class="fas fa-question-circle" />
          帮助文档
        </a>

        <a
          class="menu-item"
          @click.prevent="openFeedback"
        >
          <i class="fas fa-comment-alt" />
          产品反馈
        </a>

        <div class="menu-divider" />

        <a class="menu-item logout" @click.prevent="handleLogout">
          <i class="fas fa-sign-out-alt" />
          退出登录
        </a>
      </div>

      <a class="user-profile" @click.prevent="toggleUserMenu">
        <div class="user-avatar">
          <img v-if="userAvatar" :src="userAvatar" alt="头像" />
          <i v-else class="fas fa-user" />
        </div>
        <div v-show="!isCollapsed" class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </a>
    </div>

    <!-- Feedback Modal -->
    <ProductFeedback :visible="showFeedbackModal" @close="showFeedbackModal = false" />
  </aside>
</template>

<script>
import { authService, brandService } from '@/config/supabase.js'
import { authStore } from '@/stores/auth.js'
import ProductFeedback from '@/features/system/views/ProductFeedback.vue'

export default {
  name: 'Sidebar',
  components: {
    ProductFeedback
  },
  data() {
    return {
      showUserMenu: false,
      isCollapsed: false,
      showFeedbackModal: false,
      authStore,
      brand: {
        name: 'ALPHA&LEADER',
        subtitle: '安华理达',
        logoUrl: '',
        logoText: ''
      }
    }
  },
  computed: {
    currentPath() {
      return this.$route?.path || '/'
    },
    userName() {
      if (authStore.state?.user?.user_metadata?.full_name) {
        return authStore.state.user.user_metadata.full_name
      }
      if (authStore.state?.user?.email) {
        return authStore.state.user.email.split('@')[0]
      }
      return '用户'
    },
    userRole() {
      return authStore.state?.title || authStore.state?.user?.user_metadata?.title || '律师'
    },
    userAvatar() {
      return authStore.state?.avatarUrl || null
    }
  },
  async mounted() {
    await this.loadBrandSettings()
    // Close user menu when clicking outside
    document.addEventListener('click', e => {
      const footer = this.$el.querySelector('.sidebar-footer')
      if (footer && !footer.contains(e.target)) {
        this.showUserMenu = false
      }
    })
  },
  methods: {
    async loadBrandSettings() {
      const { data } = await brandService.getBrandSettings()
      if (data) {
        this.brand.name = data.brand_name || this.brand.name
        this.brand.subtitle = data.brand_subtitle || this.brand.subtitle
        this.brand.logoUrl = data.logo_url || ''
        this.brand.logoText = data.logo_text || ''
      }
    },
    navigate(path) {
      this.$router.push(path)
      this.showUserMenu = false
    },
    isActive(path) {
      if (path === '/') {
        return this.currentPath === '/'
      }
      return this.currentPath.startsWith(path)
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      this.showUserMenu = false
    },
    openFeedback() {
      this.showFeedbackModal = true
      this.showUserMenu = false
    },
    async handleLogout() {
      this.showUserMenu = false

      try {
        console.log('Logging out...')
        const { error } = await authService.signOut()

        if (error) {
          console.error('Logout error:', error)
        }

        authStore.clearAuth()
        this.$router.push('/login')

        console.log('Logout successful')
      } catch (err) {
        console.error('Logout failed:', err)
        authStore.clearAuth()
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.user-menu-popover {
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 230px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  padding: 4px 0;
  z-index: 100;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.logout {
  color: #dc2626;
}

.menu-item.logout:hover {
  background: #fef2f2;
}

.menu-item i {
  width: 20px;
  margin-right: 8px;
  color: #666;
}

.menu-divider {
  height: 1px;
  background: #e5e5e5;
  margin: 4px 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
