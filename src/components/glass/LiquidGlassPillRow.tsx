import type { CSSProperties, ReactNode } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import LiquidGlassRoot from './LiquidGlassRoot';
import GlassBackdrop from './GlassBackdrop';
import { frostedGlass } from './glassPresets';
import pillStyles from './GlassPill.module.css';

export interface GlassPillItem {
  /** React key, also what's rendered if `content` is omitted. */
  key: string;
  content?: ReactNode;
  /** Renders the pill as `<a>` instead of `<span>` when set. */
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  /** Composed alongside the shared `.pill` class — for interactive variants
   * (About's LinkedIn/Email pills use `.pillLink` for hover/focus states). */
  className?: string;
}

// cornerRadius 999 clamps to whichever pill's own half-height at render time
// (GlassRenderer's shader does min(u_radius, min(w,h)/2), same idiom
// NavPill/LogoBadges use for a capsule/circle) — one config makes every pill
// in the row a stadium shape regardless of its own text length, no per-pill
// math needed. zRadius follows LogoBadges' own chip tuning (data-config
// override there) rather than frostedGlass's card-scale 40px default or
// NavPill's pill-scale 12px — these pills sit at roughly the same physical
// size (~36-40px tall) as LogoBadges' 40px circular chips, so the same
// shallower bevel keeps them reading as a soft accent instead of the
// over-beveled "solid marble" a bigger default produces at this size.
const pillRowGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = {
  ...frostedGlass,
  cornerRadius: 999,
  zRadius: 8,
};

/**
 * One real (WebGL-refraction) glass surface shared by every pill in a row —
 * About's contact/skill/language pills, Projects' tech-stack chips. Mirrors
 * NavPill's and LogoBadges' "one root, many `data-glass` siblings" pattern
 * rather than LiquidGlassSurface's "one root per surface": some of these
 * rows carry a few dozen pills at once (About's skills list), and a
 * LiquidGlassRoot per pill would mean a WebGL context per pill — see
 * LiquidGlassRoot's and LogoBadges' context-budget comments for why that
 * blows the browser's context limit fast. One shared context per *row*
 * keeps the count bounded by how many pill rows a page has, not how many
 * pills sit in them.
 *
 * Unlike LogoBadges (which needs precomputed pixel offsets for its arc
 * layout), a pill row's shape is just "wrap normally" — so the root itself
 * is the flex-wrap container and every pill is a plain flex item, direct
 * child of the root as the library requires, no absolute positioning math
 * needed.
 */
export default function LiquidGlassPillRow({
  items,
  gap = 10,
  rootStyle,
}: {
  items: GlassPillItem[];
  gap?: number;
  rootStyle?: CSSProperties;
}) {
  return (
    <LiquidGlassRoot
      defaults={pillRowGlassDefaults}
      style={{ display: 'flex', flexWrap: 'wrap', gap, ...rootStyle }}
    >
      <GlassBackdrop />
      {items.map((item) => {
        // Dynamic per-item tag ('a' when linking out, 'span' otherwise) —
        // cast rather than a generic type param since the tag is decided
        // per array entry, not per call site (see LiquidGlassSurface for
        // the generic-param version of this, which needs a single tag known
        // to the caller up front).
        const Tag = (item.href ? 'a' : 'span') as unknown as 'a';
        return (
          <Tag
            key={item.key}
            data-glass
            href={item.href}
            target={item.target}
            rel={item.rel}
            aria-label={item.ariaLabel}
            className={item.className ? `${pillStyles.pill} ${item.className}` : pillStyles.pill}
          >
            {item.content ?? item.key}
          </Tag>
        );
      })}
    </LiquidGlassRoot>
  );
}
