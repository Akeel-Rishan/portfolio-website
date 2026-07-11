"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterQuestions = [
  "What projects has Akeel built?",
  "What is Akeel's tech stack?",
  "Is Akeel available for work?"
];

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm Akeel Rishan AI. Ask me about Akeel's projects, skills, experience, or availability."
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = originalBodyStyle.position;
      document.body.style.top = originalBodyStyle.top;
      document.body.style.left = originalBodyStyle.left;
      document.body.style.right = originalBodyStyle.right;
      document.body.style.width = originalBodyStyle.width;
      document.body.style.overflow = originalBodyStyle.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (pathname === "/akeel-ai") {
    return null;
  }

  const sendMessage = async (value?: string) => {
    const userMessage = (value ?? input).trim();
    if (!userMessage || isStreaming) return;

    const history = messages;
    const nextMessages: ChatMessage[] = [...history, { role: "user", content: userMessage }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, userMessage })
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
    } catch (caught) {
      setMessages((current) => current.filter((message) => message.content || message.role === "user"));
      setError(caught instanceof Error ? caught.message : "Chat is unavailable right now.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-dark-bg/35 backdrop-blur-[1px]"
            />

            <motion.section
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-3 bottom-20 z-[80] flex h-[min(560px,calc(100dvh-108px))] flex-col overflow-hidden rounded-2xl border border-brand-purple/30 bg-[#0A0A0F] shadow-[0_24px_80px_rgba(0,0,0,0.7)] sm:inset-x-auto sm:right-6 sm:w-[380px]"
            >
              <header className="flex items-center justify-between border-b border-white/10 bg-dark-card/95 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-cyan/40 bg-dark-bg shadow-neon">
                  <Image
                    src="/akeel-ai-assistant-avatar.png"
                    alt="Akeel Rishan AI"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">Akeel Rishan AI</p>
                  <p className="text-xs text-text-muted">Online · Ask anything</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chatbot"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition hover:bg-white/10 hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div key={`${message.role}-${index}`} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[86%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm leading-6 [overflow-wrap:anywhere]",
                        isUser
                          ? "rounded-br-md bg-gradient-to-br from-brand-purple to-violet-700 text-white"
                          : "rounded-bl-md border border-white/10 bg-white/[0.05] text-text-primary"
                      )}
                    >
                      {message.content || (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-purple" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-purple [animation-delay:120ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-purple [animation-delay:240ms]" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {messages.length === 1 && (
                <div className="grid gap-2 pt-1">
                  {starterQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="rounded-xl border border-brand-purple/20 bg-brand-purple/10 px-3 py-2 text-left text-xs text-text-muted transition hover:border-brand-cyan/40 hover:text-text-primary"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/10 bg-dark-card/95 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask about Akeel..."
                  rows={1}
                  maxLength={700}
                  className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-dark-border bg-dark-bg/80 px-3 py-2.5 text-base text-text-primary outline-none transition focus:border-brand-purple"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-purple text-white transition hover:bg-brand-cyan disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        onClick={() => setIsOpen((value) => !value)}
        initial={false}
        animate={{ scale: isOpen ? 0.94 : 1 }}
        className="fixed bottom-24 right-6 z-[75] flex h-14 w-14 items-center justify-center rounded-full border border-brand-cyan/40 bg-gradient-to-br from-brand-purple to-brand-cyan text-white shadow-[0_0_34px_rgba(6,182,212,0.45)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-cyan/70 focus:ring-offset-2 focus:ring-offset-dark-bg"
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-dark-bg bg-emerald-400">
            <Bot size={11} className="text-dark-bg" />
          </span>
        )}
      </motion.button>
    </>
  );
}
