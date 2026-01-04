# AI法律助手 - Legal Workspace v3

一个现代化、智能化的法律案件管理系统，基于 Vue 3 (CDN) 构建，提供全方位的案件管理和AI辅助功能。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-orange.svg)](https://d3js.org/)

## ✨ 核心特性

### 📋 案件管理

- **完整的案件生命周期管理** - 草稿 → 进行中 → 已结案
- **案件状态流转**
  - 新建案件可选"保存"(草稿)或"提交"(进行中)
  - 进行中的案件可在列表页直接"结案"
  - 已结案案件只读，不可修改
- **模块化架构** - 案件详情拆分为独立路由模块，代码复用性高
  - 基础信息模块 (`CaseBasicInfo.js`)
  - 案情描述模块 (`CaseFacts.js`)
  - 当事人信息模块 (`CaseStakeholders.js`)
  - 财务信息模块 (`CaseFinancials.js`)
  - 证据管理模块 (`CaseEvidence.js`)
- **多维度案件信息** - 基础信息、案情描述、当事人、证据、财务等
- **两列网格布局** - 基础信息紧凑展示，无需滚动
- **联络人信息合并** - 与基础信息整合在同一卡片
- **智能搜索与筛选** - 快速定位目标案件

### 🤖 AI智能功能

- **AI智能分析**
  - 胜诉率预测（可视化展示）
  - 风险点智能识别
  - 诉讼策略建议
- **AI对话助手**
  - 基于案件材料的智能问答
  - 快捷建议功能
  - 用户/AI头像区分
- **AI证据分析**
  - 证据完整度评估
  - 证据优先级排序
  - 智能证据收集建议
- **证据时间轴**
  - AI生成的证据事件时间线
  - 支持刷新、编辑、导出

### 📊 数据可视化

- **关系洞察** - D3.js驱动的关系图谱可视化
  - 人物/公司关系网络
  - 资金往来可视化
  - 交互式节点拖拽和缩放
- **证据时间轴** - 证据相关事件时间线展示
- **财务数据展示** - 诉讼标的、律师费、诉讼费等，集成**智能利息计算器**

### 🔍 法律研究

- **智能搜索** - 法律法规和案例检索
- **高级筛选** - 多维度筛选条件
- **结果分类** - 法规和案例分类展示

### 👤 用户管理

- **用户认证** - 基于 Supabase 的安全认证系统
  - 邮箱密码注册/登录
  - 会话管理和状态持久化
  - 密码重置功能
- **个人资料管理** - 完整的个人信息编辑
- **头像上传** - 支持自定义头像
- **账号安全** - 密码修改功能

## 🛠 技术栈

| 技术              | 版本   | 用途             |
| ----------------- | ------ | ---------------- |
| Vue 3             | 3.4.21 | 前端框架 (npm)   |
| Vite              | 5.4.21 | 构建工具         |
| VitePress         | 1.6.4  | 用户帮助文档     |
| Supabase          | 在线版 | 用户认证与数据库 |
| D3.js             | 7.8.5  | 数据可视化 (npm) |
| Sass (SCSS)       | 最新   | CSS 预处理器     |
| Vitest            | 最新   | 单元测试框架     |
| ESLint + Prettier | 最新   | 代码质量工具     |
| Font Awesome      | v6     | 图标库 (CDN)     |

## 🚀 快速开始

### 环境要求

- Node.js v20+ (用于 npm 包管理)
- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- Supabase 账号（用于用户认证）

### 本地运行

1. **克隆仓库**

```bash
git clone https://github.com/690925339/Legal-workspace-test.git
cd Legal-workspace-test
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量** ⚠️ 重要

复制 `.env.example` 文件为 `.env`:

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的配置信息：

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 通义法睿配置
VITE_FARUI_WORKSPACE_ID=your_farui_workspace_id_here
VITE_FARUI_APP_ID=your_farui_app_id_here
```

**获取 Supabase 配置**:

- 登录 [Supabase Dashboard](https://supabase.com)
- 进入项目 Settings → API
- 复制 `Project URL` 和 `anon public key`

**获取通义法睿配置**:

- 联系项目管理员获取 Workspace ID 和 App ID

> **安全提示**:
>
> - ✅ `.env` 文件已在 `.gitignore` 中，不会被提交到 Git
> - ✅ 请勿将 `.env` 文件分享给他人
> - ✅ 生产环境请使用不同的配置

4. **启动开发服务器**

```bash
npm run dev
```

5. **在浏览器中访问**

```
http://localhost:8080
```

### 其他命令

```bash
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run test         # 运行测试
npm run lint         # 代码检查和修复
npm run help:dev     # 启动帮助中心 (端口 5174)
npm run help:build   # 构建帮助中心
```

### 在线演示

🌐 **在线体验**: [https://690925339.github.io/Legal-workspace-test/](https://690925339.github.io/Legal-workspace-test/)

## 📁 项目结构

```
legal-workspace-vue/
├── index.html                    # 入口文件
├── package.json                  # npm 依赖配置
├── vite.config.js                # Vite 构建配置 (含路径别名)
├── vitest.config.js              # Vitest 测试配置
├── .eslintrc.cjs                 # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── postcss.config.js             # PostCSS 配置
├── assets/
│   └── styles/
│       ├── main.css              # 全局样式
│       ├── brand.css             # 品牌样式
│       └── evidence.css          # 证据相关样式
├── src/
│   ├── main.js                   # 应用入口
│   ├── config/
│   │   └── supabase.js           # Supabase 配置
│   ├── router/                   # 路由系统 ✨NEW
│   │   ├── index.js              # 主路由配置
│   │   ├── guards.js             # 路由守卫
│   │   └── modules/              # 模块化路由
│   │       ├── auth.js           # 认证路由
│   │       ├── case.js           # 案件路由
│   │       ├── legal-research.js # 法律检索路由
│   │       └── system.js         # 系统路由
│   ├── stores/                   # 状态管理 ✨NEW
│   │   └── auth.js               # 认证状态 (响应式 Store)
│   ├── layouts/                  # 布局组件 ✨NEW
│   │   ├── AppLayout.vue         # 主应用布局
│   │   └── AuthLayout.vue        # 认证页布局
│   ├── features/                 # Feature-Based 模块 ✨NEW
│   │   ├── auth/views/           # 认证模块
│   │   │   ├── Login.vue         # 登录页 (SFC)
│   │   │   ├── Register.vue      # 注册页 (SFC)
│   │   │   └── ForgotPassword.vue # 忘记密码 (SFC)
│   │   ├── case/                 # 案件模块
│   │   │   ├── views/            # 案件视图
│   │   │   │   ├── CaseList.vue  # 案件列表 (SFC)
│   │   │   │   ├── CaseForm.vue  # 案件表单 (SFC)
│   │   │   │   └── EvidenceUpload.js # 证据上传
│   │   │   └── modules/          # 案件子模块 (全部 SFC ✨)
│   │   │       ├── CaseBasicInfo.vue # 基础信息
│   │   │       ├── CaseFacts.vue     # 案情描述
│   │   │       ├── CaseStakeholders.vue # 当事人信息
│   │   │       ├── CaseFinancials.vue # 财务信息
│   │   │       ├── CaseEvidence.vue   # 证据管理
│   │   │       └── CaseAdvanced.vue   # 高级功能
│   │   ├── legal-research/views/ # 法律检索模块
│   │   │   ├── LegalResearch.vue # 法律检索 (SFC ✨)
│   │   │   ├── CaseSearchResults.js # 案例结果
│   │   │   └── RegulationSearchResults.js # 法规结果
│   │   ├── contract/views/       # 合同模块
│   │   │   ├── ContractReview.js # 合同审查
│   │   │   └── ContractReviewResult.js # 审查结果
│   │   ├── document/views/       # 文书模块
│   │   │   └── DocGenerate.js    # 文书生成
│   │   └── system/views/         # 系统模块 (全部 SFC ✨)
│   │       ├── Settings.vue      # 系统设置
│   │       ├── ProductFeedback.vue # 产品反馈
│   │       └── UserProfile.vue   # 个人资料
│   ├── mixins/                   # Vue Mixins
│   │   └── searchFilterMixin.js  # 搜索过滤逻辑
│   ├── services/                 # 业务服务层
│   │   ├── faruiService.js       # 通义法睿API集成
│   │   ├── llmService.js         # LLM服务
│   │   ├── lprService.js         # LPR利率服务
│   │   ├── caseCache.js          # 案件缓存
│   │   └── lawCache.js           # 法规缓存
│   ├── styles/                   # SCSS 样式
│   │   ├── _variables.scss       # 设计系统变量
│   │   ├── _mixins.scss          # Mixins 工具
│   │   ├── main.scss             # 主入口
│   │   ├── base/                 # 基础样式
│   │   └── components/           # 组件样式
│   ├── components/               # 共享组件
│   │   ├── layout/
│   │   │   └── Sidebar.vue       # 侧边栏导航 (SFC)
│   │   ├── case/                 # 案件模块组件
│   │   │   ├── CaseModuleLayout.js # 案件模块共享布局
│   │   │   └── InterestCalculator.js # 利息计算器组件
│   │   └── HistoryModal.vue      # 历史记录模态框 (SFC)
│   └── views/                    # 遗留视图 (待迁移)
│       ├── CaseDetail.js         # 案件详情入口
│       └── refactor/             # 高级功能组件
│           ├── AIAnalysis.js     # AI智能分析
│           ├── AIAssistant.js    # AI对话助手
│           ├── RelationshipGraph.js # 关系洞察 (D3.js)
│           ├── EvidenceTimeline.js  # 证据时间轴
│           └── QuoteGenerator.js    # 报价书生成
├── docs/                         # 技术文档
│   ├── PRD.md                    # 产品需求文档
│   ├── 架构设计文档.md           # 架构设计
│   ├── 架构重构实施文档.md       # 重构进度跟踪 ✨NEW
│   └── sql/                      # 数据库脚本
├── help/                         # 用户帮助中心
│   ├── .vitepress/
│   │   └── config.mjs            # VitePress 配置
│   ├── index.md                  # 帮助中心首页
│   ├── getting-started.md        # 快速入门
│   └── features/                 # 功能指南
└── README.md
```

## 📖 使用说明

### 案件管理

#### 创建案件

1. 点击案件列表右上角"新建案件"按钮
2. 填写案件信息（基础信息、当事人、案情描述、财务信息、联络人）
3. 点击"保存"存为草稿，或"提交"直接进入进行中状态

#### 案件状态流转

| 操作 | 说明                                   |
| ---- | -------------------------------------- |
| 保存 | 新建案件时保存为草稿状态               |
| 提交 | 新建案件时直接设为进行中               |
| 结案 | 在案件列表点击结案图标（仅进行中可用） |

#### 结案操作

- 在案件列表的操作栏点击结案图标（红色文件夹图标）
- 系统会弹出二次确认对话框
- 确认后案件变为"已结案"状态，信息只读

### AI功能使用

#### AI智能分析

1. 进入案件详情页
2. 选择"高级功能" > "AI分析"
3. 查看胜诉率预测、风险点、策略建议
4. 点击"刷新分析"重新生成

#### 证据时间轴

1. 进入案件详情页
2. 选择"高级功能" > "证据时间轴"
3. 查看AI生成的证据事件时间线
4. 使用右上角按钮：刷新、编辑、导出

## 🎨 设计特点

- **黑白简洁主题** - 专业、现代的视觉风格
- **两列信息布局** - 紧凑展示，减少滚动
- **图标化交互** - Font Awesome图标增强可用性
- **二次确认机制** - 重要操作（如结案）需确认

## 🔄 版本历史

### v3.11 (2026-01-04) - 当前版本 ✨

**架构重构 - Feature-Based + SFC 化**:

- ✅ **目录结构迁移**：全面采用 Feature-Based 架构，按功能模块组织代码
  - `src/features/auth/` - 认证模块
  - `src/features/case/` - 案件模块（views + modules）
  - `src/features/legal-research/` - 法律检索模块
  - `src/features/contract/` - 合同模块
  - `src/features/document/` - 文书模块
  - `src/features/system/` - 系统模块
- ✅ **路由系统重构**：模块化路由配置 (`router/modules/`)
- ✅ **布局系统**：新增 `AppLayout.vue` 和 `AuthLayout.vue`
- ✅ **状态管理**：响应式 Auth Store (`stores/auth.js`)
- ✅ **SFC 转换** (10 个组件)：
  - System: Settings.vue, ProductFeedback.vue, UserProfile.vue
  - Legal Research: LegalResearch.vue
  - Case Modules: CaseBasicInfo.vue, CaseFacts.vue, CaseStakeholders.vue, CaseFinancials.vue, CaseEvidence.vue, CaseAdvanced.vue
- ✅ **逻辑复用 (Composables)**：抽取 4 个核心业务逻辑 hook
  - `useCaseData`: 案件数据管理
  - `useModal`: 模态框管理
  - `useStakeholders`: 当事人管理
  - `useTags`: 标签管理
  - *CaseFacts.vue 已完成重构试点*

### v3.10 (2026-01-04)

**代码优化与重构**:

- ✅ **CaseDetail.js 大幅精简**：从 1451 行精简至 ~150 行，减少 90% 代码量
- ✅ **移除重复代码**：删除与子模块重复的证据、当事人、编辑功能实现
- ✅ **架构优化**：CaseDetail 仅保留路由导航和高级功能，基础功能由独立模块处理
- ✅ **提升可维护性**：代码结构更清晰，职责分离更明确

### v3.9 (2026-01-04)

**用户帮助中心上线**:

- ✅ **VitePress 文档系统**：集成 VitePress 构建用户帮助中心
- ✅ **完整帮助文档**：快速入门、功能指南、常见问题等
- ✅ **应用内集成**：侧边栏"帮助文档"直接跳转到帮助中心
- ✅ **独立服务**：帮助中心独立运行在端口 5174

### v3.8 (2025-12-30)

**智能诉讼计算器集成**:

- ✅ **专业利息计算器**：集成了LPR/基准利率自动分段计算、自定义利率、固定时长等多种计算模式
- ✅ **组件化重构**：独立的 `InterestCalculator` 组件，支持复用
- ✅ **数据联通**：计算结果自动回填至财务标的项
- ✅ **UX优化**：优化的财务信息编辑界面，卡片式标的项管理

### v3.7 (2025-12-29)

**AI 可行性报告增强**:

- ✅ **7维度分析模型**：新增案情、证据、法律、风险、执行、策略、ROI全方位分析
- ✅ **智能决策树**：基于证据覆盖率和偿债能力自动推荐诉讼/和解/放弃策略
- ✅ **法规检索优化**：支持法律依据的分页展示，优化法条元数据显示（效力/发布日期）
- ✅ **数据互通**：实现报告与基础信息、证据模块的数据联动

### v3.6 (2025-12-29)

**界面布局优化**:

- ✅ 案件头部布局优化，移除冗余头部，释放垂直空间
- ✅ 面包屑导航增强，集成案件名称显示
- ✅ 基础信息卡片增强，集成状态、负责人、最后更新时间字段
- ✅ 证据列表和分析页样式统一，采用标准化卡片布局

### v3.5 (2025-12-26)

**案件详情模块拆分**:

- ✅ 将案件详情页 5 个模块拆分为独立路由页面
- ✅ 新增 `CaseModuleLayout.js` 共享布局组件
- ✅ 新增 `CaseBasicInfo.js` 基础信息模块
- ✅ 新增 `CaseFacts.js` 案情描述模块
- ✅ 新增 `CaseStakeholders.js` 当事人信息模块
- ✅ 新增 `CaseFinancials.js` 财务信息模块
- ✅ 新增 `CaseEvidence.js` 证据管理模块
- ✅ 新增 `CaseAdvanced.js` 高级功能模块
- ✅ Tab 点击跳转到独立模块路由

### v3.4 (2025-12-18)

**搜索优化与安全增强**:

- ✅ 实现"批量获取200条"策略，减少API调用成本
- ✅ 搜索历史本地缓存，实现秒开
- ✅ 裁判日期排序功能优化
- ✅ 环境变量迁移，移除硬编码密钥
- ✅ RLS (Row Level Security) 策略配置
- ✅ 用户数据隔离保护
- ✅ 历史记录用户绑定
- ✅ 刷新页面跳转优化

### v3.3 (2025-12-15)

**代码重构与模块化**:

- ✅ 高级功能模块化重构
- ✅ 将 AI 分析、AI 助手、关系图谱、证据时间轴、报价生成器拆分为独立组件
- ✅ 新建 `views/refactor/` 目录存放重构后的模块
- ✅ 提升代码可维护性和复用性
- ✅ 优化项目结构文档

### v3.2 (2025-12-08)

**用户认证系统**:

- ✅ 集成 Supabase 在线版认证
- ✅ 用户注册/登录功能
- ✅ 会话管理和状态持久化
- ✅ 错误处理和加载状态

**历史记录功能**:

- ✅ 通用历史记录模态框组件
- ✅ 法律检索历史（案例/法规标签页）
- ✅ 文书生成历史（起诉状/答辩状标签页）
- ✅ 合同审查历史
- ✅ 按日期倒序排列和筛选

### v3.1 (2025-12-04)

**案件状态流转优化**:

- ✅ 新建案件：保存（草稿）/ 提交（进行中）双按钮
- ✅ 结案功能移至案件列表操作栏
- ✅ 结案操作二次确认
- ✅ 已结案案件只读保护
- ✅ 删除详情页状态下拉选择

**布局优化**:

- ✅ 基础信息改为两列网格布局
- ✅ 联络人信息合并到基础信息卡片
- ✅ 删除案件进度卡片
- ✅ 案件阶段改为下拉选择（咨询/立案/一审/二审等）

**证据时间轴优化**:

- ✅ 添加刷新、编辑、导出按钮
- ✅ 按钮样式与关系洞察统一

### v3.0 (2025-12-04)

- ✅ 分区编辑模态框
- ✅ AI分析UI优化
- ✅ AI对话助手增强
- ✅ 多当事人支持

## 🚧 开发计划

### 近期计划 (v3.3)

- [ ] 用户资料扩展（profiles 表）
- [ ] 路由守卫和权限控制
- [ ] 忘记密码功能
- [ ] 文件预览功能
- [ ] 证据时间轴编辑器
- [ ] AI 案情梳理 (AI Case Facts Generation) ✨

### 中期计划 (v4.0)

- [ ] 团队协作功能
- [ ] 权限管理系统
- [ ] 后端API集成
- [ ] 数据持久化到 Supabase

## 📚 文档

| 文档                                              | 描述             |
| ------------------------------------------------- | ---------------- |
| [PRD.md](docs/PRD.md)                             | 产品需求文档     |
| [架构设计文档.md](docs/架构设计文档.md)           | 系统架构设计文档 |
| [design-guidelines.md](docs/design-guidelines.md) | UI/UX设计规范    |
| [前端开发规范.md](docs/前端开发规范.md)           | 前端开发规范     |
| [需求确认文档.md](docs/需求确认文档.md)           | 需求调研文档     |

## 🗺️ 路由说明

| 路由路径                           | 页面组件                | 说明                 |
| ---------------------------------- | ----------------------- | -------------------- |
| `/`                                | CaseList                | 案件列表（默认首页） |
| `/detail/:id`                      | CaseDetail              | 案件详情入口页       |
| `/detail/:id/basic`                | CaseBasicInfo           | 基础信息模块 ✨NEW   |
| `/detail/:id/facts`                | CaseFacts               | 案情描述模块 ✨NEW   |
| `/detail/:id/stakeholders`         | CaseStakeholders        | 当事人信息模块 ✨NEW |
| `/detail/:id/financials`           | CaseFinancials          | 财务信息模块 ✨NEW   |
| `/detail/:id/evidence`             | CaseEvidence            | 证据管理模块 ✨NEW   |
| `/detail/:id/advanced`             | CaseAdvanced            | 高级功能模块 ✨NEW   |
| `/case/new`                        | CaseForm                | 新建案件表单         |
| `/case/:id/edit`                   | CaseForm                | 编辑案件表单         |
| `/case/:id/evidence`               | EvidenceUpload          | 证据上传页           |
| `/legal-research`                  | LegalResearch           | 法律检索页           |
| `/case-search-results?q=xxx`       | CaseSearchResults       | 案例检索结果页       |
| `/regulation-search-results?q=xxx` | RegulationSearchResults | 法规检索结果页       |
| `/contract-review`                 | ContractReview          | 合同审查页           |
| `/contract-review-result`          | ContractReviewResult    | 合同审查结果页       |
| `/doc-generate`                    | DocGenerate             | 文书生成页           |
| `/settings`                        | Settings                | 系统设置页           |
| `/user-profile`                    | UserProfile             | 个人资料页           |
| `/product-feedback`                | ProductFeedback         | 产品反馈页           |
| `/login`                           | Login                   | 登录页               |
| `/register`                        | Register                | 注册页               |
| `/forgot-password`                 | ForgotPassword          | 忘记密码页           |

### 模态框展示（无独立路由）

以下功能通过模态框展示，不占用独立路由：

| 功能         | 触发位置       | 说明                                                   |
| ------------ | -------------- | ------------------------------------------------------ |
| 案例详情查看 | 案例检索结果页 | 点击案例卡片弹出模态框，显示完整判决书原文             |
| 法规详情查看 | 法规检索结果页 | 点击法规条目弹出模态框，左侧显示正文，右侧显示章节导航 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证

---

**开发团队**: Alpha&Leader Legal Tech  
**最后更新**: 2026-01-04 17:19  
**版本**: v3.11

---

<div align="center">
  <sub>Built with ❤️ for legal professionals</sub>
</div>
