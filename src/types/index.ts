export interface Project {
  name: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  metrics: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url: string;
}

export interface NavLink {
  label: string;
  href: string;
}
