import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Lắng nghe trên 0.0.0.0
    port: 5173, // (Tuỳ chọn) Cổng bạn muốn chạy
    proxy: {
      '/api': {
        target: 'http://8.222.247.36:8103', // URL của backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api1': {
        target: 'http://8.222.247.36:8103', // URL của API 1
        changeOrigin: true,
      },
    },
  },
});
