import type { ReactNode, CSSProperties } from 'react';

interface PageShellProps {
  /** Home is a fixed, non-scrolling 100vh screen; About/Projects scroll. */
  noScroll?: boolean;
  children: ReactNode;
}

/**
 * Per-page content wrapper — just the scroll/overflow container for a page's
 * own section(s). The persistent chrome (nav pill, ambient background) lives
 * once in RootLayout now, not per-page — see RootLayout.tsx for why:
 * mounting it fresh inside every page component meant it was torn down and
 * rebuilt (new WebGL context, new fade-in) on every single route change,
 * which is what made navigating between pages read as a reload instead of a
 * transition, even though the background itself never actually changes.
 */
export default function PageShell({ noScroll, children }: PageShellProps) {
  const wrapperStyle: CSSProperties = noScroll
    ? { position: 'relative', height: '100vh', overflow: 'hidden' }
    : { position: 'relative', minHeight: '100vh', overflow: 'hidden' };

  return <div style={wrapperStyle}>{children}</div>;
}
