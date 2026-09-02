import { Fragment, useState, type CSSProperties } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import LiquidGlassRoot from '../glass/LiquidGlassRoot';
import GlassBackdropVideo from '../glass/GlassBackdropVideo';
import { frostedGlass } from '../glass/glassPresets';
import { projects } from '../../content/projects';
import styles from './LogoBadges.module.css';

interface LogoBadge {
  name: string;
  href: string;
  /** Path under /public, e.g. "/logos/lexcheck.svg". */
  src: string;
  fallback: string;
}

const logos: LogoBadge[] = [
  { name: 'LexCheck', href: 'https://lexcheck.com', src: '/logos/lexcheck.svg', fallback: 'LX' },
  { name: 'Cohere', href: 'https://cohere.live', src: '/logos/cohere.svg', fallback: 'CH' },
];

/** Tech stack per logo, pulled straight from the Projects content so it never drifts out of sync. */
function stackFor(name: string): string[] {
  return projects.find((p) => p.name === name)?.stack ?? [];
}

/** Manual line-break points so compound names fit the small chip circles — display only. */
const CHIP_LINE_BREAKS: Record<string, [string, string]> = {
  MongoDB: ['Mongo', 'DB'],
};

function renderChipLabel(tech: string) {
  const lines = CHIP_LINE_BREAKS[tech];
  if (!lines) return tech;
  return (
    <>
      {lines[0]}
      <br />
      {lines[1]}
    </>
  );
}

const BADGE_SIZE = 72;
const BADGE_GAP = 40;

/**
 * Static top/left for each badge, replacing the old flex-column + per-child
 * translateX stagger (`.wrap { display:flex; gap:40px }` +
 * `.group:first-child/:last-child { transform: translateX(...) }`). Both
 * badges and every chip now have to be *direct* children of one shared
 * LiquidGlassRoot (see the component doc comment below for why), which
 * means there's no more `.group` wrapper div to hang that layout on — these
 * numbers are just that same layout, pre-computed instead of derived from
 * flex + transform.
 */
const GROUP_OFFSETS: Array<{ top: number; left: number }> = [
  { top: 0, left: 96 }, // LexCheck — first
  { top: BADGE_SIZE + BADGE_GAP, left: 56 }, // Cohere — last
];

// LiquidGlass measures and centers panels off this root's own
// getBoundingClientRect() — but every child here is `position: absolute`
// (see GROUP_OFFSETS above), so with no size of its own passed in, the root
// has zero intrinsic width/height (nothing in normal flow to size it).
// CSS doesn't mind that — it's just a positioning anchor — but the shader
// library does: with a zero-size (or too-small) root, whichever tech chips
// land farthest from their badge along the reveal arc permanently rendered
// as flat white circles instead of real glass. Sizing the root to just the
// badges' own footprint (184px tall) wasn't enough on its own — confirmed
// live: chips still whited out, because the reveal arc reaches well past
// that footprint (ARC_RADIUS plus a chip's own half-size and padding, ~124px
// beyond a badge's center) and the library apparently needs the root to
// actually cover the content it's asked to render, not just be "non-zero".
// ROOT_WIDTH/HEIGHT below pad generously past that reach; only fixed once
// they did.
const CONTENT_WIDTH =
  Math.max(...GROUP_OFFSETS.map((o) => o.left)) + BADGE_SIZE - Math.min(...GROUP_OFFSETS.map((o) => o.left));
const CONTENT_HEIGHT = Math.max(...GROUP_OFFSETS.map((o) => o.top)) + BADGE_SIZE;

// cornerRadius large enough to always clamp to whichever glass element it's
// applied to's own half-height (GlassRenderer.ts's shader does
// `min(u_radius, min(w,h)/2)`, same as CSS border-radius) — the same `999`
// idiom NavPill uses for its pill + indicator. Shared here by both badges
// and every chip: each clamps against its own box, so one config makes the
// 72px badges circles and every 40px chip a circle too.
//
// zRadius (bevel depth) is set for the 72px badge specifically — 14px keeps
// roughly the identity card's own bevel-to-half-height ratio (a big ~210px
// panel with a 40px bevel reads as a flat pane with a beveled rim; at this
// badge's much smaller half-height, inheriting that same 40px default would
// leave no flat area at all, so the badge reads as a solid curved marble
// instead of the identity card's calmer glass-pane look). The chips are
// smaller still (40px, half-height 20px) and get their own, shallower
// zRadius via `data-config` below rather than sharing this value.
const logoGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = {
  ...frostedGlass,
  cornerRadius: 999,
  zRadius: 14,
};

// Per-chip override (see logoGlassDefaults comment) — LiquidGlass reads this
// off each element's own `data-config` JSON and merges it over the root's
// defaults, the same escape hatch the library exposes for exactly this.
const CHIP_GLASS_CONFIG = JSON.stringify({ zRadius: 8 });

const ARC_RADIUS = 84;
const ARC_START_DEG = 100; // just left of straight up (kept clear of the left edge)
const ARC_END_DEG = 10; // swings right, toward the hero — stays above badge level

/** Position for the i-th of n chips along an arc above the badge (0deg = right, 90deg = straight up). */
function arcOffset(i: number, n: number) {
  const angleDeg = n === 1 ? 90 : ARC_START_DEG - ((ARC_START_DEG - ARC_END_DEG) * i) / (n - 1);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = ARC_RADIUS * Math.cos(angleRad);
  const y = -ARC_RADIUS * Math.sin(angleRad);
  return { x, y };
}

// LiquidGlass measures/centers panels off this root's own
// getBoundingClientRect(), and needs that box to actually cover the content
// it's asked to render — not just be non-zero. Sizing the root to only the
// badges' own footprint (CONTENT_WIDTH/HEIGHT above) still left whichever
// tech chips land farthest from their badge along the reveal arc permanently
// white instead of real glass (confirmed live). ARC_REACH_PAD is how far a
// revealed chip's own padded box can reach past its badge's center: the
// arc's radius, plus the chip's half-size, plus the per-glass-element
// SHADOW_PAD the library adds around every panel (40px: 20px chip half-size
// + 20px shadow pad — see the liquidglass source, SHADOW_PAD). Padding the
// root by this on every side (rather than baking it into CONTENT_WIDTH/
// HEIGHT directly) keeps the padding symmetric around the group's own
// footprint, so it doesn't itself shift where that footprint is centered.
const ARC_REACH_PAD = ARC_RADIUS + 40;
const ROOT_WIDTH = CONTENT_WIDTH + ARC_REACH_PAD * 2;
const ROOT_HEIGHT = CONTENT_HEIGHT + ARC_REACH_PAD * 2;

/**
 * Both badges and their whole tech-stack fans share ONE LiquidGlassRoot —
 * previously each badge (badge + its own chips) got its own root, i.e. its
 * own WebGL context. Home already runs AvatarHero's and ButterflyCursor's
 * own Three.js contexts, plus the identity card's and NavPill's own
 * LiquidGlassRoot — two more for the badges tipped the page into "too many
 * active WebGL contexts" territory: confirmed live via the console
 * (`WARNING: Too many active WebGL contexts. Oldest context will be lost.`,
 * `THREE.WebGLRenderer: Context Lost.`) and visually — hovering a badge
 * showed some chips rendering real refracted glass while others sat there
 * as flat opaque white circles (the shader's own canvas-clear color,
 * never actually replaced by a rendered frame because that badge's context
 * got evicted before every one of its glass elements got a first render).
 * One shared root/context for both badges removes that contention.
 *
 * The library requires every `data-glass` element to be a *direct* child of
 * its root, which rules out the old per-badge `.group` wrapper div — so the
 * hover-reveal that used to be pure CSS (`.group:hover .chip`) is now
 * tracked in React state instead (`hoveredLogo`) and applied as a class,
 * since `.group:hover .chip` relied on the chip being a DOM *descendant* of
 * the hovered badge's own wrapper, which is no longer true once both badges
 * and every chip are flat siblings under one root.
 */
export default function LogoBadges() {
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  return (
    <LiquidGlassRoot
      className={styles.wrap}
      defaults={logoGlassDefaults}
      style={{
        pointerEvents: 'none',
        width: ROOT_WIDTH,
        height: ROOT_HEIGHT,
        // Overrides .wrap's `top: 50%; transform: translateY(-50%)` — that
        // trick centers by the element's *own* height, which would now
        // center the padded ROOT_HEIGHT box (see ARC_REACH_PAD above)
        // instead of the group's real CONTENT_HEIGHT, visibly shifting the
        // badges. This computes the same "centered" position directly from
        // CONTENT_HEIGHT so the padding added for the library's sake stays
        // invisible to layout.
        top: `calc(50% - ${CONTENT_HEIGHT / 2}px)`,
        transform: 'none',
      }}
    >
      <GlassBackdropVideo />
      {logos.map((logo, gi) => {
        const stack = stackFor(logo.name);
        const offset = GROUP_OFFSETS[gi];
        const centerTop = offset.top + BADGE_SIZE / 2;
        const centerLeft = offset.left + BADGE_SIZE / 2;
        const revealed = hoveredLogo === logo.name;
        return (
          // Fragment, not a wrapping <div> — badge and chips must be direct
          // children of the LiquidGlassRoot itself (see the component doc
          // comment above), and an intermediate DOM element here would
          // break that the same way the old `.group` div did.
          <Fragment key={logo.name}>
            <a
              href={logo.href}
              target="_blank"
              rel="noreferrer"
              title={logo.name}
              aria-label={`${logo.name} — visit site`}
              data-glass
              className={styles.badge}
              style={{ top: offset.top, left: offset.left, pointerEvents: 'auto' }}
              onMouseEnter={() => setHoveredLogo(logo.name)}
              onMouseLeave={() => setHoveredLogo((cur) => (cur === logo.name ? null : cur))}
              onFocus={() => setHoveredLogo(logo.name)}
              onBlur={() => setHoveredLogo((cur) => (cur === logo.name ? null : cur))}
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement?.insertAdjacentHTML(
                    'beforeend',
                    `<span class="${styles.fallback}">${logo.fallback}</span>`,
                  );
                }}
              />
            </a>
            {stack.map((tech, i) => {
              const { x, y } = arcOffset(i, stack.length);
              return (
                <div
                  key={tech}
                  data-glass
                  data-config={CHIP_GLASS_CONFIG}
                  aria-hidden="true"
                  className={`${styles.chip}${revealed ? ` ${styles.revealed}` : ''}`}
                  style={
                    {
                      top: centerTop,
                      left: centerLeft,
                      '--x': `${x}px`,
                      '--y': `${y}px`,
                      transitionDelay: revealed ? `${i * 40}ms` : '0ms',
                    } as CSSProperties
                  }
                >
                  {renderChipLabel(tech)}
                </div>
              );
            })}
          </Fragment>
        );
      })}
    </LiquidGlassRoot>
  );
}
