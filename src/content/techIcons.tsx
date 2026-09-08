import type { IconType } from 'react-icons';
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiDotnet,
  SiNodedotjs,
  SiGraphql,
  SiMysql,
  SiMongodb,
  SiFigma,
  SiMui,
  SiAntdesign,
  SiGit,
  SiJira,
  SiCursor,
  SiGithubcopilot,
} from 'react-icons/si';
// A handful of techs have no brand mark in Simple Icons — AWS and Azure were
// pulled from that set at the trademark holders' request, C# and generic
// "Accessibility"/"SQL" were never brand logos to begin with. Tabler's brand
// icon set covers the first two; its outline style also reads fine as a
// stand-in for the latter three, which aren't real product logos anyway.
import { TbBrandAws, TbBrandAzure, TbBrandCSharp, TbAccessible, TbDatabase } from 'react-icons/tb';

/**
 * Tech name (as used verbatim in `content/about.ts` tags and
 * `content/projects.ts` stacks) -> its logo/icon component. One shared map
 * so Home's LogoBadges chips and About's "What I do" pills never drift into
 * showing two different marks for the same tech.
 *
 * React Native has no brand mark of its own distinct from React's — both
 * point at SiReact on purpose, rather than mixing in an outline-style icon
 * from a different set just to have *something* different there.
 */
export const TECH_ICONS: Record<string, IconType> = {
  React: SiReact,
  'React Native': SiReact,
  'Next.js': SiNextdotjs,
  Angular: SiAngular,
  TypeScript: SiTypescript,
  '.NET Core': SiDotnet,
  '.NET': SiDotnet,
  'Node.js': SiNodedotjs,
  'C#': TbBrandCSharp,
  GraphQL: SiGraphql,
  MySQL: SiMysql,
  SQL: TbDatabase,
  MongoDB: SiMongodb,
  AWS: TbBrandAws,
  Azure: TbBrandAzure,
  Figma: SiFigma,
  'Material UI': SiMui,
  'Ant Design': SiAntdesign,
  Accessibility: TbAccessible,
  Git: SiGit,
  Jira: SiJira,
  'Cursor AI': SiCursor,
  'GitHub Copilot': SiGithubcopilot,
};

/**
 * Official brand color per tech, for the one place these render as colorful
 * logos instead of the on-glass monochrome treatment (`currentColor`, via
 * `--color-*` tokens) every pill/chip elsewhere uses — CapabilitiesCard's
 * icon grid. Deliberately not every key in TECH_ICONS: a few brands are
 * monochrome by design (Next.js, GitHub Copilot, Cursor AI all ship
 * black/white marks, not a hue) and the non-brand stand-ins (SQL,
 * Accessibility) were never a real logo to begin with — those fall back to
 * the caller's own default color instead of an invented one.
 */
export const TECH_BRAND_COLORS: Record<string, string> = {
  React: '#61DAFB',
  'React Native': '#61DAFB',
  Angular: '#DD0031',
  TypeScript: '#3178C6',
  '.NET Core': '#512BD4',
  '.NET': '#512BD4',
  'Node.js': '#339933',
  'C#': '#9B4F96',
  GraphQL: '#E10098',
  MySQL: '#4479A1',
  MongoDB: '#47A248',
  AWS: '#FF9900',
  Azure: '#0078D4',
  Figma: '#A259FF',
  'Material UI': '#007FFF',
  'Ant Design': '#0170FE',
  Git: '#F05032',
  Jira: '#0052CC',
};
