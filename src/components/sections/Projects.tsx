"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { Project } from "@/types";

function ArchitectureFlow({ nodes, featured = false }: { nodes: string[]; featured?: boolean }) {
  return (
    <div className="scroll-x-container -mx-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex min-w-max items-center gap-2 px-1">
        {nodes.map((node, index) => (
          <div key={`${node}-${index}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span
              className={
                featured
                  ? "shrink-0 rounded-full border border-brand-cyan/35 bg-brand-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan-100"
                  : "shrink-0 rounded-full border border-dark-border bg-dark-card px-3 py-1.5 text-[11px] font-medium text-gray-300"
              }
            >
              {node}
            </span>
            {index < nodes.length - 1 && <span className="shrink-0 text-xs text-gray-600">{"->"}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card glow className="project-card flex h-full flex-col p-4 sm:p-5">
      <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-dark-border bg-dark-bg/70">
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
          <h3 className="text-base font-semibold text-text-primary sm:text-lg">{project.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{project.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <ArchitectureFlow nodes={project.architecture} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech} variant="purple">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center rounded-lg border border-dark-border bg-dark-bg/70 p-2 text-center">
            <p className="text-xs font-bold text-text-primary sm:text-sm">{metric.value}</p>
            <p className="mt-1 text-[10px] text-text-muted sm:text-xs">{metric.label}</p>
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
        <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge variant="cyan">Projects</Badge>
          <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Projects by Akeel Rishan
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow className="project-card relative overflow-hidden p-4 sm:p-5 lg:p-6">
            <Badge variant="pink" className="absolute right-3 top-3 px-2 py-1 text-[10px] sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
              Featured Project
            </Badge>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
              <div>
                <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg border border-dark-border bg-dark-bg/70">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="pr-20 text-xl font-bold text-text-primary sm:text-2xl lg:pr-24 lg:text-3xl">
                  {featured.name}
                </h3>
                <p className="mt-3 px-0 text-center text-sm leading-7 text-muted-foreground sm:text-base lg:text-left">{featured.description}</p>
              </div>

              <div className="rounded-xl border border-dark-border bg-dark-bg/70 p-4">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                  Architecture
                </p>
                <div>
                  <ArchitectureFlow nodes={featured.architecture} featured />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {featured.metrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col items-center rounded-lg border border-dark-border bg-white/[0.04] p-2 text-center">
                      <p className="text-xs font-bold text-text-primary sm:text-sm">{metric.value}</p>
                      <p className="mt-1 text-[10px] text-text-muted sm:text-xs">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
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

        <motion.div variants={staggerContainer} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 lg:gap-6">
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
