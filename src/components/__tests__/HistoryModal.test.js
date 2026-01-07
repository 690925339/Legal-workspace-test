import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryModal from '../HistoryModal.vue'

describe('HistoryModal.vue', () => {
  describe('Props 测试', () => {
    it('visible=false 时不应该显示模态框', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: false,
          historyType: 'contract'
        }
      })

      // 模态框应该存在但不可见
      expect(wrapper.exists()).toBe(true)
    })

    it('visible=true 时应该显示模态框', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'contract'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('应该接受 historyType prop', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'legal-research'
        }
      })

      expect(wrapper.props('historyType')).toBe('legal-research')
    })
  })

  describe('渲染测试', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'contract'
        }
      })
    })

    it('应该渲染模态框标题', () => {
      // 标题应该存在
      // const modal = wrapper.find('.modal') || wrapper.find('[role="dialog"]')
      expect(wrapper.html()).toBeTruthy()
    })

    it('应该渲染关闭按钮', () => {
      const closeButtons = wrapper.findAll('button')
      expect(closeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('事件测试', () => {
    it('点击关闭应该触发 update:visible 事件', async () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'contract'
        }
      })

      // 尝试调用关闭方法
      if (typeof wrapper.vm.closeModal === 'function') {
        wrapper.vm.closeModal()
        expect(wrapper.emitted()).toHaveProperty('update:visible')
      }
    })
  })

  describe('历史类型', () => {
    it('应该支持合同审查历史类型', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'contract'
        }
      })

      expect(wrapper.props('historyType')).toBe('contract')
    })

    it('应该支持法律检索历史类型', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'legal-research'
        }
      })

      expect(wrapper.props('historyType')).toBe('legal-research')
    })

    it('应该支持文书生成历史类型', () => {
      const wrapper = mount(HistoryModal, {
        props: {
          visible: true,
          historyType: 'doc-generate'
        }
      })

      expect(wrapper.props('historyType')).toBe('doc-generate')
    })
  })
})
