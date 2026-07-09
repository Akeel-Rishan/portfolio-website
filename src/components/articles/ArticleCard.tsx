"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Article } from "@/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card glow className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/10] border-b border-dark-border bg-dark-bg/70">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">{article.platform}</p>
        <h3 className="mt-3 flex-1 text-lg font-semibold leading-snug text-text-primary">{article.title}</h3>

        <Button
          href={article.url}
          target="_blank"
          rel="noreferrer"
          variant="outline"
          size="sm"
          icon={<ArrowUpRight size={16} />}
          className="mt-5 w-full"
        >
          Read on Medium
        </Button>
      </div>
    </Card>
  );
}
