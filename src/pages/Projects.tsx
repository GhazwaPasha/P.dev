import PageShell from '../components/layout/PageShell';
import glass from '../components/glass/Glass.module.css';
import GlassPillRow from '../components/glass/GlassPillRow';
import { projects } from '../content/projects';
import { withBase } from '../lib/assetPath';
import styles from './Projects.module.css';

// Matches every card's own default radius on this page.
const CARD_RADIUS = 32;

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

        {/* Same shape as Home's identity card, one glass surface per project. */}
        {projects.map((p) => (
          <a
            key={p.slotId}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.name} — visit ${p.urlLabel}`}
            className={`${glass.glass} ${styles.cardLink}`}
            style={{
              borderRadius: CARD_RADIUS,
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
                padding: 8,
              }}
            >
              <img
                src={withBase(p.logo)}
                alt={p.imageLabel}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement?.insertAdjacentText('beforeend', p.name);
                }}
              />
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
              <GlassPillRow gap={8} items={p.stack.map((tech) => ({ key: tech }))} />
            </div>
          </a>
        ))}
      </section>
    </PageShell>
  );
}
