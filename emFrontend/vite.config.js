import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: "https://ansh0r.pythonanywhere.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", ""),
      }
    }
  },

  build: {
    proxy: {
      '/api': {
        target: "https://ansh0r.pythonanywhere.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", ""),
      }
    }
  }
})
