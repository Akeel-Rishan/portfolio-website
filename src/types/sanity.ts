export interface SanityArticle {
  _id: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  mediumUrl: string;
  publishedAt: string | null;
  readingTimeMinutes: number | null;
  tags: string[] | null;
  displayOrder: number | null;
}

export interface SanityProjectMetric {
  label: string;
  value: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  techStack: string[] | null;
  githubUrl: string | null;
  demoUrl: string | null;
  metrics: SanityProjectMetric[] | null;
  architectureFlow: string[] | null;
  isFeatured: boolean | null;
  displayOrder: number | null;
}

export interface SanityExperience {
  _id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean | null;
  description: string | null;
  bulletPoints: string[] | null;
  techUsed: string[] | null;
  companyInitials: string | null;
  accentColor: string | null;
  displayOrder: number | null;
}

export interface SanitySkill {
  _id: string;
  category: string;
  iconName: string | null;
  items: string[] | null;
  proficiency: number | null;
  displayOrder: number | null;
}

export interface SanityCertification {
  _id: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  credentialId: string | null;
  verifyUrl: string | null;
  accentColor: string | null;
  displayOrder: number | null;
}

export interface SanitySiteConfig {
  heroName: string | null;
  heroTitle: string | null;
  heroTagline: string | null;
  heroGithub: string | null;
  heroLinkedin: string | null;
  heroTwitter: string | null;
  heroCvUrl: string | null;
  heroAvailableForWork: boolean | null;
  aboutParagraph1: string | null;
  aboutParagraph2: string | null;
  aboutParagraph3: string | null;
  aboutYearsExp: string | null;
  aboutProjectsBuilt: string | null;
  aboutModelsDeployed: string | null;
  contactEmail: string | null;
  siteUrl: string | null;
}
