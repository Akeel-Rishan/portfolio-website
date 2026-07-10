import { groq } from "next-sanity";

export const ARTICLES_QUERY = groq`
  *[_type == "article" && isPublished == true]
  | order(displayOrder asc, publishedAt desc) {
    _id,
    title,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    mediumUrl,
    publishedAt,
    readingTimeMinutes,
    tags,
    displayOrder
  }
`;

export const PROJECTS_QUERY = groq`
  *[_type == "project" && isPublished == true]
  | order(displayOrder asc) {
    _id,
    title,
    description,
    problem,
    solution,
    impact,
    techStack,
    githubUrl,
    demoUrl,
    metrics,
    architectureFlow,
    isFeatured,
    displayOrder
  }
`;

export const FEATURED_PROJECT_QUERY = groq`
  *[_type == "project" && isPublished == true && isFeatured == true][0] {
    _id,
    title,
    description,
    problem,
    solution,
    impact,
    techStack,
    githubUrl,
    demoUrl,
    metrics,
    architectureFlow,
    isFeatured,
    displayOrder
  }
`;

export const EXPERIENCE_QUERY = groq`
  *[_type == "experience"]
  | order(displayOrder asc) {
    _id,
    company,
    role,
    location,
    startDate,
    endDate,
    isCurrent,
    description,
    bulletPoints,
    techUsed,
    companyInitials,
    accentColor,
    displayOrder
  }
`;

export const SKILLS_QUERY = groq`
  *[_type == "skill"]
  | order(displayOrder asc) {
    _id,
    category,
    iconName,
    items,
    proficiency,
    displayOrder
  }
`;

export const CERTIFICATIONS_QUERY = groq`
  *[_type == "certification"]
  | order(displayOrder asc) {
    _id,
    name,
    issuer,
    issueDate,
    credentialId,
    verifyUrl,
    accentColor,
    displayOrder
  }
`;

export const SITE_CONFIG_QUERY = groq`
  *[_type == "siteConfig"][0] {
    heroName,
    heroTitle,
    heroTagline,
    heroGithub,
    heroLinkedin,
    heroTwitter,
    heroCvUrl,
    heroAvailableForWork,
    aboutParagraph1,
    aboutParagraph2,
    aboutParagraph3,
    aboutYearsExp,
    aboutProjectsBuilt,
    aboutModelsDeployed,
    contactEmail,
    siteUrl
  }
`;
