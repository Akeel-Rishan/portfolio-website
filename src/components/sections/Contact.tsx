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
        <motion.div variants={fadeInLeft} className="order-first text-center lg:order-first lg:text-left">
          <Badge variant="pink">Contact</Badge>
          <h2 className="mt-4 text-center text-2xl font-bold leading-tight sm:text-3xl lg:text-left lg:text-4xl">
            Let&apos;s build an AI system that earns trust.
          </h2>
          <p className="mt-3 text-center text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:mt-4 lg:text-left">
            Reach out for LLM product engineering, RAG architecture, agent systems,
            evaluation design, or production readiness reviews.
          </p>
          <div className="mt-8 grid gap-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              const isEmail = method.label === "Email";
              return (
                <a key={method.label} href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group">
                  <Card glow className="flex flex-row items-center gap-3 p-4 sm:gap-4 sm:p-5 lg:p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/25 bg-brand-purple/10 text-brand-cyan transition group-hover:shadow-neon sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-xs font-medium text-text-muted sm:text-sm">{method.label}</span>
                      <span
                        title={method.value}
                        className={
                          isEmail
                            ? "block max-w-full truncate text-[12px] font-semibold leading-5 text-text-primary min-[390px]:text-[13px] sm:text-base"
                            : "block max-w-full truncate text-sm font-semibold leading-5 text-text-primary sm:text-base"
                        }
                      >
                        {method.value}
                      </span>
                    </span>
                  </Card>
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} className="order-last lg:order-last">
          <Card glow className="p-4 sm:p-6">
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
                <label className="space-y-1.5 text-xs font-medium text-text-muted sm:space-y-2 sm:text-sm">
                  <span>Name</span>
                  <input
                    required
                    name="name"
                    aria-invalid={Boolean(errors.name)}
                    style={{ fontSize: "16px" }}
                    className="min-h-12 w-full rounded-xl border border-dark-border bg-dark-bg/70 px-3 py-3 text-base text-text-primary outline-none transition focus:border-brand-purple sm:px-4 sm:py-3.5"
                  />
                  {errors.name && <span className="block break-words text-xs text-red-300 sm:text-sm">{errors.name}</span>}
                </label>
                <label className="space-y-1.5 text-xs font-medium text-text-muted sm:space-y-2 sm:text-sm">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    aria-invalid={Boolean(errors.email)}
                    style={{ fontSize: "16px" }}
                    className="min-h-12 w-full rounded-xl border border-dark-border bg-dark-bg/70 px-3 py-3 text-base text-text-primary outline-none transition focus:border-brand-purple sm:px-4 sm:py-3.5"
                  />
                  {errors.email && <span className="block break-words text-xs text-red-300 sm:text-sm">{errors.email}</span>}
                </label>
              </div>
              <label className="space-y-1.5 text-xs font-medium text-text-muted sm:space-y-2 sm:text-sm">
                <span>Subject</span>
                <select
                  required
                  name="subject"
                  style={{ fontSize: "16px", appearance: "none" }}
                  className="min-h-12 w-full rounded-xl border border-dark-border bg-dark-bg/70 px-3 py-3 text-base text-text-primary outline-none transition focus:border-brand-purple sm:px-4 sm:py-3.5"
                >
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5 text-xs font-medium text-text-muted sm:space-y-2 sm:text-sm">
                <span>Message</span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  aria-invalid={Boolean(errors.message)}
                  style={{ fontSize: "16px" }}
                  className="min-h-[100px] w-full resize-none rounded-xl border border-dark-border bg-dark-bg/70 px-3 py-3 text-base text-text-primary outline-none transition focus:border-brand-purple sm:min-h-[120px] sm:px-4 sm:py-3.5"
                />
                {errors.message && <span className="block break-words text-xs text-red-300 sm:text-sm">{errors.message}</span>}
              </label>
              <Button
                type="submit"
                size="lg"
                icon={<Send size={18} />}
                disabled={status === "sending"}
                className="min-h-12 w-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8 sm:py-3"
              >
                {status === "sending" ? "Sending..." : "Submit Message"}
              </Button>
              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 px-4 text-center text-sm text-emerald-200 sm:text-base"
                >
                  <CheckCircle2 size={20} />
                  <span>Thank you. Your message is in my inbox and I&apos;ll reply soon.</span>
                </motion.div>
              )}
              {status === "error" && <p className="break-words text-xs text-red-300 sm:text-sm">{errorMessage}</p>}
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
