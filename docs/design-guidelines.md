# 智能分析模块 UI 设计规范

## 一、设计理念

采用 **黑白简洁风格**，强调内容优先，减少视觉干扰，提供专业、可信赖的法律工作界面体验。

---

## 二、色彩体系

### 主色调
| 用途 | 色值 | 说明 |
|------|------|------|
| 主色（黑） | `#1a1a1a` | 主要按钮、激活状态、重要文字 |
| 辅助黑 | `#333333` | 悬停状态 |
| 白色 | `#ffffff` | 背景、次要按钮 |

### 灰度色阶
| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#fafafa` | 整体页面背景 |
| 卡片背景 | `#ffffff` | 内容卡片背景 |
| 次背景 | `#f5f5f5` | 输入框底部、标签背景 |
| 边框色 | `#e5e5e5` | 卡片、按钮边框 |
| 虚线边框 | `#dddddd` | 上传区域边框 |
| 主文字 | `#1a1a1a` | 标题、正文 |
| 次文字 | `#666666` | 描述文字 |
| 辅助文字 | `#999999` | 提示、占位符 |
| 禁用色 | `#cccccc` | 禁用按钮 |

### 状态色（仅用于风险提示）
| 状态 | 背景色 | 文字色 | 说明 |
|------|--------|--------|------|
| 警告 | `#fef3c7` | `#d97706` | 风险警告 |
| 信息 | `#e0e7ff` | `#4f46e5` | 一般提示 |
| 成功 | `#dcfce7` | `#16a34a` | 审查通过 |
| 错误 | `#fee2e2` | `#dc2626` | 严重问题 |

---

## 三、字体规范

### 字号
| 元素 | 字号 | 字重 |
|------|------|------|
| 页面标题 | 26px | 600 (semibold) |
| 页面描述 | 14px | 400 (normal) |
| 按钮文字 | 14px | 500 (medium) |
| 小按钮文字 | 13px | 500 (medium) |
| 正文内容 | 14px | 400 (normal) |
| 辅助文字 | 13px | 400 (normal) |
| 小提示 | 12px | 400 (normal) |

### 行高
- 正文行高：1.8
- 标题行高：1.4
- 按钮行高：1

---

## 四、间距规范

### 页面间距
- 页面内边距：`40px`
- 内容区最大宽度：`900px`
- 页面居中显示

### 卡片间距
- 卡片圆角：`12px`
- 卡片内边距：`20px`
- 卡片间距：`24px`
- 卡片边框：`1px solid #e5e5e5`

### 元素间距
- 标题与描述间距：`12px`
- 描述与内容间距：`24px`
- 按钮内边距：`10px 24px`（主按钮）
- 按钮内边距：`8px 16px`（次按钮）
- 图标与文字间距：`8px`

---

## 五、组件规范

### 1. 主按钮 (Primary Button)
```css
.smart-btn-primary {
    padding: 10px 24px;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
}

/* 悬停状态 */
.smart-btn-primary:hover {
    background: #333;
}

/* 禁用状态 */
.smart-btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
}
```

**使用场景**：主要操作，如"开始检索"、"开始审查"、"立即撰写"

---

### 2. 次按钮 (Secondary Button)
```css
.smart-btn-secondary {
    padding: 8px 16px;
    background: white;
    color: #1a1a1a;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}

/* 悬停状态 */
.smart-btn-secondary:hover {
    background: #f5f5f5;
    border-color: #ccc;
}
```

**使用场景**：次要操作，如"筛选"、"排序"、"换一批"、"移除"

---

### 3. 标签切换 (Tab Switcher)
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
    color: #666;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
}

.smart-tab-btn.active {
    background: #1a1a1a;
    color: white;
}
```

**使用场景**：页面内功能切换，如"案例检索/法规检索"、"合同审查/对比审查"

---

### 4. 上传区域 (Upload Zone)
```css
.smart-upload-zone {
    padding: 48px 24px;
    text-align: center;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background: #fafafa;
    cursor: pointer;
}

/* 拖拽状态 */
.smart-upload-zone.dragging {
    border-color: #1a1a1a;
    background: #f0f0f0;
    border-style: solid;
}

/* 悬停状态 */
.smart-upload-zone:hover {
    border-color: #999;
    background: #f5f5f5;
}
```

**使用场景**：文件上传区域

---

### 5. 文本输入框 (Textarea)
```css
.smart-textarea {
    width: 100%;
    min-height: 200px;
    padding: 20px;
    border: none;
    resize: none;
    font-size: 14px;
    line-height: 1.8;
    color: #1a1a1a;
}

.smart-textarea::placeholder {
    color: #999;
}

.smart-textarea:focus {
    outline: none;
}
```

**使用场景**：案情描述输入、检索内容输入

---

### 6. 结果展示区 (Result Section)
```css
.smart-result-header {
    padding: 16px 20px;
    background: #1a1a1a;
    color: white;
}

.smart-result-content {
    padding: 24px;
    background: white;
}
```

**使用场景**：生成结果、审查结果展示

---

### 7. 风险项 (Risk Item)
```css
.smart-risk-item {
    display: flex;
    gap: 14px;
    padding: 14px;
    background: #fafafa;
    border-radius: 8px;
}

.smart-risk-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    /* 根据风险级别使用不同的状态色 */
}
```

**使用场景**：合同审查风险点展示

---

### 8. 建议卡片 (Suggestion Card)
```css
.smart-suggestion-item {
    padding: 14px 16px;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    font-size: 13px;
    color: #1a1a1a;
    cursor: pointer;
}

.smart-suggestion-item:hover {
    border-color: #1a1a1a;
    background: #fafafa;
}
```

**使用场景**：检索建议、快捷操作

---

### 9. 底部提示栏 (Footer Info)
```css
.smart-footer-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: #f5f5f5;
    border-radius: 8px;
}
```

**使用场景**：额度提示、免责声明

---

## 六、交互规范

### 按钮状态
1. **默认状态**：正常显示
2. **悬停状态**：背景色加深或变浅
3. **点击状态**：略微缩小或加深
4. **禁用状态**：灰色，cursor: not-allowed
5. **加载状态**：显示旋转图标，禁止点击

### 过渡动画
- 统一使用 `transition: all 0.2s`
- 避免过度动画，保持简洁

### 拖拽交互
- 拖入时边框变实线
- 拖入时背景色加深
- 释放后立即响应

---

## 七、图标规范

使用 **Font Awesome** 图标库

### 常用图标
| 功能 | 图标 |
|------|------|
| 上传 | `fa-upload` / `fa-cloud-upload-alt` |
| 搜索 | `fa-search` |
| 筛选 | `fa-filter` |
| 排序 | `fa-sort` |
| 刷新 | `fa-sync-alt` |
| 复制 | `fa-copy` |
| 下载 | `fa-download` |
| 删除 | `fa-times` / `fa-trash-alt` |
| 返回 | `fa-arrow-left` |
| 加载 | `fa-spinner fa-spin` |
| 成功 | `fa-check-circle` |
| 警告 | `fa-exclamation-triangle` |
| 信息 | `fa-info-circle` |

---

## 八、响应式设计

### 断点
- 桌面端：> 1024px（当前主要支持）
- 平板端：768px - 1024px（后续支持）
- 移动端：< 768px（后续支持）

### 当前实现
- 内容区最大宽度 900px
- 居中显示
- 两列布局在小屏时堆叠

---

## 九、页面结构模板

```html
<div class="smart-page">
    <div class="smart-container">
        <!-- 页面头部 -->
        <div class="smart-header">
            <h1>页面标题</h1>
            <p>页面描述文字</p>
            <div class="smart-tabs">
                <button class="smart-tab-btn active">标签1</button>
                <button class="smart-tab-btn">标签2</button>
            </div>
        </div>

        <!-- 主要内容卡片 -->
        <div class="smart-card">
            <!-- 内容区域 -->
            <div class="smart-card-footer">
                <div class="smart-tips">提示文字</div>
                <button class="smart-btn-primary">主要操作</button>
            </div>
        </div>

        <!-- 底部提示 -->
        <div class="smart-footer-info">
            <i class="fas fa-info-circle"></i>
            <span>提示信息</span>
        </div>
    </div>
</div>
```

---

## 十、设计原则

1. **简洁优先**：去除不必要的装饰，让内容成为焦点
2. **一致性**：所有页面使用相同的组件和样式
3. **可读性**：足够的对比度，清晰的层级
4. **专业感**：黑白配色传达专业、可信赖的感觉
5. **高效交互**：减少点击次数，快速完成任务

---

## 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-12-02 | v1.0 | 初始版本，确定黑白简洁风格 |

