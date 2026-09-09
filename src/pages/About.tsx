import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import glass from '../components/glass/Glass.module.css';
import GlassPillRow from '../components/glass/GlassPillRow';
import pillStyles from './About.module.css';
import { profile, intro, pillars, story, highlights } from '../content/about';
import { TECH_ICONS } from '../content/techIcons';
import { withBase } from '../lib/assetPath';

// 32 matches every card on this page — none pass a `radius` override.
const CARD_RADIUS = 32;

function GlassPanel({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={glass.glass} style={{ borderRadius: CARD_RADIUS, padding: 40, ...style }}>
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
        {/* Intro — who I am, in my own words, not a resume objective line. */}
        <GlassPanel>
          <div className={pillStyles.introRow}>
            <div
              style={{
                width: 160,
                height: 160,
                flexShrink: 0,
                borderRadius: '50%',
                overflow: 'hidden',
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
              <img
                src={withBase('/images/profile.jpg')}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement?.insertAdjacentHTML('beforeend', 'PS');
                }}
              />
            </div>
            <div className={pillStyles.introBody}>
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
              <GlassPillRow
                style={{ marginTop: 20 }}
                className={pillStyles.introPills}
                items={[
                  { key: 'linkedin', content: 'LinkedIn', href: profile.linkedin, className: pillStyles.pillLink },
                  {
                    key: 'email',
                    content: 'Email',
                    href: `mailto:${profile.email}`,
                    className: pillStyles.pillLink,
                  },
                ]}
              />
            </div>
          </div>
        </GlassPanel>

        {/* What I do — capability pillars, not a 30+ item skill tag wall.
            All pillars' tags share the one row below rather than each
            pillar rendering its own. */}
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
          <GlassPillRow
            style={{ marginTop: 20 }}
            gap={8}
            items={pillars.flatMap((pillar) => pillar.tags).map((tag) => {
              const Icon = TECH_ICONS[tag];
              return {
                key: tag,
                content: (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    {Icon && <Icon size={15} aria-hidden="true" />}
                    {tag}
                  </span>
                ),
              };
            })}
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
      </section>
    </PageShell>
  );
}
