"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

type ArticleCarouselProps = {
  articles: Article[];
};

type PositionVariant = "center" | "left" | "right" | "hidden";

const AUTOPLAY_DELAY = 2500;
const CLICK_DEBOUNCE_MS = 300;

function getResponsiveMotion(width: number, prefersReduced: boolean) {
  if (prefersReduced) {
    return {
      sideX: 0,
      hiddenX: 0,
      sideRotate: 0,
      hiddenRotate: 0,
      sideOpacity: 0.55,
      duration: 0.2,
      cardWidth: "min(380px, 85vw)"
    };
  }

  if (width > 0 && width < 640) {
    return {
      sideX: 20,
      hiddenX: 120,
      sideRotate: 8,
      hiddenRotate: 14,
      sideOpacity: 0.3,
      duration: 0.7,
      cardWidth: "85vw"
    };
  }

  if (width > 0 && width < 1024) {
    return {
      sideX: 40,
      hiddenX: 150,
      sideRotate: 14,
      hiddenRotate: 22,
      sideOpacity: 0.5,
      duration: 0.7,
      cardWidth: "min(320px, 78vw)"
    };
  }

  return {
    sideX: 60,
    hiddenX: 180,
    sideRotate: 18,
    hiddenRotate: 28,
    sideOpacity: 0.65,
    duration: 0.7,
    cardWidth: "380px"
  };
}

function getPositionVariant(index: number, selectedIndex: number, total: number): PositionVariant {
  const previous = (selectedIndex - 1 + total) % total;
  const next = (selectedIndex + 1) % total;

  if (index === selectedIndex) return "center";
  if (index === previous) return "left";
  if (index === next) return "right";

  return "hidden";
}

export function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastClickAt = useRef(0);
  const prefersReduced = Boolean(useReducedMotion());
  const { width } = useWindowSize();

  const autoplayPlugin = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: articles.length > 2,
      align: "center",
      skipSnaps: false,
      dragFree: false,
      containScroll: false
    },
    prefersReduced || articles.length <= 1 ? [] : [autoplayPlugin.current]
  );

  const motionConfig = useMemo(() => getResponsiveMotion(width, prefersReduced), [prefersReduced, width]);

  const variants = useMemo<Variants>(
    () => ({
      center: {
        scale: prefersReduced ? 1 : 1.12,
        x: 0,
        rotateY: 0,
        opacity: 1,
        zIndex: 30,
        transition: {
          duration: motionConfig.duration,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      left: {
        scale: prefersReduced ? 0.98 : 0.88,
        x: -motionConfig.sideX,
        rotateY: motionConfig.sideRotate,
        opacity: motionConfig.sideOpacity,
        zIndex: 20,
        transition: {
          duration: motionConfig.duration,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      right: {
        scale: prefersReduced ? 0.98 : 0.88,
        x: motionConfig.sideX,
        rotateY: -motionConfig.sideRotate,
        opacity: motionConfig.sideOpacity,
        zIndex: 20,
        transition: {
          duration: motionConfig.duration,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      hidden: {
        scale: 0.75,
        x: 0,
        rotateY: 0,
        opacity: 0,
        zIndex: 0,
        transition: {
          duration: prefersReduced ? 0 : motionConfig.duration,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    }),
    [motionConfig, prefersReduced]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    if (prefersReduced || articles.length <= 1 || isPaused) {
      autoplay.stop();
      return;
    }

    autoplay.play();
  }, [articles.length, emblaApi, isPaused, prefersReduced]);

  const scrollTo = useCallback(
    (index: number) => {
      const now = Date.now();
      if (!emblaApi || now - lastClickAt.current < CLICK_DEBOUNCE_MS) return;

      lastClickAt.current = now;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const toggleAutoplay = () => {
    setIsPaused((current) => !current);
  };

  if (articles.length === 0) return null;

  if (articles.length === 1) {
    return (
      <div className="mx-auto max-w-[380px]" aria-label="Article carousel">
        <ArticleCard article={articles[0]} />
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      aria-label="Article carousel, auto-advancing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <button
        type="button"
        aria-label={isPaused ? "Resume article carousel" : "Pause article carousel"}
        onClick={toggleAutoplay}
        className="absolute right-2 top-2 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-dark-card/85 text-text-primary shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-brand-cyan hover:text-brand-cyan"
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>

      <div className="relative overflow-hidden" style={{ perspective: "1200px" }}>
        <div ref={emblaRef} className="overflow-hidden">
          <div
            className="flex items-center py-10 pb-14"
            style={{
              transformStyle: "preserve-3d"
            }}
          >
            {articles.map((article, index) => {
              const variant = getPositionVariant(index, selectedIndex, articles.length);
              const isCenter = variant === "center";
              const isHidden = variant === "hidden";

              return (
                <div
                  key={`${article.title}-${index}`}
                  className={cn("flex-none px-4", isHidden && "pointer-events-none")}
                  style={{ width: motionConfig.cardWidth }}
                >
                  <motion.div
                    animate={variant}
                    variants={variants}
                    style={{
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                      boxShadow: isCenter
                        ? "0 25px 60px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)"
                        : "0 10px 30px rgba(0,0,0,0.4)",
                      borderColor: isCenter ? "rgba(124,58,237,0.5)" : "rgba(30,30,46,1)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "12px",
                      visibility: isHidden ? "hidden" : "visible"
                    }}
                  >
                    <motion.div
                      animate={
                        isCenter && !prefersReduced
                          ? {
                              y: [0, -6, 6, 0]
                            }
                          : { y: 0 }
                      }
                      transition={
                        isCenter && !prefersReduced
                          ? {
                              duration: 3,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "loop"
                            }
                          : { duration: 0.2 }
                      }
                      style={{
                        willChange: "transform",
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden"
                      }}
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 z-40 h-full w-20 bg-gradient-to-r from-dark-bg to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-40 h-full w-20 bg-gradient-to-l from-dark-bg to-transparent sm:w-32" />
      </div>

      <p className="sr-only" aria-live="polite">
        Active article: {articles[selectedIndex]?.title}
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {articles.map((article, index) => (
          <button
            key={`${article.title}-dot`}
            type="button"
            onClick={() => scrollTo(index)}
            className="h-2 rounded transition-all duration-300"
            style={{
              width: index === selectedIndex ? "24px" : "8px",
              background: index === selectedIndex ? "#7C3AED" : "rgba(124,58,237,0.3)"
            }}
            aria-label={`Go to article ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
