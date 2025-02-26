import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    define: mode === 'production'
      ? {
          'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify(process.env.VITE_RECAPTCHA_SITE_KEY),
          'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
        }
      : {}, // No need to manually define for development
    plugins: [react()],
    base: '/',
    server: {
      historyApiFallback: true,
    },
    build: {
      outDir: 'dist',
    }
  };
});
