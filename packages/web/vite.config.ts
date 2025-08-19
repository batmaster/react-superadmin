import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactSuperAdminWeb',
      formats: ['es', 'umd'],
      fileName: (format) => `react-superadmin-web.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@react-superadmin/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@react-superadmin/core': 'ReactSuperAdminCore',
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
