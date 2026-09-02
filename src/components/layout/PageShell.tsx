import type { ReactNode, CSSProperties } from 'react';
import NavPill from './NavPill';
import BackgroundBlobs from './BackgroundBlobs';

interface PageShellProps {
  /** Home is a fixed, non-scrolling 100vh screen; About/Projects scroll. */
  noScroll?: boolean;
  cursorNone?: boolean;
  children: ReactNode;
}

export default function PageShell({ noScroll, cursorNone, children }: PageShellProps) {
  const wrapperStyle: CSSProperties = noScroll
    ? { position: 'relative', height: '100vh', overflow: 'hidden' }
    : { position: 'relative', minHeight: '100vh', overflow: 'hidden' };
  if (cursorNone) wrapperStyle.cursor = 'none';

  return (
    <div style={wrapperStyle}>
      <BackgroundBlobs />
      <NavPill />
      {children}
    </div>
  );
}
