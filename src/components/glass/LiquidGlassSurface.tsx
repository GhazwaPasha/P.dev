import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import LiquidGlassRoot from './LiquidGlassRoot';
import GlassBackdropVideo from './GlassBackdropVideo';

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
  /** Backdrop video src the shader refracts — same file BackgroundBlobs
   * already plays as the real page background, so a surface anywhere on the
   * page refracts the actual live background instead of a static photo. */
  backdropVideoSrc?: string;
  /** Poster frame for the hidden backdrop video. */
  backdropPoster?: string;
}

export type LiquidGlassSurfaceProps<T extends ElementType> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T> | 'as' | 'children'>;

/**
 * One real (WebGL-refraction) glass surface: a LiquidGlassRoot carrying
 * exactly the two children the library expects — a hidden, live backdrop
 * video for the shader to sample, and the actual `[data-glass]` surface —
 * with `cornerRadius` shared between the shader config and the CSS
 * border-radius instead of duplicated at each call site.
 *
 * See GlassBackdropVideo for why the backdrop is `visibility: hidden` +
 * `position: fixed`, and why that's still true (and still needed) now that
 * it's a live video instead of a static photo.
 */
export default function LiquidGlassSurface<T extends ElementType = 'div'>({
  as,
  defaults,
  rootStyle,
  backdropVideoSrc,
  backdropPoster,
  children,
  style,
  ...rest
}: LiquidGlassSurfaceProps<T>) {
  const Tag = (as || 'div') as ElementType;

  return (
    <LiquidGlassRoot style={{ position: 'relative', pointerEvents: 'none', ...rootStyle }} defaults={defaults}>
      <GlassBackdropVideo src={backdropVideoSrc} poster={backdropPoster} />
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
