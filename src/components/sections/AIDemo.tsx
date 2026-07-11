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

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Chat request failed");
      }

      if (!response.body) {
        throw new Error("Chat response did not include a stream");
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
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The AI chat could not respond. Check your Gemini API key and try again."
      );
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
          <h2 className="mt-4 text-center text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">Ask me anything.</h2>
          <p className="mt-3 px-2 text-center text-sm leading-7 text-muted-foreground sm:px-0 sm:text-base lg:mt-4 lg:text-lg lg:leading-8">
            A streaming portfolio assistant that can answer questions about projects, skills,
            experience, certifications, and work fit.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card glow className="mx-auto w-full max-w-full overflow-hidden rounded-xl p-0 sm:rounded-2xl lg:max-w-4xl">
            <div
              ref={scrollRef}
              style={{ overflowX: "hidden", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
              className="h-[320px] max-w-full overflow-x-hidden overflow-y-auto p-4 sm:h-[360px] sm:p-5 lg:h-[400px]"
            >
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
                  <div className="mt-3 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => sendMessage(question)}
                        className="flex min-h-9 shrink-0 snap-start items-center whitespace-nowrap rounded-full border border-dark-border bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-text-muted transition hover:border-brand-purple hover:text-text-primary sm:px-3 sm:text-xs"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3 overflow-x-hidden sm:space-y-5">
                  {messages.map((message, index) => {
                    const isUser = message.role === "user";
                    const isLastAssistant = !isUser && index === messages.length - 1;
                    return (
                      <div
                        key={`${message.role}-${index}`}
                        className={cn("flex min-w-0 max-w-full gap-3", isUser && "justify-end")}
                      >
                        {!isUser && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-xs lg:h-9 lg:w-9">
                            AI
                          </span>
                        )}
                        <div
                          style={{
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            wordWrap: "break-word",
                            minWidth: 0,
                            maxWidth: isUser ? "85%" : "85%"
                          }}
                          className={cn(
                            "chat-message-bubble min-w-0 max-w-[85%] overflow-hidden rounded-xl border px-3 py-2 text-xs sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-sm lg:max-w-[70%]",
                            isUser
                              ? "border-brand-cyan/35 bg-brand-cyan/10 text-text-primary"
                              : "border-dark-border bg-white/[0.04]"
                          )}
                        >
                          {isUser ? (
                            <p
                              style={{
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                wordWrap: "break-word",
                                minWidth: 0
                              }}
                              className="w-full min-w-0 text-xs leading-6 sm:text-sm sm:leading-7"
                            >
                              {message.content}
                            </p>
                          ) : message.content ? (
                            <div
                              style={{
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                wordWrap: "break-word",
                                minWidth: 0
                              }}
                              className="w-full min-w-0"
                            >
                              <StreamingText text={message.content} isStreaming={isStreaming && isLastAssistant} />
                            </div>
                          ) : (
                            <LoadingDots />
                          )}
                        </div>
                        {isUser && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-[10px] font-bold text-brand-cyan sm:h-8 sm:w-8 sm:text-xs lg:h-9 lg:w-9">
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

            <div className="border-t border-dark-border p-3 sm:p-4">
              <div className="mb-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="flex min-h-9 shrink-0 snap-start items-center whitespace-nowrap rounded-full border border-dark-border px-2.5 py-1.5 text-[11px] text-text-muted transition hover:border-brand-cyan hover:text-brand-cyan sm:px-3 sm:text-xs"
                  >
                    {question}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about my work..."
                  style={{ fontSize: "16px" }}
                  className="min-h-11 min-w-0 flex-1 rounded-full border border-dark-border bg-dark-bg/70 px-3 py-2.5 text-base text-text-primary outline-none transition focus:border-brand-purple sm:px-4 sm:py-2"
                />
                <Button type="submit" icon={<Send size={16} />} disabled={isStreaming || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg px-0 sm:h-10 sm:w-10 sm:px-0">
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
