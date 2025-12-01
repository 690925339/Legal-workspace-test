# Vue Legal Workspace

一个现代化的法律案件管理系统，基于 Vue 3 (CDN) 构建。

## 功能特性

- 📋 **案件管理** - 创建、编辑、查看和删除案件
- 🔍 **智能搜索** - 快速搜索和过滤案件
- 🤖 **AI 功能**
  - AI 证据分析
  - AI 法律助手
- 📊 **数据分析** - 案件资料分析和可视化
- 👥 **用户认证** - 登录和注册功能

## 技术栈

- **前端框架**: Vue 3 (CDN)
- **路由**: 自定义 Hash 路由
- **样式**: 原生 CSS
- **图标**: Font Awesome 6

## 快速开始

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/legal-workspace-vue.git
cd legal-workspace-vue
```

2. 启动本地服务器
```bash
python -m http.server 8080
```

3. 在浏览器中访问
```
http://localhost:8080
```

### GitHub Pages 部署

本项目已配置为可直接通过 GitHub Pages 访问。

访问地址: `https://YOUR_USERNAME.github.io/legal-workspace-vue/`

## 项目结构

```
legal-workspace-vue/
├── index.html              # 入口文件
├── assets/
│   └── styles/
│       └── main.css        # 全局样式
├── src/
│   ├── main.js            # 应用入口
│   ├── router.js          # 路由配置
│   ├── components/        # 组件
│   │   └── layout/
│   │       ├── AppLayout.js
│   │       └── Sidebar.js
│   └── views/             # 页面视图
│       ├── CaseList.js    # 案件列表
│       ├── CaseDetail.js  # 案件详情
│       ├── CaseForm.js    # 案件创建/编辑
│       ├── Login.js       # 登录页
│       └── Register.js    # 注册页
└── README.md
```

## 使用说明

### 案件管理

- **新建案件**: 点击右上角"新建案件"按钮
- **查看案件**: 点击列表中的案件行
- **编辑案件**: 点击操作列的编辑按钮
- **删除案件**: 点击操作列的删除按钮

### AI 功能

- **AI 证据分析**: 在案件详情页选择"AI证据分析"标签
- **AI 助手**: 在案件详情页选择"AI助手"标签

## 开发计划

- [ ] 后端 API 集成
- [ ] 真实数据持久化
- [ ] 更多 AI 功能
- [ ] 移动端适配
- [ ] 多语言支持

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
