import { certifications, experiences, projects, skills, SITE } from "@/lib/constants";

const projectDetails = projects
  .map((project) => {
    const metrics = project.metrics.map((metric) => `${metric.label}: ${metric.value}`).join(", ");
    return `${project.name}: ${project.description} Problem: ${project.problem} Solution: ${project.solution} Impact: ${project.impact} Tech stack: ${project.tech.join(", ")}. Metrics: ${metrics}.`;
  })
  .join("\n\n");

const skillDetails = skills
  .map((group) => `${group.category}: ${group.skills.join(", ")}. Proficiency: ${group.proficiency}%.`)
  .join("\n");

const experienceDetails = experiences
  .map((item) => {
    return `${item.role} at ${item.company}, ${item.period}, ${item.location}. Impact: ${item.bullets.join(" ") } Tech used: ${item.tech.join(", ")}.`;
  })
  .join("\n\n");

const certificationDetails = certifications
  .map((certification) => {
    return `${certification.name} from ${certification.issuer}, ${certification.issueDate}, credential ID ${certification.credentialId}.`;
  })
  .join("\n");

export const PORTFOLIO_CONTEXT = `
The portfolio owner is ${SITE.name}, an AI Engineer. Their positioning statement is: "${SITE.description}"

They build production-grade LLM systems, retrieval-augmented generation pipelines, autonomous AI agents, evaluation workflows, and full-stack AI products. They are curious, practical, and strongly oriented toward builder work that survives production constraints. They like systems that are measured, observable, useful, and trustworthy rather than flashy demos without reliability.

Projects:
${projectDetails}

Skills:
${skillDetails}

Experience:
${experienceDetails}

Education and certifications:
${certificationDetails}

Work status and preferences:
${SITE.name} is open to ambitious AI engineering opportunities, especially roles involving LLM applications, RAG systems, AI agents, applied ML platforms, and production AI architecture. They prefer remote-friendly or hybrid roles and are comfortable collaborating across product, engineering, and research teams.

Contact details:
Email: ${SITE.email}
GitHub: ${SITE.githubHandle} at ${SITE.github}
LinkedIn: ${SITE.linkedinLabel} at ${SITE.linkedin}

Personality:
They are curious, direct, systems-minded, and enjoy turning rough AI ideas into dependable products. They care about thoughtful architecture, clear tradeoffs, measured outcomes, and practical user experience.
`;

export function buildPortfolioSystemPrompt() {
  return `
You are the AI portfolio assistant for ${SITE.name}.

Use only the portfolio context below. Answer only questions about the portfolio owner, their projects, skills, experience, certifications, work preferences, and contact details.

Rules:
- Be concise but specific.
- Cite real metrics, tools, project names, and technologies from the context when relevant.
- Sound human and confident, not robotic or salesy.
- Never make up information.
- If the user asks for something not in the context, say: "I don't have that detail, but you can reach out via the contact section."
- If asked about hiring fit, summarize relevant strengths and suggest contacting ${SITE.name}.

Portfolio context:
${PORTFOLIO_CONTEXT}
`;
}
