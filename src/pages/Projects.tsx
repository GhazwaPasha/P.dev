import type { GlassConfig } from '@ybouane/liquidglass';
import PageShell from '../components/layout/PageShell';
import LiquidGlassSurface from '../components/glass/LiquidGlassSurface';
import LiquidGlassPillRow from '../components/glass/LiquidGlassPillRow';
import { frostedGlass } from '../components/glass/glassPresets';
import { projects } from '../content/projects';
import styles from './Projects.module.css';

// cornerRadius 32 matches GlassCard's own default radius, which every card
// here used to render at. Doubles as this page's CSS border-radius too —
// see LiquidGlassSurface.
const projectsGlassDefaults: Partial<GlassConfig> & { cornerRadius: number } = { ...frostedGlass, cornerRadius: 32 };

export default function Projects() {
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
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--text-3xl)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            fontWeight: 800,
            color: 'var(--color-heading)',
            textShadow: 'var(--glass-text-shadow)',
          }}
        >
          Projects
        </h1>

        {/* Same shape as Home's identity card, one LiquidGlassSurface per
            project — see LiquidGlassSurface for why its backdrop photo is
            `visibility: hidden` (needed here, and not on Home, because this
            page stacks more than one of these surfaces down the page). */}
        {projects.map((p) => (
          <LiquidGlassSurface
            key={p.slotId}
            as="a"
            defaults={projectsGlassDefaults}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.name} — visit ${p.urlLabel}`}
            className={styles.cardLink}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              gap: 32,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              padding: 40,
            }}
          >
            <div
              aria-label={p.imageLabel}
              style={{
                width: 220,
                height: 160,
                flexShrink: 0,
                borderRadius: 20,
                background: 'linear-gradient(135deg, var(--color-blob-cyan), var(--color-blob-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-snug)',
                fontWeight: 700,
                textAlign: 'center',
                padding: 12,
              }}
            >
              {p.name}
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-xl)',
                    lineHeight: 'var(--leading-snug)',
                    fontWeight: 700,
                    color: 'var(--color-heading)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {p.name}
                </h2>
                {/* Secondary/indigo accent: this label is the external destination the whole
                    card links out to, same "leaves the site" rule as About's contact pills.
                    --color-accent-secondary-onglass (not the plain --color-accent-secondary
                    About's pills use) — this span sits directly on the naked glass panel, not
                    on a guaranteed-light pill backing, so it needs the same light-text-plus-
                    shadow treatment as --color-heading/--color-body above. */}
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--color-accent-secondary-onglass)',
                    textShadow: 'var(--glass-text-shadow)',
                  }}
                >
                  {p.urlLabel}
                </span>
              </div>
              <p
                style={{
                  margin: '10px 0 16px',
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-body)',
                  textShadow: 'var(--glass-text-shadow)',
                }}
              >
                {p.description}
              </p>
              <LiquidGlassPillRow gap={8} items={p.stack.map((tech) => ({ key: tech }))} />
            </div>
          </LiquidGlassSurface>
        ))}
      </section>
    </PageShell>
  );
}
