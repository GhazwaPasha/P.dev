import type { GlassConfig } from '@ybouane/liquidglass';

/**
 * Shared LiquidGlass defaults for every real-refraction surface on the site
 * (Home's identity card, About's and Projects' cards) — one tuned "regular
 * glass" look reused everywhere real glass is used, rather than each page
 * re-deriving its own numbers. cornerRadius is deliberately NOT included
 * here: it has to match each surface's own CSS border-radius, so callers
 * pass it themselves via LiquidGlassRoot's `defaults` merge.
 */
export const regularGlass: Partial<GlassConfig> = {
  blurAmount: 0.22,
  refraction: 0.75,
  chromAberration: 0.06,
  edgeHighlight: 0.1,
  // Was 0.28 — the shader's Blinn-Phong specular (shaders.ts FS_GLASS,
  // `totalSpec`) sums four lights at once (sp1/sp2/spB/sp4) and adds the
  // result straight into color with no clamping. On a bevel this shallow
  // (zRadius 12–40 against panels much bigger than that), the surface
  // normal barely varies across a wide area, so the "highlight zone" isn't
  // a crisp pinpoint sparkle — it's a broad, flat-out-white patch: a pale
  // blob parked over the pill's rounded end / the nav's active-item
  // indicator, or a diagonal glare band smeared across the identity card.
  // Confirmed live by zeroing each term independently: fresnel alone
  // wasn't it (blob persisted with fresnel:0, specular at 0.28) and
  // specular alone was (blob gone with specular:0, fresnel untouched).
  // 0.08 is the highest value that stayed clean in that same test —
  // 0.15 already brought a faint version of the smear back — so this
  // keeps a real specular sparkle without it blowing out into a blob.
  specular: 0.08,
  // Was 0.9 (near max) — combined with the shader's fresnel term being
  // direction-agnostic (see the liquidglass patch), that read as a bright
  // ring glowing evenly around every edge, not just the top. Lowered
  // alongside the patch's top/bottom rimBias rather than instead of it —
  // this keeps the whole effect a bit less "hot" everywhere, the patch is
  // what actually makes top vs. bottom asymmetric.
  fresnel: 0.55,
  tintStrength: 0.05,
  shadowOpacity: 0.26,
  shadowSpread: 16,
  shadowOffsetY: 6,
};

/**
 * Frosted variant of the above — heavier blur standing in as the dominant
 * effect, with refraction and chromAberration pulled back to match: a
 * strongly diffused backdrop makes the sharp bend/fringe of real refraction
 * read as noise rather than glass, so both are dialed down instead of left
 * at regularGlass's clearer-pane values. tintStrength is raised a touch for
 * the slightly milky cast frosted glass has over clear. Kept separate from
 * regularGlass (rather than a couple of overrides on it) since nearly every
 * knob differs, not just blurAmount.
 */
export const frostedGlass: Partial<GlassConfig> = {
  blurAmount: 0.75,
  refraction: 0.2,
  chromAberration: 0.0,
  edgeHighlight: 0.1,
  specular: 0.03,
  fresnel: 0.4,
  tintStrength: 0.2,
  shadowOpacity: 0.26,
  shadowSpread: 16,
  shadowOffsetY: 6,
};

/**
 * Dark variant of regularGlass — negative brightness darkens the captured
 * backdrop itself (smoked glass, not just a darker tint over the same
 * light pane), so fresnel and specular are both pulled back to match: a
 * surface that's absorbing light rather than a clear one shouldn't still
 * glint at grazing angles as brightly as regularGlass does. shadowOpacity/
 * spread are raised instead — a dark panel needs a visibly deeper shadow to
 * still read as elevated above this site's own dark background rather than
 * flattening into it.
 */
export const darkGlass: Partial<GlassConfig> = {
  blurAmount: 0.3,
  refraction: 0.6,
  chromAberration: 0.05,
  edgeHighlight: 0.12,
  specular: 0.05,
  fresnel: 0.4,
  tintStrength: 0.05,
  brightness: -0.25,
  shadowOpacity: 0.38,
  shadowSpread: 18,
  shadowOffsetY: 8,
};
