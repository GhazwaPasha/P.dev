import { withBase } from '../../lib/assetPath';

/** Fixed, full-viewport page background — a static photo behind every page. */
export default function BackgroundBlobs() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
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
