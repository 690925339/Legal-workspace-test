import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.config.js',
                '**/mockData.js'
            ]
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
})
