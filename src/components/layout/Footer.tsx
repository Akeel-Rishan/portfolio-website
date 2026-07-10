import { Github, Linkedin, Twitter } from "lucide-react";
import { navLinks, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border bg-dark-card/60">
      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          <p className="font-mono text-lg font-semibold gradient-text">&lt;{SITE.name} /&gt;</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">{SITE.tagline}</p>
        </div>

        <nav className="flex flex-wrap justify-start gap-3 md:justify-center">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm text-text-muted transition hover:bg-white/5 hover:text-brand-cyan">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:justify-end">
          <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan">
            <Github size={18} />
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan">
            <Linkedin size={18} />
          </a>
          <a href={SITE.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan">
            <Twitter size={18} />
          </a>
        </div>
      </div>
      <div className="border-t border-dark-border py-4">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col justify-between gap-2 text-sm text-text-muted sm:flex-row">
          <p>&copy; {year} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
