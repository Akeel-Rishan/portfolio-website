"use client";

import { motion } from "framer-motion";
import { ArticleCarousel } from "@/components/ui/ArticleCarousel";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import type { Article } from "@/types";

export function Articles({ articles }: { articles: Article[] }) {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="articles" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="pink">Articles</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Articles
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <ArticleCarousel articles={articles} />
        </motion.div>
      </motion.div>
    </section>
  );
}
