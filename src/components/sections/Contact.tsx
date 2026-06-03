"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fadeInLeft, fadeInRight, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { SITE } from "@/lib/constants";

type FormStatus = "idle" | "sending" | "sent" | "error";

const contactMethods = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, icon: Mail },
  { label: "LinkedIn", value: SITE.linkedinLabel, href: SITE.linkedin, icon: Linkedin },
  { label: "GitHub", value: SITE.githubHandle, href: SITE.github, icon: Github }
];

const subjectOptions = ["Job Opportunity", "Collaboration", "General Question", "Open Source"];

export function Contact() {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={ref} className="section-shell">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeInLeft}>
          <Badge variant="pink">Contact</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Let&apos;s build an AI system that earns trust.
          </h2>
          <p className="mt-5 leading-8 text-muted-foreground">
            Reach out for LLM product engineering, RAG architecture, agent systems,
            evaluation design, or production readiness reviews.
          </p>
          <div className="mt-8 grid gap-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a key={method.label} href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group">
                  <Card glow className="flex items-center gap-4 p-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-purple/25 bg-brand-purple/10 text-brand-cyan transition group-hover:shadow-neon">
                      <Icon size={21} />
                    </span>
                    <span>
                      <span className="block text-sm text-text-muted">{method.label}</span>
                      <span className="block font-semibold text-text-primary">{method.value}</span>
                    </span>
                  </Card>
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight}>
          <Card glow>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-text-muted">
                  <span>Name</span>
                  <input
                    required
                    name="name"
                    className="w-full rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                  />
                </label>
                <label className="space-y-2 text-sm text-text-muted">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-text-muted">
                <span>Subject</span>
                <select
                  required
                  name="subject"
                  className="w-full rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                >
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-text-muted">
                <span>Message</span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  className="w-full resize-none rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                />
              </label>
              <Button
                type="submit"
                size="lg"
                icon={<Send size={18} />}
                disabled={status === "sending"}
                className="w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Submit Message"}
              </Button>
              {status === "sent" && <p className="text-sm text-emerald-300">Message received. I&apos;ll reply soon.</p>}
              {status === "error" && <p className="text-sm text-red-300">Something went wrong. Please try again.</p>}
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
