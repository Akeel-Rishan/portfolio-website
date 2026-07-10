"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-6 text-white">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-purple-950/20">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Sanity Studio</p>
          <h1 className="mt-4 text-3xl font-bold">Sanity is not configured yet.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Add the Sanity environment variables to <code className="text-cyan-200">.env.local</code>, restart the
            dev server, then open Studio again.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-slate-200">
            {`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=your_viewer_token
SANITY_WEBHOOK_SECRET=your_random_secret`}
          </pre>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
