# Vue SFC 组件化升级计划

> **目标**: 将现有 `.js` 组件转换为 `.vue` 单文件组件  
> **优先级**: 高  
> **预估工作量**: 中等

---

## 1. 优化收益

### SFC 的优势
- ✅ **Scoped CSS**: 样式隔离，避免全局污染
- ✅ **更好的 IDE 支持**: 语法高亮、智能提示、错误检查
- ✅ **模板语法**: 使用 `<template>` 替代字符串模板
- ✅ **代码组织**: HTML、JS、CSS 统一管理
- ✅ **构建优化**: Vite 更好的 HMR 和 Tree-shaking

---

## 2. 组件分类与优先级

### 优先级 1: 布局组件（简单）
- `Sidebar.js` → `Sidebar.vue`
- `AppLayout.js` → `AppLayout.vue`

### 优先级 2: 通用组件（中等）
- `HistoryModal.js` → `HistoryModal.vue`

### 优先级 3: 认证页面（简单）
- `Login.js` → `Login.vue`
- `Register.js` → `Register.vue`
- `ForgotPassword.js` → `ForgotPassword.vue`

### 优先级 4: 业务页面（复杂）
- `CaseList.js` → `CaseList.vue`
- `CaseForm.js` → `CaseForm.vue`
- `CaseDetail.js` → `CaseDetail.vue` ⚠️ 最复杂
- `EvidenceUpload.js` → `EvidenceUpload.vue`
- `LegalResearch.js` → `LegalResearch.vue`
- `Settings.js` → `Settings.vue`
- `UserProfile.js` → `UserProfile.vue`
- 等...

### 优先级 5: 高级功能模块（复杂）
- `refactor/AIAnalysis.js` → `refactor/AIAnalysis.vue`
- `refactor/AIAssistant.js` → `refactor/AIAssistant.vue`
- `refactor/RelationshipGraph.js` → `refactor/RelationshipGraph.vue`
- `refactor/EvidenceTimeline.js` → `refactor/EvidenceTimeline.vue`
- `refactor/QuoteGenerator.js` → `refactor/QuoteGenerator.vue`

---

## 3. 转换模板

### JS 组件 → Vue SFC

**原始 JS 组件结构:**
```javascript
export default {
  data() { return { ... } },
  computed: { ... },
  methods: { ... },
  template: `<div>...</div>`
}
```

**Vue SFC 结构:**
```vue
<template>
  <div>...</div>
</template>

<script>
export default {
  name: 'ComponentName',
  data() { return { ... } },
  computed: { ... },
  methods: { ... }
}
</script>

<style scoped>
/* 组件专属样式 */
</style>
```

---

## 4. 转换步骤

### 第 1 步: 创建 Login.vue（示例）
1. 创建 `src/views/Login.vue`
2. 将 template 字符串移到 `<template>` 标签
3. 将 JS 逻辑移到 `<script>` 标签
4. 添加 `<style scoped>` 提取组件专属样式
5. 更新 `main.js` 导入路径

### 第 2 步: 逐步转换其他组件
按优先级依次转换，每转换一个组件：
- ✅ 测试功能正常
- ✅ 检查样式一致
- ✅ 提交 Git

### 第 3 步: 清理旧文件
所有组件转换完成后，删除 `.js` 组件文件

---

## 5. 需要注意的问题

### 全局依赖处理
某些组件可能依赖全局变量（如 `window.d3`），需要改为：
```javascript
import * as d3 from 'd3'
```

### 路由更新
`main.js` 中的组件注册需要更新导入路径：
```javascript
// 旧
import Login from './views/Login.js'
// 新
import Login from './views/Login.vue'
```

### CSS 提取
将组件专属样式从 `main.css` 移到各组件的 `<style scoped>`

---

## 6. 实施计划

建议采用 **渐进式转换** 策略：

1. **第一批**: Login, Register, ForgotPassword（约 1-2 小时）
2. **第二批**: Sidebar, HistoryModal（约 1 小时）
3. **第三批**: CaseList, CaseForm（约 2-3 小时）
4. **第四批**: 其他业务页面（根据时间安排）
5. **第五批**: 高级功能模块（最后处理）

---

## 7. 开始执行

准备好后，我将：
1. 从 `Login.vue` 开始示范转换
2. 逐步转换其他组件
3. 每完成一批进行测试验证
