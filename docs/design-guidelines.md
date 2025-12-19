# AI法律助手 - UI/UX 设计规范

## 📋 文档信息

**版本**: v2.0  
**最后更新**: 2025-12-04  
**适用范围**: AI法律助手 Legal Workspace v3.0

---

## 目录

1. [设计理念](#设计理念)
2. [色彩体系](#色彩体系)
3. [字体规范](#字体规范)
4. [间距与布局](#间距与布局)
5. [组件规范](#组件规范)
6. [交互规范](#交互规范)
7. [图标规范](#图标规范)
8. [响应式设计](#响应式设计)
9. [页面模板](#页面模板)
10. [设计原则](#设计原则)

---

## 设计理念

### 核心价值观
采用 **黑白简洁风格**，强调内容优先，减少视觉干扰，提供专业、可信赖的法律工作界面体验。

### 设计目标
- **专业性**: 传达法律行业的严谨和专业
- **效率性**: 减少认知负担，提高工作效率
- **一致性**: 统一的视觉语言和交互模式
- **可访问性**: 良好的对比度和可读性

---

## 色彩体系

### 主色调

#### 黑色系
| 用途 | 色值 | CSS变量 | 使用场景 |
|------|------|---------|----------|
| 主色（黑） | `#1a1a1a` | `--color-primary` | 主要按钮、激活状态、标题文字 |
| 辅助黑 | `#333333` | `--color-primary-hover` | 按钮悬停状态 |
| 深灰 | `#666666` | `--color-text-secondary` | 次要文字、描述文字 |

#### 白色系
| 用途 | 色值 | CSS变量 | 使用场景 |
|------|------|---------|----------|
| 纯白 | `#ffffff` | `--color-white` | 卡片背景、次要按钮背景 |
| 页面背景 | `#fafafa` | `--color-bg-page` | 整体页面背景 |
| 次背景 | `#f5f5f5` | `--color-bg-secondary` | 输入框底部、标签背景 |

### 灰度色阶

| 级别 | 色值 | CSS变量 | 使用场景 |
|------|------|---------|----------|
| Gray-50 | `#fafafa` | `--gray-50` | 页面背景 |
| Gray-100 | `#f5f5f5` | `--gray-100` | 次背景、禁用背景 |
| Gray-200 | `#e5e5e5` | `--gray-200` | 边框、分割线 |
| Gray-300 | `#dddddd` | `--gray-300` | 虚线边框 |
| Gray-400 | `#cccccc` | `--gray-400` | 禁用文字 |
| Gray-500 | `#999999` | `--gray-500` | 辅助文字、占位符 |
| Gray-600 | `#666666` | `--gray-600` | 次要文字 |
| Gray-700 | `#333333` | `--gray-700` | 悬停状态 |
| Gray-900 | `#1a1a1a` | `--gray-900` | 主文字、主色 |

### 状态色（仅用于状态提示）

#### 成功色
| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 成功背景 | `#dcfce7` | 成功提示背景 |
| 成功文字 | `#16a34a` | 成功提示文字 |
| 成功边框 | `#22c55e` | 成功状态边框 |

#### 警告色
| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 警告背景 | `#fef3c7` | 警告提示背景 |
| 警告文字 | `#d97706` | 警告提示文字 |
| 警告边框 | `#f59e0b` | 警告状态边框 |

#### 错误色
| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 错误背景 | `#fee2e2` | 错误提示背景 |
| 错误文字 | `#dc2626` | 错误提示文字 |
| 错误边框 | `#ef4444` | 错误状态边框 |

#### 信息色
| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 信息背景 | `#e0e7ff` | 信息提示背景 |
| 信息文字 | `#4f46e5` | 信息提示文字 |
| 信息边框 | `#6366f1` | 信息状态边框 |

### 案件状态色

| 状态 | 背景色 | 文字色 | 使用场景 |
|------|--------|--------|----------|
| 进行中 | `#dbeafe` | `#1e40af` | 案件状态标签 |
| 草稿 | `#f3f4f6` | `#4b5563` | 案件状态标签 |
| 已结案 | `#d1fae5` | `#065f46` | 案件状态标签 |
| 未签约 | `#fed7aa` | `#c2410c` | 案件状态标签 |

### 证据分类色

| 分类 | 背景色 | 文字色 | 使用场景 |
|------|--------|--------|----------|
| 合同协议 | `#e0f2fe` | `#0369a1` | 证据分类标签 |
| 支付凭证 | `#dcfce7` | `#15803d` | 证据分类标签 |
| 往来函件 | `#f3e8ff` | `#7e22ce` | 证据分类标签 |
| 其他证据 | `#f3f4f6` | `#4b5563` | 证据分类标签 |

---

## 字体规范

### 字体家族
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

### 字号体系

| 元素类型 | 字号 | 字重 | 行高 | 使用场景 |
|---------|------|------|------|----------|
| 超大标题 | `48px` | `700` | `1.2` | AI分析胜诉率数值 |
| 页面标题 | `26px` | `600` | `1.4` | 页面主标题 |
| 卡片标题 | `18px` | `600` | `1.4` | 卡片标题 |
| 小标题 | `16px` | `600` | `1.4` | 子标题、模态框标题 |
| 正文大 | `15px` | `400` | `1.8` | 重要正文内容 |
| 正文 | `14px` | `400` | `1.8` | 普通正文、按钮文字 |
| 辅助文字 | `13px` | `400` | `1.6` | 描述文字、提示文字 |
| 小字 | `12px` | `400` | `1.5` | 小提示、时间戳 |
| 极小字 | `10px` | `400` | `1.4` | 图表标签 |

### 字重规范

| 字重值 | 名称 | 使用场景 |
|--------|------|----------|
| `400` | Normal | 正文、描述文字 |
| `500` | Medium | 按钮文字、标签文字 |
| `600` | Semibold | 标题、卡片标题 |
| `700` | Bold | 强调文字、数值 |

### 文字颜色

| 用途 | 色值 | 使用场景 |
|------|------|----------|
| 主文字 | `#1a1a1a` | 标题、正文 |
| 次文字 | `#666666` | 描述文字 |
| 辅助文字 | `#999999` | 提示、占位符 |
| 禁用文字 | `#cccccc` | 禁用状态 |
| 反色文字 | `#ffffff` | 深色背景上的文字 |

---

## 间距与布局

### 间距体系（8px基准）

| 级别 | 数值 | CSS变量 | 使用场景 |
|------|------|---------|----------|
| xs | `4px` | `--spacing-xs` | 图标与文字间距 |
| sm | `8px` | `--spacing-sm` | 小元素间距 |
| md | `12px` | `--spacing-md` | 标题与描述间距 |
| lg | `16px` | `--spacing-lg` | 卡片内元素间距 |
| xl | `20px` | `--spacing-xl` | 卡片内边距 |
| 2xl | `24px` | `--spacing-2xl` | 卡片间距、区块间距 |
| 3xl | `32px` | `--spacing-3xl` | 大区块间距 |
| 4xl | `40px` | `--spacing-4xl` | 页面内边距 |
| 5xl | `48px` | `--spacing-5xl` | 页面顶部间距 |

### 页面布局

#### 页面容器
```css
.smart-page {
    min-height: 100vh;
    background: #fafafa;
    overflow-y: auto;
}

.smart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
}
```

#### 内容区域
```css
.smart-content {
    max-width: 900px; /* 阅读最佳宽度 */
    margin: 0 auto;
}
```

### 卡片规范

#### 现代卡片 (modern-card)
```css
.modern-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 24px;
}
```

#### 智能卡片 (smart-card)
```css
.smart-card {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
}
```

#### 卡片头部
```css
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #fafafa;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 12px 12px 0 0;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}
```

### 圆角规范

| 元素类型 | 圆角值 | 使用场景 |
|---------|--------|----------|
| 小圆角 | `4px` | 标签、徽章 |
| 标准圆角 | `6px` | 按钮、输入框 |
| 中圆角 | `8px` | 小卡片 |
| 大圆角 | `12px` | 主卡片、模态框 |
| 圆形 | `50%` | 头像、图标按钮 |

### 阴影规范

| 级别 | 阴影值 | 使用场景 |
|------|--------|----------|
| 轻微 | `0 1px 3px rgba(0,0,0,0.05)` | 悬停状态 |
| 标准 | `0 2px 8px rgba(0,0,0,0.05)` | 卡片、下拉菜单 |
| 中等 | `0 4px 12px rgba(0,0,0,0.08)` | 模态框 |
| 强烈 | `0 8px 24px rgba(0,0,0,0.12)` | 弹出层 |

---

## 组件规范

### 1. 按钮组件

#### 主按钮 (smart-btn-primary)
```css
.smart-btn-primary {
    padding: 10px 20px;
    background: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.smart-btn-primary:hover {
    background: #333333;
}

.smart-btn-primary:active {
    transform: translateY(1px);
}

.smart-btn-primary:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
```

**使用场景**: 主要操作，如"保存"、"提交"、"确认"

**示例**:
```html
<button class="smart-btn-primary">
    <i class="fas fa-save"></i> 保存
</button>
```

#### 次按钮 (smart-btn-secondary)
```css
.smart-btn-secondary {
    padding: 10px 20px;
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.smart-btn-secondary:hover {
    background: #f5f5f5;
    border-color: #cccccc;
}
```

**使用场景**: 次要操作，如"取消"、"筛选"、"刷新"

#### 图标按钮 (icon-btn)
```css
.icon-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: #f5f5f5;
    border-color: #cccccc;
}
```

**使用场景**: 编辑、删除、添加等图标操作

### 2. 表单组件

#### 输入框 (smart-input)
```css
.smart-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    font-size: 14px;
    color: #1a1a1a;
    transition: all 0.2s;
}

.smart-input:focus {
    outline: none;
    border-color: #1a1a1a;
}

.smart-input::placeholder {
    color: #999999;
}

.smart-input:disabled {
    background: #f5f5f5;
    color: #cccccc;
    cursor: not-allowed;
}
```

**使用场景**: 文本输入、数字输入

#### 下拉选择框 (smart-select)
```css
.smart-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    font-size: 14px;
    color: #1a1a1a;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
}

.smart-select:focus {
    outline: none;
    border-color: #1a1a1a;
}
```

**使用场景**: 选项选择

#### 多行文本框 (smart-textarea)
```css
.smart-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
    resize: vertical;
    transition: all 0.2s;
}

.smart-textarea:focus {
    outline: none;
    border-color: #1a1a1a;
}

.smart-textarea::placeholder {
    color: #999999;
}
```

**使用场景**: 案情描述、长文本输入

#### 标签 (smart-label)
```css
.smart-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #666666;
}

.smart-label.required::after {
    content: '*';
    color: #dc2626;
    margin-left: 4px;
}
```

**使用场景**: 表单字段标签

### 3. 标签页组件

#### 标签页容器 (smart-tabs)
```css
.smart-tabs {
    display: inline-flex;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 4px;
    gap: 4px;
}

.smart-tab-btn {
    padding: 10px 28px;
    background: transparent;
    color: #666666;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.smart-tab-btn.active {
    background: #1a1a1a;
    color: #ffffff;
}

.smart-tab-btn:hover:not(.active) {
    background: rgba(0, 0, 0, 0.05);
}
```

**使用场景**: 页面内功能切换

### 4. 模态框组件

#### 模态框遮罩 (modal-overlay)
```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s;
}
```

#### 模态框容器 (modal-container)
```css
.modal-container {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    animation: slideUp 0.3s;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e5e5;
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
}

.modal-close {
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 50%;
    font-size: 16px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-close:hover {
    background: #f5f5f5;
}

.modal-body {
    padding: 24px;
    max-height: calc(90vh - 160px);
    overflow-y: auto;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #e5e5e5;
}
```

**使用场景**: 编辑表单、确认对话框

### 5. 标签组件

#### 状态标签 (smart-tag)
```css
.smart-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

/* 案件状态标签 */
.smart-tag.status-active {
    background: #dbeafe;
    color: #1e40af;
}

.smart-tag.status-draft {
    background: #f3f4f6;
    color: #4b5563;
}

.smart-tag.status-closed {
    background: #d1fae5;
    color: #065f46;
}

.smart-tag.status-unsigned {
    background: #fed7aa;
    color: #c2410c;
}
```

**使用场景**: 案件状态、证据分类

### 6. 上传组件

#### 上传区域 (smart-upload-zone)
```css
.smart-upload-zone {
    padding: 48px 24px;
    text-align: center;
    border: 2px dashed #dddddd;
    border-radius: 8px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.2s;
}

.smart-upload-zone:hover {
    border-color: #999999;
    background: #f5f5f5;
}

.smart-upload-zone.dragging {
    border-color: #1a1a1a;
    border-style: solid;
    background: #f0f0f0;
}
```

**使用场景**: 文件上传

### 7. 提示组件

#### 成功提示 (Toast)
```css
.toast-success {
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 12px 24px;
    background: #10b981;
    color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1000;
    animation: slideIn 0.3s;
}
```

**使用场景**: 操作成功反馈

---

## 交互规范

### 按钮交互状态

| 状态 | 视觉变化 | 鼠标样式 |
|------|----------|----------|
| 默认 | 正常显示 | `cursor: pointer` |
| 悬停 | 背景色变化 | `cursor: pointer` |
| 点击 | 轻微下移 `translateY(1px)` | `cursor: pointer` |
| 禁用 | 灰色，不透明度降低 | `cursor: not-allowed` |
| 加载 | 显示旋转图标 | `cursor: wait` |

### 过渡动画

#### 标准过渡
```css
transition: all 0.2s ease;
```

#### 淡入动画
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

#### 滑入动画
```css
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### 拖拽交互

| 状态 | 视觉反馈 |
|------|----------|
| 拖入 | 边框变实线，背景色加深 |
| 拖出 | 恢复虚线边框，背景色变浅 |
| 释放 | 立即响应，显示上传进度 |

### 表单验证

| 状态 | 边框颜色 | 提示文字颜色 |
|------|----------|--------------|
| 正常 | `#e5e5e5` | `#999999` |
| 聚焦 | `#1a1a1a` | - |
| 错误 | `#dc2626` | `#dc2626` |
| 成功 | `#16a34a` | `#16a34a` |

---

## 图标规范

### 图标库
使用 **Font Awesome 6** 图标库

### 图标大小

| 场景 | 尺寸 | 使用示例 |
|------|------|----------|
| 按钮图标 | `14px` | 保存、取消按钮 |
| 标题图标 | `16px` | 卡片标题前的图标 |
| 大图标 | `20px` | 上传区域图标 |
| 头像图标 | `36px` | 聊天头像 |

### 常用图标映射

| 功能 | 图标类名 | 使用场景 |
|------|---------|----------|
| 保存 | `fa-save` | 保存按钮 |
| 编辑 | `fa-pen` | 编辑按钮 |
| 删除 | `fa-trash-alt` | 删除按钮 |
| 添加 | `fa-plus` | 添加按钮 |
| 搜索 | `fa-search` | 搜索框 |
| 筛选 | `fa-filter` | 筛选按钮 |
| 刷新 | `fa-sync-alt` | 刷新按钮 |
| 上传 | `fa-cloud-upload-alt` | 上传区域 |
| 下载 | `fa-download` | 下载按钮 |
| 复制 | `fa-copy` | 复制按钮 |
| 关闭 | `fa-times` | 关闭按钮 |
| 返回 | `fa-arrow-left` | 返回按钮 |
| 成功 | `fa-check-circle` | 成功提示 |
| 警告 | `fa-exclamation-triangle` | 警告提示 |
| 信息 | `fa-info-circle` | 信息提示 |
| 错误 | `fa-times-circle` | 错误提示 |
| 加载 | `fa-spinner fa-spin` | 加载状态 |
| 用户 | `fa-user` | 用户头像 |
| 机器人 | `fa-robot` | AI头像 |
| 发送 | `fa-paper-plane` | 发送消息 |
| 文件 | `fa-file-alt` | 文件图标 |
| 文件夹 | `fa-folder` | 文件夹图标 |
| 日历 | `fa-calendar` | 日期选择 |
| 时钟 | `fa-clock` | 时间显示 |

---

## 响应式设计

### 断点定义

| 断点名称 | 屏幕宽度 | 设备类型 | 支持状态 |
|---------|---------|---------|----------|
| Mobile | < 768px | 手机 | 规划中 |
| Tablet | 768px - 1024px | 平板 | 规划中 |
| Desktop | > 1024px | 桌面 | ✅ 已支持 |
| Large Desktop | > 1440px | 大屏 | ✅ 已支持 |

### 当前实现

#### 桌面端布局
- 内容区最大宽度: `1200px`
- 阅读区最大宽度: `900px`
- 侧边栏宽度: `240px` (展开) / `60px` (折叠)
- 页面内边距: `40px`

#### 网格系统
```css
.smart-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.smart-form-group.full-width {
    grid-column: span 2;
}
```

---

## 页面模板

### 标准页面模板
```html
<div class="smart-page">
    <div class="smart-container">
        <!-- 页面头部 -->
        <div class="smart-header">
            <div class="header-left">
                <h1 class="page-title">页面标题</h1>
                <p class="page-description">页面描述文字</p>
            </div>
            <div class="header-right">
                <button class="smart-btn-primary">主要操作</button>
            </div>
        </div>

        <!-- 主要内容 -->
        <div class="smart-content">
            <div class="modern-card">
                <div class="card-header">
                    <div class="card-title">卡片标题</div>
                    <button class="icon-btn">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>
                <div class="card-body">
                    <!-- 卡片内容 -->
                </div>
            </div>
        </div>
    </div>
</div>
```

### 表单页面模板
```html
<div class="modal-overlay">
    <div class="modal-container" style="width: 600px;">
        <div class="modal-header">
            <div class="modal-title">表单标题</div>
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="smart-form-grid">
                <div class="smart-form-group">
                    <label class="smart-label required">字段名称</label>
                    <input type="text" class="smart-input" placeholder="请输入...">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="smart-btn-secondary">取消</button>
            <button class="smart-btn-primary">
                <i class="fas fa-save"></i> 保存
            </button>
        </div>
    </div>
</div>
```

---

## 设计原则

### 1. 简洁优先
- 去除不必要的装饰元素
- 让内容成为视觉焦点
- 避免过度设计

### 2. 一致性
- 所有页面使用相同的组件和样式
- 统一的交互模式和反馈
- 保持视觉语言的连贯性

### 3. 可读性
- 足够的对比度（WCAG AA标准）
- 清晰的视觉层级
- 合理的行高和字间距

### 4. 专业感
- 黑白配色传达专业、可信赖的感觉
- 精确的间距和对齐
- 高质量的视觉呈现

### 5. 高效交互
- 减少点击次数
- 快速完成任务
- 清晰的操作反馈

### 6. 可访问性
- 键盘导航支持
- 屏幕阅读器友好
- 色盲友好的配色

---

## 代码示例

### CSS变量定义
```css
:root {
    /* 颜色 */
    --color-primary: #1a1a1a;
    --color-primary-hover: #333333;
    --color-white: #ffffff;
    --color-bg-page: #fafafa;
    --color-bg-secondary: #f5f5f5;
    --color-border: #e5e5e5;
    --color-text-primary: #1a1a1a;
    --color-text-secondary: #666666;
    --color-text-tertiary: #999999;
    
    /* 间距 */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 20px;
    --spacing-2xl: 24px;
    --spacing-3xl: 32px;
    --spacing-4xl: 40px;
    
    /* 圆角 */
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    
    /* 阴影 */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-md: 0 2px 8px rgba(0,0,0,0.05);
    --shadow-lg: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-xl: 0 8px 24px rgba(0,0,0,0.12);
}
```

---

## 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-12-04 | v2.0 | 全面更新设计规范，增加详细的组件说明、交互规范和代码示例 |
| 2025-12-02 | v1.0 | 初始版本，确定黑白简洁风格 |

---

**文档维护**: 设计团队  
**最后更新**: 2025-12-04
