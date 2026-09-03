import type { CapabilityPillar, Highlight, Story } from '../types/content';

export const profile = {
  name: 'Pivak E Safa',
  title: 'Full Stack Engineer',
  email: 'pivakesafa@gmail.com',
  phone: '+92 311 1777465',
  linkedin: 'https://www.linkedin.com/in/pivak-e-safa/',
  location: 'Pakistan',
};

// First-person, point-of-view statement rather than a resume objective —
// what I care about building, not a restated list of capabilities (those
// live in `pillars` below).
export const intro =
  "I care about the whole product, not just my corner of the stack. A good " +
  'idea only counts once someone can actually use it. That usually means moving ' +
  'between a Figma file, an API, and a database in the same afternoon, and ' +
  "keeping the thing usable and fast the whole way through. I've spent the last " +
  'few years doing exactly that, most of it on one product that grew from a ' +
  'concept into a company an acquirer wanted.';

export const pillars: CapabilityPillar[] = [
  {
    title: 'Product engineering, end to end',
    description:
      'Full-stack builds spanning the client, the API, and the database behind it, not just the part closest to the design file.',
    tags: ['React', 'Next.js', 'Angular', 'React Native', 'TypeScript'],
  },
  {
    title: 'Backend & cloud',
    description:
      'Services and data layers built to hold up under real usage: REST and GraphQL APIs on .NET and Node, backed by SQL and NoSQL stores on AWS and Azure.',
    tags: ['.NET Core', 'Node.js', 'C#', 'GraphQL', 'MySQL', 'MongoDB', 'AWS', 'Azure'],
  },
  {
    title: 'Design systems & UX',
    description:
      'Interfaces built from a shared component language rather than one-off screens, consistent and accessible by default.',
    tags: ['Figma', 'Material UI', 'Ant Design', 'Accessibility'],
  },
  {
    title: 'Workflow & tooling',
    description:
      'Agile delivery across distributed teams, with modern AI tooling folded into the day-to-day to move faster without cutting corners.',
    tags: ['Git', 'Jira', 'Cursor AI', 'GitHub Copilot'],
  },
];

export const story: Story = {
  role: 'Full Stack Developer',
  company: 'Rolustech',
  location: 'Lahore, Pakistan (Remote)',
  period: '06/2019 – Present',
  body:
    "I've been a core team member on a product I helped take from an initial " +
    'concept to a multi-million dollar business, later acquired by a prominent ' +
    'Silicon Valley tech leader, working across Angular, React, and React ' +
    'Native on the front end and .NET, Node, and GraphQL behind it, with a design ' +
    'system holding the UI together across four platforms. Along the way I worked ' +
    'directly with product managers, designers, and engineers across the US, ' +
    'Canada, and Australia, and helped introduce practices like microservices ' +
    'and clean architecture as the codebase grew.',
  stats: [
    { value: '6+', label: 'projects managed at once' },
    { value: '200k+', label: 'lines of code owned' },
    { value: '40%+', label: 'faster delivery, AI-assisted' },
  ],
};

// Strongest few facts worth a portfolio visitor's attention — academic,
// leadership, and credentialing detail condensed from what used to be three
// separate resume sections (Education, Awards, Certifications).
export const highlights: Highlight[] = [
  {
    title: 'B.S. Computer Science, Magna Cum Laude',
    description:
      'National University of Computer and Emerging Sciences, 3.76/4.00 GPA, Gold Medalist for the highest CGPA in the graduating class.',
  },
  {
    title: 'Founder, Women in Engineering',
    description:
      'Founded and led the society at NUCES, running seminars and workshops supporting women in engineering.',
  },
  {
    title: 'Finalist, Adobe Women in Tech',
    description: 'Reached the final round of the Adobe Women in Tech Scholarship.',
  },
  {
    title: 'Certified across the stack',
    description: 'React (Udemy), Secure Full-Stack MEAN (EC-Council), and UX Design foundations (Google).',
  },
];
