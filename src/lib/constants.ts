import type { Article, Certification, Experience, NavLink, Project, SkillCategory } from "@/types";

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
  twitter: "https://x.com/Scolarx_",
  cv: "/cv.pdf"
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Demos", href: "#demos" },
  { label: "Resume", href: "#resume-analyzer" },
  { label: "Articles", href: "#articles" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export const articles: Article[] = [
  {
    title: "AI Skills That Companies Are Hiring For Right Now",
    platform: "Medium",
    image: "/project-agents.svg",
    imageAlt: "Abstract AI agent workflow article preview",
    url: "https://medium.com/@your-medium-username/ai-skills-that-companies-are-hiring-for-right-now"
  },
  {
    title: "How to Build an AI SaaS Product From Scratch",
    platform: "Medium",
    image: "/project-saas.svg",
    imageAlt: "AI SaaS dashboard article preview",
    url: "https://medium.com/@your-medium-username/how-to-build-an-ai-saas-product-from-scratch"
  },
  {
    title: "ChatGPT vs Claude vs Gemini: Which One Should You Use?",
    platform: "Medium",
    image: "/project-llm.svg",
    imageAlt: "Language model comparison article preview",
    url: "https://medium.com/@your-medium-username/chatgpt-vs-claude-vs-gemini-which-one-should-you-use"
  },
  {
    title: "I Used AI Every Day for 30 Days - Here's What Changed",
    platform: "Medium",
    image: "/project-voice.svg",
    imageAlt: "Daily AI workflow article preview",
    url: "https://medium.com/@your-medium-username/i-used-ai-every-day-for-30-days-heres-what-changed"
  }
];

export const projects: Project[] = [
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
    iconName: "Brain",
    skills: ["GPT-4", "Claude", "Gemini", "Mistral", "Llama"],
    proficiency: 94,
    variant: "purple"
  },
  {
    category: "AI Agents",
    iconName: "Bot",
    skills: ["LangGraph", "CrewAI", "AutoGen", "Tool Use", "ReAct"],
    proficiency: 90,
    variant: "cyan"
  },
  {
    category: "RAG Systems",
    iconName: "Database",
    skills: ["LlamaIndex", "Pinecone", "Weaviate", "Chroma", "FAISS"],
    proficiency: 92,
    variant: "green"
  },
  {
    category: "MLOps",
    iconName: "GitBranch",
    skills: ["HuggingFace", "W&B", "MLflow", "Docker", "GitHub Actions"],
    proficiency: 84,
    variant: "orange"
  },
  {
    category: "Backend",
    iconName: "ServerCog",
    skills: ["FastAPI", "PostgreSQL", "Redis", "Python", "REST APIs"],
    proficiency: 88,
    variant: "pink"
  },
  {
    category: "Frontend",
    iconName: "Code2",
    skills: ["Next.js", "TypeScript", "React", "Tailwind", "Framer Motion"],
    proficiency: 86,
    variant: "purple"
  }
];

export const experiences: Experience[] = [
  {
    role: "AI Engineer Intern",
    company: "Decode Labs",
    period: "2026 - Present",
    location: "Remote",
    initials: "DL",
    color: "from-brand-purple to-brand-cyan",
    bullets: [
      "Contributing to AI-powered product features with a focus on practical LLM workflows.",
      "Supporting development of prompt flows, API integrations, and full-stack AI prototypes.",
      "Learning production engineering practices across testing, debugging, and reliable deployment."
    ],
    tech: ["AI Engineering", "LLMs", "Prompt Engineering", "APIs", "Full-Stack Development"]
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
