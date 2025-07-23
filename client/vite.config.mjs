// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Deep Thoughts',
        },
      },
    }),
  ],
  base: '/',
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    middlewareMode: false,
    setupMiddlewares(middlewares) {
      middlewares.use(history());
      return middlewares;
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, 
    sourcemap: true,   
    chunkSizeWarningLimit: 500, 
  },
  css: {
    devSourcemap: true,
  },
});
