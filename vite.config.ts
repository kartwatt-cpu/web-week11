import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 第 11 周：入口换成 main.tsx，交给 @vitejs/plugin-react 处理 JSX 与 React Fast Refresh。
// dev server 固定 5173；/api 只在本机开发时代理到后端 8080。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // 轨道 B 的组件行为测试需要 DOM 环境；纯函数测试在 jsdom 下同样能跑。
  test: {
    environment: 'jsdom',
    css: false,
    setupFiles: ['./src/test-setup.ts'],
  },
});
