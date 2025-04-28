import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // The API endpoint to proxy
      '/': {
        target: 'https://gmc-reporting.duckdns.org:3000',
        changeOrigin: true,
        secure: false, // Use 'true' if the target is using a valid HTTPS certificate
      },
    },
  },
});
