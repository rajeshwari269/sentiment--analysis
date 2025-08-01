<<<<<<< HEAD

// https://vite.dev/config/

=======
>>>>>>> ed6ba4dea6940acd2b80ea9373c462f64e12a09b
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
