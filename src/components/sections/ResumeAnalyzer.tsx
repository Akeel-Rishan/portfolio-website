"use client";

import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, FileUp, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type ResumeResult = {
  strengths: string[];
  weaknesses: string[];
  ats_score: number;
  suggestions: string[];
};

const statusMessages = [
  "Reading your resume...",
  "Analyzing structure...",
  "Scoring ATS compatibility...",
  "Generating suggestions..."
];

export function ResumeAnalyzer() {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const { trackResumeUpload } = useAnalytics();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = window.setInterval(() => {
      setStatusIndex((current) => Math.min(current + 1, statusMessages.length - 1));
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isAnalyzing]);

  const selectFile = (nextFile?: File) => {
    if (!nextFile) return;
    if (nextFile.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }
    setError("");
    setResult(null);
    setFile(nextFile);
    trackResumeUpload();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files[0]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
  };

  const analyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setStatusIndex(0);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Resume analysis failed");
      }

      setResult(await response.json());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Resume analysis failed. Upload a valid PDF and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor =
    !result || result.ats_score > 80 ? "text-emerald-300" : result.ats_score > 60 ? "text-amber-300" : "text-red-300";

  return (
    <section id="resume-analyzer" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge variant="green">Resume Analyzer</Badge>
          <h2 className="mt-4 text-[clamp(22px,6vw,28px)] font-bold leading-tight sm:text-[clamp(26px,4vw,32px)] lg:text-[clamp(2rem,4vw,3rem)]">
            Analyze a resume with AI-powered ATS feedback.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow className="p-4 sm:p-6">
            {!result ? (
              <>
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand-purple/45 bg-brand-purple/5 p-5 text-center transition hover:border-brand-cyan sm:min-h-56 sm:p-8"
                >
                  <FileUp className="text-brand-cyan" size={32} />
                  <p className="mt-4 text-sm font-semibold text-text-primary sm:text-base">
                    {file ? file.name : "Drag and drop a PDF resume"}
                  </p>
                  <p className="mt-2 text-sm text-text-muted">PDF only. Tap to select or drag a file.</p>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
                </label>

                {isAnalyzing && (
                  <div className="mt-6">
                    <div className="mb-3 flex justify-between text-[13px] text-text-muted sm:text-sm">
                      <span>{statusMessages[statusIndex]}</span>
                      <span>{Math.min((statusIndex + 1) * 25, 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        animate={{ width: `${Math.min((statusIndex + 1) * 25, 100)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan"
                      />
                    </div>
                  </div>
                )}

                {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                <Button onClick={analyze} disabled={!file || isAnalyzing} className="mt-6 w-full">
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Card hover={false} className="border-emerald-400/25 bg-emerald-400/5 p-3.5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-200 sm:text-base">
                      <CheckCircle size={18} />
                      Strengths
                    </h3>
                    <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground sm:text-sm">
                      {result.strengths.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card hover={false} className="border-orange-400/25 bg-orange-400/5 p-3.5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-orange-200 sm:text-base">
                      <AlertTriangle size={18} />
                      Weaknesses
                    </h3>
                    <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground sm:text-sm">
                      {result.weaknesses.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card hover={false} className="flex flex-col items-center justify-center p-3.5 sm:p-6">
                    <div className={cn("flex h-[100px] w-[100px] items-center justify-center rounded-full border-8 border-dark-border text-[32px] font-bold sm:h-36 sm:w-36 sm:text-4xl", scoreColor)}>
                      {result.ats_score}
                    </div>
                    <p className="mt-4 text-[11px] font-semibold text-text-primary sm:text-base">ATS Score</p>
                  </Card>
                  <Card hover={false} className="border-brand-cyan/25 bg-brand-cyan/5 p-3.5 sm:p-6">
                    <h3 className="text-sm font-semibold text-cyan-200 sm:text-base">Suggestions</h3>
                    <ol className="mt-4 list-decimal space-y-2 pl-5 text-[13px] text-muted-foreground sm:text-sm">
                      {result.suggestions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </Card>
                </div>
                <Button
                  variant="outline"
                  icon={<RotateCcw size={16} />}
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setError("");
                  }}
                  className="mt-6"
                >
                  Analyze Another
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
