export interface ExperienceEntry {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface EducationEntry {
  school: string;
  location: string;
  degree: string;
  period: string;
  notes: string[];
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Award {
  title: string;
  description: string;
}

export interface LanguageEntry {
  name: string;
  level: string;
}

export interface Project {
  slotId: string;
  imageLabel: string;
  name: string;
  url: string;
  urlLabel: string;
  description: string;
  stack: string[];
}
