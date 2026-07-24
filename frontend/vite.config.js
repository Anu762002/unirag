import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      },
      '/documents': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      }
    }
  }
})
