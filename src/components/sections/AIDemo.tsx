"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { StreamingText } from "@/components/ui/StreamingText";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fadeInUp, staggerContainer, useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What projects have you built?",
  "Explain your RAG system",
  "What is your tech stack?",
  "Are you open to work?",
  "What makes you different?"
];

export function AIDemo() {
  const { ref, inView } = useScrollReveal<HTMLElement>();
  const { trackChatMessage } = useAnalytics();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const sendMessage = async (value: string) => {
    const userMessage = value.trim();
    if (!userMessage || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setIsStreaming(true);
    trackChatMessage(userMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, userMessage })
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const token = decoder.decode(chunk, { stream: true });
        setMessages((current) => {
          const updated = [...current];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + token };
          return updated;
        });
      }
    } catch {
      setError("The AI chat could not respond. Check your Gemini API key and try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <section id="chat" ref={ref} className="section-shell">
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-center">
          <Badge variant="cyan">AI Chat</Badge>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">Ask me anything.</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            A streaming portfolio assistant that can answer questions about projects, skills,
            experience, certifications, and work fit.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow className="mx-auto max-w-4xl p-0">
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-5">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan font-bold text-white shadow-neon">
                    AI
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-text-primary">Start with a question</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                    Try asking about production RAG systems, agent workflows, the tech stack,
                    or whether this engineer is available for your team.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => sendMessage(question)}
                        className="rounded-full border border-dark-border bg-white/[0.04] px-4 py-2 text-sm text-text-muted transition hover:border-brand-purple hover:text-text-primary"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((message, index) => {
                    const isUser = message.role === "user";
                    const isLastAssistant = !isUser && index === messages.length - 1;
                    return (
                      <div key={`${message.role}-${index}`} className={cn("flex gap-3", isUser && "justify-end")}>
                        {!isUser && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan text-xs font-bold text-white">
                            AI
                          </span>
                        )}
                        <div
                          className={cn(
                            "max-w-[82%] rounded-xl border px-4 py-3",
                            isUser
                              ? "border-brand-cyan/35 bg-brand-cyan/10 text-text-primary"
                              : "border-dark-border bg-white/[0.04]"
                          )}
                        >
                          {isUser ? (
                            <p className="text-sm leading-7">{message.content}</p>
                          ) : message.content ? (
                            <StreamingText text={message.content} isStreaming={isStreaming && isLastAssistant} />
                          ) : (
                            <LoadingDots />
                          )}
                        </div>
                        {isUser && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-xs font-bold text-brand-cyan">
                            You
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {error && (
                    <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                      <p>{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<RefreshCw size={15} />}
                        className="mt-3"
                        onClick={() => sendMessage(messages.filter((message) => message.role === "user").at(-1)?.content ?? "")}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-dark-border p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-dark-border px-3 py-1.5 text-xs text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan"
                  >
                    {question}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about my projects, skills, or experience..."
                  className="min-w-0 flex-1 rounded-full border border-dark-border bg-dark-bg/70 px-5 py-3 text-sm text-text-primary outline-none transition focus:border-brand-purple"
                />
                <Button type="submit" icon={<Send size={18} />} disabled={isStreaming || !input.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
