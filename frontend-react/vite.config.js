import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api goes to the PHP server (php -S localhost:8000 -t backend-php)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
