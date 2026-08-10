import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tracker/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
