"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Github, Globe, Linkedin, Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fadeInLeft, fadeInRight, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { PortfolioSiteConfig } from "@/lib/sanity/data";

type FormStatus = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const subjectOptions = ["Job Opportunity", "Collaboration", "General Question", "Open Source"];

export function Contact({ config }: { config: PortfolioSiteConfig }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const { trackContactSubmit } = useAnalytics();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const contactMethods = [
    { label: "Email", value: config.email, href: `mailto:${config.email}`, icon: Mail },
    { label: "LinkedIn", value: config.linkedinLabel, href: config.linkedin, icon: Linkedin },
    { label: "Kaggle", value: config.kaggleLabel, href: config.kaggle, icon: Globe },
    { label: "GitHub", value: config.githubHandle, href: config.github, icon: Github }
  ];

  const validateForm = (formData: FormData) => {
    const nextErrors: FieldErrors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (name.length < 2) {
      nextErrors.name = "Please enter at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (message.length < 20) {
      nextErrors.message = "Please include at least 20 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validateForm(formData);

    setErrors(nextErrors);
    setErrorMessage("");

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Contact request failed");
      }

      setStatus("sent");
      trackContactSubmit();
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
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
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-text-muted">
                  <span>Name</span>
                  <input
                    required
                    name="name"
                    aria-invalid={Boolean(errors.name)}
                    className="w-full rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                  />
                  {errors.name && <span className="block text-xs text-red-300">{errors.name}</span>}
                </label>
                <label className="space-y-2 text-sm text-text-muted">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                  />
                  {errors.email && <span className="block text-xs text-red-300">{errors.email}</span>}
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
                  aria-invalid={Boolean(errors.message)}
                  className="w-full resize-none rounded-xl border border-dark-border bg-dark-bg/70 px-4 py-3 text-text-primary outline-none transition focus:border-brand-purple"
                />
                {errors.message && <span className="block text-xs text-red-300">{errors.message}</span>}
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
              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200"
                >
                  <CheckCircle2 size={20} />
                  <span>Thank you. Your message is in my inbox and I&apos;ll reply soon.</span>
                </motion.div>
              )}
              {status === "error" && <p className="text-sm text-red-300">{errorMessage}</p>}
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
