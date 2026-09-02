# Polish Plan — Liquid Glass Portfolio

Diagnosis and plan from the initial polish pass, updated with what's since shipped.
Scope: [Home](src/pages/Home.tsx), [About](src/pages/About.tsx), [Projects](src/pages/Projects.tsx) and the shared [glass](src/components/glass)/[layout](src/components/layout)/[hero](src/components/hero) components.

## Original diagnosis

| Symptom | Root cause | Where |
|---|---|---|
| Nav icons/cards feel dead | Zero `transition` properties in any `.css` file | `NavPill.module.css`, `GlassCard.module.css` |
| Glass looks like frosted plastic, not glass | Just `background + blur + border + shadow` — no specular edge, no light-catching gradient, no refraction | `GlassCard.module.css` |
| Active nav state "just changes color" | `isActive ? styles.active : ''` swaps a `color` with no easing, no moving indicator | `NavPill.tsx` |
| Background blobs feel static/wallpaper-like | Plain absolutely-positioned divs, no motion | `BackgroundBlobs.tsx` |
| Butterfly cursor feels stiff | Pointer position applied via direct `translate`, no lerp/spring | `ButterflyCursor.tsx` |
| Route changes are an instant hard cut | `Routes`/`Route` with no transition wrapper | `App.tsx` |
| Cards/content "just appear" on load | No mount animation on `GlassCard` or page sections | `About.tsx`, `Projects.tsx` |
| Keyboard users get no visible focus | No `:focus-visible` rule anywhere | global |
| Avatar hero pops in abruptly once loaded | Hard swap from empty div to canvas | `AvatarHero.tsx` |

## Phased plan

**Phase 1 — Make the glass actually look like glass**
Top-edge specular highlight, asymmetric inset light border, `contrast()` bump in the blur stack, mouse-tracked specular glare on `GlassCard`.
*Status: shipped.* All four land in [tokens.css](src/styles/tokens.css) (`--glass-inset-light[-strong]`, `--glass-specular-top`, `--glass-glare`, `contrast()` added to `--glass-blur[-strong]`) and [GlassCard.module.css](src/components/glass/GlassCard.module.css)/[GlassCard.tsx](src/components/glass/GlassCard.tsx). The glare tracks the pointer via a ref + `style.setProperty` (no re-render per move, matching the codebase's existing pattern), gated behind `:hover`/`:focus-within` so it's keyboard-reachable too, with a `prefers-reduced-motion` guard on its own transition. Verified in the Browser preview across Home (identity card + round logo badges), About (headshot/skills/experience/education/awards cards), and Projects (image-tile cards) — no clipping from the new `overflow: hidden`, no console errors, `tsc --noEmit` clean.

**Phase 2 — Interactivity states**
Nav hover/active sliding indicator + focus ring; `GlassCard` hover lift on clickable cards; pill-tag hover/press feedback; global `prefers-reduced-motion` guard.
*Status: shipped.* [NavPill.tsx](src/components/layout/NavPill.tsx) now computes the active index from `useLocation` and slides a circular indicator (`translateX`, spring easing) behind it in [NavPill.module.css](src/components/layout/NavPill.module.css), plus icon hover (color + soft background) and a `:focus-visible` ring. `GlassCard` gained an `interactive` prop (hover lift + deepened shadow via the new `--glass-shadow-hover[-strong]` tokens) in [GlassCard.tsx](src/components/glass/GlassCard.tsx)/[GlassCard.module.css](src/components/glass/GlassCard.module.css) — wired onto the Projects cards, which are now themselves clickable links out to each project (previously only the small `lexcheck.com`/`cohere.live` text was a link) with a matching focus ring in the new [Projects.module.css](src/pages/Projects.module.css). The About page's LinkedIn/Email pills got real hover/press/focus feedback via the new [About.module.css](src/pages/About.module.css) `.pillLink` (the non-interactive tag pills — Skills, location, languages — were deliberately left plain, since they aren't clickable). The per-component `prefers-reduced-motion` blocks in `GlassCard` and `LogoBadges` were removed in favor of one global guard in [global.css](src/styles/global.css). Verified in the Browser preview: indicator slides correctly across all 3 routes, LinkedIn pill shows its hover state, and a hovered Projects card was confirmed via computed styles to have `transform: translateY(-4px)` and the deeper shadow while its sibling card doesn't; `tsc --noEmit` clean throughout.

**Phase 3 — Motion that sells "liquid"**
Blob drift keyframes, lerped butterfly-cursor follow with velocity-based rotation, cross-fade page transitions, staggered card entrance, cross-fade avatar load-in.
*Status: not started (butterfly cursor's follow logic is unchanged; only its pointer-events bug was fixed — see below).*

**Phase 4 — Accessibility & correctness pass**
`:focus-visible` everywhere, contrast audit of translucent text after Phase 1 lands, confirm `aria-current` on active nav link.
*Status: not started, except the arc/badge feature below is keyboard-reachable via `:focus-within`.*

## Shipped since this plan was written

Work actually done diverged from the phased plan above — it was driven by follow-up requests rather than executed in order:

1. **Identity card** — added a `GlassCard` on the right of the Home hero: "Pivak-e-Safa" / "Full Stack Dev", plus a Web / iOS / Android / PC bullet list. [Home.tsx](src/pages/Home.tsx), [IdentityCard.module.css](src/components/hero/IdentityCard.module.css).
2. **Logo badges** — two round glass badges (LexCheck, Cohere) on the left of the hero, linking out to each site. Real logos supplied by the user, cropped down to icon-only marks for the round format. [LogoBadges.tsx](src/components/hero/LogoBadges.tsx), assets in `public/logos/`.
3. **Staggered badge layout** — badges offset horizontally (not vertically aligned) and moved closer to the avatar per feedback.
4. **Tech-stack reveal** — hovering (or focusing) a badge fans out small glass circles in an arc above it, showing that project's stack (`Angular`/`.NET Core`/`SQL`/`Node.js` for LexCheck; `React`/`React Native`/`.NET`/`MongoDB` for Cohere), sourced live from [content/projects.ts](src/content/projects.ts) so it can't drift out of sync. Tuned twice for spacing/overlap and to display "MongoDB" as two lines.
5. **Bug fix (found while building the arc): butterfly cursor was eating all hover/click on Home.** React-three-fiber sets `pointer-events: auto` inline on its canvas wrapper by default, which combined with the cursor's `z-index: 9999` and 1:1 pointer tracking meant it silently sat on top of every element under the real mouse — nav icons, links, badges, all of it — and blocked their `:hover`/click. Fixed by forcing `pointerEvents: 'none'` on the `Canvas` in [ButterflyCursor.tsx](src/components/cursor/ButterflyCursor.tsx). This was blocking Phase 2 entirely and wasn't visible without inspecting `document.querySelectorAll(':hover')` directly — worth keeping in mind if any *other* future hover/click feature on Home mysteriously doesn't fire.

## Recommended next step

Phases 1 and 2 are both done (see above). Phase 3 (blob drift keyframes, lerped butterfly-cursor follow, cross-fade page transitions, staggered card entrance, cross-fade avatar load-in) is next — it's the one phase that actually earns the "liquid" name, and it's the largest remaining chunk of untouched work.
