import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/legal-workspace-v3/',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // 使用包含运行时编译器的 Vue 版本，支持 template 字符串
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    },
    server: {
        port: 8080,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router'],
                    'd3-vendor': ['d3']
                }
            }
        }
    }
})
