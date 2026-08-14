import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/binance': {
        target: 'https://api.binance.com/api',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, ''),
      },
    },
  },
})
