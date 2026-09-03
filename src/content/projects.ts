import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    slotId: 'lexcheck-thumb',
    imageLabel: 'LexCheck logo',
    name: 'LexCheck',
    logo: '/logos/lexcheck.svg',
    url: 'https://www.lexcheck.com/',
    urlLabel: 'lexcheck.com',
    description:
      'AI-powered contract review and negotiation platform for legal and business teams. ' +
      'It automates redlining, applies playbook rules, and flags risky language to cut ' +
      'contract turnaround time.',
    stack: ['Angular', '.NET Core', 'SQL', 'Node.js'],
  },
  {
    slotId: 'cohere-thumb',
    imageLabel: 'Cohere logo',
    name: 'Cohere',
    logo: '/logos/cohere.svg',
    url: 'https://cohere.live/',
    urlLabel: 'cohere.live',
    description:
      'All-in-one platform for coaches and course creators to sell and deliver their ' +
      'services — scheduling, payments, community, and content, with an AI assistant ' +
      'built in.',
    stack: ['React', 'React Native', '.NET', 'MongoDB'],
  },
];
