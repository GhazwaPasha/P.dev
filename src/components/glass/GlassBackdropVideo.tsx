import { useEffect, useRef } from 'react';
import { BG_VIDEO_PLAYBACK_RATE } from '../layout/bgVideo';

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
  src = '/videos/bg.mp4',
  poster = '/images/bg.jpg',
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
        inset: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        visibility: 'hidden',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
