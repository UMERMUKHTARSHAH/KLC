import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/shopify/admin": {  // More specific proxy path
        target: "https://kashmir-loom.myshopify.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/shopify\/admin/, "/admin")
      }
    },
    // IMPORTANT: This handles SPA routing
    historyApiFallback: true
  },
    optimizeDeps: {
    include: ['jwt-decode', 'react-icons/si', 'react-icons/ai', 'react-icons/ri', 'react-icons/gr',
              'react-icons/tb', 'react-icons/gi', 'react-icons/fa', 'react-icons/fa6', 'react-icons/io5'],
  },
  plugins: [react()],
})