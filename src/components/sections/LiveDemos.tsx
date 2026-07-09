"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clipboard, Code2, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { StreamingText } from "@/components/ui/StreamingText";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type DemoTab = "summarize" | "explain-code" | "optimize-prompt";

const tabs = [
  { id: "summarize" as const, label: "Text Summarizer", icon: FileText },
  { id: "explain-code" as const, label: "Code Explainer", icon: Code2 },
  { id: "optimize-prompt" as const, label: "Prompt Optimizer", icon: Sparkles }
];

const placeholders: Record<DemoTab, string> = {
  summarize: "Paste up to 2000 characters of text to summarize...",
  "explain-code": "Paste a code snippet to explain...",
  "optimize-prompt": "Paste a rough AI prompt to improve..."
};

function detectLanguage(code: string) {
  if (/\b(def|import|from)\b/.test(code)) return "Python";
  if (/\binterface\s+\w+|type\s+\w+\s*=/.test(code)) return "TypeScript";
  if (/<\/?[A-Z][\w]*/.test(code)) return "TSX/React";
  if (/\b(function|const|let|var)\b/.test(code)) return "JavaScript";
  if (/\bselect\b.+\bfrom\b/i.test(code)) return "SQL";
  return "Auto-detect";
}

export function LiveDemos() {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const { trackDemoUse } = useAnalytics();
  const [activeTab, setActiveTab] = useState<DemoTab>("summarize");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const tokenCount = useMemo(() => input.trim().split(/\s+/).filter(Boolean).length, [input]);
  const language = useMemo(() => detectLanguage(input), [input]);

  const endpoint = `/api/demo/${activeTab}`;

  const generate = async () => {
    if (!input.trim() || isStreaming) return;
    setOutput("");
    setError("");
    setCopied(false);
    setIsStreaming(true);
    trackDemoUse(activeTab === "summarize" ? "summarize" : activeTab === "explain-code" ? "explain" : "optimize");

    try {
      const bodyKey = activeTab === "explain-code" ? "code" : activeTab === "optimize-prompt" ? "prompt" : "text";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [bodyKey]: input })
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Demo request failed");
      }

      if (!response.body) {
        throw new Error("Demo response did not include a stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((current) => current + decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "This demo could not generate a response. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section id="demos" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="purple">Live AI Demos</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Try small AI workflows directly in the portfolio.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setInput("");
                      setOutput("");
                      setError("");
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-brand-purple bg-brand-purple/15 text-text-primary"
                        : "border-dark-border text-text-muted hover:border-brand-cyan hover:text-brand-cyan"
                    )}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Input</p>
                  <div className="flex items-center gap-2">
                    {activeTab === "explain-code" && <Badge variant="cyan">{language}</Badge>}
                    <span className="text-xs text-text-muted">{tokenCount} tokens</span>
                  </div>
                </div>
                <textarea
                  value={input}
                  maxLength={activeTab === "summarize" ? 2000 : undefined}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={placeholders[activeTab]}
                  className="h-72 w-full resize-none rounded-xl border border-dark-border bg-dark-bg/70 p-4 text-sm leading-7 text-text-primary outline-none transition focus:border-brand-purple"
                />
                <Button onClick={generate} disabled={isStreaming || !input.trim()} className="mt-4 w-full">
                  {isStreaming ? "Generating..." : "Generate"}
                </Button>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Output</p>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? <Check size={15} /> : <Clipboard size={15} />}
                    onClick={copyOutput}
                    disabled={!output}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="h-72 overflow-y-auto rounded-xl border border-dark-border bg-dark-bg/70 p-4">
                  {activeTab === "optimize-prompt" && output ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-dark-border bg-white/[0.03] p-3">
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-muted">Before</p>
                        <p className="text-sm leading-6 text-muted-foreground">{input}</p>
                      </div>
                      <div className="rounded-xl border border-brand-purple/30 bg-brand-purple/10 p-3">
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-brand-cyan">After</p>
                        <StreamingText text={output} isStreaming={isStreaming} />
                      </div>
                    </div>
                  ) : output ? (
                    <StreamingText text={output} isStreaming={isStreaming} />
                  ) : isStreaming ? (
                    <LoadingDots />
                  ) : (
                    <p className="text-sm leading-7 text-text-muted">
                      Generated output will stream here as tokens arrive.
                    </p>
                  )}
                  {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
