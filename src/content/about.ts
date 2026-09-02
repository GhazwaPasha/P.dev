import type {
  Award,
  Certification,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
} from '../types/content';

export const profile = {
  name: 'Pivak E Safa',
  title: 'Full Stack Engineer',
  email: 'pivakesafa@gmail.com',
  phone: '+92 311 1777465',
  linkedin: 'https://www.linkedin.com/in/pivak-e-safa/',
  location: 'Pakistan',
};

export const summary =
  'I design and build complete products — responsive front ends, APIs, and the ' +
  'databases behind them. Comfortable across the stack, from Angular and React ' +
  'on the client to .NET Core and Node on the server, with production experience ' +
  'taking a product from concept to a multi-million dollar acquisition.';

export const skills: string[] = [
  'Angular',
  'React JS',
  'React Native',
  'Redux',
  'Next.js',
  'Ant Design',
  'MUI',
  'Material UI',
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  '.NET',
  '.NET Core',
  'ASP.NET',
  'ASP.NET Core',
  'C#',
  'Node JS',
  'MySQL',
  'MongoDB',
  'AWS',
  'Firebase',
  'GraphQL',
  'Azure Cloud',
  'Python',
  'Git',
  'GitHub',
  'GitLab',
  'Jira',
  'Bitbucket',
  'Postman',
  'HeidiSQL',
  'Figma',
  'Redmine',
  'Cursor AI',
  'GitHub Copilot',
];

export const experience: ExperienceEntry[] = [
  {
    company: 'Rolustech',
    location: 'Lahore, Pakistan (Remote)',
    title: 'Full Stack Developer',
    period: '06/2019 – Present',
    bullets: [
      'Managed 6+ full-stack projects simultaneously using Agile development methodologies.',
      'Frontend: Angular, React JS, React Native, Redux, Next.js, TypeScript, JavaScript, CSS, HTML.',
      'Backend: C#, ASP.NET, Entity Framework, Node JS, GraphQL, MySQL, MongoDB, Firebase, AWS, Azure DevOps.',
      'Implemented and maintained scalable design systems (Material UI, Ant Design, custom UI kits) for consistent, accessible UX.',
      'Worked closely with designers and PMs to build interactive, user-friendly interfaces focused on usability, accessibility, and performance.',
      'Introduced modern practices and architectures such as Microservices and Clean Architecture.',
      'Collaborated with product managers, developers, and business managers across the USA, Canada, and Australia to prioritize roadmap and requirements.',
      'Followed Scrum-based development with two-week sprints alongside Kanban to maintain quality and on-time delivery.',
      'Owned technical process end to end — development, design, architecture, and code review.',
      'Managed codebases totaling 200,000+ lines of code across 4 platforms.',
      'Core team member developing a product from initial concept to a multi-million dollar solution, later acquired by a prominent Silicon Valley tech leader.',
      'Leveraged AI tools like Cursor AI and GitHub Copilot to cut development cost and boost productivity by 40%+.',
    ],
  },
];

export const education: EducationEntry[] = [
  {
    school: 'National University of Computer and Emerging Sciences',
    location: 'Pakistan',
    degree: 'Bachelor of Science, Computer Science',
    period: '08/2015 – 06/2019',
    notes: [
      'Graduated Magna Cum Laude — 3.76 / 4.00.',
      'Founded and led the Women in Engineering society; ran seminars and workshops supporting women in engineering.',
    ],
  },
];

export const certifications: Certification[] = [
  { name: 'React — The Complete Guide', issuer: 'Udemy' },
  { name: 'Secure Full Stack MEAN Developer', issuer: 'EC-Council' },
  { name: 'Foundations of User Experience (UX) Design', issuer: 'Google' },
];

export const awards: Award[] = [
  { title: 'Gold Medalist', description: 'Highest CGPA holder in bachelor degree at FAST NUCES.' },
  { title: 'Finalist, Adobe WiT', description: 'Reached the final round of the Adobe Women in Tech Scholarship.' },
  { title: "Dean's List", description: "Appeared on the Dean's List of honor multiple times during the bachelor degree." },
];

export const languages: LanguageEntry[] = [
  { name: 'English', level: 'Proficient' },
  { name: 'Urdu', level: 'Native' },
  { name: 'Punjabi', level: 'Native' },
];
