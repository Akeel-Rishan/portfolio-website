import { Bot, Brain, Code2, Database, GitBranch, ServerCog } from "lucide-react";
import type { Certification, Experience, NavLink, Project, SkillCategory } from "@/types";

export const SITE = {
  name: "Akeel Rishan",
  initials: "AR",
  title: "Akeel Rishan | AI Engineer",
  description:
    "AI Engineer building production-grade LLM systems, RAG pipelines, and autonomous AI agents. View live demos, architecture diagrams, and open source projects.",
  tagline: "Production-grade LLM systems, RAG pipelines, and autonomous AI agents.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com",
  email: "hello@your-domain.com",
  github: "https://github.com/Akeel-Rishan",
  githubUsername: "Akeel-Rishan",
  githubHandle: "@Akeel-Rishan",
  linkedin: "https://www.linkedin.com/in/akeelrishan",
  linkedinLabel: "linkedin.com/in/akeelrishan",
  kaggle: "https://www.kaggle.com/akeelrishanai",
  kaggleLabel: "kaggle.com/akeelrishanai",
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
    name: "RAG PDF Chat System",
    description: "Document intelligence platform for grounded Q&A across large PDF collections.",
    image: "/project-rag.svg",
    imageAlt: "RAG PDF chat system architecture preview",
    problem: "Teams were losing time searching fragmented PDFs and still lacked confidence in answers.",
    solution: "Built a cited RAG workflow with ingestion, semantic retrieval, reranking, and Gemini synthesis.",
    impact: "Reduced document lookup time while keeping responses traceable to source passages.",
    architecture: ["Frontend", "API", "AI Layer", "VectorDB", "LLM"],
    tech: ["Python", "LlamaIndex", "Pinecone", "Gemini", "FastAPI", "Next.js"],
    github: "https://github.com/yourname/rag-pdf-chat-system",
    demo: "https://rag-pdf-chat.your-domain.com",
    metrics: [
      { label: "Retrieval", value: "94% accuracy" },
      { label: "Response", value: "<2s" },
      { label: "Indexed", value: "10k docs" }
    ],
    featured: true
  },
  {
    name: "Multi-Agent Workflow System",
    description: "Coordinated agents that plan, execute, validate, and report complex work.",
    image: "/project-agents.svg",
    imageAlt: "Multi-agent workflow orchestration preview",
    problem: "Manual operational workflows required repeated context switching and quality checks.",
    solution: "Composed LangGraph and CrewAI agents with Redis state and FastAPI orchestration.",
    impact: "Completed multi-step tasks faster with auditable intermediate decisions.",
    architecture: ["Frontend", "API", "AI Layer", "Redis", "LLM"],
    tech: ["LangGraph", "CrewAI", "Python", "Redis", "FastAPI"],
    github: "https://github.com/yourname/multi-agent-workflow",
    demo: "https://agents.your-domain.com",
    metrics: [
      { label: "Agents", value: "5" },
      { label: "Speed", value: "3x faster" },
      { label: "Success", value: "89%" }
    ]
  },
  {
    name: "AI SaaS Platform",
    description: "Subscription-ready AI app with auth, billing, usage limits, and model routing.",
    image: "/project-saas.svg",
    imageAlt: "AI SaaS platform dashboard preview",
    problem: "AI prototypes often lacked production product foundations like billing and reliability.",
    solution: "Built a Next.js platform with Stripe, Supabase, OpenAI routes, and usage metering.",
    impact: "Created a deployable SaaS base for AI product experiments and customer pilots.",
    architecture: ["Frontend", "API", "Auth", "AI Layer", "LLM"],
    tech: ["Next.js", "Stripe", "Supabase", "OpenAI", "Tailwind"],
    github: "https://github.com/yourname/ai-saas-platform",
    demo: "https://ai-saas.your-domain.com",
    metrics: [
      { label: "Users", value: "200 simulated" },
      { label: "Uptime", value: "98%" },
      { label: "API", value: "sub-100ms" }
    ]
  },
  {
    name: "Fine-tuned Domain LLM",
    description: "Domain-specialized model using LoRA adapters and experiment tracking.",
    image: "/project-llm.svg",
    imageAlt: "Fine-tuned domain LLM evaluation preview",
    problem: "Generic model responses missed domain terminology and classification nuance.",
    solution: "Fine-tuned with PEFT, tracked experiments in W&B, and evaluated against a curated test set.",
    impact: "Improved task-specific quality while keeping training cost and deployment size practical.",
    architecture: ["Dataset", "Trainer", "Adapter", "Eval", "LLM"],
    tech: ["HuggingFace", "LoRA", "W&B", "Python", "PEFT"],
    github: "https://github.com/yourname/domain-llm",
    demo: "https://domain-llm.your-domain.com",
    metrics: [
      { label: "Lift", value: "23% better" },
      { label: "Model", value: "1.2B params" },
      { label: "Score", value: "F1: 0.91" }
    ]
  },
  {
    name: "AI Voice Assistant",
    description: "Low-latency voice assistant with transcription, synthesis, and conversational state.",
    image: "/project-voice.svg",
    imageAlt: "AI voice assistant waveform preview",
    problem: "Voice AI needed faster turn-taking and more natural escalation behavior.",
    solution: "Combined Whisper, Gemini, ElevenLabs, FastAPI, and WebSockets for real-time sessions.",
    impact: "Delivered natural voice responses with accurate transcripts and configurable personas.",
    architecture: ["Frontend", "Socket", "Speech", "AI Layer", "Voice"],
    tech: ["Whisper", "ElevenLabs", "Gemini", "FastAPI", "WebSockets"],
    github: "https://github.com/yourname/ai-voice-assistant",
    demo: "https://voice-ai.your-domain.com",
    metrics: [
      { label: "Latency", value: "<500ms" },
      { label: "Accuracy", value: "97%" },
      { label: "Voices", value: "8" }
    ]
  }
];

export const skills: SkillCategory[] = [
  {
    category: "LLMs & Prompting",
    icon: Brain,
    skills: ["GPT-4", "Claude", "Gemini", "Mistral", "Llama"],
    proficiency: 94,
    variant: "purple"
  },
  {
    category: "AI Agents",
    icon: Bot,
    skills: ["LangGraph", "CrewAI", "AutoGen", "Tool Use", "ReAct"],
    proficiency: 90,
    variant: "cyan"
  },
  {
    category: "RAG Systems",
    icon: Database,
    skills: ["LlamaIndex", "Pinecone", "Weaviate", "Chroma", "FAISS"],
    proficiency: 92,
    variant: "green"
  },
  {
    category: "MLOps",
    icon: GitBranch,
    skills: ["HuggingFace", "W&B", "MLflow", "Docker", "GitHub Actions"],
    proficiency: 84,
    variant: "orange"
  },
  {
    category: "Backend",
    icon: ServerCog,
    skills: ["FastAPI", "PostgreSQL", "Redis", "Python", "REST APIs"],
    proficiency: 88,
    variant: "pink"
  },
  {
    category: "Frontend",
    icon: Code2,
    skills: ["Next.js", "TypeScript", "React", "Tailwind", "Framer Motion"],
    proficiency: 86,
    variant: "purple"
  }
];

export const experiences: Experience[] = [
  {
    role: "Senior AI Engineer",
    company: "Applied Intelligence Studio",
    period: "2024 - Present",
    location: "Remote",
    initials: "AI",
    color: "from-brand-purple to-brand-cyan",
    bullets: [
      "Built RAG infrastructure serving 50k monthly knowledge queries with cited responses.",
      "Designed agent tool-calling patterns with approvals, retries, and observability.",
      "Introduced prompt and retrieval evals that caught regressions before release.",
      "Partnered with product teams to convert prototypes into maintainable AI services."
    ],
    tech: ["OpenAI", "LangGraph", "FastAPI", "pgvector", "Docker"]
  },
  {
    role: "Machine Learning Engineer",
    company: "CloudOps AI",
    period: "2022 - 2024",
    location: "Hybrid",
    initials: "CO",
    color: "from-cyan-400 to-emerald-400",
    bullets: [
      "Deployed anomaly detection models across streaming infrastructure telemetry.",
      "Reduced inference cost by 35% through batching, caching, and model routing.",
      "Created monitoring dashboards for model drift, latency, and service health.",
      "Built internal APIs that made ML predictions available to operations tools."
    ],
    tech: ["Python", "MLflow", "Redis", "PostgreSQL", "Kubernetes"]
  },
  {
    role: "Full-Stack AI Developer",
    company: "Product Lab",
    period: "2020 - 2022",
    location: "Colombo",
    initials: "PL",
    color: "from-pink-400 to-orange-400",
    bullets: [
      "Built analytics dashboards and automation tools for data-heavy workflows.",
      "Integrated early LLM features into support and reporting products.",
      "Shipped reusable React components that accelerated product delivery.",
      "Connected CRM, billing, and messaging APIs for internal operation systems."
    ],
    tech: ["React", "Node.js", "TypeScript", "Tailwind", "REST APIs"]
  }
];

export const certifications: Certification[] = [
  {
    name: "AWS Certified Machine Learning - Specialty",
    issuer: "AWS",
    issueDate: "Issued Feb 2025",
    credentialId: "AWS-MLS-0249",
    url: "https://aws.amazon.com/certification",
    color: "from-orange-400 to-yellow-300"
  },
  {
    name: "Professional Machine Learning Engineer",
    issuer: "Google Cloud",
    issueDate: "Issued Nov 2024",
    credentialId: "GCP-PMLE-1182",
    url: "https://cloud.google.com/learn/certification",
    color: "from-cyan-400 to-blue-500"
  },
  {
    name: "DeepLearning.AI Specializations",
    issuer: "DeepLearning.AI",
    issueDate: "Issued Aug 2024",
    credentialId: "DLAI-GENAI-7421",
    url: "https://www.deeplearning.ai",
    color: "from-brand-purple to-pink-400"
  },
  {
    name: "Hugging Face NLP Course",
    issuer: "Hugging Face",
    issueDate: "Issued Apr 2024",
    credentialId: "HF-NLP-3907",
    url: "https://huggingface.co/learn",
    color: "from-emerald-400 to-brand-cyan"
  }
];
