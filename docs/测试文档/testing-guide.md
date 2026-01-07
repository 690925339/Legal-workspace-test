# Vue 组件测试指南

> **测试框架**: Vitest + @vue/test-utils  
> **测试环境**: happy-dom  
> **覆盖率**: 使用 v8 provider

本文档提供 Vue 组件测试的完整指南和实用示例。

---

## 📚 目录

- [快速开始](#快速开始)
- [测试结构](#测试结构)
- [常用测试示例](#常用测试示例)
- [最佳实践](#最佳实践)
- [运行测试](#运行测试)

---

## 快速开始

### 运行测试

```bash
# 运行所有测试
npm run test

# 可视化测试界面
npm run test:ui

# 生成覆盖率报告
npm run test:coverage

# 监听模式（开发时）
npm run test -- --watch
```

### 创建测试文件

测试文件应放置在对应模块的 `__tests__/` 目录下：

**Feature-Based 架构** (推荐):

```
src/features/case/
├── services/
│   ├── caseService.js
│   └── __tests__/
│       └── caseService.spec.js
├── composables/
│   ├── useCaseBasicInfo.js
│   └── __tests__/
│       └── useCaseBasicInfo.spec.js
└── views/
    ├── CaseList.vue
    └── __tests__/
        └── CaseList.spec.js
```

**全局服务层**:

```
src/services/
├── api-client.js
└── __tests__/
    └── api-client.spec.js
```

**组件测试**:

```
src/components/
├── common/
│   ├── ConfirmModal.vue
│   └── __tests__/
│       └── ConfirmModal.spec.js
```

---

## 测试结构

### 基本模板

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '../ComponentName.vue'

describe('ComponentName.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ComponentName, {
      props: {
        // props here
      }
    })
  })

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
```

---

## 常用测试示例

### 1. 测试组件渲染

**测试表单元素是否存在**

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../Login.vue'

describe('Login.vue - 渲染测试', () => {
  it('应该渲染邮箱输入框', () => {
    const wrapper = mount(Login)
    const emailInput = wrapper.find('input[type="email"]')
    expect(emailInput.exists()).toBe(true)
  })

  it('应该渲染密码输入框', () => {
    const wrapper = mount(Login)
    const passwordInput = wrapper.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)
  })

  it('应该渲染登录按钮', () => {
    const wrapper = mount(Login)
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('登录')
  })
})
```

### 2. 测试用户交互

**测试按钮点击**

```javascript
describe('Login.vue - 交互测试', () => {
  it('点击登录按钮应该调用 handleLogin', async () => {
    const wrapper = mount(Login)

    // 填写表单
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')

    // 提交表单
    await wrapper.find('form').trigger('submit.prevent')

    // 验证行为（这里需要根据实际实现调整）
    // 例如：检查是否显示加载状态
    expect(wrapper.vm.isLoading).toBe(true)
  })
})
```

**测试输入变化**

```javascript
it('输入邮箱应该更新 v-model', async () => {
  const wrapper = mount(Login)
  const emailInput = wrapper.find('input[type="email"]')

  await emailInput.setValue('user@example.com')

  expect(wrapper.vm.email).toBe('user@example.com')
})
```

### 3. 测试组件Props

```javascript
import { mount } from '@vue/test-utils'
import CaseForm from '../CaseForm.vue'

describe('CaseForm.vue - Props 测试', () => {
  it('编辑模式下应该显示现有案件数据', () => {
    const caseData = {
      id: '123',
      caseName: '测试案件',
      caseNumber: 'CASE-001'
    }

    const wrapper = mount(CaseForm, {
      props: {
        editId: '123',
        initialData: caseData
      }
    })

    expect(wrapper.find('input[name="caseName"]').element.value).toBe('测试案件')
    expect(wrapper.find('input[name="caseNumber"]').element.value).toBe('CASE-001')
  })
})
```

### 4. 测试事件触发

```javascript
describe('CaseList.vue - 事件测试', () => {
  it('点击新建按钮应该触发 create 事件', async () => {
    const wrapper = mount(CaseList)

    await wrapper.find('.create-btn').trigger('click')

    // 检查是否触发了事件
    expect(wrapper.emitted()).toHaveProperty('create')
  })

  it('点击删除按钮应该触发 delete 事件并传递ID', async () => {
    const wrapper = mount(CaseList, {
      props: {
        cases: [{ id: '123', name: '测试案件' }]
      }
    })

    await wrapper.find('.delete-btn').trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual(['123'])
  })
})
```

### 5. 测试计算属性

```javascript
describe('Sidebar.vue - 计算属性测试', () => {
  it('isCollapsed 为 true 时应该添加 collapsed 类', () => {
    const wrapper = mount(Sidebar, {
      data() {
        return {
          isCollapsed: true
        }
      }
    })

    expect(wrapper.classes()).toContain('sidebar-collapsed')
  })
})
```

### 6. 测试异步操作

```javascript
import { vi } from 'vitest'

describe('Login.vue - 异步测试', () => {
  it('成功登录后应该导航到首页', async () => {
    // Mock router
    const mockPush = vi.fn()
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: {
            push: mockPush
          }
        }
      }
    })

    // 设置表单数据
    wrapper.vm.email = 'test@example.com'
    wrapper.vm.password = 'password123'

    // 调用登录方法
    await wrapper.vm.handleLogin()

    // 验证导航
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
```

### 7. 测试条件渲染

```javascript
describe('HistoryModal.vue - 条件渲染', () => {
  it('visible=false 时不应该显示模态框', () => {
    const wrapper = mount(HistoryModal, {
      props: {
        visible: false
      }
    })

    expect(wrapper.find('.modal').isVisible()).toBe(false)
  })

  it('visible=true 时应该显示模态框', async () => {
    const wrapper = mount(HistoryModal, {
      props: {
        visible: true
      }
    })

    expect(wrapper.find('.modal').isVisible()).toBe(true)
  })
})
```

### 8. 测试列表渲染

```javascript
describe('CaseList.vue - 列表渲染', () => {
  it('应该渲染正确数量的案件', () => {
    const cases = [
      { id: '1', name: '案件1' },
      { id: '2', name: '案件2' },
      { id: '3', name: '案件3' }
    ]

    const wrapper = mount(CaseList, {
      props: { cases }
    })

    const caseItems = wrapper.findAll('.case-item')
    expect(caseItems).toHaveLength(3)
  })

  it('空列表时应该显示空状态提示', () => {
    const wrapper = mount(CaseList, {
      props: { cases: [] }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('暂无案件')
  })
})
```

### 9. 测试表单验证

```javascript
describe('CaseForm.vue - 表单验证', () => {
  it('提交空表单应该显示错误提示', async () => {
    const wrapper = mount(CaseForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.text()).toContain('请填写必填项')
  })

  it('邮箱格式错误应该显示提示', async () => {
    const wrapper = mount(Login)

    await wrapper.find('input[type="email"]').setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toContain('邮箱格式不正确')
  })
})
```

### 10. 测试Slots插槽

```javascript
describe('Card.vue - 插槽测试', () => {
  it('应该渲染默认插槽内容', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<p>卡片内容</p>'
      }
    })

    expect(wrapper.html()).toContain('<p>卡片内容</p>')
  })

  it('应该渲染具名插槽', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<h2>卡片标题</h2>',
        footer: '<button>确定</button>'
      }
    })

    expect(wrapper.find('.card-header').html()).toContain('<h2>卡片标题</h2>')
    expect(wrapper.find('.card-footer').html()).toContain('<button>确定</button>')
  })
})
```

### 11. 测试 API Client ⚡NEW

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiClient } from '../api-client.js'

describe('ApiClient', () => {
  let client

  beforeEach(() => {
    client = new ApiClient({ baseURL: 'https://api.example.com' })
  })

  it('应该正确设置请求拦截器', () => {
    const interceptor = vi.fn(config => config)
    client.addRequestInterceptor(interceptor)

    expect(client.requestInterceptors).toContain(interceptor)
  })

  it('GET 请求应该返回正确的数据', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' })
    })

    const result = await client.get('/test')
    expect(result).toEqual({ data: 'test' })
  })

  it('应该正确处理错误响应', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    await expect(client.get('/test')).rejects.toThrow('Not Found')
  })
})
```

### 12. 测试 Composables ⚡NEW

```javascript
import { describe, it, expect, vi } from 'vitest'
import { useCaseBasicInfo } from '../useCaseBasicInfo.js'

describe('useCaseBasicInfo', () => {
  it('应该初始化编辑表单数据', () => {
    const { editForm, stageOptions } = useCaseBasicInfo()

    expect(editForm.value).toHaveProperty('name')
    expect(editForm.value).toHaveProperty('caseNumber')
    expect(stageOptions.value).toContain('立案')
  })

  it('loadBasicInfo 应该加载案件数据', async () => {
    // Mock caseService
    vi.mock('@/features/case/services', () => ({
      caseService: {
        getById: vi.fn().mockResolvedValue({
          case_title: '测试案件',
          case_number: 'CASE-001'
        })
      }
    }))

    const { loadBasicInfo, editForm } = useCaseBasicInfo()
    await loadBasicInfo('test-id')

    expect(editForm.value.name).toBe('测试案件')
  })
})
```

### 13. 测试缓存服务 ⚡NEW

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { caseListCache } from '../caseListCache.js'

describe('caseListCache', () => {
  beforeEach(() => {
    caseListCache.clear()
    vi.useFakeTimers()
  })

  it('应该正确缓存和获取数据', () => {
    const testData = [{ id: '1', name: '案件1' }]

    caseListCache.set(testData)
    const cached = caseListCache.get()

    expect(cached).toEqual(testData)
  })

  it('缓存过期后应该返回 null', () => {
    const testData = [{ id: '1', name: '案件1' }]

    caseListCache.set(testData)

    // 快进 6 分钟(超过 5 分钟 TTL)
    vi.advanceTimersByTime(6 * 60 * 1000)

    const cached = caseListCache.get()
    expect(cached).toBeNull()
  })

  it('invalidate 应该清除缓存', () => {
    const testData = [{ id: '1', name: '案件1' }]

    caseListCache.set(testData)
    caseListCache.invalidate()

    expect(caseListCache.get()).toBeNull()
  })
})
```

### 14. 测试 Service 层 ⚡NEW

```javascript
import { describe, it, expect, vi } from 'vitest'
import { caseService } from '../caseService.js'

// Mock Supabase
vi.mock('@/config/supabase.js', () => ({
  getSupabaseClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: '1', case_title: '测试案件' },
        error: null
      })
    }))
  })
}))

describe('caseService', () => {
  it('getById 应该返回案件数据', async () => {
    const result = await caseService.getById('test-id')

    expect(result).toHaveProperty('id')
    expect(result.case_title).toBe('测试案件')
  })

  it('create 应该创建新案件', async () => {
    const newCase = {
      case_title: '新案件',
      case_number: 'CASE-002'
    }

    const result = await caseService.create(newCase)

    expect(result).toHaveProperty('id')
  })
})
```

---

## 最佳实践

### 1. 测试组织

```javascript
describe('ComponentName.vue', () => {
  describe('渲染测试', () => {
    // 所有渲染相关测试
  })

  describe('交互测试', () => {
    // 所有用户交互测试
  })

  describe('边界情况', () => {
    // 边界和异常情况测试
  })
})
```

### 2. 使用 beforeEach 减少重复

```javascript
describe('Login.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Login, {
      // 公共配置
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('测试1', () => {
    // 使用 wrapper
  })

  it('测试2', () => {
    // 使用 wrapper
  })
})
```

### 3. Mock 外部依赖

```javascript
import { vi } from 'vitest'

// Mock Supabase
vi.mock('../config/supabase.js', () => ({
  authService: {
    signIn: vi.fn().mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    })
  }
}))

describe('Login with mocked Supabase', () => {
  // 测试代码
})
```

### 4. 测试命名规范

```javascript
// ✅ 好的命名
it('应该在邮箱格式错误时显示错误提示', () => {})
it('点击提交按钮后应该禁用表单', () => {})

// ❌ 避免
it('测试1', () => {})
it('works', () => {})
```

### 5. 每个测试只验证一个行为

```javascript
// ✅ 好的做法
it('应该渲染邮箱输入框', () => {
  expect(wrapper.find('input[type="email"]').exists()).toBe(true)
})

it('应该渲染密码输入框', () => {
  expect(wrapper.find('input[type="password"]').exists()).toBe(true)
})

// ❌ 避免
it('应该渲染所有表单元素', () => {
  expect(wrapper.find('input[type="email"]').exists()).toBe(true)
  expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  expect(wrapper.find('button').exists()).toBe(true)
})
```

### 6. 测试用户行为，而非实现细节

```javascript
// ✅ 测试用户能看到什么
it('登录失败时应该显示错误消息', async () => {
  await wrapper.vm.handleLogin()
  expect(wrapper.text()).toContain('登录失败')
})

// ❌ 测试内部状态
it('登录失败时应该设置 errorMessage', async () => {
  await wrapper.vm.handleLogin()
  expect(wrapper.vm.errorMessage).toBe('登录失败')
})
```

---

## 运行测试

### 命令选项

```bash
# 运行单个文件
npm run test -- Login.test.js

# 运行匹配模式的测试
npm run test -- --grep Login

# 监听模式
npm run test -- --watch

# UI 模式（带可视化界面）
npm run test:ui

# 覆盖率报告
npm run test:coverage
```

### 查看覆盖率

运行 `npm run test:coverage` 后，覆盖率报告会生成在 `coverage/` 目录：

```
coverage/
├── index.html       # HTML版本报告（用浏览器打开）
└── coverage-final.json
```

### 持续集成

在 CI/CD 中运行测试：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
```

---

## 常见问题

### Q: 如何测试路由跳转？

```javascript
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

const mockPush = vi.fn()
const wrapper = mount(Component, {
  global: {
    mocks: {
      $router: {
        push: mockPush
      }
    }
  }
})

// 验证路由调用
expect(mockPush).toHaveBeenCalledWith('/target-route')
```

### Q: 如何测试 Vuex/Pinia store?

```javascript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

const wrapper = mount(Component, {
  global: {
    plugins: [createPinia()]
  }
})
```

### Q: 如何测试 async/await?

```javascript
it('异步操作测试', async () => {
  const wrapper = mount(Component)

  // 调用异步方法
  await wrapper.vm.asyncMethod()

  // 等待 DOM 更新
  await wrapper.vm.$nextTick()

  // 验证结果
  expect(wrapper.text()).toContain('结果')
})
```

---

## 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
- [Vue 3 测试指南](https://vuejs.org/guide/scaling-up/testing.html)

---

**最后更新**: 2026-01-07  
**适用版本**: Vue 3.4+ | Vitest 1.x | @vue/test-utils 2.x  
**架构版本**: v3.15 (Feature-Based + SFC)
