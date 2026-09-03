import type { GlassConfig } from '@ybouane/liquidglass';
import { NavLink, useLocation } from 'react-router-dom';
import LiquidGlassRoot from '../glass/LiquidGlassRoot';
import GlassBackdrop from '../glass/GlassBackdrop';
import { frostedGlass } from '../glass/glassPresets';
import styles from './NavPill.module.css';

interface NavItem {
  to: string;
  title: string;
  icon: React.ReactNode;
}

const items: NavItem[] = [
  {
    to: '/',
    title: 'Home',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.6 3.5 9.8V21a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-6a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5v6a1 1 0 0 0 1 1H19.5a1 1 0 0 0 1-1V9.8Z" />
      </svg>
    ),
  },
  {
    to: '/about',
    title: 'About',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4.2" />
        <path d="M4 21c0-4.4 3.6-7.2 8-7.2s8 2.8 8 7.2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      </svg>
    ),
  },
  {
    to: '/projects',
    title: 'Projects',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="2.2" />
        <rect x="13" y="3" width="8" height="8" rx="2.2" />
        <rect x="3" y="13" width="8" height="8" rx="2.2" />
        <rect x="13" y="13" width="8" height="8" rx="2.2" />
      </svg>
    ),
  },
];

// cornerRadius large enough to always clamp to whichever glass element it's
// applied to's own half-height (GlassRenderer.ts's shader does
// `min(u_radius, min(w,h)/2)`, same as CSS border-radius) — the same `999`
// idiom the plain-CSS pills elsewhere on the site use for a capsule shape.
// Shared by both glass elements below (the pill and the indicator): each
// clamps against its *own* box, so one config makes the pill a capsule and
// the indicator a circle without needing a per-element data-config override.
//
// zRadius (bevel depth) is NOT left at frostedGlass's inherited 40px
// default here — that number reads fine on the identity card (a ~210px-tall
// panel, so a 40px bevel only eats the rim and leaves a large flat center),
// but this pill is only ~54px tall. A bevel deeper than half an element's
// own height never reaches a flat plateau (see shaders.ts's bevelHeight —
// it clamps to `d`, the distance-in, before it ever reaches zR), so the
// *whole* pill reads as one continuous curve instead of a flat pane with a
// beveled rim — visibly different material from the identity card even
// though every other shader parameter is identical. 12px keeps roughly the
// identity card's own bevel-to-half-height ratio (~0.38) at this size.
const navGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = {
  ...frostedGlass,
  cornerRadius: 999,
  zRadius: 12,
};

// See the comment on the indicator element below — this is a per-element
// data-config override (the library's own escape hatch for exactly this),
// not a change to the shared default above.
const INDICATOR_GLASS_CONFIG = JSON.stringify({ zRadius: 30 });

export default function NavPill() {
  const { pathname } = useLocation();
  const activeIndex = items.findIndex((item) =>
    item.to === '/' ? pathname === '/' : pathname.startsWith(item.to),
  );

  return (
    // One root, two `[data-glass]` siblings (pill background + active-item
    // indicator) instead of two independent roots: they share a single
    // WebGL context — worth it on a page that already has AvatarHero and
    // ButterflyCursor's own Three.js contexts plus every other real-glass
    // surface running at once (confirmed live: a second nav-only context
    // was enough to trip this sandboxed browser's "too many active WebGL
    // contexts" eviction, silently blanking whichever surface lost its
    // context) — and it composes correctly for free: LiquidGlass.ts draws
    // an earlier glass element's already-rendered output into a later
    // one's scene (`_drawPriorGlassToScene`), so the indicator — coming
    // after the pill in DOM order — genuinely refracts the pill's own
    // glass, reading as a brighter accent floating on it rather than a
    // flat cutout. The icons (NavLink) are last and plain (no
    // `data-glass`), so they just paint on top of both in normal DOM order.
    <LiquidGlassRoot
      as="nav"
      defaults={navGlassDefaults}
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '10px 22px',
        // Home hides the native cursor (see PageShell's cursorNone) in favor of the
        // 3D butterfly cursor; ButterflyCursor hides itself over <nav> so it
        // doesn't sit on top of the icons, so the plain system cursor needs to be
        // switched back on here, overriding that ancestor's `cursor: none`.
        cursor: 'default',
      }}
    >
      <GlassBackdrop />
      {/* The pill's own capsule background — absolutely positioned to fill
          the root's padding box (the root *is* the fixed, padded nav pill
          now) rather than being the flex container itself, so it can sit
          out of the icons' flex flow. */}
      <div data-glass aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {activeIndex !== -1 && (
        <div
          data-glass
          // Deliberately NOT navGlassDefaults's zRadius:12 — that value is
          // tuned for the pill (half-height 27px) to get a flat plateau with
          // a beveled rim. Applied to this 40px indicator (half-height 20px)
          // it's *still* small enough to develop its own crisp flat-center-
          // plus-rim, which reads as a second, competing glass disc sitting
          // on top of the pill instead of the soft accent it's meant to be
          // (confirmed live — a distinct pink-rimmed circle floating on the
          // pill's own blue-rimmed capsule). A much larger zRadius here
          // keeps the indicator permanently over-beveled at its own size —
          // no flat plateau ever forms, so it stays a soft blended glow
          // instead of a separate-looking object.
          data-config={INDICATOR_GLASS_CONFIG}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 6,
            left: 18,
            width: 40,
            height: 40,
            pointerEvents: 'none',
            transform: `translateX(${activeIndex * 52}px)`,
            transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          title={item.title}
          aria-label={item.title}
          className={styles.icon}
        >
          {item.icon}
        </NavLink>
      ))}
    </LiquidGlassRoot>
  );
}
