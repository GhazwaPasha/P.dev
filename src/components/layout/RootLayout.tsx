import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackgroundBlobs from './BackgroundBlobs';
import NavPill from './NavPill';
import styles from './RootLayout.module.css';

// Prefetch the *other* routes' lazy chunks (see App.tsx for why all three
// are lazy) once the browser's idle, so navigating there normally hits an
// already-resolved import() instead of the Suspense fallback below — same
// onIdle-deferral idiom Home.tsx already uses for its own heavy chunk, just
// prefetching instead of gating a mount on it.
const routeImporters: Record<string, () => Promise<unknown>> = {
  '/': () => import('../../pages/Home'),
  '/about': () => import('../../pages/About'),
  '/projects': () => import('../../pages/Projects'),
};

function onIdle(cb: () => void): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb);
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}

/**
 * Persistent chrome — nav pill + ambient background — mounted exactly once
 * for the app's lifetime via react-router's nested-layout pattern (App.tsx
 * renders this as the parent route, with `<Outlet/>` standing in for
 * whichever page is active). Previously each page mounted its own copy of
 * both (via PageShell), so every navigation fully tore down and rebuilt the
 * nav's WebGL context and the background canvas — a visible flash-then-
 * refade on every single click even though the background itself never
 * actually changes between pages. Hoisting them here means only the page
 * *content* swaps on navigation now, and it does so with a plain fade
 * instead of an instant, Suspense-fallback-flashing cut.
 */
export default function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(
    () =>
      onIdle(() => {
        Object.entries(routeImporters).forEach(([path, importer]) => {
          if (path !== pathname) importer().catch(() => {});
        });
      }),
    [pathname],
  );

  return (
    // cursor:none only for Home (ButterflyCursor stands in for the system
    // pointer there) — applied on this shared wrapper now that NavPill no
    // longer lives inside a per-page shell, so it still sits under the
    // override the way it always did; NavPill sets its own inline
    // `cursor: default` specifically to win back over this when it applies.
    <div style={{ cursor: isHome ? 'none' : undefined }}>
      <BackgroundBlobs />
      <NavPill />
      {/* Keyed by pathname so this (and everything inside it) fully
          remounts on navigation — that's what retriggers the CSS fade-in
          below on every route change, page content included. The
          background/nav above are siblings, outside this key, so they're
          untouched by it. */}
      <div key={pathname} className={styles.fadeIn}>
        {/* No visible fallback: the real background/nav are already
            painted and persistent above, so a route whose chunk hasn't
            resolved yet (rare now that idle-prefetch above usually beats
            the click) simply shows nothing extra rather than flashing a
            solid cover over already-correct chrome. */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
