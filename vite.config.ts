import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages currently serves this site at /P.dev/ (the pivak.is-a.dev
  // custom domain isn't live yet). Switch this back to '/' once that domain
  // is registered and set as the custom domain in GitHub Pages settings.
  base: '/P.dev/',
  plugins: [react()],
});
