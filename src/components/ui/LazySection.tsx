"use client";

import dynamic from "next/dynamic";
import { ComponentType, Suspense } from "react";

type LazySectionOptions = {
  skeleton?: React.ReactNode;
};

const defaultSkeleton = (
  <section className="section-shell">
    <div className="h-72 animate-pulse rounded-lg border border-dark-border bg-white/[0.04]" />
  </section>
);

export function createLazySection<TProps extends object>(
  loader: () => Promise<{ default: ComponentType<TProps> }>,
  options: LazySectionOptions = {}
) {
  const DynamicSection = dynamic(loader, {
    ssr: false,
    loading: () => <>{options.skeleton ?? defaultSkeleton}</>
  });

  function LazySection(props: TProps) {
    return (
      <Suspense fallback={options.skeleton ?? defaultSkeleton}>
        <DynamicSection {...props} />
      </Suspense>
    );
  }

  LazySection.displayName = "LazySection";
  return LazySection;
}
