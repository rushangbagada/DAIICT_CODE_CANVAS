import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    // Polyfill process for browser
    'process.env': {}
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'https://daiict-code-canvas-1.onrender.com' : 'http://localhost:5000',
        changeOrigin: true
      },
      '/ml-api': {
        target: process.env.NODE_ENV === 'production' ? 'https://daiict-code-canvas-1.onrender.com' : 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
