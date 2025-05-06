import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // plugins: [react(), tsconfigPaths()]K,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
