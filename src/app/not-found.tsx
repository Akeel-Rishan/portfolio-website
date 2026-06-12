import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-dark-bg px-6 text-center text-text-primary">
      <div className="relative w-full max-w-3xl">
        <div className="absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="relative z-10">
          <div className="mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-full border border-brand-cyan/40 bg-dark-card text-5xl font-bold text-brand-cyan shadow-neon">
            ?
          </div>
          <h1 className="gradient-text text-5xl font-black sm:text-7xl">404 - Page not found</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Even my AI agents couldn&apos;t locate this page.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-transparent bg-gradient-to-r from-brand-purple to-brand-cyan px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
