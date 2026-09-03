import { useLayoutEffect, useRef } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import PageShell from '../components/layout/PageShell';
import AvatarHero from '../components/hero/AvatarHero';
import ButterflyCursor from '../components/cursor/ButterflyCursor';
import LiquidGlassRoot from '../components/glass/LiquidGlassRoot';
import { frostedGlass } from '../components/glass/glassPresets';
import LogoBadges from '../components/hero/LogoBadges';
import styles from '../components/hero/IdentityCard.module.css';
import { withBase } from '../lib/assetPath';

// Module-level (stable reference) so LiquidGlassRoot's effect doesn't tear
// down and reinitialize its WebGL context on every Home render. cornerRadius
// is per-surface (must match this card's own CSS border-radius) so it's
// layered on top of the shared preset here rather than living in it.
// Uses frostedGlass rather than the shared regularGlass preset — About's and
// Projects' cards stay on regularGlass.
const identityGlassDefaults: Partial<GlassConfig> = { ...frostedGlass, cornerRadius: 32 };

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // LogoBadges centers itself horizontally under this card via the
  // `--card-center-right` custom property it reads (distance from the
  // viewport's right edge to the card's own horizontal center) — see the
  // comment on `right` in LogoBadges.tsx. That distance stays constant
  // across viewport widths (the card is anchored by a fixed `right: 64px`
  // in IdentityCard.module.css, so widening the viewport shifts the card
  // and this measurement together) but depends on the card's rendered
  // width, which comes from its own font metrics rather than anything
  // worth hand-computing — so it's measured directly and republished
  // whenever the card's box actually changes size (e.g. on font load).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const update = () => {
      const rect = card.getBoundingClientRect();
      section.style.setProperty('--card-center-right', `${window.innerWidth - rect.left - rect.width / 2}px`);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <PageShell noScroll>
      <section
        ref={sectionRef}
        style={{ position: 'relative', zIndex: 1, height: '100vh', boxSizing: 'border-box' }}
      >
        {/* Rendered before AvatarHero (and with no z-index of its own, so it
            doesn't create a stacking context that would carry its contents
            above the avatar as one elevated block) — this root's backdrop
            <img> needs to sit *behind* the avatar, and plain DOM/paint order
            among unstacked (z-index: auto) siblings is what puts it there.
            Root deliberately excludes AvatarHero itself as glass backdrop
            content, though — the avatar sits close enough behind the card's
            usual position that including it made the shader refract a
            warped chunk of the avatar's face/shoulder, worse as it animated.
            It instead gets its own copy of the same photo BackgroundBlobs
            renders as the real page background, so there's real content for
            the shader to bend. That backdrop image must be a plain
            `position: absolute; inset: 0` *inside* this untransformed root,
            not `position: fixed` inside .wrap — .wrap's own
            `transform: translateY(-50%)` (applied to the card below, not
            this root) would make it the containing block for any fixed
            descendant per spec, sizing/positioning the image relative to the
            tiny card box instead of the viewport. */}
        <LiquidGlassRoot
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          defaults={identityGlassDefaults}
        >
          <img
            src={withBase('/images/bg.jpg')}
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            ref={cardRef}
            className={styles.wrap}
            data-glass
            style={{
              borderRadius: 32,
              padding: '40px 56px',
              pointerEvents: 'auto',
              // No CSS backdrop-filter fallback here on purpose — that's a
              // different look from the shader, not a rougher version of it,
              // so showing it would mean a visible style-swap the moment the
              // shader takes over. LiquidGlassRoot keeps this hidden
              // (opacity 0) until init settles either way, then reveals it.
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 'var(--text-3xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                fontWeight: 800,
                color: 'var(--color-heading)',
                textShadow: 'var(--glass-text-shadow)',
                whiteSpace: 'nowrap',
              }}
            >
              Pivak E Safa
            </h1>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-normal)',
                fontWeight: 600,
                color: 'var(--color-subtle)',
                textShadow: 'var(--glass-text-shadow)',
              }}
            >
              Full Stack Developer
            </p>
          </div>
        </LiquidGlassRoot>
        <AvatarHero />
        <LogoBadges />
      </section>
      <ButterflyCursor />
    </PageShell>
  );
}
