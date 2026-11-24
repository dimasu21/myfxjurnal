import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nasdaq': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: () => '/v8/finance/chart/%5ENDX?interval=1m&range=1d',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          xlsx: ['xlsx'],
          pdf: ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
});
