import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { geminiApiPlugin } from './vite-api-plugin';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        geminiApiPlugin(), // Handles /api/gemini in dev mode
      ],
      // API key is read from .env.local by the plugin (dev) or Vercel env vars (production)
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
