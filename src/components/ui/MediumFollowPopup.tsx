"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";

type MediumFollowPopupProps = {
  mediumUrl: string;
  delayMs?: number;
  cooldownDays?: number;
};

type BodyScrollState = {
  overflow: string;
  position: string;
  top: string;
  width: string;
  scrollY: number;
  isIOS: boolean;
};

const SESSION_KEY = "medium_popup_seen";
const DISMISSED_KEY = "medium_popup_dismissed_at";
const EXIT_DURATION_MS = 350;
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

function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
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
  const bodyScrollStateRef = useRef<BodyScrollState | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobile-sm";
  const isMobileSm = bp === "mobile-sm";
  const isTablet = bp === "tablet";

  useFocusTrap(dialogRef, isVisible && !isClosing);

  const unlockBodyScroll = useCallback(() => {
    const state = bodyScrollStateRef.current;

    if (!state) {
      return;
    }

    document.body.style.overflow = state.overflow;
    document.body.style.position = state.position;
    document.body.style.top = state.top;
    document.body.style.width = state.width;

    if (state.isIOS) {
      window.scrollTo(0, state.scrollY);
    }

    bodyScrollStateRef.current = null;
  }, []);

  const lockBodyScroll = useCallback(() => {
    if (bodyScrollStateRef.current) {
      return;
    }

    const isIOS = isIOSDevice();
    const scrollY = window.scrollY;

    bodyScrollStateRef.current = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      scrollY,
      isIOS
    };

    if (isIOS) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return;
    }

    document.body.style.overflow = "hidden";
  }, []);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(
      () => {
        setIsMounted(false);
        setIsClosing(false);
        unlockBodyScroll();
        previousFocusRef.current?.focus();
      },
      prefersReduced ? 0 : EXIT_DURATION_MS
    );
  }, [prefersReduced, unlockBodyScroll]);

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

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 80 || info.velocity.y > 300) {
        closePopup();
      }
    },
    [closePopup]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!shouldShowPopup(cooldownDays)) {
        return;
      }

      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lockBodyScroll();
      setIsMounted(true);
      setIsVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldownDays, delayMs, lockBodyScroll]);

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

      unlockBodyScroll();
    };
  }, [unlockBodyScroll]);

  if (!isMounted) {
    return null;
  }

  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94, y: 8 }
  };

  const mobileVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" }
  };

  const reducedVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = prefersReduced ? reducedVariants : isMobile ? mobileVariants : desktopVariants;
  const modalTransition = prefersReduced
    ? { duration: 0.01 }
    : isMobile
      ? { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
      : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const };

  const backdropTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: isMobile ? 0.35 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const };

  const modalStyle: CSSProperties = {
    backgroundColor: "#111118",
    border: isMobile ? "none" : "1px solid rgba(124,58,237,0.35)",
    borderTop: isMobile ? "1px solid rgba(124,58,237,0.25)" : undefined,
    borderRadius: isMobile ? "24px 24px 0 0" : "16px",
    boxShadow: isMobile
      ? "0 -8px 40px rgba(124,58,237,0.1), 0 -4px 20px rgba(0,0,0,0.4)"
      : "0 0 40px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.5)",
    padding: isMobile ? "24px 20px calc(24px + env(safe-area-inset-bottom))" : isTablet ? "28px" : "36px",
    position: isMobile ? "fixed" : "relative",
    bottom: isMobile ? 0 : undefined,
    left: isMobile ? 0 : undefined,
    right: isMobile ? 0 : undefined,
    width: isMobile ? "100%" : isTablet ? "min(440px, 90vw)" : "460px",
    maxHeight: isMobile ? undefined : "90vh",
    overflowY: "auto",
    zIndex: 9999,
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain"
  };

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 flex justify-center px-4",
            isMobile ? "items-end p-0" : "items-center p-6"
          )}
          role="presentation"
          style={{ zIndex: 9997 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={backdropTransition}
        >
          <motion.button
            aria-label="Close Medium follow popup"
            className="fixed inset-0 cursor-default bg-[rgba(0,0,0,0.75)]"
            style={{
              zIndex: 9998,
              WebkitBackdropFilter: "blur(4px)",
              backdropFilter: "blur(4px)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={closePopup}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="medium-popup-title"
            aria-describedby="medium-popup-description"
            className={cn(
              "relative overflow-hidden text-white before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.2),transparent_30%)] before:content-['']",
              isMobile && "[max-height:85vh] [max-height:85dvh]"
            )}
            style={modalStyle}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={modalTransition}
            drag={isMobile ? "y" : false}
            dragConstraints={isMobile ? { top: 0 } : undefined}
            dragElastic={isMobile ? 0.2 : 0}
            onDragEnd={isMobile ? handleDragEnd : undefined}
          >
            {isMobile && (
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.15)",
                  margin: "0 auto 20px auto",
                  flexShrink: 0
                }}
              />
            )}

            <div className="relative z-10">
              <div className={cn("flex items-start justify-between gap-4", isMobile ? "mb-5" : "mb-6")}>
                <div className="flex min-w-0 items-center gap-3">
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
                  <div className="min-w-0">
                    <p
                      className="font-semibold uppercase tracking-[0.24em] text-cyan-300"
                      style={{ fontSize: isMobileSm ? 9 : 10 }}
                    >
                      WRITING ON MEDIUM
                    </p>
                    <h2
                      id="medium-popup-title"
                      className="mt-1 font-bold leading-tight text-white"
                      style={{ fontSize: isMobile ? 19 : 22 }}
                    >
                      Enjoying My Content?
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close popup"
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  style={{
                    width: isMobile ? 44 : 36,
                    height: isMobile ? 44 : 36,
                    padding: isMobile ? 6 : 8
                  }}
                  onClick={closePopup}
                >
                  <span className="flex h-full w-full items-center justify-center">
                    <X className={isMobile ? "h-4 w-4" : "h-4 w-4"} aria-hidden="true" />
                  </span>
                </button>
              </div>

              <p
                id="medium-popup-description"
                className="leading-6 text-slate-300"
                style={{ fontSize: isMobileSm ? 13 : isMobile ? 14 : 16 }}
              >
                I share practical articles on AI engineering, LLM apps, agents, RAG systems, and real-world software
                builds.
              </p>

              <div className={cn("flex flex-col gap-3", isMobile ? "mt-6" : "mt-7")}>
                <motion.button
                  ref={followButtonRef}
                  type="button"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.38)] transition hover:shadow-[0_0_42px_rgba(6,182,212,0.42)] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  style={{
                    minHeight: 44,
                    padding: isMobile ? "13px 20px" : "14px 24px",
                    fontSize: isMobileSm ? 14 : 15,
                    whiteSpace: "nowrap"
                  }}
                  animate={
                    prefersReduced
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 24px rgba(124,58,237,0.35)",
                            "0 0 42px rgba(6,182,212,0.45)",
                            "0 0 24px rgba(124,58,237,0.35)"
                          ]
                        }
                  }
                  transition={prefersReduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  onClick={openMedium}
                >
                  <span className="truncate">Follow Me on Medium</span>
                  {!isMobileSm && (
                    <ExternalLink className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  )}
                </motion.button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-white/10 font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  style={{
                    minHeight: 44,
                    padding: isMobile ? "6px 12px" : "10px 20px",
                    fontSize: 13
                  }}
                  onClick={closePopup}
                >
                  Maybe Later
                </button>
              </div>

              <p className="mt-4 text-center text-slate-500" style={{ fontSize: 11 }}>
                No spam. Only quality content.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
