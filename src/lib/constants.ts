import type { Certification, Experience, NavLink, Project, SkillCategory } from "@/types";

export const SITE = {
  name: "YourName",
  title: "AI Engineer Portfolio",
  description:
    "AI Engineer building production-grade LLM systems, RAG pipelines, and autonomous AI agents.",
  url: "https://your-domain.com",
  email: "hello@your-domain.com",
  github: "https://github.com/yourname",
  linkedin: "https://linkedin.com/in/yourname",
  twitter: "https://twitter.com/yourname",
  cv: "/cv.pdf"
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export const projects: Project[] = [
  {
    name: "Enterprise RAG Copilot",
    description:
      "A retrieval-augmented assistant that answers policy and support questions with cited sources, semantic reranking, and human feedback loops.",
    tech: ["Next.js", "LangChain", "PostgreSQL", "pgvector", "OpenAI"],
    github: "https://github.com/yourname/enterprise-rag-copilot",
    demo: "https://enterprise-rag-demo.your-domain.com",
    metrics: "92% answer acceptance across 14k internal queries"
  },
  {
    name: "Autonomous Research Agent",
    description:
      "A multi-step agent that decomposes research goals, searches trusted sources, extracts evidence, and produces auditable briefs.",
    tech: ["Python", "FastAPI", "CrewAI", "Playwright", "Redis"],
    github: "https://github.com/yourname/research-agent",
    demo: "https://research-agent.your-domain.com",
    metrics: "Reduced analyst research time by 68%"
  },
  {
    name: "LLM Evaluation Harness",
    description:
      "A production eval suite for prompt variants, tool-use reliability, hallucination checks, and regression tracking across models.",
    tech: ["TypeScript", "OpenAI Evals", "Prisma", "Docker", "Grafana"],
    github: "https://github.com/yourname/llm-eval-harness",
    demo: "https://evals.your-domain.com",
    metrics: "Cut release regressions by 41%"
  },
  {
    name: "Voice Support Agent",
    description:
      "A real-time voice assistant with intent routing, CRM tool calls, transcript summarization, and handoff escalation.",
    tech: ["WebRTC", "Node.js", "Twilio", "OpenAI", "MongoDB"],
    github: "https://github.com/yourname/voice-support-agent",
    demo: "https://voice-agent.your-domain.com",
    metrics: "Handled 1.8k calls with 4.7/5 CSAT"
  },
  {
    name: "AI Workflow Orchestrator",
    description:
      "A workflow engine for composing AI tasks, API tools, approvals, and scheduled automations with observability built in.",
    tech: ["React", "Temporal", "FastAPI", "Kubernetes", "LangGraph"],
    github: "https://github.com/yourname/ai-workflow-orchestrator",
    demo: "https://workflow-ai.your-domain.com",
    metrics: "99.9% workflow completion reliability"
  }
];

export const skills: SkillCategory[] = [
  {
    category: "LLMs",
    skills: ["Prompt engineering", "Function calling", "Structured outputs", "Fine-tuning", "Evaluation"]
  },
  {
    category: "Agents",
    skills: ["Tool orchestration", "Planning loops", "Memory systems", "Guardrails", "Multi-agent workflows"]
  },
  {
    category: "RAG",
    skills: ["Vector search", "Hybrid retrieval", "Reranking", "Chunking strategies", "Citation grounding"]
  },
  {
    category: "MLOps",
    skills: ["Model monitoring", "Dataset versioning", "CI/CD", "Observability", "Cost optimization"]
  },
  {
    category: "Backend",
    skills: ["FastAPI", "Node.js", "PostgreSQL", "Redis", "Docker"]
  },
  {
    category: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"]
  }
];

export const experiences: Experience[] = [
  {
    role: "Senior AI Engineer",
    company: "Applied Intelligence Studio",
    period: "2024 - Present",
    description:
      "Designing production LLM systems for enterprise search, workflow automation, and agentic operations.",
    highlights: [
      "Built RAG infrastructure serving 50k monthly knowledge queries",
      "Introduced eval pipelines for prompt and retrieval regression testing",
      "Led architecture reviews for secure tool-calling systems"
    ]
  },
  {
    role: "Machine Learning Engineer",
    company: "CloudOps AI",
    period: "2022 - 2024",
    description:
      "Shipped applied ML services for forecasting, anomaly detection, and conversational analytics.",
    highlights: [
      "Deployed real-time anomaly models across streaming telemetry",
      "Reduced inference cost by 35% through batching and caching",
      "Partnered with platform teams to harden ML service reliability"
    ]
  },
  {
    role: "Full-Stack Developer",
    company: "Product Lab",
    period: "2020 - 2022",
    description:
      "Built data-heavy SaaS features and internal automation tools with React, APIs, and cloud services.",
    highlights: [
      "Delivered analytics dashboards used by operations teams daily",
      "Built API integrations with payment, CRM, and messaging platforms",
      "Created design-system components for faster product iteration"
    ]
  }
];

export const certifications: Certification[] = [
  {
    name: "Generative AI Engineering",
    issuer: "DeepLearning.AI",
    year: "2025",
    url: "https://www.deeplearning.ai"
  },
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford Online",
    year: "2024",
    url: "https://online.stanford.edu"
  },
  {
    name: "AWS Certified Machine Learning - Specialty",
    issuer: "Amazon Web Services",
    year: "2024",
    url: "https://aws.amazon.com/certification"
  },
  {
    name: "Kubernetes Application Developer",
    issuer: "Cloud Native Computing Foundation",
    year: "2023",
    url: "https://www.cncf.io/certification"
  }
];
