// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // for simplified imports
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
