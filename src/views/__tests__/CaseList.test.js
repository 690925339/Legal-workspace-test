import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CaseList from '../CaseList.vue'

describe('CaseList.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(CaseList)
    })

    describe('渲染测试', () => {
        it('应该正确渲染组件', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('应该渲染搜索框', () => {
            const searchInput = wrapper.find('input[type="text"]')
            expect(searchInput.exists()).toBe(true)
        })

        it('应该渲染新建案件按钮', () => {
            const createButton = wrapper.find('.create-btn')
            expect(createButton.exists()).toBe(true)
        })

        it('应该渲染状态筛选标签', () => {
            const tabs = wrapper.findAll('.status-tab')
            expect(tabs.length).toBeGreaterThan(0)
        })
    })

    describe('列表渲染', () => {
        it('初始状态应该显示案件列表', () => {
            expect(wrapper.vm.filteredCases).toBeDefined()
        })

        it('应该有正确的状态标签', () => {
            const statusTabs = ['全部', '草稿', '进行中', '已结案']
            statusTabs.forEach(status => {
                expect(wrapper.text()).toContain(status)
            })
        })
    })

    describe('搜索功能', () => {
        it('输入搜索关键词应该更新 searchKeyword', async () => {
            const searchInput = wrapper.find('input[type="text"]')
            await searchInput.setValue('测试案件')
            expect(wrapper.vm.searchKeyword).toBe('测试案件')
        })
    })

    describe('状态筛选', () => {
        it('切换状态筛选应该更新 selectedStatus', async () => {
            wrapper.vm.selectStatus('active')
            expect(wrapper.vm.selectedStatus).toBe('active')
        })

        it('应该能够筛选草稿状态', async () => {
            wrapper.vm.selectStatus('draft')
            expect(wrapper.vm.selectedStatus).toBe('draft')
        })
    })

    describe('组件方法', () => {
        it('应该有 viewCase 方法', () => {
            expect(typeof wrapper.vm.viewCase).toBe('function')
        })

        it('应该有 editCase 方法', () => {
            expect(typeof wrapper.vm.editCase).toBe('function')
        })

        it('应该有 deleteCase 方法', () => {
            expect(typeof wrapper.vm.deleteCase).toBe('function')
        })

        it('应该有 createCase 方法', () => {
            expect(typeof wrapper.vm.createCase).toBe('function')
        })
    })
})
