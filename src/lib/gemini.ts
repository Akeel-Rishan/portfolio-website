const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-1.5-flash";
const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 1024
};

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }>;
};

export interface StreamGeminiOptions {
  prompt?: string;
  systemPrompt?: string;
  contents?: GeminiContent[];
  temperature?: number;
  maxOutputTokens?: number;
}

export interface CallGeminiOptions extends StreamGeminiOptions {}

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return apiKey;
}

function buildPayload(options: StreamGeminiOptions) {
  const contents = options.contents ?? [
    {
      role: "user" as const,
      parts: [{ text: options.prompt ?? "" }]
    }
  ];

  return {
    system_instruction: options.systemPrompt
      ? {
          parts: [{ text: options.systemPrompt }]
        }
      : undefined,
    contents,
    generationConfig: {
      ...DEFAULT_GENERATION_CONFIG,
      temperature: options.temperature ?? DEFAULT_GENERATION_CONFIG.temperature,
      maxOutputTokens: options.maxOutputTokens ?? DEFAULT_GENERATION_CONFIG.maxOutputTokens
    }
  };
}

function getTextFromSseLine(line: string) {
  if (!line.startsWith("data:")) {
    return "";
  }

  const payload = line.slice(5).trim();

  if (!payload || payload === "[DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(payload);
    return parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

export async function streamGemini(options: StreamGeminiOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = getApiKey();
  const response = await fetch(
    `${GEMINI_BASE_URL}/${DEFAULT_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload(options))
    }
  );

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "Gemini streaming request failed");
    throw new Error(`Gemini streaming error ${response.status}: ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (buffer.trim()) {
              const text = getTextFromSseLine(buffer.trim());
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const text = getTextFromSseLine(line.trim());
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  });
}

export async function callGemini(options: CallGeminiOptions): Promise<string> {
  const apiKey = getApiKey();
  const response = await fetch(`${GEMINI_BASE_URL}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildPayload(options))
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Gemini request failed");
    throw new Error(`Gemini error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export function createStreamingResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export function detectCodeLanguage(code: string) {
  const trimmed = code.trim();
  const firstLine = trimmed.split("\n")[0]?.toLowerCase() ?? "";

  if (firstLine.includes("python") || /\b(def|import|from)\b/.test(trimmed)) return "Python";
  if (firstLine.includes("typescript") || /\binterface\s+\w+|type\s+\w+\s*=/.test(trimmed)) return "TypeScript";
  if (firstLine.includes("javascript") || /\b(function|const|let|var)\b/.test(trimmed)) return "JavaScript";
  if (firstLine.includes("tsx") || /<\/?[A-Z][\w]*/.test(trimmed)) return "TSX/React";
  if (firstLine.includes("sql") || /\bselect\b.+\bfrom\b/i.test(trimmed)) return "SQL";
  if (firstLine.includes("java") || /\bpublic\s+class\b/.test(trimmed)) return "Java";
  if (firstLine.includes("go") || /\bfunc\s+\w+\(/.test(trimmed)) return "Go";
  return "Code";
}
