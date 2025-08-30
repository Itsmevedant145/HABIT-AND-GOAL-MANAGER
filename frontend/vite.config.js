import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Optional: Add custom configurations if needed
  define: {
    'process.env': process.env, // Optional if you need to reference process.env directly
  },
});
