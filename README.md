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
- **财务数据展示** - 诉讼标的、律师费、诉讼费等

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

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | CDN | 前端框架 |
| Supabase | 在线版 | 用户认证与数据库 |
| D3.js | v7 | 数据可视化 |
| Font Awesome | v6 | 图标库 |
| CSS | 原生 | 样式设计 |

## 🚀 快速开始

### 环境要求
- Python 3.x (用于本地服务器)
- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- Supabase 账号（用于用户认证）

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/690925339/legal-workspace-v3.git
cd legal-workspace-v3
```

2. **配置 Supabase**

编辑 `src/config/supabase.js`，填入您的 Supabase 项目信息：
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

获取方式：
- 登录 [Supabase Dashboard](https://supabase.com)
- 进入项目 Settings → API
- 复制 Project URL 和 anon public key

3. **启动本地服务器**
```bash
python3 -m http.server 8080
```

4. **在浏览器中访问**
```
http://localhost:8080
```

### 在线演示

🌐 **在线体验**: [https://690925339.github.io/legal-workspace-v3/](https://690925339.github.io/legal-workspace-v3/)

## 📁 项目结构

```
legal-workspace-vue/
├── index.html                    # 入口文件
├── check-syntax.js               # 语法检查工具
├── assets/
│   └── styles/
│       ├── main.css              # 全局样式
│       ├── brand.css             # 品牌样式
│       ├── evidence.css          # 证据相关样式
│       └── main.css.bak          # 样式备份
├── src/
│   ├── main.js                   # 应用入口
│   ├── router.js                 # 路由配置
│   ├── config/
│   │   └── supabase.js           # Supabase 配置
│   ├── store/                    # 状态管理
│   │   └── authStore.js          # 认证状态管理
│   ├── components/               # 组件
│   │   ├── layout/
│   │   │   ├── AppLayout.js      # 主布局
│   │   │   └── Sidebar.js        # 侧边栏导航
│   │   └── HistoryModal.js       # 历史记录模态框
│   └── views/                    # 页面视图
│       ├── CaseList.js           # 案件列表
│       ├── CaseDetail.js         # 案件详情
│       ├── CaseForm.js           # 案件表单
│       ├── EvidenceUpload.js     # 证据上传
│       ├── LegalResearch.js      # 法律检索
│       ├── CaseSearchResults.js  # 案例检索结果
│       ├── CaseDetailView.js     # 案例详情查看
│       ├── RegulationSearchResults.js # 法规检索结果
│       ├── ContractReview.js     # 合同审查
│       ├── ContractReviewResult.js # 合同审查结果
│       ├── DocGenerate.js        # 文书生成（起诉状、答辩状、报价书）
│       ├── UserProfile.js        # 个人资料
│       ├── Settings.js           # 系统设置
│       ├── ProductFeedback.js    # 产品反馈
│       ├── Login.js              # 登录页
│       ├── Register.js           # 注册页
│       ├── ForgotPassword.js     # 忘记密码
│       └── refactor/             # 高级功能模块
│           ├── AIAnalysis.js     # AI智能分析（胜诉率预测、风险识别）
│           ├── AIAssistant.js    # AI对话助手（基于案件的智能问答）
│           ├── RelationshipGraph.js # 关系洞察（D3.js关系图谱可视化）
│           ├── EvidenceTimeline.js  # 证据时间轴（证据事件时间线）
│           └── QuoteGenerator.js    # 生成报价书（法律服务报价书生成）
├── docs/                         # 文档
│   ├── PRD.md                    # 产品需求文档
│   ├── design-guidelines.md      # 设计规范
│   ├── 前端开发规范.md            # 前端开发规范
│   ├── 需求确认文档.md            # 需求调研
│   ├── 竞品调研报告.md            # 竞品调研
│   ├── feedback-integration.md   # 反馈集成文档
│   ├── RAGflow集成实现方案.md    # RAGflow集成方案
│   ├── SUPABASE-TROUBLESHOOTING.md # Supabase故障排除
│   ├── api/                      # API文档
│   │   ├── 通义法睿-案例检索API对接文档.md
│   │   ├── 通义法睿-法规检索API对接文档.md
│   │   ├── 案例检索API与前端差异分析.md
│   │   └── 法规检索API与前端差异分析.md
│   └── sql/                      # 数据库脚本
│       ├── README.md
│       ├── brand_settings.sql
│       ├── cases.sql
│       └── product_feedback.sql
└── README.md
```

## 📖 使用说明

### 案件管理

#### 创建案件
1. 点击案件列表右上角"新建案件"按钮
2. 填写案件信息（基础信息、当事人、案情描述、财务信息、联络人）
3. 点击"保存"存为草稿，或"提交"直接进入进行中状态

#### 案件状态流转
| 操作 | 说明 |
|------|------|
| 保存 | 新建案件时保存为草稿状态 |
| 提交 | 新建案件时直接设为进行中 |
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

### v3.3 (2025-12-15) - 当前版本 ✨
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

### 中期计划 (v4.0)
- [ ] 团队协作功能
- [ ] 权限管理系统
- [ ] 后端API集成
- [ ] 数据持久化到 Supabase

## 📚 文档

| 文档 | 描述 |
|------|------|
| [PRD.md](docs/PRD.md) | 产品需求文档 |
| [架构设计文档.md](docs/架构设计文档.md) | 系统架构设计文档 |
| [design-guidelines.md](docs/design-guidelines.md) | UI/UX设计规范 |
| [前端开发规范.md](docs/前端开发规范.md) | 前端开发规范 |
| [需求确认文档.md](docs/需求确认文档.md) | 需求调研文档 |

## 🗺️ 路由说明

| 路由路径 | 页面组件 | 说明 |
|---------|---------|------|
| `/` | CaseList | 案件列表（默认首页） |
| `/case/:id` | CaseDetail | 案件详情页 |
| `/case/new` | CaseForm | 新建案件表单 |
| `/case/:id/edit` | CaseForm | 编辑案件表单 |
| `/case/:id/evidence` | EvidenceUpload | 证据上传页 |
| `/legal-research` | LegalResearch | 法律检索页 |
| `/case-search-results?q=xxx` | CaseSearchResults | 案例检索结果页 |
| `/regulation-search-results?q=xxx` | RegulationSearchResults | 法规检索结果页 |
| `/contract-review` | ContractReview | 合同审查页 |
| `/contract-review-result` | ContractReviewResult | 合同审查结果页 |
| `/doc-generate` | DocGenerate | 文书生成页 |
| `/settings` | Settings | 系统设置页 |
| `/user-profile` | UserProfile | 个人资料页 |
| `/product-feedback` | ProductFeedback | 产品反馈页 |
| `/login` | Login | 登录页 |
| `/register` | Register | 注册页 |
| `/forgot-password` | ForgotPassword | 忘记密码页 |

### 模态框展示（无独立路由）

以下功能通过模态框展示，不占用独立路由：

| 功能 | 触发位置 | 说明 |
|------|---------|------|
| 案例详情查看 | 案例检索结果页 | 点击案例卡片弹出模态框，显示完整判决书原文 |
| 法规详情查看 | 法规检索结果页 | 点击法规条目弹出模态框，左侧显示正文，右侧显示章节导航 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证

---

**开发团队**: Alpha&Leader Legal Tech  
**最后更新**: 2025-12-16  
**版本**: v3.3

---

<div align="center">
  <sub>Built with ❤️ for legal professionals</sub>
</div>
