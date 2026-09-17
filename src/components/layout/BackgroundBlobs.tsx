import { withBase } from '../../lib/assetPath';

/** Fixed, full-viewport page background — a static photo behind every page. */
export default function BackgroundBlobs() {
  return (
    <div
      style={{
        position: 'fixed',
        // `top`/`left: 0` plus explicit `100vw`/`100vh` sizing, not `inset:
        // 0` — `inset: 0`'s `right`/`bottom: 0` resolve against the
        // *containing block* width, which global.css's `scrollbar-gutter:
        // stable` on <html> permanently shrinks by the scrollbar's width
        // (so the reserved gutter stays visually consistent whether or not
        // a page actually scrolls — see that rule's own comment). On a
        // page with no real scrollbar to fill it, that leaves a
        // gutter-width sliver of unpainted page background on the right.
        // `vw`/`vh` units measure the actual device viewport instead,
        // unaffected by the reserved gutter, so this always covers edge to
        // edge regardless of which page is scrollable.
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      <img
        src={withBase('/images/bg.jpg')}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}
