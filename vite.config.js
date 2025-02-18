import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    historyApiFallback: true, // Ensures React Router handles routing
  },
  build: {
    outDir: 'dist', // Ensure correct build output
  }
});
