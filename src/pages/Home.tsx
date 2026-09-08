import { useLayoutEffect, useRef } from 'react';
import PageShell from '../components/layout/PageShell';
import AvatarHero from '../components/hero/AvatarHero';
import LogoBadges from '../components/hero/LogoBadges';
import CapabilitiesCard from '../components/hero/CapabilitiesCard';
import glass from '../components/glass/Glass.module.css';
import styles from '../components/hero/IdentityCard.module.css';

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
        {/* Plain CSS "fake glass" (see components/glass/Glass.module.css)
            — needs no backdrop <img> copy or DOM-ordering tricks to feed it
            content: backdrop-filter samples whatever's actually composited
            behind the element at paint time, avatar included. Its DOM
            position relative to AvatarHero doesn't matter for stacking
            either — .wrap's explicit z-index: 1 always paints it above
            AvatarHero's un-indexed (z-index: auto) box regardless of tree
            order. The highlight/glow layer is pure CSS (.glass::after) — no
            extra DOM node needed for it. */}
        <div ref={cardRef} className={styles.wrap}>
          <div className={glass.glass} style={{ borderRadius: 32 }}>
            <div className={styles.content}>
              <h1
                className={styles.name}
                style={{
                  margin: 0,
                  lineHeight: 'var(--leading-tight)',
                  letterSpacing: 'var(--tracking-tight)',
                  fontWeight: 800,
                  color: 'var(--color-heading)',
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
                }}
              >
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>
        <AvatarHero />
        <LogoBadges />
        <CapabilitiesCard />
      </section>
    </PageShell>
  );
}
