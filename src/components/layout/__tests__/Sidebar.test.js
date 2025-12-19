import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '../Sidebar.vue'

describe('Sidebar.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(Sidebar)
    })

    describe('渲染测试', () => {
        it('应该正确渲染侧边栏', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('应该渲染品牌Logo区域', () => {
            const brandArea = wrapper.find('.brand-area')
            expect(brandArea.exists()).toBe(true)
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
            wrapper.vm.isCollapsed = true
            const collapseBtn = wrapper.find('.collapse-btn')
            await collapseBtn.trigger('click')
            expect(wrapper.vm.isCollapsed).toBe(false)
        })
    })

    describe('导航功能', () => {
        it('应该有 navigate 方法', () => {
            expect(typeof wrapper.vm.navigate).toBe('function')
        })

        it('应该有 isActive 方法', () => {
            expect(typeof wrapper.vm.isActive).toBe('function')
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
})
