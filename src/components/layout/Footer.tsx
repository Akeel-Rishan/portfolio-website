import { Github, Linkedin, Twitter } from "lucide-react";
import { navLinks, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border bg-dark-card/60">
      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] gap-8 py-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="mx-auto max-w-sm md:mx-0">
          <p className="font-mono text-lg font-semibold gradient-text">&lt;{SITE.name} /&gt;</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">{SITE.tagline}</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:col-span-2 md:flex md:flex-wrap md:justify-center lg:col-span-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="flex min-h-11 items-center justify-center rounded-full px-3 py-2 text-base text-text-muted transition hover:bg-white/5 hover:text-brand-cyan md:text-sm">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-center gap-3 md:justify-end">
          <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan md:h-10 md:w-10">
            <Github size={18} />
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan md:h-10 md:w-10">
            <Linkedin size={18} />
          </a>
          <a href={SITE.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan md:h-10 md:w-10">
            <Twitter size={18} />
          </a>
        </div>
      </div>
      <div className="border-t border-dark-border py-4">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col items-center justify-between gap-2 text-center text-xs text-text-muted sm:flex-row sm:text-left sm:text-sm">
          <p>&copy; {year} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
