"use client";

import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, FileUp, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
        throw new Error("Resume analysis failed");
      }

      setResult(await response.json());
    } catch {
      setError("Resume analysis failed. Check the API key and upload a valid PDF.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor =
    !result || result.ats_score > 80 ? "text-emerald-300" : result.ats_score > 60 ? "text-amber-300" : "text-red-300";

  return (
    <section id="resume-analyzer" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mb-10 max-w-2xl">
          <Badge variant="green">Resume Analyzer</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
            Analyze a resume with AI-powered ATS feedback.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow>
            {!result ? (
              <>
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand-purple/45 bg-brand-purple/5 p-8 text-center transition hover:border-brand-cyan"
                >
                  <FileUp className="text-brand-cyan" size={38} />
                  <p className="mt-4 font-semibold text-text-primary">
                    {file ? file.name : "Drag and drop a PDF resume"}
                  </p>
                  <p className="mt-2 text-sm text-text-muted">PDF only. The file is sent to Gemini for analysis.</p>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
                </label>

                {isAnalyzing && (
                  <div className="mt-6">
                    <div className="mb-3 flex justify-between text-sm text-text-muted">
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
                <div className="grid gap-5 md:grid-cols-2">
                  <Card hover={false} className="border-emerald-400/25 bg-emerald-400/5">
                    <h3 className="flex items-center gap-2 font-semibold text-emerald-200">
                      <CheckCircle size={18} />
                      Strengths
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {result.strengths.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card hover={false} className="border-orange-400/25 bg-orange-400/5">
                    <h3 className="flex items-center gap-2 font-semibold text-orange-200">
                      <AlertTriangle size={18} />
                      Weaknesses
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {result.weaknesses.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card hover={false} className="flex flex-col items-center justify-center">
                    <div className={cn("flex h-36 w-36 items-center justify-center rounded-full border-8 border-dark-border text-4xl font-bold", scoreColor)}>
                      {result.ats_score}
                    </div>
                    <p className="mt-4 font-semibold text-text-primary">ATS Score</p>
                  </Card>
                  <Card hover={false} className="border-brand-cyan/25 bg-brand-cyan/5">
                    <h3 className="font-semibold text-cyan-200">Suggestions</h3>
                    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
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
