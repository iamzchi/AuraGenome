import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  //配置别名
  resolve: {
    alias: {
      '@': '/src',
      vue: 'vue/dist/vue.esm-bundler.js' // 完整版 Vue
    },
  },
})
