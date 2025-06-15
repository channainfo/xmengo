import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.SERVER_URI || 'https://otgs-sso.ngrok.io',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.SERVER_URI || 'https://otgs-sso.ngrok.io',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
