"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { Project } from "@/types";

function ArchitectureFlow({ nodes, featured = false }: { nodes: string[]; featured?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {nodes.map((node, index) => (
        <div key={`${node}-${index}`} className="flex items-center gap-2">
          <span
            className={
              featured
                ? "rounded-full border border-brand-cyan/35 bg-brand-cyan/10 px-3 py-2 text-xs text-cyan-100"
                : "rounded-full border border-dark-border bg-white/[0.04] px-3 py-1.5 text-[11px] text-muted-foreground"
            }
          >
            {node}
          </span>
          {index < nodes.length - 1 && <span className="text-brand-purple">→</span>}
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card glow className="flex h-full flex-col">
      <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg border border-dark-border bg-dark-bg/70">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">{project.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {[
          ["Problem", project.problem],
          ["Solution", project.solution],
          ["Impact", project.impact]
        ].map(([label, text]) => (
          <div key={label} className="rounded-xl border border-dark-border bg-white/[0.03] p-4">
            <p className="font-mono text-xs text-brand-cyan">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ArchitectureFlow nodes={project.architecture} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech} variant="purple">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-dark-border bg-dark-bg/70 p-3 text-center">
            <p className="text-sm font-semibold text-text-primary">{metric.value}</p>
            <p className="mt-1 text-[11px] text-text-muted">{metric.label}</p>
          </div>
        ))}
      </div>

    </Card>
  );
}

export function Projects({ projects, featuredProject }: { projects: Project[]; featuredProject: Project | null }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const featured = featuredProject ?? projects.find((project) => project.featured) ?? projects[0];
  const rest = projects.filter((project) => project.name !== featured.name);

  if (!featured) {
    return null;
  }

  return (
    <section id="projects" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="cyan">Projects</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            AI systems designed around problem, solution, and measurable impact.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow className="relative overflow-hidden p-7 md:p-8">
            <Badge variant="pink" className="absolute right-5 top-5">
              Featured Project
            </Badge>
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-lg border border-dark-border bg-dark-bg/70">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="pr-24 text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-text-primary">
                  {featured.name}
                </h3>
                <p className="mt-4 leading-8 text-muted-foreground">{featured.description}</p>
                <div className="mt-7 grid gap-3">
                  {[
                    ["Problem", featured.problem],
                    ["Solution", featured.solution],
                    ["Impact", featured.impact]
                  ].map(([label, text]) => (
                    <div key={label} className="rounded-xl border border-dark-border bg-white/[0.03] p-4">
                      <p className="font-mono text-xs text-brand-cyan">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-dark-border bg-dark-bg/70 p-5">
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                  Architecture
                </p>
                <div className="grid gap-4">
                  {featured.architecture.map((node, index) => (
                    <div key={node} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/15 font-mono text-sm text-brand-cyan">
                        {index + 1}
                      </span>
                      <div className="flex-1 rounded-xl border border-brand-purple/25 bg-white/[0.04] px-4 py-3 text-sm text-text-primary">
                        {node}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <ArchitectureFlow nodes={featured.architecture} featured />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {featured.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-dark-border bg-white/[0.04] p-3 text-center">
                      <p className="text-sm font-bold text-text-primary">{metric.value}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featured.tech.map((tech) => (
                    <Badge key={tech} variant="cyan">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerContainer} className="mt-6 grid gap-5 lg:grid-cols-2">
          {rest.map((project) => (
            <motion.div key={project.name} variants={fadeInUp}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
