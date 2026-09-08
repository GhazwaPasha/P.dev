import GlassPillRow from '../glass/GlassPillRow';
import { pillars } from '../../content/about';
import { TECH_ICONS, TECH_BRAND_COLORS } from '../../content/techIcons';
import styles from './CapabilitiesCard.module.css';

// A little bigger than GlassPill's usual 18px on-glass icon size — this grid
// is the one place icons carry their own brand color instead of the shared
// on-glass white, so they read better with a bit more room.
const ICON_SIZE = 24;

// Every tag across all four About "What I do" pillars, flattened and
// deduped — sourced from the same content the About page itself reads, so
// this card's chip row can't silently drift out of sync with it. Further
// deduped by *icon*, not just tag name: React Native has no brand mark of
// its own (see techIcons.tsx), so it points at the same SiReact icon as
// plain React — rendering both as tags used to be fine (the text told them
// apart), but with the chips now icon-only that reads as one logo shown
// twice. Keeps whichever of a pair comes first.
const seenIcons = new Set<(typeof TECH_ICONS)[string]>();
const skillTags = Array.from(new Set(pillars.flatMap((pillar) => pillar.tags))).filter((tag) => {
  const icon = TECH_ICONS[tag];
  if (!icon) return true;
  if (seenIcons.has(icon)) return false;
  seenIcons.add(icon);
  return true;
});

/**
 * Tech-stack chips on the left of the Home hero, mirroring the identity
 * card's placement on the right (Home.tsx / IdentityCard.module.css) — same
 * vertical centering, same 64px inset from the viewport edge. No backing
 * card behind them (there used to be one — a single big glass panel wrapping
 * the whole row) — each chip is already its own glass circle via the shared
 * GlassPillRow/.pill, so the wrapping panel was just a second, redundant
 * glass surface stacked behind ones that already read as glass on their own.
 */
export default function CapabilitiesCard() {
  return (
    <div className={styles.wrap}>
      {/* Grid, not the row's default flex-wrap — flex-wrap fits as many
          circles as the row's own width allows per line (6, then 6, then
          6, then a stray 2 for these 20 icons), which reads as an
          arbitrary wrap rather than a shape. A fixed 5-column grid makes it
          a deliberate 5x4 block instead. */}
      <GlassPillRow
        gap={10}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', justifyItems: 'center' }}
        items={skillTags.map((tag) => {
          const Icon = TECH_ICONS[tag];
          const color = TECH_BRAND_COLORS[tag];
          return {
            key: tag,
            ariaLabel: tag,
            className: styles.iconPill,
            content: Icon ? <Icon size={ICON_SIZE} aria-hidden="true" style={color ? { color } : undefined} /> : tag,
          };
        })}
      />
    </div>
  );
}
