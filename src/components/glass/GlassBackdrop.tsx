import { withBase } from '../../lib/assetPath';

interface GlassBackdropProps {
  src?: string;
}

/**
 * Hidden, viewport-filling, static photo — the backdrop content every
 * LiquidGlassRoot on the site (other than Home's identity card, which wires
 * its own copy directly against the hero section instead of the viewport —
 * see Home.tsx) feeds its shader to refract. Same source as BackgroundBlobs'
 * real page background, so every glass surface anywhere on the page bends
 * the actual visible background instead of an unrelated one — the point
 * isn't motion (this file used to be a live `<video>` when the background
 * itself was animated; a plain `<img>` is the same idea for a static photo,
 * and simpler: no autoplay/reduced-motion handling, and LiquidGlass rasterizes
 * an `<img>` once and caches it instead of re-sampling every frame the way it
 * has to for `<video>` — see `_detectDynamic()` in LiquidGlass.ts).
 *
 * `position: fixed` + `opacity: 0` (+ `pointerEvents: none`, since unlike
 * `visibility: hidden` an `opacity: 0` element stays hit-testable) keeps
 * this invisible to the visitor while staying a real, painted layer that
 * LiquidGlass can rasterize via html-to-image. `fixed` keeps it correctly
 * viewport-sized/positioned no matter where inside the page its own
 * LiquidGlassRoot sits (a card mid-page isn't a full-viewport box, so
 * `absolute` alone wouldn't cover the same region a `position: fixed` real
 * background does). Staying invisible matters once more than one of these
 * shares a page (About's cards, Projects' cards, NavPill, LogoBadges, all
 * live at once): a visible copy would paint solid over every earlier root's
 * already-rendered content, the same "opaque position:fixed" bug the old
 * photo backdrop's comments already called out.
 */
export default function GlassBackdrop({ src = withBase('/images/bg.jpg') }: GlassBackdropProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        position: 'fixed',
        // Deliberately taller than the viewport (and centered on it, via the
        // negative top) rather than a plain `inset: 0`. LiquidGlass.ts reads
        // this element's raw geometry to know how far its content extends —
        // it has no idea the image is only ever *painted* within the
        // viewport. A glass panel scrolled half off-screen still asks for
        // background covering its *entire* padded box, including the sliver
        // currently above y=0 or below the viewport's bottom edge; a
        // `100vh`-tall box simply doesn't reach there, so that sliver falls
        // through to the library's own white scene-primer instead of real
        // content — the "whitish look" on a panel that's half scrolled in or
        // out. One extra viewport-height of margin above and below
        // comfortably covers how far any of our cards can be off-screen
        // while still partially visible (their own height is well under
        // 100vh).
        top: '-100vh',
        left: 0,
        width: '100vw',
        height: '300vh',
        objectFit: 'cover',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
