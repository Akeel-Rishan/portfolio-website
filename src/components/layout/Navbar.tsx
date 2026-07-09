"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["home", ...navLinks.map((link) => link.href.replace("#", "")), "demo"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (!href.startsWith("#")) return;
    if (pathname !== "/") return;

    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      event.preventDefault();
    }

    handleNavClick(href);
  };

  const getHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    return pathname === "/" ? href : `/${href}`;
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        isScrolled ? "border-b border-dark-border bg-dark-bg/78 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 w-[min(1120px,calc(100%-32px))] items-center justify-between">
        <Link
          href={pathname === "/" ? "#home" : "/"}
          onClick={(event) => {
            if (pathname !== "/") return;
            event.preventDefault();
            handleNavClick("#home");
          }}
          className="font-mono text-lg font-semibold tracking-normal gradient-text"
        >
          &lt;{SITE.name} /&gt;
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isHashLink = link.href.startsWith("#");
            const active = isHashLink ? pathname === "/" && activeSection === id : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={getHref(link.href)}
                onClick={(event) => handleLinkClick(event, link.href)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-text-muted transition duration-300 hover:bg-white/5 hover:text-text-primary",
                  active && "bg-brand-purple/12 text-brand-cyan"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark-border text-text-primary transition hover:border-brand-purple md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-dark-border bg-dark-bg/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          isOpen ? "max-h-80 border-b" : "max-h-0 border-b-0"
        )}
      >
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col gap-2 py-4">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isHashLink = link.href.startsWith("#");
            const active = isHashLink ? pathname === "/" && activeSection === id : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={getHref(link.href)}
                onClick={(event) => handleLinkClick(event, link.href)}
                className={cn(
                  "rounded-xl px-4 py-3 text-left text-sm font-medium text-text-muted transition hover:bg-white/5 hover:text-text-primary",
                  active && "bg-brand-purple/12 text-brand-cyan"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
