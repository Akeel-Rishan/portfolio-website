import { NextResponse } from "next/server";
import { buildPortfolioSystemPrompt } from "@/lib/portfolio-context";
import { createStreamingResponse, streamGemini } from "@/lib/gemini";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = {
  messages?: unknown;
  userMessage?: unknown;
};

function toGeminiRole(role: ChatMessage["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatPayload;
    const userMessage = typeof body.userMessage === "string" ? body.userMessage.trim() : "";

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (userMessage.length > 1200) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const history = Array.isArray(body.messages)
      ? body.messages
          .filter((message): message is ChatMessage => {
            if (!message || typeof message !== "object") return false;
            const candidate = message as Partial<ChatMessage>;
            return (
              (candidate.role === "user" || candidate.role === "assistant") &&
              typeof candidate.content === "string" &&
              candidate.content.trim().length > 0
            );
          })
          .slice(-8)
      : [];

    const stream = await streamGemini({
      systemPrompt: buildPortfolioSystemPrompt(),
      contents: [
        ...history.map((message) => ({
          role: toGeminiRole(message.role),
          parts: [{ text: message.content.slice(0, 1600) }]
        })),
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      temperature: 0.45,
      maxOutputTokens: 700
    });

    return createStreamingResponse(stream);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
