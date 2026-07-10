import { articles, certifications, experiences, projects, skills, SITE } from "@/lib/constants";
import type { Article, Certification, Experience, Project, SkillCategory } from "@/types";
import type {
  SanityArticle,
  SanityCertification,
  SanityExperience,
  SanityProject,
  SanitySiteConfig,
  SanitySkill
} from "@/types/sanity";
import { client, isSanityConfigured } from "./client";
import {
  ARTICLES_QUERY,
  CERTIFICATIONS_QUERY,
  EXPERIENCE_QUERY,
  FEATURED_PROJECT_QUERY,
  PROJECTS_QUERY,
  SITE_CONFIG_QUERY,
  SKILLS_QUERY
} from "./queries";

const SANITY_CACHE_TAG = "sanity-content";

export type PortfolioSiteConfig = {
  name: string;
  initials: string;
  title: string;
  description: string;
  tagline: string;
  url: string;
  email: string;
  github: string;
  githubUsername: string;
  githubHandle: string;
  linkedin: string;
  linkedinLabel: string;
  kaggle: string;
  kaggleLabel: string;
  twitter: string;
  cv: string;
  availableForWork: boolean;
  aboutParagraphs: string[];
  aboutStats: Array<{ label: string; value: string }>;
};

function shouldUseSanity() {
  return isSanityConfigured;
}

async function fetchSanity<T>(query: string): Promise<T | null> {
  if (!shouldUseSanity()) return null;

  try {
    return await client.fetch<T>(
      query,
      {},
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 60, tags: [SANITY_CACHE_TAG] } }
    );
  } catch (error) {
    console.warn("[sanity] Falling back to local portfolio data", error);
    return null;
  }
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getHandle(url: string, fallback: string) {
  try {
    const pathname = new URL(url).pathname.replace(/^\/|\/$/g, "");
    const last = pathname.split("/").filter(Boolean).at(-1);
    return last ? `@${last}` : fallback;
  } catch {
    return fallback;
  }
}

function getLabel(url: string, fallback: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export async function getSiteConfig(): Promise<PortfolioSiteConfig> {
  const config = await fetchSanity<SanitySiteConfig>(SITE_CONFIG_QUERY);
  const name = config?.heroName?.trim() || SITE.name;
  const github = config?.heroGithub || SITE.github;
  const linkedin = config?.heroLinkedin || SITE.linkedin;
  const twitter = config?.heroTwitter || SITE.twitter;
  const email = config?.contactEmail || SITE.email;

  return {
    name,
    initials: getInitials(name) || SITE.initials,
    title: config?.heroTitle || SITE.title,
    description: config?.heroTagline || SITE.description,
    tagline: config?.heroTagline || SITE.tagline,
    url: config?.siteUrl || SITE.url,
    email,
    github,
    githubUsername: github.split("/").filter(Boolean).at(-1) || SITE.githubUsername,
    githubHandle: getHandle(github, SITE.githubHandle),
    linkedin,
    linkedinLabel: getLabel(linkedin, SITE.linkedinLabel),
    kaggle: SITE.kaggle,
    kaggleLabel: SITE.kaggleLabel,
    twitter,
    cv: config?.heroCvUrl || SITE.cv,
    availableForWork: config?.heroAvailableForWork ?? true,
    aboutParagraphs: [
      config?.aboutParagraph1 ||
        "I am an AI engineer focused on shipping LLM systems that move past demos and into dependable product workflows.",
      config?.aboutParagraph2 ||
        "My background blends full-stack engineering, applied machine learning, retrieval systems, agent orchestration, and evaluation pipelines.",
      config?.aboutParagraph3 ||
        "I care about the operational details: latency, grounding, monitoring, cost, fallback behavior, and the human trust needed to put AI in production."
    ],
    aboutStats: [
      { label: "Years Exp", value: config?.aboutYearsExp || "1+" },
      { label: "Projects Built", value: config?.aboutProjectsBuilt || "10" },
      { label: "Models Deployed", value: config?.aboutModelsDeployed || "2" }
    ]
  };
}

function mapArticle(article: SanityArticle): Article {
  return {
    title: article.title,
    platform: "Medium",
    image: article.coverImageUrl || "/project-agents.svg",
    imageAlt: `${article.title} article preview`,
    url: article.mediumUrl
  };
}

export async function getArticles(): Promise<Article[]> {
  const data = await fetchSanity<SanityArticle[]>(ARTICLES_QUERY);
  return data?.length ? data.map(mapArticle) : articles;
}

function mapProject(project: SanityProject): Project {
  return {
    name: project.title,
    description: project.description,
    image: "/project-agents.svg",
    imageAlt: `${project.title} project preview`,
    problem: project.problem || "Problem details can be edited in Sanity.",
    solution: project.solution || "Solution details can be edited in Sanity.",
    impact: project.impact || "Impact details can be edited in Sanity.",
    architecture: project.architectureFlow?.length ? project.architectureFlow : ["Frontend", "API", "AI Layer"],
    tech: project.techStack?.length ? project.techStack : ["AI", "Next.js"],
    github: project.githubUrl || "#",
    demo: project.demoUrl || "#",
    metrics: project.metrics?.length ? project.metrics : [{ label: "Status", value: "Live" }],
    featured: Boolean(project.isFeatured)
  };
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchSanity<SanityProject[]>(PROJECTS_QUERY);
  return data?.length ? data.map(mapProject) : projects;
}

export async function getFeaturedProject(): Promise<Project | null> {
  const data = await fetchSanity<SanityProject>(FEATURED_PROJECT_QUERY);
  return data ? mapProject(data) : null;
}

function formatPeriod(item: SanityExperience) {
  const start = item.startDate ? new Date(item.startDate).getFullYear().toString() : "";
  const end = item.isCurrent ? "Present" : item.endDate ? new Date(item.endDate).getFullYear().toString() : "";
  return [start, end].filter(Boolean).join(" - ") || "Present";
}

function mapExperience(item: SanityExperience): Experience {
  return {
    role: item.role,
    company: item.company,
    period: formatPeriod(item),
    location: item.location || "Remote",
    initials: item.companyInitials || getInitials(item.company) || "AI",
    color: "from-brand-purple to-brand-cyan",
    bullets: item.bulletPoints?.length ? item.bulletPoints : item.description ? [item.description] : [],
    tech: item.techUsed?.length ? item.techUsed : ["AI Engineering"]
  };
}

export async function getExperiences(): Promise<Experience[]> {
  const data = await fetchSanity<SanityExperience[]>(EXPERIENCE_QUERY);
  return data?.length ? data.map(mapExperience) : experiences;
}

function mapSkill(item: SanitySkill, index: number): SkillCategory {
  const variants: SkillCategory["variant"][] = ["purple", "cyan", "green", "orange", "pink"];

  return {
    category: item.category,
    iconName: item.iconName || "Brain",
    skills: item.items?.length ? item.items : [],
    proficiency: item.proficiency ?? 80,
    variant: variants[index % variants.length]
  };
}

export async function getSkills(): Promise<SkillCategory[]> {
  const data = await fetchSanity<SanitySkill[]>(SKILLS_QUERY);
  return data?.length ? data.map(mapSkill) : skills;
}

function mapCertification(item: SanityCertification): Certification {
  return {
    name: item.name,
    issuer: item.issuer || "Certification",
    issueDate: item.issueDate ? `Issued ${new Date(item.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : "Issued",
    credentialId: item.credentialId || "Credential",
    url: item.verifyUrl || "#",
    color: "from-brand-purple to-brand-cyan"
  };
}

export async function getCertifications(): Promise<Certification[]> {
  const data = await fetchSanity<SanityCertification[]>(CERTIFICATIONS_QUERY);
  return data?.length ? data.map(mapCertification) : certifications;
}
