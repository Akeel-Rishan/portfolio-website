"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

type MediumFollowPopupProps = {
  mediumUrl: string;
  delayMs?: number;
  cooldownDays?: number;
};

const SESSION_KEY = "medium_popup_seen";
const DISMISSED_KEY = "medium_popup_dismissed_at";
const EXIT_DURATION_MS = 300;
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

function safeGetStorage(storage: Storage | undefined, key: string) {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSetStorage(storage: Storage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // Storage can fail in strict privacy modes. The popup should still close.
  }
}

function isDismissedWithinCooldown(cooldownDays: number) {
  const dismissedAt = safeGetStorage(window.localStorage, DISMISSED_KEY);

  if (!dismissedAt) {
    return false;
  }

  const dismissedTime = Number(dismissedAt);
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;

  return Number.isFinite(dismissedTime) && Date.now() - dismissedTime < cooldownMs;
}

function shouldShowPopup(cooldownDays: number) {
  if (IS_DEVELOPMENT) {
    return true;
  }

  const alreadySeenThisSession = safeGetStorage(window.sessionStorage, SESSION_KEY) === "true";

  return !alreadySeenThisSession && !isDismissedWithinCooldown(cooldownDays);
}

export function MediumFollowPopup({
  mediumUrl,
  delayMs = 5000,
  cooldownDays = 7
}: MediumFollowPopupProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const followButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string>("");
  const closeTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 768;

  useFocusTrap(dialogRef, isVisible && !isClosing);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(
      () => {
        setIsMounted(false);
        setIsClosing(false);
        document.body.style.overflow = previousOverflowRef.current;
        previousFocusRef.current?.focus();
      },
      prefersReducedMotion ? 0 : EXIT_DURATION_MS
    );
  }, [prefersReducedMotion]);

  const closePopup = useCallback(() => {
    if (isClosing) {
      return;
    }

    safeSetStorage(window.sessionStorage, SESSION_KEY, "true");
    safeSetStorage(window.localStorage, DISMISSED_KEY, String(Date.now()));
    setIsClosing(true);
    setIsVisible(false);
    finishClose();
  }, [finishClose, isClosing]);

  const openMedium = useCallback(() => {
    window.open(mediumUrl, "_blank", "noopener noreferrer");
    closePopup();
  }, [closePopup, mediumUrl]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!shouldShowPopup(cooldownDays)) {
        return;
      }

      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setIsMounted(true);
      setIsVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldownDays, delayMs]);

  useEffect(() => {
    if (!isVisible || isClosing) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      followButtonRef.current?.focus();
    }, 90);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isClosing, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closePopup, isVisible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  const modalInitial = isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 };
  const modalAnimate = isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const modalExit = isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 };

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 pt-16 md:items-center md:p-6"
          role="presentation"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={transition}
        >
          <motion.button
            aria-label="Close Medium follow popup"
            className="absolute inset-0 cursor-default bg-[rgba(0,0,0,0.75)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={closePopup}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="medium-popup-title"
            aria-describedby="medium-popup-description"
            className={cn(
              "relative w-full overflow-hidden border border-[rgba(124,58,237,0.35)] bg-[#111118] text-white shadow-[0_30px_90px_rgba(0,0,0,0.65)]",
              "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.2),transparent_30%)] before:content-['']",
              isMobile ? "rounded-t-[28px] px-5 pb-6 pt-5" : "max-w-[440px] rounded-3xl p-7"
            )}
            initial={modalInitial}
            animate={modalAnimate}
            exit={modalExit}
            transition={transition}
          >
            <div className="relative z-10">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_28px_rgba(124,58,237,0.32)]">
                    <Image
                      src="/medium-logo-icon.webp"
                      alt="Medium"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      priority={false}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Medium</p>
                    <h2 id="medium-popup-title" className="mt-1 text-xl font-bold text-white md:text-2xl">
                      Follow my AI writing
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close popup"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  onClick={closePopup}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p id="medium-popup-description" className="text-sm leading-6 text-slate-300 md:text-base">
                I share practical articles on AI engineering, LLM apps, agents, RAG systems, and real-world software
                builds.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  ref={followButtonRef}
                  type="button"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.38)] transition hover:shadow-[0_0_42px_rgba(6,182,212,0.42)] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 24px rgba(124,58,237,0.35)",
                            "0 0 42px rgba(6,182,212,0.45)",
                            "0 0 24px rgba(124,58,237,0.35)"
                          ]
                        }
                  }
                  transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  onClick={openMedium}
                >
                  Follow on Medium
                  <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </motion.button>

                <button
                  type="button"
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  onClick={closePopup}
                >
                  Maybe later
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">No spam. Only quality content.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
