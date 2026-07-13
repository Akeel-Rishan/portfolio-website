const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akeelrishan.me";
const email = "mohamedrishanakeel13867@gmail.com";
const githubUrl = "https://github.com/Akeel-Rishan";
const mediumUrl = "https://medium.com/@AkeelRishan";
const linkedinUrl = "https://www.linkedin.com/in/akeelrishan";
const twitterUrl = "https://x.com/Scolarx_";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Akeel Rishan",
  alternateName: ["Mohamed Rishan Akeel", "AkeelRishan", "Akeel Rishan AI Engineer"],
  jobTitle: "AI Engineer & Software Developer",
  description:
    "AI Engineer from Sri Lanka specializing in production-grade LLM systems, RAG pipelines, autonomous AI agents, and full-stack SaaS development.",
  url: BASE_URL,
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.png`,
    width: 1200,
    height: 630
  },
  sameAs: [githubUrl, mediumUrl, linkedinUrl, twitterUrl],
  knowsAbout: [
    "Large Language Models",
    "RAG Systems",
    "AI Agents",
    "LangChain",
    "LangGraph",
    "Next.js",
    "FastAPI",
    "Python",
    "TypeScript",
    "Supabase",
    "Google Gemini API",
    "OpenAI API",
    "SaaS Development",
    "Vector Databases"
  ],
  nationality: {
    "@type": "Country",
    name: "Sri Lanka"
  },
  alumniOf: [],
  address: {
    "@type": "PostalAddress",
    addressCountry: "LK",
    addressRegion: "Sri Lanka"
  },
  email,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "professional inquiries",
    email,
    availableLanguage: "English"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Akeel Rishan - AI Engineer Portfolio",
  description: "Portfolio of Akeel Rishan, AI Engineer and Software Developer from Sri Lanka.",
  author: {
    "@id": `${BASE_URL}/#person`
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  inLanguage: "en-US"
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  dateCreated: "2024-01-01T00:00:00Z",
  dateModified: "2026-07-01T00:00:00Z",
  url: BASE_URL,
  name: "Akeel Rishan - AI Engineer Portfolio",
  isPartOf: {
    "@id": `${BASE_URL}/#website`
  },
  about: {
    "@id": `${BASE_URL}/#person`
  },
  mainEntity: {
    "@id": `${BASE_URL}/#person`
  }
};

const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Akeel Rishan's AI Projects",
  description: "Production AI systems built by Akeel Rishan",
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "LeadFlow AI",
      description: "Multi-tenant AI lead automation SaaS built with Next.js 14, OpenAI, and Supabase",
      url: githubUrl
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "AI Portfolio Website",
      description: "Personal AI engineer portfolio with chatbot, resume analyzer, and live AI demos",
      url: BASE_URL
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Business WhatsApp Assistant SaaS",
      description: "WhatsApp AI automation for businesses using Gemini Flash and Meta WhatsApp Cloud API",
      url: githubUrl
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Car Parts Marketplace Platform",
      description: "Full marketplace with real-time dispatch and React Native rider app",
      url: githubUrl
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "LeadPilot AI",
      description: "Lead generation SaaS for marketing agencies built with NestJS and Supabase",
      url: githubUrl
    }
  ]
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
    </>
  );
}
