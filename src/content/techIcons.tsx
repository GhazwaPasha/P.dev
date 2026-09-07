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
