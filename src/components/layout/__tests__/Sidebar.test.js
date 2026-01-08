import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '../Sidebar.vue'

// Mock vue-router
const mockRouter = {
  push: vi.fn()
}

const mockRoute = {
  path: '/'
}

describe('Sidebar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Sidebar, {
      global: {
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: {
          ProductFeedback: true
        }
      }
    })
  })

  describe('渲染测试', () => {
    it('应该正确渲染侧边栏', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.sidebar').exists()).toBe(true)
    })

    it('应该渲染品牌Logo区域', () => {
      const brand = wrapper.find('.brand')
      expect(brand.exists()).toBe(true)
    })

    it('应该渲染品牌图标', () => {
      const brandIcon = wrapper.find('.brand-icon')
      expect(brandIcon.exists()).toBe(true)
    })

    it('应该渲染折叠按钮', () => {
      const collapseBtn = wrapper.find('.collapse-btn')
      expect(collapseBtn.exists()).toBe(true)
    })

    it('应该渲染导航项', () => {
      const navItems = wrapper.findAll('.nav-item')
      expect(navItems.length).toBeGreaterThan(0)
    })
  })

  describe('折叠功能', () => {
    it('初始状态应该是展开的', () => {
      expect(wrapper.vm.isCollapsed).toBe(false)
    })

    it('点击折叠按钮应该切换折叠状态', async () => {
      const collapseBtn = wrapper.find('.collapse-btn')
      await collapseBtn.trigger('click')
      expect(wrapper.vm.isCollapsed).toBe(true)
    })

    it('再次点击应该恢复展开', async () => {
      // 先折叠
      await wrapper.find('.collapse-btn').trigger('click')
      expect(wrapper.vm.isCollapsed).toBe(true)

      // 再展开
      await wrapper.find('.collapse-btn').trigger('click')
      expect(wrapper.vm.isCollapsed).toBe(false)
    })

    it('折叠后侧边栏应该有 collapsed 类', async () => {
      await wrapper.find('.collapse-btn').trigger('click')
      expect(wrapper.find('.sidebar').classes()).toContain('collapsed')
    })
  })

  describe('导航功能', () => {
    it('应该有 navigate 方法', () => {
      expect(typeof wrapper.vm.navigate).toBe('function')
    })

    it('应该有 isActive 方法', () => {
      expect(typeof wrapper.vm.isActive).toBe('function')
    })

    it('isActive 应该正确判断根路径', () => {
      expect(wrapper.vm.isActive('/')).toBe(true)
    })

    it('navigate 调用 router.push', () => {
      wrapper.vm.navigate('/legal-research')
      expect(mockRouter.push).toHaveBeenCalledWith('/legal-research')
    })
  })

  describe('用户菜单', () => {
    it('初始状态用户菜单应该隐藏', () => {
      expect(wrapper.vm.showUserMenu).toBe(false)
    })

    it('应该有 toggleUserMenu 方法', () => {
      expect(typeof wrapper.vm.toggleUserMenu).toBe('function')
    })

    it('切换用户菜单状态', () => {
      wrapper.vm.toggleUserMenu()
      expect(wrapper.vm.showUserMenu).toBe(true)
      wrapper.vm.toggleUserMenu()
      expect(wrapper.vm.showUserMenu).toBe(false)
    })
  })

  describe('辅助功能', () => {
    it('折叠按钮应该有 aria-label', () => {
      const collapseBtn = wrapper.find('.collapse-btn')
      expect(collapseBtn.attributes('aria-label')).toBeDefined()
    })

    it('导航链接应该有 aria-label', () => {
      const navLinks = wrapper.findAll('[aria-label]')
      expect(navLinks.length).toBeGreaterThan(0)
    })
  })

  describe('帮助中心链接', () => {
    it('应该有 helpCenterUrl 计算属性', () => {
      expect(wrapper.vm.helpCenterUrl).toBeDefined()
    })

    it('开发环境应该返回 localhost 地址', () => {
      // 在测试环境中，import.meta.env.DEV 应该是 true
      expect(wrapper.vm.helpCenterUrl).toContain('localhost')
    })
  })
})
