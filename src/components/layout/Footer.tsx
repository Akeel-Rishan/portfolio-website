import { Github, Linkedin, Twitter } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border bg-dark-card/40">
      <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col items-center justify-between gap-4 py-8 text-sm text-text-muted sm:flex-row">
        <p>&copy; {year} {SITE.name}. Built for production AI work.</p>
        <div className="flex items-center gap-3">
          <a href={SITE.github} aria-label="GitHub" className="transition hover:text-brand-cyan">
            <Github size={18} />
          </a>
          <a href={SITE.linkedin} aria-label="LinkedIn" className="transition hover:text-brand-cyan">
            <Linkedin size={18} />
          </a>
          <a href={SITE.twitter} aria-label="Twitter" className="transition hover:text-brand-cyan">
            <Twitter size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
