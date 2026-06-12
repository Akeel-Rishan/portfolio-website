"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-6 text-text-primary">
      <div className="grid w-full max-w-4xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="relative h-72">
          <div className="absolute inset-8 rounded-full border border-brand-purple/40 bg-brand-purple/10 shadow-neon" />
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-brand-cyan/50 bg-dark-card">
            <div className="absolute left-7 top-8 h-4 w-4 rounded-full bg-brand-cyan" />
            <div className="absolute right-7 top-8 h-4 w-4 rounded-full bg-brand-purple" />
            <div className="absolute bottom-8 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-text-muted" />
          </div>
          <div className="absolute bottom-7 left-16 h-2 w-44 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan" />
        </div>
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-brand-cyan">Runtime alert</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Something went wrong</h1>
          <p className="mt-5 leading-8 text-muted-foreground">
            The page hit an unexpected error. You can retry the render or head back home while the logs tell us what happened.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-brand-purple to-brand-cyan px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              <RotateCcw size={17} />
              Retry
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-purple/70 px-5 py-2.5 text-sm font-semibold text-brand-purple transition hover:bg-brand-purple hover:text-white"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
