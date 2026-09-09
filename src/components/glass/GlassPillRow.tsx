import type { CSSProperties, ReactNode } from 'react';
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

/**
 * A row of glass pills — About's contact/skill/language pills, Projects'
 * tech-stack chips, CapabilitiesCard's icon row. Used to be backed by one
 * shared WebGL context per row (LiquidGlassPillRow — every `data-glass`
 * pill had to be a *direct* child of one `LiquidGlassRoot`, and a context
 * per row rather than per pill kept the browser's concurrent-WebGL-context
 * budget from blowing up on a page with a few dozen pills at once). Plain
 * CSS has none of those constraints — each pill is just its own
 * `backdrop-filter` element — so this is now a plain flex-wrap div with no
 * shared root at all.
 */
export default function GlassPillRow({
  items,
  gap = 10,
  style,
  className,
}: {
  items: GlassPillItem[];
  gap?: number;
  style?: CSSProperties;
  /** For the row's own container div — e.g. a page's own CSS Module class
   * carrying a mobile media query, which `style` (a plain inline object)
   * can't express. Distinct from `GlassPillItem.className` above, which
   * targets each individual pill instead. */
  className?: string;
}) {
  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap, ...style }}>
      {items.map((item) => {
        // Dynamic per-item tag ('a' when linking out, 'span' otherwise) —
        // cast rather than a generic type param since the tag is decided
        // per array entry, not per call site.
        const Tag = (item.href ? 'a' : 'span') as unknown as 'a';
        return (
          <Tag
            key={item.key}
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
    </div>
  );
}
