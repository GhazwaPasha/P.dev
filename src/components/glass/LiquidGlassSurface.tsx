import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import LiquidGlassRoot from './LiquidGlassRoot';
import GlassBackdrop from './GlassBackdrop';

interface OwnProps<T extends ElementType> {
  /** Tag for the actual glass surface — 'div' for cards, 'nav'/'a' for interactive ones. */
  as?: T;
  children?: ReactNode;
  /**
   * Full GlassConfig for this surface, `cornerRadius` included — pass a
   * stable (module-level) reference, same requirement LiquidGlassRoot's
   * `defaults` already has, so its WebGL context isn't torn down and
   * rebuilt every render. `cornerRadius` doubles as the surface's own CSS
   * border-radius (see below) so there's exactly one number to keep in
   * sync with the shader instead of two.
   */
  defaults: Partial<GlassConfig> & { cornerRadius: number };
  /** Style for the LiquidGlassRoot itself — only Home's identity card needs
   * to override this (`position: absolute; inset: 0`, to fill its hero
   * section); every other surface is fine sitting in normal flow. */
  rootStyle?: CSSProperties;
}

export type LiquidGlassSurfaceProps<T extends ElementType> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T> | 'as' | 'children'>;

/**
 * One real (WebGL-refraction) glass surface: a LiquidGlassRoot carrying
 * exactly the two children the library expects — a hidden backdrop photo
 * for the shader to sample, and the actual `[data-glass]` surface — with
 * `cornerRadius` shared between the shader config and the CSS border-radius
 * instead of duplicated at each call site.
 *
 * See GlassBackdrop for why the backdrop is `opacity: 0` + `position: fixed`.
 */
export default function LiquidGlassSurface<T extends ElementType = 'div'>({
  as,
  defaults,
  rootStyle,
  children,
  style,
  ...rest
}: LiquidGlassSurfaceProps<T>) {
  const Tag = (as || 'div') as ElementType;

  return (
    <LiquidGlassRoot style={{ position: 'relative', pointerEvents: 'none', ...rootStyle }} defaults={defaults}>
      <GlassBackdrop />
      <Tag
        data-glass
        style={{ borderRadius: defaults.cornerRadius, pointerEvents: 'auto', ...(style as CSSProperties) }}
        {...rest}
      >
        {children}
      </Tag>
    </LiquidGlassRoot>
  );
}
