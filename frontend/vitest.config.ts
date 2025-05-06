// vitest.config.ts
import { defineConfig } from 'vitest/config';
const tsconfigPaths = import('vite-tsconfig-paths');
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tsconfigPaths.then((plugin) => plugin.default())],
  test: {
    environment: 'jsdom', // ブラウザ環境でテストを実行
    globals: true, // グローバルに `expect` などを使えるようにする
    setupFiles: './vitest.setup.ts', // 必要ならテストのセットアップファイルを指定
    include: ['**/*.test.tsx', '**/*.test.ts'],
  },
});
