import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { LiquidGlass, type GlassConfig } from '@ybouane/liquidglass';

interface LiquidGlassRootProps {
  /**
   * Direct children of this root. Mark whichever child(ren) should actually
   * render as glass with a `data-glass` attribute — everything else is
   * treated as backdrop content the shader samples and bends. Any child
   * whose contents animate every frame on its own (a WebGL/canvas element,
   * a <video>) needs `data-dynamic` too, or the glass will refract a frozen
   * snapshot of it from init time instead of the live frame.
   */
  children: ReactNode;
  /** Root element tag — 'section'/'nav' etc. for semantic HTML where it matters. */
  as?: 'div' | 'section' | 'nav';
  /** Passed through as LiquidGlass.init's `defaults`, applied to every
   * `[data-glass]` child unless overridden per-element via data-config. */
  defaults?: Partial<GlassConfig>;
  style?: CSSProperties;
  className?: string;
}

/**
 * Wraps @ybouane/liquidglass (WebGL shader: real refraction, chromatic
 * aberration, specular + fresnel highlights) around whichever of this root's
 * direct children carry `data-glass`. Every glass surface on the site now
 * goes through this (usually via LiquidGlassSurface, its higher-level
 * wrapper) — there's no plain-CSS backdrop-filter fallback component left.
 *
 * Each instance opens its own WebGL context and rasterizes its non-canvas
 * backdrop children via html-to-image on every relevant DOM change, so a
 * page with many of these (About, Projects) means many contexts at once —
 * see the AvatarModel/ButterflyCursor-style perf-budget comments this
 * codebase already uses for WebGL contexts if that ever needs revisiting.
 */
export default function LiquidGlassRoot({
  children,
  as = 'div',
  defaults,
  style,
  className,
}: LiquidGlassRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let instance: LiquidGlass | null = null;
    let cancelled = false;
    let scrollRafId = 0;

    // The library renders each glass element once (on init, resize, or a
    // DOM mutation inside it — see LiquidGlass.ts's dirty-tracking) and
    // then goes idle; it has no scroll listener of its own, because
    // scrolling never changes any of those things. But every rect it reads
    // (the glass element's own box, and this root's backdrop <img>) comes
    // from getBoundingClientRect(), which is viewport-relative — so on a
    // page that actually scrolls (About, Projects; Home's section is
    // non-scrolling), a card that was below the fold at mount time gets
    // its one-and-only render with an <img> rect that didn't overlap it
    // yet, bakes in an empty (white) scene, and then never re-renders even
    // once it's scrolled into view. `markChanged()` is the library's public
    // escape hatch for exactly this — content it can't observe on its own
    // — so nudge every glass on this root to re-sample on scroll,
    // rAF-throttled so a fast scroll doesn't queue up redundant re-renders.
    const onScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        instance?.markChanged();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    const glassElements = Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-glass]'));

    // The plain-CSS fallback background (see Home.tsx) and the WebGL shader
    // are two genuinely different looks, not a rough/polished pair — so
    // rather than showing the CSS version first and popping into the shader
    // once it's ready (a visible style swap on every single page load), hide
    // the glass element until we know which one it's actually getting, then
    // reveal it once, already in its final state. A quick fade-in reads as
    // an intentional reveal; a mid-load style swap reads as a bug (see the
    // avatar-bleed conversation this replaced).
    glassElements.forEach((el) => {
      el.style.transition = 'opacity 200ms ease';
      el.style.opacity = '0';
      // The injected canvas (added by LiquidGlass.init below) renders at
      // z-index: -1 so the glass element's own DOM content paints on top of
      // it. That only lands "behind this element specifically" if the
      // element establishes its own stacking context — otherwise the
      // negative z-index resolves against whatever ancestor's context it
      // escapes to instead, and the canvas can render behind unrelated page
      // content and disappear. `position: relative` alone (which the library
      // sets on this element itself) isn't enough without a paired z-index
      // or transform. This is exactly what the old `.glass-surface` CSS
      // class used to guarantee via `isolation: isolate` before real glass
      // replaced it here — reproducing that directly, unconditionally,
      // rather than relying on something incidental (e.g. a hover
      // transform) to establish it only sometimes.
      el.style.isolation = 'isolate';
    });
    // Reveal, then hand the `opacity`/`transition` properties this effect
    // set back to the stylesheet once the fade-in has had time to run.
    // Elements with no opacity rule of their own (most glass surfaces) end
    // up computed at 1 either way, so this is a no-op for them — but an
    // element whose CSS *does* keep managing its own opacity afterward
    // (the logo badges' tech chips: `opacity: 0` by default, shown via
    // `.group:hover .chip { opacity: 1 }`) would otherwise be stuck
    // permanently visible under this inline override forever, since
    // nothing else here ever clears it.
    const reveal = () => {
      glassElements.forEach((el) => {
        el.style.opacity = '1';
        setTimeout(() => {
          el.style.removeProperty('opacity');
          el.style.removeProperty('transition');
        }, 250);
      });
    };

    // Deferred by one microtask, and re-checking `cancelled` right before
    // actually calling init(). React 18 StrictMode double-invokes effects in
    // dev, synchronously: mount -> cleanup -> mount again, all before any
    // microtask gets a chance to run. LiquidGlass.init()'s very first
    // (synchronous, pre-await) side effect force-sets `position: relative`
    // on each glass element and injects its canvas — shared DOM state, not
    // just this instance's own bookkeeping. A naive cancel-flag-after-the-
    // fact guard (checking `cancelled` only once init() resolves) isn't
    // enough: the doomed first invocation still runs that synchronous
    // mutation before its own cleanup can stop it, and its *eventual*
    // destroy() call (once its now-pointless init() finally resolves) strips
    // `position: relative` back off the element — which the real (second)
    // instance's still-live canvas depends on for correct positioning
    // (confirmed live: without this guard, the glass element's computed
    // position stayed "static" and its canvas rendered at a fixed -20/-20
    // offset from the viewport instead of from its own box). Deferring the
    // call itself past the synchronous replay means the doomed invocation's
    // `cancelled` flip has already happened by the time we'd check it, so
    // it never touches the DOM in the first place. (Previously reverted
    // this exact fix after mistaking an unrelated 712px-viewport testing
    // artifact for a regression it caused — it wasn't; re-applying it.)
    queueMicrotask(() => {
      if (cancelled) return;
      LiquidGlass.init({ root, glassElements, defaults })
        .then((inst) => {
          if (cancelled) {
            inst.destroy();
            return;
          }
          instance = inst;
          reveal();
        })
        .catch((err) => {
          // No WebGL / init failure: reveal the plain CSS fallback instead
          // of leaving the card invisible forever.
          console.error('LiquidGlassRoot: init failed, falling back to plain CSS glass', err);
          if (!cancelled) reveal();
        });
    });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
    // `defaults` is expected to be a stable (module-level or memoized)
    // reference — recreating it on every render would tear down and
    // reinitialize the WebGL context on every render too.
  }, [defaults]);

  const Tag = as;
  return (
    <Tag ref={rootRef} className={className} style={style}>
      {children}
    </Tag>
  );
}
