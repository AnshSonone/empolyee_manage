import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // Use the environment variable for the proxy target
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});



// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({

//   const env = loadEnv(mode, process.cwd())
  
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: env.VITE_API_URL,
//         changeOrigin: true,
//         secure: true,
//       }
//     }
//   }
// })

// import.meta.env.VITE_API_URL ||
