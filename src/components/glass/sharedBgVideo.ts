import { BG_VIDEO_PLAYBACK_RATE } from '../layout/bgVideo';
import { withBase } from '../../lib/assetPath';

const DEFAULT_SRC = withBase('/videos/bg.mp4');
const DEFAULT_POSTER = withBase('/images/bg.jpg');

let sharedVideo: HTMLVideoElement | null = null;
let refCount = 0;

/**
 * Ref-counted, page-wide decode of the ambient background video, shared by
 * every `SharedGlassBackdrop` consumer on the page instead of each one
 * running its own `<video>` + decoder (what plain `GlassBackdropVideo`
 * does — see its doc comment). About's cards are the first adopter: one
 * `LiquidGlassRoot` for the 4 panels plus two `LiquidGlassPillRow`s means 3
 * separate glass contexts, which used to mean 3 separate live video
 * decodes running at once, on top of the real page background — see
 * BackgroundBlobs.tsx and the perf notes in LiquidGlassRoot.tsx. Acquiring
 * this instead means those 3 contexts sample one shared decode.
 *
 * The element itself never needs CSS positioning or sizing tied to the
 * viewport (unlike GlassBackdropVideo's real backdrop `<video>`, which the
 * shader reads via `getBoundingClientRect()` + `object-fit`): consumers
 * pull frames out of it manually via `drawImage` using its natural
 * `videoWidth`/`videoHeight`, so it only needs to exist, decode, and stay
 * out of layout — see SharedGlassBackdrop's cover-fit math.
 */
export function acquireSharedBgVideo(): { video: HTMLVideoElement; release: () => void } {
  if (!sharedVideo) {
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.autoplay = true;
    video.poster = DEFAULT_POSTER;
    // Kept in the render tree (not display:none / visibility:hidden) for
    // the same reason GlassBackdropVideo is `opacity: 0` rather than
    // hidden outright — browsers use "will never be shown" as a signal to
    // throttle a <video>'s own decode work. 1x1 keeps its paint cost
    // negligible either way.
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    const source = document.createElement('source');
    source.src = DEFAULT_SRC;
    source.type = 'video/mp4';
    video.appendChild(source);
    document.body.appendChild(video);
    video.playbackRate = BG_VIDEO_PLAYBACK_RATE;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {});
    }
    sharedVideo = video;
    refCount = 0;
  }

  refCount++;
  const video = sharedVideo;
  let released = false;

  return {
    video,
    release: () => {
      if (released) return;
      released = true;
      refCount--;
      if (refCount <= 0 && sharedVideo === video) {
        video.pause();
        video.remove();
        sharedVideo = null;
        refCount = 0;
      }
    },
  };
}
