import { NextResponse } from "next/server";
import { createStreamingResponse, detectCodeLanguage, streamGemini } from "@/lib/gemini";

type DemoType = "summarize" | "explain-code" | "optimize-prompt";

type DemoPayload = {
  text?: unknown;
  code?: unknown;
  prompt?: unknown;
};

const demoConfig: Record<DemoType, { field: keyof DemoPayload; systemPrompt: string; maxLength: number }> = {
  summarize: {
    field: "text",
    maxLength: 2000,
    systemPrompt:
      "You are a concise summarization assistant. Return a clear summary with key points and no invented facts."
  },
  "explain-code": {
    field: "code",
    maxLength: 5000,
    systemPrompt:
      "You are a senior engineer explaining code. Explain intent, flow, important functions, risks, and one practical improvement."
  },
  "optimize-prompt": {
    field: "prompt",
    maxLength: 2500,
    systemPrompt:
      "You are a prompt engineer. Improve the user's prompt for clarity, context, constraints, output format, and evaluation criteria."
  }
};

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request, { params }: { params: { type: string } }) {
  const type = params.type as DemoType;
  const config = demoConfig[type];

  if (!config) {
    return NextResponse.json({ error: "Unknown demo type" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as DemoPayload;
    const input = typeof body[config.field] === "string" ? body[config.field].trim() : "";

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    if (input.length > config.maxLength) {
      return NextResponse.json({ error: "Input is too long" }, { status: 400 });
    }

    const language = type === "explain-code" ? detectCodeLanguage(input) : "";
    const prompt =
      type === "explain-code"
        ? `Language: ${language}\n\nCode:\n${input}`
        : type === "optimize-prompt"
          ? `Original prompt:\n${input}\n\nReturn only the improved prompt.`
          : `Summarize this text:\n${input}`;

    const stream = await streamGemini({
      prompt,
      systemPrompt: config.systemPrompt,
      temperature: 0.35,
      maxOutputTokens: 900
    });

    return createStreamingResponse(stream);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Demo request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
