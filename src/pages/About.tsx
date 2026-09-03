import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { GlassConfig } from '@ybouane/liquidglass';
import PageShell from '../components/layout/PageShell';
import LiquidGlassRoot from '../components/glass/LiquidGlassRoot';
import GlassBackdropVideo from '../components/glass/GlassBackdropVideo';
import LiquidGlassPillRow from '../components/glass/LiquidGlassPillRow';
import { frostedGlass } from '../components/glass/glassPresets';
import pillStyles from './About.module.css';
import { profile, intro, pillars, story, highlights, languages } from '../content/about';

// cornerRadius 32 matches GlassCard's own default radius, which every card
// on this page used to render at (none passed a `radius` override). Doubles
// as this page's CSS border-radius too — see the `data-glass` divs below.
const aboutGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = { ...frostedGlass, cornerRadius: 32 };

/**
 * The 4 sections below used to each be their own LiquidGlassSurface — 4
 * separate WebGL contexts, each with its own always-live video backdrop
 * (a <video> counts as perpetually "dirty" to the shader, so none of those
 * 4 contexts ever went idle). That's the same "one context per element"
 * pattern NavPill/LogoBadges/LiquidGlassPillRow already moved away from —
 * one shared root, many `[data-glass]` siblings — applied here for the
 * same reason: fewer contexts competing for the browser's concurrent-WebGL
 * budget, which is what was making whichever card finished its one-time
 * render earliest (this page's first section) the most likely one caught
 * mid context-loss/recovery when you happened to look at it.
 */
function GlassPanel({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      data-glass
      style={{ borderRadius: aboutGlassDefaults.cornerRadius, padding: 40, pointerEvents: 'auto', ...style }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: '0 0 20px',
        fontSize: 'var(--text-xl)',
        lineHeight: 'var(--leading-snug)',
        fontWeight: 700,
        color: 'var(--color-heading)',
        textShadow: 'var(--glass-text-shadow)',
      }}
    >
      {children}
    </h2>
  );
}

export default function About() {
  return (
    <PageShell>
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 920,
          margin: '0 auto',
          padding: '140px 24px 100px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* One shared LiquidGlassRoot for all 4 sections below — see
            GlassPanel's doc comment. `pointerEvents: 'none'` on the root
            itself (each GlassPanel sets its own `pointerEvents: 'auto'`
            back on), same split NavPill/LogoBadges/LiquidGlassSurface
            already use: the injected shader canvas shouldn't intercept
            clicks outside a card's own box, only the visible card should. */}
        <LiquidGlassRoot
          defaults={aboutGlassDefaults}
          style={{ display: 'flex', flexDirection: 'column', gap: 28, pointerEvents: 'none' }}
        >
          <GlassBackdropVideo />
          {/* Intro — who I am, in my own words, not a resume objective line. */}
          <GlassPanel>
          <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              aria-label="portrait photo placeholder"
              style={{
                width: 160,
                height: 160,
                flexShrink: 0,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--color-blob-blue), var(--color-blob-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
                fontWeight: 800,
                color: '#fff',
              }}
            >
              PS
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1
                style={{
                  margin: '0 0 8px',
                  fontSize: 'var(--text-3xl)',
                  lineHeight: 'var(--leading-tight)',
                  letterSpacing: 'var(--tracking-tight)',
                  fontWeight: 800,
                  color: 'var(--color-heading)',
                  textShadow: 'var(--glass-text-shadow)',
                }}
              >
                {profile.name}
              </h1>
              <p
                style={{
                  margin: '0 0 14px',
                  fontSize: 'var(--text-md)',
                  lineHeight: 'var(--leading-normal)',
                  fontWeight: 600,
                  color: 'var(--color-subtle)',
                  textShadow: 'var(--glass-text-shadow)',
                }}
              >
                {profile.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--text-md)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-body)',
                  textShadow: 'var(--glass-text-shadow)',
                }}
              >
                {intro}
              </p>
              <LiquidGlassPillRow
                rootStyle={{ marginTop: 20 }}
                items={[
                  { key: 'linkedin', content: 'LinkedIn', href: profile.linkedin, className: pillStyles.pillLink },
                  {
                    key: 'email',
                    content: 'Email',
                    href: `mailto:${profile.email}`,
                    className: pillStyles.pillLink,
                  },
                  { key: 'location', content: profile.location },
                ]}
              />
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-subtle)',
                  textShadow: 'var(--glass-text-shadow)',
                }}
              >
                {languages.join(' · ')}
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* What I do — capability pillars, not a 30+ item skill tag wall.
            Every pillar used to render its own LiquidGlassPillRow (its own
            WebGL context + its own async init) — 4 contexts just for this
            section, more than every other section on the page combined,
            which is why this was the section still fading in after
            everything else had settled. All pillars' tags now share the one
            row below, the same "one shared context per row" pattern the
            intro section's contact pills already use. */}
        <GlassPanel>
          <SectionHeading>What I do</SectionHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {pillars.map((pillar) => (
              <div key={pillar.title} style={{ flex: '1 1 340px', minWidth: 260 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-lg)',
                    lineHeight: 'var(--leading-snug)',
                    fontWeight: 700,
                    color: 'var(--color-heading)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: 'var(--text-base)',
                    lineHeight: 'var(--leading-relaxed)',
                    color: 'var(--color-body)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
          <LiquidGlassPillRow
            rootStyle={{ marginTop: 20 }}
            gap={8}
            items={pillars.flatMap((pillar) => pillar.tags).map((tag) => ({ key: tag }))}
          />
        </GlassPanel>

        {/* The highlight — one story told in full, not a bullet dump of every
            responsibility across the role. */}
        <GlassPanel>
          <SectionHeading>The highlight</SectionHeading>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-snug)',
                fontWeight: 700,
                color: 'var(--color-heading)',
                textShadow: 'var(--glass-text-shadow)',
              }}
            >
              {story.role} · {story.company}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-subtle)',
                textShadow: 'var(--glass-text-shadow)',
              }}
            >
              {story.period}
            </p>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-subtle)', textShadow: 'var(--glass-text-shadow)' }}>
            {story.location}
          </p>
          <p
            style={{
              margin: '16px 0 20px',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-body)',
              textShadow: 'var(--glass-text-shadow)',
            }}
          >
            {story.body}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, marginBottom: 20 }}>
            {story.stats.map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: 'var(--text-2xl)',
                    lineHeight: 'var(--leading-tight)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-heading)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-subtle)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/projects"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textShadow: 'var(--glass-text-shadow)',
            }}
          >
            See what shipped from it on the Projects page →
          </Link>
        </GlassPanel>

        {/* A few highlights — the strongest handful of facts, not the full
            education/awards/certification record. */}
        <GlassPanel>
          <SectionHeading>A few highlights</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {highlights.map((h) => (
              <div key={h.title}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-lg)',
                    lineHeight: 'var(--leading-snug)',
                    fontWeight: 700,
                    color: 'var(--color-heading)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {h.title}
                </h3>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 'var(--text-base)',
                    lineHeight: 'var(--leading-relaxed)',
                    color: 'var(--color-body)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
        </LiquidGlassRoot>
      </section>
    </PageShell>
  );
}
