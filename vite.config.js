import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify(process.env.VITE_RECAPTCHA_SITE_KEY)
  },
  plugins: [react()],
  base: '/',
  server: {
    historyApiFallback: true, // Ensures React Router handles routing
  },
  build: {
    outDir: 'dist', // Ensure correct build output
  }
});
