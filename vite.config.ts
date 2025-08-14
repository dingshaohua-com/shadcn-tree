import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import reactSwc from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  server: {
    // port: 3000,
    // host: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  plugins: [
    reactSwc({
      plugins: [['@preact-signals/safe-react/swc', {}]],
    }),
    tailwindcss(),
    svgr({
      // include: "**/*.svg?react", //默认
      // include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@repo': '/src/components',
    },
  },
});
