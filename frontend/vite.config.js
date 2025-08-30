import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Define the build output directory as 'dist'
  build: {
    outDir: 'dist', // Ensure that the build output goes to the 'dist' directory
  },
  define: {
    'process.env': process.env, // Optional if you need to reference process.env directly
  },
});
