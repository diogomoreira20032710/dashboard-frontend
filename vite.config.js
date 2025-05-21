import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ ESSENCIAL para imagens carregarem corretamente no NGINX
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.cjs')
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // ou a URL do teu backend no Render (ex: https://dashboard-backend.onrender.com)
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
