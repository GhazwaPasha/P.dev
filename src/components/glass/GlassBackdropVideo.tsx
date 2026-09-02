import { useEffect, useRef } from 'react';
import { BG_VIDEO_PLAYBACK_RATE } from '../layout/bgVideo';
import { withBase } from '../../lib/assetPath';

interface GlassBackdropVideoProps {
  src?: string;
  poster?: string;
}

/**
 * Hidden, viewport-filling, *live* `<video>` — the backdrop content every
 * LiquidGlassRoot on the site (other than Home's identity card, which wires
 * its own copy directly against the hero section instead of the viewport —
 * see Home.tsx) feeds its shader to refract. Same source as BackgroundBlobs'
 * real page background, so every glass surface anywhere on the page bends
 * the actual moving background instead of a static photo frozen at one
 * moment (which is what a plain `<img src="/images/bg.jpg">` backdrop gives
 * you — visually reads as "this card has its own background" instead of
 * seeing through to the live one).
 *
 * `position: fixed` + `visibility: hidden`, same as the static-photo
 * backdrop this replaces: LiquidGlass.ts reads the live video frame
 * directly off the element every render (`vid.readyState` / `drawImage`),
 * independent of CSS — so hiding it doesn't hide it from the shader, it
 * only stops it from *also* being a real, opaque, full-viewport DOM layer.
 * `fixed` keeps it correctly viewport-sized/positioned no matter where
 * inside the page its own LiquidGlassRoot sits (a card mid-page isn't a
 * full-viewport box, so `absolute` alone wouldn't cover the same region a
 * `position: fixed` real background does). `hidden` matters once more than
 * one of these shares a page (About's cards, Projects' cards, NavPill,
 * LogoBadges, all live at once): an unhidden copy would paint solid over
 * every earlier root's already-rendered content, the same "opaque
 * position:fixed" bug the old photo backdrop's comments already called out.
 */
export default function GlassBackdropVideo({
  src = withBase('/videos/bg.mp4'),
  poster = withBase('/images/bg.jpg'),
}: GlassBackdropVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = BG_VIDEO_PLAYBACK_RATE;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    // Autoplay can still be blocked by the browser; the poster/last-decoded-
    // frame covers that case the same way BackgroundBlobs' real one does.
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      style={{
        position: 'fixed',
        // Deliberately taller than the viewport (and centered on it, via the
        // negative top) rather than a plain `inset: 0`. LiquidGlass.ts reads
        // this element's raw geometry to know how far its content extends —
        // it has no idea the video is only ever *painted* within the
        // viewport (visibility:hidden here doesn't change that geometry).
        // A glass panel scrolled half off-screen still asks for background
        // covering its *entire* padded box, including the sliver currently
        // above y=0 or below the viewport's bottom edge; a `100vh`-tall box
        // simply doesn't reach there, so that sliver falls through to the
        // library's own white scene-primer instead of real video — the
        // "whitish look" on a panel that's half scrolled in or out. One
        // extra viewport-height of margin above and below comfortably
        // covers how far any of our cards can be off-screen while still
        // partially visible (their own height is well under 100vh).
        top: '-100vh',
        left: 0,
        width: '100vw',
        height: '300vh',
        objectFit: 'cover',
        visibility: 'hidden',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
