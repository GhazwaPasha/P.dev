import { useEffect, useRef } from 'react';
import { acquireSharedBgVideo } from './sharedBgVideo';

/**
 * Drop-in alternative to `GlassBackdropVideo` for a `LiquidGlassRoot` whose
 * page mounts several glass contexts at once (About: the 4-panel root plus
 * two `LiquidGlassPillRow`s). Instead of each root running its own live
 * `<video>` decode of the same file, this renders a `<canvas>` that's kept
 * painted with the *shared* decode's current frame (see sharedBgVideo.ts) —
 * one real video decoder per page instead of one per glass context.
 *
 * LiquidGlass.ts treats a `<canvas>` backdrop child differently from a
 * `<video>`/`<img>` one: video/img get `object-fit` applied automatically
 * from the element's own computed style before sampling, but a canvas is
 * just stretched — its raw pixel content is drawn as-is into the
 * destination rect (`_drawMediaElement`'s `CANVAS` branch). So the
 * `object-fit: cover` cropping that GlassBackdropVideo gets for free via
 * CSS has to be baked into this canvas's own backing-store pixels instead —
 * done manually below, matching `object-position: center`.
 */
export default function SharedGlassBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { video, release } = acquireSharedBgVideo();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let stopped = false;

    // Backing-store resolution matches the canvas's own CSS box (see the
    // style below) at device pixel ratio — same box GlassBackdropVideo's
    // real <video> covers, so a card scrolled off-screen still samples real
    // pixels instead of falling through to empty canvas (see
    // GlassBackdropVideo's doc comment on the 300vh height).
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * 3 * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (stopped) return;
      const haveFrame = video.readyState >= 1 && video.videoWidth > 0 && video.videoHeight > 0;
      if (haveFrame) {
        const cw = canvas.width;
        const ch = canvas.height;
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        // object-fit: cover, object-position: center, computed by hand —
        // crop the source to the canvas's aspect ratio rather than
        // stretching/squashing it to fit.
        const scale = Math.max(cw / vw, ch / vh);
        const sw = cw / scale;
        const sh = ch / scale;
        const sx = (vw - sw) / 2;
        const sy = (vh - sh) / 2;
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
      }
      // Reduced motion: keep polling (cheaply — no frame drawn yet) until
      // the shared decode actually has a frame, then freeze on it, same
      // end state `GlassBackdropVideo`'s `video.pause()` produces.
      if (!reducedMotion || !haveFrame) {
        rafId = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      release();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // LiquidGlass._detectDynamic() only treats a backdrop as "live" (worth
      // re-rendering every frame) when it's literally a <video> tag or
      // carries this attribute — a plain <canvas> doesn't auto-qualify the
      // way GlassBackdropVideo's real <video> does, so without this the
      // shader renders one frame of this canvas and then goes idle, reading
      // a permanently stale snapshot instead of the live shared video.
      data-dynamic
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '-100vh',
        left: 0,
        width: '100vw',
        height: '300vh',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
