import type { CSSProperties } from 'react';
import { projects } from '../../content/projects';
import { TECH_ICONS } from '../../content/techIcons';
import { withBase } from '../../lib/assetPath';
import glass from '../glass/Glass.module.css';
import styles from './LogoBadges.module.css';

interface LogoBadge {
  name: string;
  href: string;
  /** Path under /public, e.g. "/logos/lexcheck.svg". */
  src: string;
  fallback: string;
}

const logos: LogoBadge[] = [
  { name: 'LexCheck', href: 'https://lexcheck.com', src: withBase('/logos/lexcheck.svg'), fallback: 'LX' },
  { name: 'Cohere', href: 'https://cohere.live', src: withBase('/logos/cohere.svg'), fallback: 'CH' },
];

/** Tech stack per logo, pulled straight from the Projects content so it never drifts out of sync. */
function stackFor(name: string): string[] {
  return projects.find((p) => p.name === name)?.stack ?? [];
}

/** Chip logo size — comfortably inside the 40px circle with its 4px padding. */
const CHIP_ICON_SIZE = 20;

const BADGE_SIZE = 72;
const BADGE_GAP = 88;

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

// The identity card (Home.tsx) is vertically centered via `top: 50%;
// transform: translateY(-50%)`, so its own top/bottom edges sit half its
// rendered height above/below the section's 50% line. CARD_HALF_HEIGHT is
// that half-height, worked out from the card's own styles: 40px top padding
// + the h1 (34px * 1.15 line-height) + 8px paragraph margin + the p (18px *
// 1.45 line-height) + 40px bottom padding, halved. CARD_GAP is the visual
// breathing room below the card's bottom edge before the badges start.
// FALLBACK_CARD_RIGHT is only the pre-measurement guess used below before
// Home.tsx's ResizeObserver publishes the real `--card-center-right` custom
// property (see the comment on `left` below, and the one on that effect in
// Home.tsx) — it's never relied on for the actual layout, just avoids a
// coordinate of `NaN` on the very first paint.
const CARD_HALF_HEIGHT = 77;
const CARD_GAP = 28;
const FALLBACK_CARD_RIGHT = 64;
// Deliberate nudge off dead-center, to the right, purely by eye.
const CENTER_NUDGE = 24;

/**
 * Logo badges + their tech-stack fans, one flex row of plain `.group`
 * wrappers — each a badge plus its own absolutely-positioned chips, with the
 * hover/focus reveal handled by a plain CSS `.group:hover .chip` /
 * `.group:focus-within .chip` rule (see LogoBadges.module.css). Used to need
 * React state instead of that (`hoveredLogo`) plus precomputed pixel offsets
 * for badges and chips alike (`GROUP_OFFSETS`, `ROOT_WIDTH`/`ROOT_HEIGHT`) —
 * both artifacts of the old WebGL library requiring every glass element to
 * be a *direct* child of one shared root (no wrapper div allowed, so no CSS
 * `:hover` ancestor relationship either), and of that root needing a
 * precisely padded bounding box for the shader to render the whole reveal
 * arc into. Plain CSS backdrop-filter has neither constraint — each badge
 * and chip is just its own independent glass element, nested normally.
 */
export default function LogoBadges() {
  return (
    <div
      className={styles.wrap}
      style={{
        top: `calc(50% + ${CARD_HALF_HEIGHT + CARD_GAP}px)`,
        // Centers this row's own horizontal center under
        // `--card-center-right` — the identity card's real measured
        // horizontal center, published by a ResizeObserver in Home.tsx (see
        // the comment on its effect there). `left: calc(100% - ...)`
        // converts that "distance from the viewport's right edge" into a
        // "distance from this row's own containing block's left edge", and
        // `translateX(-50%)` re-centers the row (of whatever width its
        // content naturally comes out to) on that point instead of putting
        // its left edge there.
        left: `calc(100% - var(--card-center-right, ${FALLBACK_CARD_RIGHT}px) + ${CENTER_NUDGE}px)`,
        transform: 'translateX(-50%)',
        gap: BADGE_GAP,
      }}
    >
      {logos.map((logo) => {
        const stack = stackFor(logo.name);
        return (
          <div key={logo.name} className={styles.group} style={{ width: BADGE_SIZE, height: BADGE_SIZE }}>
            <a
              href={logo.href}
              target="_blank"
              rel="noreferrer"
              title={logo.name}
              aria-label={`${logo.name} — visit site`}
              className={`${glass.glass} ${styles.badge}`}
              style={{ borderRadius: '50%' }}
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
              const Icon = TECH_ICONS[tech];
              return (
                <div
                  key={tech}
                  title={tech}
                  aria-hidden="true"
                  className={`${glass.glass} ${styles.chip}`}
                  style={
                    {
                      borderRadius: '50%',
                      '--x': `${x}px`,
                      '--y': `${y}px`,
                      transitionDelay: `${i * 40}ms`,
                    } as CSSProperties
                  }
                >
                  {Icon ? <Icon size={CHIP_ICON_SIZE} /> : tech}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
