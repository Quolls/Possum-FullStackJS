import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5122 // 更改为其他未被占用的端口
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
