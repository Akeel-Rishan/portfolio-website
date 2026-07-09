"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { articles } from "@/lib/constants";

export function Articles() {
  const { ref, inView } = useScrollReveal<HTMLElement>();

  return (
    <section id="articles" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="pink">Articles</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Articles
          </h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            Thoughts, tutorials, and insights on AI, software engineering, SaaS, and technology.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <motion.div key={article.title} variants={fadeInUp}>
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
