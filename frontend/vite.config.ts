import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  // base: '/calendar-memo-app/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005', // AWS の開発環境の URL
        changeOrigin: true, // オリジンを AWS に変更して CORS 回避
        secure: false, // HTTPS ではなく HTTP なので `false` を設定
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
