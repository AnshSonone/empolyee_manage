import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: "http:///localhost:8000",
          changeOrigin: true,
          secure: true,
        }
      }
    }
  })
}

// https://vite.dev/config/
// export default defineConfig({
  
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: import.meta.env.VITE_API_URL,
//         changeOrigin: true,
//         secure: true,
//       }
//     }
//   }
// })
