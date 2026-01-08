import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryModal from '../HistoryModal.vue'

describe('HistoryModal.vue', () => {
  describe('Props 测试', () => {
    it('visible=false 时不应该渲染模态框内容', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: false,
          title: '测试标题'
        }
      })

      // v-if="visible" 控制渲染
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('visible=true 时应该渲染模态框', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          title: '测试标题'
        }
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('应该接受 title prop', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          title: '历史记录'
        }
      })

      expect(wrapper.props('title')).toBe('历史记录')
      expect(wrapper.find('.modal-title').text()).toBe('历史记录')
    })

    it('应该接受 records prop', () => {
      const records = [
        { id: 1, title: '记录1', date: '2026-01-01' },
        { id: 2, title: '记录2', date: '2026-01-02' }
      ]
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          records
        }
      })

      expect(wrapper.props('records')).toEqual(records)
    })

    it('应该接受 tabs prop', () => {
      const tabs = ['案例', '法规']
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          tabs
        }
      })

      expect(wrapper.props('tabs')).toEqual(tabs)
    })
  })

  describe('渲染测试', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          title: '测试历史'
        }
      })
    })

    it('应该渲染模态框标题', () => {
      expect(wrapper.find('.modal-title').exists()).toBe(true)
    })

    it('应该渲染关闭按钮', () => {
      expect(wrapper.find('.modal-close').exists()).toBe(true)
    })

    it('无记录时应该显示空状态', () => {
      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.find('.empty-state').text()).toContain('暂无历史记录')
    })
  })

  describe('记录列表测试', () => {
    it('应该渲染历史记录列表', () => {
      const records = [
        { id: 1, title: '合同审查记录', date: '2026-01-01' },
        { id: 2, title: '法规检索记录', date: '2026-01-02' }
      ]
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          records
        }
      })

      const historyItems = wrapper.findAll('.history-item')
      expect(historyItems.length).toBe(2)
    })

    it('记录应该按日期倒序排列', () => {
      const records = [
        { id: 1, title: '旧记录', date: '2026-01-01' },
        { id: 2, title: '新记录', date: '2026-01-10' }
      ]
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          records
        }
      })

      const items = wrapper.findAll('.record-title')
      expect(items[0].text()).toBe('新记录')
    })
  })

  describe('Tabs 测试', () => {
    it('有 tabs 时应该渲染标签页', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          tabs: ['案例', '法规']
        }
      })

      expect(wrapper.find('.tabs-container').exists()).toBe(true)
      expect(wrapper.findAll('.tab-button').length).toBe(2)
    })

    it('无 tabs 时不应该渲染标签页', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          tabs: []
        }
      })

      expect(wrapper.find('.tabs-container').exists()).toBe(false)
    })

    it('点击标签应该切换 activeTab', async () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          tabs: ['案例', '法规']
        }
      })

      const tabButtons = wrapper.findAll('.tab-button')
      await tabButtons[1].trigger('click')
      expect(wrapper.vm.activeTab).toBe('法规')
    })
  })

  describe('事件测试', () => {
    it('点击关闭按钮应该触发 update:visible 事件', async () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true
        }
      })

      await wrapper.find('.modal-close').trigger('click')
      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:visible')[0]).toEqual([false])
    })

    it('点击遮罩层应该关闭模态框', async () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true
        }
      })

      await wrapper.find('.modal-overlay').trigger('click')
      expect(wrapper.emitted('update:visible')).toBeTruthy()
    })

    it('点击记录应该触发 select 事件', async () => {
      const records = [{ id: 1, title: '测试记录', date: '2026-01-01' }]
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          records
        }
      })

      await wrapper.find('.history-item').trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')[0][0]).toEqual(records[0])
    })

    it('点击删除按钮应该触发 delete 事件', async () => {
      const records = [{ id: 1, title: '测试记录', date: '2026-01-01' }]
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          records
        }
      })

      await wrapper.find('.delete-btn').trigger('click')
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')[0][0]).toEqual(records[0])
    })
  })
})
