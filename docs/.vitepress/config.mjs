import { defineConfig } from 'vitepress'

export default defineConfig({
    ignoreDeadLinks: true,
    title: "Legal Workspace Docs",
    description: "Documentation for Legal Workspace Vue Project",
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/脚手架迁移方案' }
        ],

        sidebar: {
            '/': [
                {
                    text: '快速开始',
                    items: [
                        { text: '脚手架迁移方案', link: '/脚手架迁移方案' },
                        { text: 'SFC 迁移计划', link: '/sfc-migration-plan' },
                        { text: '迁移完成报告', link: '/migration-complete' }
                    ]
                },
                {
                    text: '设计与规范',
                    items: [
                        { text: '设计规范', link: '/design-guidelines' },
                        { text: '前端开发规范', link: '/前端开发规范' },
                        { text: '数据库表结构', link: '/数据库表结构' }
                    ]
                },
                {
                    text: '架构文档',
                    items: [
                        { text: '架构设计', link: '/架构设计文档' },
                        { text: '微服务治理', link: '/微服务治理文档' },
                        { text: 'RAGflow 集成', link: '/RAGflow集成实现方案' },
                        { text: 'AI 可行性报告', link: '/AI可行性报告实施逻辑' }
                    ]
                },
                {
                    text: 'API & 故障排除',
                    items: [
                        { text: 'RAGflow API', link: '/RAGflowAPI' },
                        { text: 'Supabase 故障排除', link: '/SUPABASE-TROUBLESHOOTING' }
                    ]
                },
                {
                    text: '产品文档',
                    items: [
                        { text: 'PRD', link: '/PRD' },
                        { text: '竞品调研', link: '/竞品调研报告' },
                        { text: '利息计算器逻辑', link: '/利息计算器设计与算法逻辑' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
