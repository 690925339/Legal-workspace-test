<template>
  <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
    <div class="brand" style="position: relative; padding-right: 0;">
      <div v-if="brand.logoUrl" class="brand-icon">
        <img :src="brand.logoUrl" alt="Logo" style="max-width: 32px; max-height: 32px;">
      </div>
      <div v-else class="brand-icon">
        <i class="fas fa-gavel"></i>
      </div>
      <div class="brand-text" v-show="!isCollapsed">
        <div class="brand-name">{{ brand.name }}</div>
        <div class="brand-subtitle">{{ brand.subtitle }}</div>
      </div>
      
      <!-- Collapse Toggle -->
      <button @click="toggleCollapse" class="collapse-btn" aria-label="折叠侧边栏">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <div class="nav-group-title" v-show="!isCollapsed">工作台</div>
    <a @click.prevent="navigate('/')" 
       :class="['nav-item', { active: isActive('/') }]"
       aria-label="案件管理">
      <i class="fas fa-folder-open"></i>
      <span v-show="!isCollapsed">案件管理</span>
    </a>

    <div class="nav-group-title" style="margin-top: 24px;" v-show="!isCollapsed">智能分析</div>
    <a @click.prevent="navigate('/legal-research')" 
       :class="['nav-item', { active: isActive('/legal-research') }]"
       aria-label="法律检索">
      <i class="fas fa-search"></i>
      <span v-show="!isCollapsed">法律检索</span>
    </a>
    <a @click.prevent="navigate('/contract-review')" 
       :class="['nav-item', { active: isActive('/contract-review') }]"
       aria-label="合同审查">
      <i class="fas fa-file-contract"></i>
      <span v-show="!isCollapsed">合同审查</span>
    </a>
    <a @click.prevent="navigate('/doc-generate')" 
       :class="['nav-item', { active: isActive('/doc-generate') }]"
       aria-label="文书生成">
      <i class="fas fa-pen-fancy"></i>
      <span v-show="!isCollapsed">文书生成</span>
    </a>

    <div class="sidebar-footer" style="position: relative;">
      <div v-if="showUserMenu" class="user-menu-popover">
        <a @click.prevent="navigate('/profile')" class="menu-item">
          <i class="fas fa-user-circle"></i>
          个人资料
        </a>

        <a href="https://ai.feishu.cn/wiki/CBlfwahuAiecuRk9yvucFTx8n5b?from=from_copylink" 
           target="_blank" 
           @click="showUserMenu = false" 
           class="menu-item">
          <i class="fas fa-question-circle"></i>
          帮助文档
        </a>
        
        <a @click.prevent="showFeedbackModal = true; showUserMenu = false" class="menu-item">
          <i class="fas fa-comment-alt"></i>
          产品反馈
        </a>
        
        <div class="menu-divider"></div>
        
        <a @click.prevent="handleLogout" class="menu-item logout">
          <i class="fas fa-sign-out-alt"></i>
          退出登录
        </a>
      </div>

      <a @click.prevent="toggleUserMenu" class="user-profile">
        <div class="user-avatar">
          <img v-if="userAvatar" :src="userAvatar" alt="头像">
          <i v-else class="fas fa-user"></i>
        </div>
        <div class="user-info" v-show="!isCollapsed">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </a>
    </div>
    
    <!-- Feedback Modal -->
    <ProductFeedback 
      :visible="showFeedbackModal" 
      @close="showFeedbackModal = false"
    />
  </aside>
</template>

<script>
import { router } from '../../router.js'
import { authService, brandService } from '../../config/supabase.js'
import { authStore } from '../../store/authStore.js'
import ProductFeedback from '../../views/ProductFeedback.js'

export default {
  name: 'Sidebar',
  components: {
    ProductFeedback
  },
  data() {
    return {
      currentPath: window.location.hash.slice(1) || '/',
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
    userName() {
      if (authStore.user?.user_metadata?.full_name) {
        return authStore.user.user_metadata.full_name
      }
      if (authStore.user?.email) {
        return authStore.user.email.split('@')[0]
      }
      return '用户'
    },
    userRole() {
      return authStore.title || authStore.user?.user_metadata?.title || '律师'
    },
    userAvatar() {
      return authStore.avatarUrl || null
    }
  },
  async mounted() {
    await this.loadBrandSettings()
    window.addEventListener('hashchange', () => {
      this.currentPath = window.location.hash.slice(1) || '/'
    })
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
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
      router.push(path)
      this.showUserMenu = false
    },
    isActive(path) {
      return this.currentPath === path
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
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
        window.location.hash = '/login'

        console.log('Logout successful')
      } catch (err) {
        console.error('Logout failed:', err)
        authStore.clearAuth()
        window.location.hash = '/login'
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
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
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
