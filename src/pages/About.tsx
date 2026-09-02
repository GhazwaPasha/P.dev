import type { CSSProperties, ReactNode } from 'react';
import type { GlassConfig } from '@ybouane/liquidglass';
import PageShell from '../components/layout/PageShell';
import LiquidGlassSurface from '../components/glass/LiquidGlassSurface';
import { regularGlass } from '../components/glass/glassPresets';
import pillStyles from './About.module.css';
import {
  profile,
  summary,
  skills,
  experience,
  education,
  certifications,
  awards,
  languages,
} from '../content/about';

const pillTag: CSSProperties = {
  padding: '10px 18px',
  borderRadius: 999,
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--color-label)',
  background: 'var(--glass-pill-bg)',
  border: '1px solid var(--glass-pill-border)',
};

// cornerRadius 32 matches GlassCard's own default radius, which every card
// on this page used to render at (none passed a `radius` override). Doubles
// as this page's CSS border-radius too — see LiquidGlassSurface.
const aboutGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = { ...regularGlass, cornerRadius: 32 };

/**
 * One card = one LiquidGlassSurface, matching Home's identity-card shape.
 * `style` (when passed) lands on the *root*, not the card itself — used by
 * the Education/Awards pair below to size themselves via flex without
 * affecting the card's own fixed 40px padding.
 */
function GlassPanel({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <LiquidGlassSurface defaults={aboutGlassDefaults} rootStyle={style} style={{ padding: 40 }}>
      {children}
    </LiquidGlassSurface>
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
                }}
              >
                {summary}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                <a href={profile.linkedin} className={pillStyles.pillLink}>
                  LinkedIn
                </a>
                <a href={`mailto:${profile.email}`} className={pillStyles.pillLink}>
                  Email
                </a>
                <span style={pillTag}>{profile.location}</span>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h2 style={{
              margin: '0 0 20px',
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-snug)',
              fontWeight: 700,
              color: 'var(--color-heading)',
            }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {skills.map((skill) => (
              <span key={skill} style={pillTag}>
                {skill}
              </span>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <h2 style={{
              margin: '0 0 20px',
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-snug)',
              fontWeight: 700,
              color: 'var(--color-heading)',
            }}>
            Experience
          </h2>
          {experience.map((entry) => (
            <div key={entry.company}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'var(--text-lg)',
                      lineHeight: 'var(--leading-snug)',
                      fontWeight: 700,
                      color: 'var(--color-heading)',
                    }}
                  >
                    {entry.title} · {entry.company}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-subtle)' }}>
                    {entry.location}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-subtle)' }}>
                  {entry.period}
                </p>
              </div>
              <ul style={{ margin: '14px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entry.bullets.map((b) => (
                  <li
                    key={b}
                    style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-body)' }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </GlassPanel>

        {/* Education/Awards stay visually side by side — plain (non-glass)
            flex row wrapper, each card its own root sized via flex. */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <GlassPanel style={{ flex: '1 1 260px' }}>
            <h2 style={{
              margin: '0 0 16px',
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-snug)',
              fontWeight: 700,
              color: 'var(--color-heading)',
            }}>
              Education
            </h2>
            {education.map((e) => (
              <div key={e.school}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-lg)',
                    lineHeight: 'var(--leading-snug)',
                    fontWeight: 700,
                    color: 'var(--color-heading)',
                  }}
                >
                  {e.degree}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-subtle)' }}>
                  {e.school} · {e.location}
                </p>
                <p style={{ margin: '2px 0 10px', fontSize: 'var(--text-sm)', color: 'var(--color-subtle)' }}>
                  {e.period}
                </p>
                {e.notes.map((n) => (
                  <p
                    key={n}
                    style={{ margin: '0 0 4px', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-body)' }}
                  >
                    {n}
                  </p>
                ))}
              </div>
            ))}

            <h2
              style={{
                margin: '24px 0 12px',
                fontSize: 'var(--text-xl)',
                lineHeight: 'var(--leading-snug)',
                fontWeight: 700,
                color: 'var(--color-heading)',
              }}
            >
              Certifications
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {certifications.map((c) => (
                <li key={c.name} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
                  {c.name} — <span style={{ color: 'var(--color-subtle)' }}>{c.issuer}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>

          <GlassPanel style={{ flex: '1 1 260px' }}>
            <h2 style={{
              margin: '0 0 16px',
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-snug)',
              fontWeight: 700,
              color: 'var(--color-heading)',
            }}>
              Awards
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {awards.map((a) => (
                <div key={a.title}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'var(--text-lg)',
                      lineHeight: 'var(--leading-snug)',
                      fontWeight: 700,
                      color: 'var(--color-heading)',
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-body)' }}
                  >
                    {a.description}
                  </p>
                </div>
              ))}
            </div>

            <h2
              style={{
                margin: '24px 0 12px',
                fontSize: 'var(--text-xl)',
                lineHeight: 'var(--leading-snug)',
                fontWeight: 700,
                color: 'var(--color-heading)',
              }}
            >
              Languages
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {languages.map((l) => (
                <span key={l.name} style={pillTag}>
                  {l.name} · {l.level}
                </span>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>
    </PageShell>
  );
}
