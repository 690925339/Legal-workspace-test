import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../Login.vue'

describe('Login.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(Login)
    })

    describe('渲染测试', () => {
        it('应该渲染登录表单', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('应该渲染邮箱输入框', () => {
            const emailInput = wrapper.find('input[type="email"]')
            expect(emailInput.exists()).toBe(true)
        })

        it('应该渲染密码输入框', () => {
            const passwordInput = wrapper.find('input[type="password"]')
            expect(passwordInput.exists()).toBe(true)
        })

        it('应该渲染登录按钮', () => {
            const submitButton = wrapper.find('button[type="submit"]')
            expect(submitButton.exists()).toBe(true)
            expect(submitButton.text()).toContain('登录')
        })

        it('应该有忘记密码链接', () => {
            const links = wrapper.findAll('a')
            expect(links.length).toBeGreaterThan(0)
        })

        it('应该有注册链接', () => {
            const links = wrapper.findAll('a')
            expect(links.length).toBeGreaterThan(0)
        })
    })

    describe('交互测试', () => {
        it('输入邮箱应该更新 v-model', async () => {
            const emailInput = wrapper.find('input[type="email"]')
            await emailInput.setValue('test@example.com')
            expect(wrapper.vm.email).toBe('test@example.com')
        })

        it('输入密码应该更新 v-model', async () => {
            const passwordInput = wrapper.find('input[type="password"]')
            await passwordInput.setValue('password123')
            expect(wrapper.vm.password).toBe('password123')
        })

        it('记住我复选框应该可以切换', async () => {
            const checkbox = wrapper.find('input[type="checkbox"]')
            await checkbox.setChecked(true)
            expect(wrapper.vm.rememberMe).toBe(true)
        })
    })

    describe('表单验证', () => {
        it('初始状态错误消息应该为空', () => {
            expect(wrapper.vm.errorMessage).toBe('')
        })

        it('初始状态加载状态应该为false', () => {
            expect(wrapper.vm.isLoading).toBe(false)
        })
    })

    describe('组件状态', () => {
        it('应该有正确的初始数据', () => {
            expect(wrapper.vm.email).toBe('')
            expect(wrapper.vm.password).toBe('')
            expect(wrapper.vm.rememberMe).toBe(false)
            expect(wrapper.vm.isLoading).toBe(false)
            expect(wrapper.vm.errorMessage).toBe('')
        })

        it('应该有品牌信息', () => {
            expect(wrapper.vm.brand).toBeDefined()
            expect(wrapper.vm.brand.name).toBeDefined()
        })
    })
})
