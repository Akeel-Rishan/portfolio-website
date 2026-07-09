import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

type ResumeAnalysis = {
  strengths: string[];
  weaknesses: string[];
  ats_score: number;
  suggestions: string[];
};

function extractJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match?.[0] ?? cleaned;
}

function normalizeAnalysis(value: unknown): ResumeAnalysis {
  const candidate = value as Partial<ResumeAnalysis>;

  return {
    strengths: Array.isArray(candidate.strengths) ? candidate.strengths.map(String).slice(0, 5) : [],
    weaknesses: Array.isArray(candidate.weaknesses) ? candidate.weaknesses.map(String).slice(0, 5) : [],
    ats_score:
      typeof candidate.ats_score === "number" && Number.isFinite(candidate.ats_score)
        ? Math.max(0, Math.min(100, Math.round(candidate.ats_score)))
        : 0,
    suggestions: Array.isArray(candidate.suggestions) ? candidate.suggestions.map(String).slice(0, 6) : []
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF resume file is required" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF resumes are supported" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be smaller than 5 MB" }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const text = await callGemini({
      systemPrompt:
        "You are an ATS resume reviewer. Return strict JSON only with keys strengths, weaknesses, ats_score, and suggestions. Do not use markdown.",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Analyze this resume for AI engineering roles. Return JSON only: strengths string[], weaknesses string[], ats_score number 0-100, suggestions string[]."
            },
            {
              inline_data: {
                mime_type: file.type,
                data: base64
              }
            }
          ]
        }
      ],
      temperature: 0.25,
      maxOutputTokens: 2048,
      responseMimeType: "application/json"
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(text)) as unknown;
    } catch {
      return NextResponse.json({ error: "Resume analysis returned invalid JSON. Please try again." }, { status: 502 });
    }

    return NextResponse.json(normalizeAnalysis(parsed));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
