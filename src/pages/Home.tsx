import { useEffect, useRef } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import PageShell from '../components/layout/PageShell';
import AvatarHero from '../components/hero/AvatarHero';
import ButterflyCursor from '../components/cursor/ButterflyCursor';
import LiquidGlassRoot from '../components/glass/LiquidGlassRoot';
import { frostedGlass } from '../components/glass/glassPresets';
import LogoBadges from '../components/hero/LogoBadges';
import styles from '../components/hero/IdentityCard.module.css';
import { BG_VIDEO_PLAYBACK_RATE } from '../components/layout/bgVideo';
import { withBase } from '../lib/assetPath';

// Module-level (stable reference) so LiquidGlassRoot's effect doesn't tear
// down and reinitialize its WebGL context on every Home render. cornerRadius
// is per-surface (must match this card's own CSS border-radius) so it's
// layered on top of the shared preset here rather than living in it.
// Uses frostedGlass rather than the shared regularGlass preset — About's and
// Projects' cards stay on regularGlass.
const identityGlassDefaults: Partial<GlassConfig> = { ...frostedGlass, cornerRadius: 28 };

export default function Home() {
  const backdropVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = backdropVideoRef.current;
    if (!video) return;
    video.playbackRate = BG_VIDEO_PLAYBACK_RATE;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }, []);

  return (
    <PageShell noScroll cursorNone>
      <section style={{ position: 'relative', zIndex: 1, height: '100vh', boxSizing: 'border-box' }}>
        {/* Rendered before AvatarHero (and with no z-index of its own, so it
            doesn't create a stacking context that would carry its contents
            above the avatar as one elevated block) — this root's backdrop
            <video> needs to sit *behind* the avatar, and plain DOM/paint order
            among unstacked (z-index: auto) siblings is what puts it there.
            Root deliberately excludes AvatarHero itself as glass backdrop
            content, though — the avatar sits close enough behind the card's
            usual position that including it made the shader refract a
            warped chunk of the avatar's face/shoulder, worse as it animated.
            It instead gets its own copy of the same animated background
            BackgroundBlobs renders as the real page background, so there's
            real (and, now, live) content for the shader to bend. That
            backdrop video must be a plain `position: absolute; inset: 0`
            *inside* this untransformed root, not `position: fixed` inside
            .wrap — .wrap's own `transform: translateY(-50%)` (applied to the
            card below, not this root) would make it the containing block for
            any fixed descendant per spec, sizing/positioning the video
            relative to the tiny card box instead of the viewport. */}
        <LiquidGlassRoot
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          defaults={identityGlassDefaults}
        >
          <video
            ref={backdropVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={withBase('/images/bg.jpg')}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={withBase('/videos/bg.mp4')} type="video/mp4" />
          </video>
          <div
            className={styles.wrap}
            data-glass
            style={{
              borderRadius: 28,
              padding: '28px 40px',
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
                fontSize: 'var(--text-2xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                fontWeight: 800,
                color: 'var(--color-heading)',
                textShadow: 'var(--glass-text-shadow)',
                whiteSpace: 'nowrap',
              }}
            >
              Pivak-e-Safa
            </h1>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-normal)',
                fontWeight: 600,
                color: 'var(--color-subtle)',
                textShadow: 'var(--glass-text-shadow)',
              }}
            >
              Full Stack Dev
            </p>
            <ul
              style={{
                margin: '14px 0 0',
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {['Web', 'iOS', 'Android', 'PC'].map((platform) => (
                <li
                  key={platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-normal)',
                    fontWeight: 600,
                    color: 'var(--color-body)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      flexShrink: 0,
                    }}
                  />
                  {platform}
                </li>
              ))}
            </ul>
          </div>
        </LiquidGlassRoot>
        <AvatarHero />
        <LogoBadges />
      </section>
      <ButterflyCursor />
    </PageShell>
  );
}
