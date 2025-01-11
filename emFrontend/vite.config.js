import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  const env = loadEnv(mode, process.cwd())
  
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

// import.meta.env.VITE_API_URL ||
