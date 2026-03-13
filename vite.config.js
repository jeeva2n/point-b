// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Development server config
  server: {
    port: 5001,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // Changed to localhost:5002
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Production build config
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  // Base path for production
  base: '/'
})