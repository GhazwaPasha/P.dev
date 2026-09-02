import { useEffect, useRef } from 'react';
import { BG_VIDEO_PLAYBACK_RATE } from './bgVideo';
import { withBase } from '../../lib/assetPath';

/** Fixed, full-viewport page background — a looping ambient video behind every page.
 *  Falls back to the static photo (as poster, and outright in place of the video)
 *  when the video can't play or the visitor prefers reduced motion. */
export default function BackgroundBlobs() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = BG_VIDEO_PLAYBACK_RATE;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }
    // Autoplay can still be blocked by the browser; the poster image covers that case.
    video.play().catch(() => {});
  }, []);

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
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={withBase('/images/bg.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      >
        <source src={withBase('/videos/bg.mp4')} type="video/mp4" />
      </video>
    </div>
  );
}
