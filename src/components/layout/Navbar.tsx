"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Twitter, X } from "lucide-react";
import { navLinks, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const mobileNavLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Articles", href: "#articles" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

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
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition duration-300",
          isOpen || isScrolled ? "border-b border-dark-border bg-dark-bg/95 backdrop-blur-xl" : "bg-transparent"
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

          <div className="hidden items-center gap-2 lg:flex">
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
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="relative inline-flex h-11 w-11 items-center justify-center text-text-primary lg:hidden"
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            <span
              className={cn(
                "absolute h-0.5 w-6 rounded-full bg-text-primary transition duration-300",
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-2 rotate-0"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-6 rounded-full bg-text-primary transition duration-300",
                isOpen ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-6 rounded-full bg-text-primary transition duration-300",
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-2 rotate-0"
              )}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              className="fixed inset-0 z-[110] bg-black/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              className="fixed inset-0 z-[120] flex h-dvh min-h-dvh w-screen flex-col overflow-hidden bg-[#0A0A0F] shadow-[0_20px_80px_rgba(0,0,0,0.7)] lg:hidden"
              style={{ backgroundColor: "#0A0A0F" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-5">
                <span className="font-mono text-lg font-semibold tracking-normal gradient-text">
                  &lt;{SITE.name} /&gt;
                </span>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={closeMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-150 hover:border-brand-purple/50 hover:bg-brand-purple/15"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0A0F] px-4 py-5">
                {mobileNavLinks.map((link, index) => {
                  const id = link.href.replace("#", "");
                  const active = pathname === "/" && activeSection === id;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                      className="w-full"
                    >
                      <Link
                        href={getHref(link.href)}
                        onClick={(event) => handleLinkClick(event, link.href)}
                        className={cn(
                          "mb-3 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center text-xl font-semibold text-white shadow-lg shadow-black/20 transition-colors duration-150 hover:border-brand-cyan/40 hover:bg-brand-purple/10 hover:text-brand-cyan",
                          active && "bg-brand-purple/12 text-brand-cyan"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex shrink-0 justify-center gap-6 border-t border-white/10 px-6 py-6">
                {[
                  { href: SITE.github, label: "GitHub", icon: Github },
                  { href: SITE.linkedin, label: "LinkedIn", icon: Linkedin },
                  { href: SITE.twitter, label: "Twitter", icon: Twitter }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all duration-150 hover:bg-brand-purple/20 hover:text-brand-purple"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
