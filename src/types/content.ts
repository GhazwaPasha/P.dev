export interface CapabilityPillar {
  title: string;
  description: string;
  tags: string[];
}

export interface StoryStat {
  value: string;
  label: string;
}

export interface Story {
  role: string;
  company: string;
  location: string;
  period: string;
  body: string;
  stats: StoryStat[];
}

export interface Highlight {
  title: string;
  description: string;
}

export interface Project {
  slotId: string;
  imageLabel: string;
  name: string;
  /** Path under /public, e.g. "/logos/lexcheck.svg". */
  logo: string;
  url: string;
  urlLabel: string;
  description: string;
  stack: string[];
}
