import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "安华理达AI法律助手 帮助中心",
    description: "安华理达AI法律助手 用户使用指南",
    base: '/help/',  // 子目录部署路径
    themeConfig: {
        nav: [
            { text: '快速入门', link: '/getting-started' }
        ],

        sidebar: {
            '/': [
                {
                    text: '快速入门',
                    items: [
                        { text: '欢迎使用', link: '/getting-started' },
                        { text: '登录与注册', link: '/login' },
                        { text: '界面介绍', link: '/interface' }
                    ]
                },
                {
                    text: '功能指南',
                    items: [
                        { text: '案件管理', link: '/features/case-management' },
                        { text: '法律检索', link: '/features/legal-research' },
                        { text: '合同审查', link: '/features/contract-review' },
                        { text: '文书生成', link: '/features/doc-generation' }
                    ]
                },
                {
                    text: '常见问题',
                    items: [
                        { text: 'FAQ', link: '/faq' }
                    ]
                }
            ]
        }
    }
})
