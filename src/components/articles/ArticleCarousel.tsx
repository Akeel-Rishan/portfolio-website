"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

const AUTOPLAY_MS = 2000;
const TRANSITION_SECONDS = 0.68;

function buildDisplayArticles(articles: Article[]) {
  if (articles.length === 0) return [];
  if (articles.length >= 4) return articles;

  return Array.from({ length: 4 }, (_, index) => articles[index % articles.length]);
}

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const midpoint = total / 2;

  if (offset > midpoint) offset -= total;
  if (offset < -midpoint) offset += total;

  return offset;
}

function getCoverflowPose(offset: number) {
  if (offset === 0) {
    return {
      x: "-50%",
      y: "-52%",
      scale: 1.12,
      rotateY: 0,
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1.08)"
    };
  }

  if (offset === -1) {
    return {
      x: "-108%",
      y: "-48%",
      scale: 0.88,
      rotateY: 28,
      opacity: 0.76,
      zIndex: 20,
      filter: "brightness(0.82)"
    };
  }

  if (offset === 1) {
    return {
      x: "8%",
      y: "-48%",
      scale: 0.88,
      rotateY: -28,
      opacity: 0.76,
      zIndex: 20,
      filter: "brightness(0.82)"
    };
  }

  return {
    x: offset < 0 ? "-160%" : "60%",
    y: "-45%",
    scale: 0.72,
    rotateY: offset < 0 ? 38 : -38,
    opacity: 0,
    zIndex: 0,
    filter: "brightness(0.65)"
  };
}

function isVisibleOffset(offset: number) {
  return Math.abs(offset) <= 1;
}

export function ArticleCarousel({ articles }: { articles: Article[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayArticles = useMemo(() => buildDisplayArticles(articles), [articles]);
  const canAutoplay = displayArticles.length > 1;

  const activeArticle = displayArticles[activeIndex];
  const carouselItems = useMemo(
    () =>
      displayArticles.map((article, index) => ({
        article,
        index,
        offset: getCircularOffset(index, activeIndex, displayArticles.length)
      })),
    [activeIndex, displayArticles]
  );

  useEffect(() => {
    if (!canAutoplay || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % displayArticles.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [canAutoplay, displayArticles.length, isPaused]);

  useEffect(() => {
    setActiveIndex(0);
  }, [displayArticles.length]);

  if (!displayArticles.length) return null;

  const pauseForInteraction = () => {
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 4500);
  };

  const goToArticle = (index: number) => {
    pauseForInteraction();
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    pauseForInteraction();
    setActiveIndex((current) => (current - 1 + displayArticles.length) % displayArticles.length);
  };

  const goToNext = () => {
    pauseForInteraction();
    setActiveIndex((current) => (current + 1) % displayArticles.length);
  };

  return (
    <div
      className="relative overflow-hidden py-8 sm:py-10 lg:py-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="relative mx-auto h-[430px] max-w-6xl sm:h-[470px] md:h-[500px] lg:h-[530px]"
        style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[58%] h-32 w-[min(620px,80%)] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-10 left-0 z-40 w-16 bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-10 right-0 z-40 w-16 bg-gradient-to-l from-dark-bg via-dark-bg/70 to-transparent sm:w-24" />
        <button
          type="button"
          aria-label="Previous article"
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark-card/85 text-text-primary shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-brand-cyan hover:text-brand-cyan sm:left-4"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next article"
          onClick={goToNext}
          className="absolute right-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark-card/85 text-text-primary shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-brand-cyan hover:text-brand-cyan sm:right-4"
        >
          <ChevronRight size={20} />
        </button>

        {carouselItems.map(({ article, index, offset }) => {
          const pose = getCoverflowPose(offset);
          const isActive = index === activeIndex;
          const isVisible = isVisibleOffset(offset);

          return (
            <motion.div
              key={`${article.title}-${index}`}
              className={cn(
                "absolute left-1/2 top-1/2 w-[78%] max-w-[340px] will-change-transform sm:w-[58%] sm:max-w-[380px] md:w-[44%] lg:w-[34%]",
                !isActive && "pointer-events-none",
                !isVisible && "invisible"
              )}
              style={{
                zIndex: pose.zIndex,
                transformStyle: "preserve-3d"
              }}
              animate={{
                x: pose.x,
                y: pose.y,
                scale: pose.scale,
                rotateY: pose.rotateY,
                opacity: pose.opacity,
                filter: pose.filter
              }}
              transition={{
                duration: isVisible ? TRANSITION_SECONDS : 0,
                ease: [0.42, 0, 0.2, 1]
              }}
            >
              <motion.div
                animate={isActive ? { y: [0, -7, 0] } : { y: 0 }}
                transition={
                  isActive
                    ? {
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                      }
                    : { duration: 0.35 }
                }
                className={cn(
                  "rounded-xl transition-shadow duration-700",
                  isActive && "shadow-[0_24px_80px_rgba(124,58,237,0.38),0_0_46px_rgba(6,182,212,0.20)]"
                )}
              >
                <ArticleCard article={article} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {articles.map((article, index) => (
          <button
            key={article.title}
            type="button"
            aria-label={`Show article ${index + 1}`}
            onClick={() => goToArticle(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === activeIndex % articles.length ? "w-8 bg-brand-cyan" : "w-2 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      <div className="mx-auto mt-5 flex max-w-5xl gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {articles.map((article, index) => {
          const isSelected = index === activeIndex % articles.length;

          return (
            <button
              key={article.title}
              type="button"
              onClick={() => goToArticle(index)}
              aria-pressed={isSelected}
              className={cn(
                "min-w-[220px] rounded-xl border px-4 py-3 text-left transition duration-300 sm:min-w-[260px]",
                isSelected
                  ? "border-brand-cyan/70 bg-brand-cyan/10 shadow-[0_0_24px_rgba(6,182,212,0.18)]"
                  : "border-dark-border bg-dark-card/55 hover:border-brand-purple/70 hover:bg-white/[0.04]"
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan">
                {(index + 1).toString().padStart(2, "0")} / {article.platform}
              </span>
              <span className="mt-2 line-clamp-2 block text-sm font-semibold leading-snug text-text-primary">
                {article.title}
              </span>
            </button>
          );
        })}
      </div>

      {activeArticle ? (
        <p className="sr-only" aria-live="polite">
          Featured article: {activeArticle.title}
        </p>
      ) : null}
    </div>
  );
}
