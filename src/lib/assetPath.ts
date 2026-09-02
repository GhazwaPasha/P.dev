/**
 * Resolves a root-relative path (e.g. "/models/avatar.glb") against Vite's
 * configured base URL, so static assets in /public still load correctly
 * when the app is served from a subpath (e.g. GitHub Pages project sites
 * at /P.dev/).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/" or "/P.dev/"
  return base.replace(/\/$/, '') + path;
}
