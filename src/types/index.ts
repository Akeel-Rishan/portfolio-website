import type { LucideIcon } from "lucide-react";

export type BadgeVariant = "purple" | "cyan" | "green" | "orange" | "pink";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  problem: string;
  solution: string;
  impact: string;
  architecture: string[];
  tech: string[];
  github: string;
  demo: string;
  metrics: ProjectMetric[];
  featured?: boolean;
}

export interface SkillCategory {
  category: string;
  icon: LucideIcon;
  skills: string[];
  proficiency: number;
  variant: BadgeVariant;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  initials: string;
  color: string;
  bullets: string[];
  tech: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  url: string;
  color: string;
}

export interface NavLink {
  label: string;
  href: string;
}
