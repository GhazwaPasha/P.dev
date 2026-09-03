import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // pivak.is-a.dev is registered and set as the GitHub Pages custom domain,
  // so the site is served from the domain root.
  base: '/',
  plugins: [react()],
});
