"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const SYSTEM_PROMPT = `
You are "Akeel Rishan AI" - the personal AI assistant and digital twin of Akeel Rishan, an AI Engineer and Software Developer based in Sri Lanka.

PERSONALITY:
- Warm, professional, and direct
- Technically sharp on AI, LLMs, SaaS, and full-stack dev
- Enthusiastic about building products
- Concise - never over-explain
- Honest - admit when you don't know something specific

ABOUT AKEEL RISHAN:

Personal:
  Name: Akeel Rishan (Mohamed Rishan Akeel)
  Role: AI Engineer & Software Developer
  Location: Sri Lanka
  GitHub: github.com/Akeel-Rishan
  Medium: medium.com/@AkeelRishan
  Email: mohamedrishanakeel13867@gmail.com
  LinkedIn: linkedin.com/in/akeelrishan

Positioning Statement:
  "Building production-grade LLM systems, RAG pipelines, and autonomous AI agents."

Technical Skills:
  AI/ML Layer:
    LLMs (GPT-4, Gemini, Claude, Mistral, Llama)
    RAG Systems (LlamaIndex, vector search, embeddings)
    AI Agents (LangGraph, CrewAI, AutoGen, tool use)
    Prompt Engineering, fine-tuning (LoRA, PEFT)
    Vector DBs (Pinecone, Weaviate, FAISS, pgvector)
    Multimodal AI (Whisper, ElevenLabs, vision models)

  Backend:
    Python, FastAPI, Node.js, Express, TypeScript
    PostgreSQL, Supabase, Redis, Prisma, REST APIs
    WebSockets, microservices, monorepo architecture

  Frontend:
    Next.js 14 (App Router), React, React Native
    TypeScript, Tailwind CSS, Framer Motion
    Glassmorphism UI, responsive design

  DevOps & Cloud:
    Docker, GitHub Actions, Vercel, AWS, Render
    CI/CD pipelines, environment management

  SaaS Patterns:
    Multi-tenant architecture, Stripe payments
    JWT auth, RLS (Supabase), webhook pipelines
    Subscription business models

Shipped Projects:

  1. LeadFlow AI
     Type: Multi-tenant AI lead automation SaaS
     Stack: Next.js 14, Express, TypeScript, Prisma, Supabase PostgreSQL, pgvector, OpenAI, Twilio, Resend
     What it does: Multi-channel lead capture from website/Facebook/Google/Twilio, AI qualification agent using GPT-4o-mini, RAG knowledge base with embeddings, automated follow-up engine with cron
     Status: 6 phases complete, production-ready

  2. AI Portfolio Website
     Type: Personal AI engineer portfolio
     Stack: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Sanity CMS, Gemini API
     What it does: AI chatbot, Netflix 3D article carousel, resume analyzer, 3 live AI demo tools, Sanity CMS for content, streaming responses
     Status: Live and deployed

  3. Car Parts Marketplace Platform
     Type: Full marketplace with rider app
     Stack: Node.js, Express microservices, PostgreSQL, Prisma, Socket.io, Redis, FCM push notifications, React Native
     What it does: Real-time parts dispatch, rider mobile app, seller dashboard, dark-first UI
     Status: Completed

  4. AI Business WhatsApp Assistant SaaS
     Type: WhatsApp AI automation for businesses
     Stack: Next.js 14, FastAPI, Supabase, Gemini Flash, Meta WhatsApp Cloud API
     What it does: Business knowledge base, pipeline orchestrator for message processing, RLS security, monorepo with strict frontend/backend separation
     Status: Active development (Phases 1-3 planned)

  5. LeadPilot AI
     Type: Lead generation SaaS for marketing agencies
     Stack: Next.js 14, NestJS, Supabase, Clerk
     What it does: 15 frontend pages, full Supabase DB with 7 tables, RLS, TypeScript types
     Status: Frontend complete

  6. House Price Prediction (ML Project)
     Type: Machine learning project
     Stack: Python, scikit-learn (Linear Regression, Random Forest)
     Status: Scaffolded as vibe coding workflow

Writing:
  Publishes on Medium @AkeelRishan
  Topics: AI engineering, SaaS building, LLM systems, software development, technology, personal growth
  Goal: Share practical knowledge with the community

Work Approach:
  - Vibe coding with AI tools (Claude, Gemini, Codex)
  - Sequential one-phase-at-a-time workflow
  - Production-ready code with proper error handling
  - Targets US market SaaS with subscription models
  - Prefers detailed prompts that anticipate edge cases

Availability:
  Open to: Remote freelance, full-time remote roles, AI/SaaS collaborations, consulting
  Preferred work: AI engineering, full-stack SaaS, LLM systems, agent development
  Not looking for: On-site only, non-tech roles

RESPONSE RULES:
1. Be specific - cite real project names, tech, metrics
2. Keep answers concise (2-4 sentences for simple questions)
3. For technical AI/engineering questions - answer helpfully
4. If asked something not in your knowledge: "I don't have that specific detail. You can reach Akeel directly via GitHub or email."
5. Never fabricate projects, skills, or details
6. Encourage reaching out for work opportunities
7. Use markdown formatting when it adds clarity
8. You are always "Akeel Rishan AI" - never break persona
9. First message should be a warm, brief greeting
10. If asked who made you: "I was built by Akeel Rishan using Google Gemini API as part of his AI portfolio."
`;

const suggestedQuestions = [
  "What projects has Akeel built?",
  "What is your full tech stack?",
  "Are you available for work?",
  "Tell me about LeadFlow AI",
  "What do you write about on Medium?",
  "What makes Akeel different as a developer?"
];

function createWelcomeMessage() {
  return {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm **Akeel Rishan AI** - the personal assistant and digital twin of Akeel Rishan.\n\nI can tell you about his **projects**, **tech stack**, **experience**, and **availability for work**.\n\nWhat would you like to know?",
    timestamp: new Date()
  };
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseInline(text, keyPrefix) {
  const parts = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith("`")) {
      parts.push(
        <code key={key} className="ari-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={key} className="ari-strong">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push(
          <a key={key} href={linkMatch[2]} target="_blank" rel="noreferrer" className="ari-link">
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, index) =>
    typeof part === "string" ? (
      <React.Fragment key={`${keyPrefix}-text-${index}`}>{part}</React.Fragment>
    ) : (
      part
    )
  );
}

function renderTextBlock(block, keyPrefix) {
  const lines = block.split("\n");
  const isUnordered = lines.every((line) => /^-\s+/.test(line.trim()));
  const isOrdered = lines.every((line) => /^\d+\.\s+/.test(line.trim()));

  if (isUnordered) {
    return (
      <ul key={keyPrefix} className="ari-list">
        {lines.map((line, index) => (
          <li key={`${keyPrefix}-${index}`}>{parseInline(line.trim().replace(/^-\s+/, ""), `${keyPrefix}-${index}`)}</li>
        ))}
      </ul>
    );
  }

  if (isOrdered) {
    return (
      <ol key={keyPrefix} className="ari-list ari-ordered">
        {lines.map((line, index) => (
          <li key={`${keyPrefix}-${index}`}>{parseInline(line.trim().replace(/^\d+\.\s+/, ""), `${keyPrefix}-${index}`)}</li>
        ))}
      </ol>
    );
  }

  return (
    <p key={keyPrefix} className="ari-paragraph">
      {lines.map((line, index) => (
        <React.Fragment key={`${keyPrefix}-line-${index}`}>
          {index > 0 && <br />}
          {parseInline(line, `${keyPrefix}-line-${index}`)}
        </React.Fragment>
      ))}
    </p>
  );
}

function renderMarkdown(text) {
  const elements = [];
  const segments = text.split(/```/);

  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      elements.push(
        <pre key={`code-${index}`} className="ari-code-block">
          {segment.trim()}
        </pre>
      );
      return;
    }

    segment
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .forEach((block, blockIndex) => {
        elements.push(renderTextBlock(block, `block-${index}-${blockIndex}`));
      });
  });

  return <>{elements}</>;
}

export default function AkeelRishanAI() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [messages, setMessages] = useState([createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isStreaming]);

  const resetTextareaHeight = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "44px";
    textareaRef.current.style.overflowY = "hidden";
  }, []);

  const handleTextareaChange = (event) => {
    const value = event.target.value.slice(0, 500);
    setInput(value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
    event.target.style.overflowY = event.target.scrollHeight > 140 ? "auto" : "hidden";
  };

  const resetChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([createWelcomeMessage()]);
    setInput("");
    setIsTyping(false);
    setIsStreaming(false);
    resetTextareaHeight();
  }, [resetTextareaHeight]);

  const copyMessage = async (message) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = useCallback(
    async (text) => {
      const content = (text || input).trim();
      if (!content || isStreaming) return;

      const userMsg = {
        id: `${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date()
      };

      const currentMessages = [...messages, userMsg];
      setMessages(currentMessages);
      setInput("");
      resetTextareaHeight();
      setIsTyping(true);

      const history = currentMessages
        .filter((message) => message.role !== "system")
        .slice(-20)
        .map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }]
        }));

      const aiMsgId = `${Date.now() + 1}`;
      const aiMsg = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true
      };

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: history,
              generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 1024,
                topP: 0.9
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Network fail");
        }

        setIsTyping(false);
        setIsStreaming(true);
        setMessages((previous) => [...previous, aiMsg]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonStr);
              const chunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (chunk) {
                fullText += chunk;
                setMessages((previous) =>
                  previous.map((message) =>
                    message.id === aiMsgId ? { ...message, content: fullText } : message
                  )
                );
              }
            } catch {
              /* Ignore malformed SSE fragments. */
            }
          }
        }

        setMessages((previous) =>
          previous.map((message) =>
            message.id === aiMsgId ? { ...message, isStreaming: false } : message
          )
        );
      } catch (error) {
        setIsTyping(false);
        const messageText =
          error?.name === "AbortError"
            ? null
            : String(error?.message || "").includes("401") || String(error?.message || "").includes("403")
              ? "Invalid API key. Check your key and try again."
              : String(error?.message || "").includes("429")
                ? "Rate limit reached. Please wait a moment."
                : String(error?.message || "").includes("500")
                  ? "Gemini API error. Please try again."
                  : "Connection failed. Check your internet.";

        if (messageText) {
          setMessages((previous) => [
            ...previous,
            {
              id: `${Date.now()}`,
              role: "system",
              content: messageText,
              timestamp: new Date()
            }
          ]);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [apiKey, input, isStreaming, messages, resetTextareaHeight]
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const hasUserMessage = messages.some((message) => message.role === "user");

  return (
    <div className="ari-root">
      <style dangerouslySetInnerHTML={{ __html: `
        * { box-sizing: border-box; }
        .ari-root {
          min-height: 100dvh;
          background: #0A0A0F;
          color: #F8F8FF;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .ari-setup {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at 20% 20%, rgba(124,58,237,0.14), transparent 32%),
            radial-gradient(circle at 80% 15%, rgba(6,182,212,0.1), transparent 28%),
            #0A0A0F;
        }
        .ari-setup-card {
          width: min(400px, 90vw);
          background: #111118;
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 0 60px rgba(124,58,237,0.1);
          text-align: center;
        }
        .ari-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #06B6D4);
          color: #fff;
          font-family: Georgia, serif;
          font-weight: 700;
        }
        .ari-setup-avatar { width: 64px; height: 64px; font-size: 22px; }
        .ari-setup-title { margin: 16px 0 0; font-size: 24px; font-weight: 700; }
        .ari-setup-subtitle { margin: 4px 0 0; font-size: 13px; color: #6B7280; }
        .ari-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }
        .ari-label { display: block; margin-bottom: 8px; text-align: left; color: #9CA3AF; font-size: 12px; font-weight: 500; }
        .ari-key-wrap { position: relative; }
        .ari-key-input {
          width: 100%;
          padding: 12px 44px 12px 16px;
          background: #1A1A28;
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 10px;
          color: #F8F8FF;
          font-size: 15px;
          outline: none;
          transition: border 150ms, box-shadow 150ms;
        }
        .ari-key-input::placeholder { color: #4B5563; }
        .ari-key-input:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
        .ari-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #6B7280;
          cursor: pointer;
          font-size: 16px;
        }
        .ari-eye:hover { color: #9CA3AF; }
        .ari-helper { margin: 6px 0 0; text-align: left; font-size: 11px; color: #4B5563; }
        .ari-start {
          margin-top: 20px;
          width: 100%;
          height: 48px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: filter 150ms, transform 150ms, opacity 150ms;
        }
        .ari-start:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .ari-start:active:not(:disabled) { transform: scale(0.98); }
        .ari-start:disabled { opacity: 0.5; cursor: not-allowed; }
        .ari-privacy { margin-top: 16px; font-size: 11px; color: #4B5563; }
        .ari-chat {
          height: 100dvh;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(124,58,237,0.08);
          border-right: 1px solid rgba(124,58,237,0.08);
          background: #0A0A0F;
        }
        .ari-header {
          height: 64px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: #111118;
          border-bottom: 1px solid rgba(124,58,237,0.15);
          box-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        .ari-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .ari-header-avatar { width: 40px; height: 40px; font-size: 14px; flex-shrink: 0; }
        .ari-name { font-size: 15px; font-weight: 600; color: #F8F8FF; }
        .ari-status { display: flex; align-items: center; gap: 6px; margin-top: 2px; color: #6B7280; font-size: 11px; }
        .ari-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; animation: pulse 2s infinite; }
        .ari-new-chat {
          padding: 6px 12px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 8px;
          color: #9CA3AF;
          font-size: 12px;
          cursor: pointer;
          transition: background 150ms, color 150ms;
        }
        .ari-new-chat:hover { background: rgba(124,58,237,0.2); color: white; }
        .ari-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #0A0A0F;
        }
        .ari-messages::-webkit-scrollbar { width: 4px; }
        .ari-messages::-webkit-scrollbar-track { background: transparent; }
        .ari-messages::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 999px; }
        .ari-messages::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }
        .ari-message { animation: fadeSlideUp 0.25s ease-out forwards; }
        .ari-message-ai { max-width: 82%; align-self: flex-start; }
        .ari-ai-row { display: flex; gap: 10px; align-items: flex-start; }
        .ari-message-avatar { width: 28px; height: 28px; font-size: 10px; flex-shrink: 0; }
        .ari-bubble-wrap { min-width: 0; }
        .ari-bubble {
          position: relative;
          overflow-wrap: break-word;
          word-break: break-word;
          min-width: 0;
        }
        .ari-bubble-ai {
          background: #111118;
          border: 1px solid rgba(124,58,237,0.12);
          border-radius: 4px 16px 16px 16px;
          padding: 12px 14px;
          color: #E5E7EB;
          font-size: 14px;
          line-height: 1.65;
        }
        .ari-message-user { max-width: 78%; align-self: flex-end; }
        .ari-bubble-user {
          background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
          border-radius: 16px 16px 4px 16px;
          padding: 12px 14px;
          color: white;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 450;
        }
        .ari-timestamp { margin-top: 4px; font-size: 11px; color: #374151; }
        .ari-ai-time { margin-left: 38px; }
        .ari-user-time { text-align: right; }
        .ari-copy {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          pointer-events: none;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 3px 8px;
          color: #9CA3AF;
          font-size: 11px;
          cursor: pointer;
          transition: opacity 150ms;
        }
        .ari-bubble-ai:hover .ari-copy { opacity: 1; pointer-events: auto; }
        .ari-system {
          align-self: center;
          max-width: 90%;
          margin: 0 auto;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          color: #FCA5A5;
          font-size: 13px;
          text-align: center;
        }
        .ari-suggestions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin: -4px 0 0 38px;
          max-width: 640px;
        }
        .ari-chip {
          opacity: 0;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(124,58,237,0.15);
          background: rgba(124,58,237,0.06);
          color: #9CA3AF;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
          transition: all 150ms;
          animation: chipIn 0.2s ease-out forwards;
        }
        .ari-chip:hover { background: rgba(124,58,237,0.14); border-color: rgba(124,58,237,0.4); color: #E5E7EB; transform: translateY(-1px); }
        .ari-typing { display: flex; gap: 4px; align-items: center; padding: 14px; }
        .ari-typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #7C3AED; animation: bounce 0.9s ease-in-out infinite; }
        .ari-cursor { display: inline-block; width: 2px; height: 14px; background: #7C3AED; margin-left: 2px; vertical-align: middle; animation: blink 1s step-end infinite; }
        .ari-input-area {
          flex-shrink: 0;
          background: #111118;
          border-top: 1px solid rgba(124,58,237,0.12);
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ari-input-row { display: flex; gap: 10px; align-items: flex-end; }
        .ari-textarea {
          flex: 1;
          min-height: 44px;
          max-height: 140px;
          resize: none;
          overflow-y: hidden;
          background: #1A1A28;
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 12px;
          padding: 11px 14px;
          color: #F8F8FF;
          font-size: 16px;
          line-height: 1.5;
          outline: none;
          transition: border 150ms, box-shadow 150ms;
        }
        .ari-textarea::placeholder { color: #374151; }
        .ari-textarea:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .ari-send {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border: 0;
          border-radius: 10px;
          color: white;
          transition: all 150ms;
        }
        .ari-send-enabled { background: linear-gradient(135deg, #7C3AED, #5B21B6); cursor: pointer; }
        .ari-send-disabled { background: rgba(124,58,237,0.3); cursor: not-allowed; }
        .ari-send-enabled:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .ari-send-enabled:active { transform: scale(0.94); }
        .ari-input-meta { display: flex; justify-content: space-between; gap: 12px; font-size: 11px; color: #374151; }
        .ari-counter-danger { color: #EF4444; }
        .ari-footer { text-align: center; font-size: 10px; color: #1F2937; }
        .ari-paragraph { margin: 0 0 8px; }
        .ari-paragraph:last-child { margin-bottom: 0; }
        .ari-strong { color: #F8F8FF; }
        .ari-inline-code {
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 4px;
          padding: 1px 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13px;
          color: #A78BFA;
        }
        .ari-code-block {
          background: #0D0D18;
          border: 1px solid rgba(124,58,237,0.2);
          border-left: 3px solid #7C3AED;
          border-radius: 8px;
          padding: 12px 14px;
          overflow-x: auto;
          font-size: 13px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: #E5E7EB;
          margin: 8px 0;
        }
        .ari-list { margin: 6px 0 8px 18px; padding: 0; }
        .ari-list li { margin: 3px 0; padding-left: 4px; }
        .ari-list li::marker { color: #7C3AED; }
        .ari-link { color: #06B6D4; word-break: break-all; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes chipIn { from { opacity: 0; transform: scale(0.95) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @media (max-width: 767px) {
          .ari-chat { width: 100%; max-width: none; border-left: 0; border-right: 0; }
          .ari-message-ai { max-width: 88%; }
          .ari-message-user { max-width: 88%; }
          .ari-suggestions { grid-template-columns: 1fr; margin-left: 38px; }
          .ari-header { padding: 0 12px; }
          .ari-input-meta { font-size: 10px; }
          .ari-new-chat { padding: 6px 10px; }
        }
      ` }} />

      {!isSetup ? (
        <main className="ari-setup">
          <section className="ari-setup-card" aria-label="Akeel Rishan AI setup">
            <div className="ari-avatar ari-setup-avatar">AR</div>
            <h1 className="ari-setup-title">Akeel Rishan AI</h1>
            <p className="ari-setup-subtitle">Personal AI Assistant</p>
            <div className="ari-divider" />
            <label className="ari-label" htmlFor="gemini-key">
              Gemini API Key
            </label>
            <div className="ari-key-wrap">
              <input
                id="gemini-key"
                className="ari-key-input"
                type={showKey ? "text" : "password"}
                value={apiKey}
                placeholder="Paste your Gemini API key..."
                onChange={(event) => setApiKey(event.target.value)}
              />
              <button className="ari-eye" type="button" onClick={() => setShowKey((value) => !value)} aria-label={showKey ? "Hide API key" : "Show API key"}>
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="ari-helper">Get a free key at aistudio.google.com</p>
            <button className="ari-start" type="button" disabled={!apiKey.trim()} onClick={() => setIsSetup(true)}>
              Start Chatting →
            </button>
            <p className="ari-privacy">Your key is never stored or shared</p>
          </section>
        </main>
      ) : (
        <main className="ari-chat" aria-label="Akeel Rishan AI chat">
          <header className="ari-header">
            <div className="ari-header-left">
              <div className="ari-avatar ari-header-avatar">AR</div>
              <div>
                <div className="ari-name">Akeel Rishan AI</div>
                <div className="ari-status">
                  <span className="ari-dot" />
                  <span>Online · Powered by Gemini</span>
                </div>
              </div>
            </div>
            <button type="button" className="ari-new-chat" onClick={resetChat}>
              New Chat
            </button>
          </header>

          <section className="ari-messages" aria-live="polite">
            {messages.map((message) => {
              if (message.role === "system") {
                return (
                  <div key={message.id} className="ari-message ari-system">
                    {message.content}
                  </div>
                );
              }

              if (message.role === "user") {
                return (
                  <div key={message.id} className="ari-message ari-message-user">
                    <div className="ari-bubble ari-bubble-user">{message.content}</div>
                    <div className="ari-timestamp ari-user-time">{formatTime(message.timestamp)}</div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="ari-message ari-message-ai">
                  <div className="ari-ai-row">
                    <div className="ari-avatar ari-message-avatar">AR</div>
                    <div className="ari-bubble-wrap">
                      <div className="ari-bubble ari-bubble-ai">
                        <button type="button" className="ari-copy" onClick={() => copyMessage(message)}>
                          {copiedId === message.id ? "Copied!" : "Copy"}
                        </button>
                        {renderMarkdown(message.content)}
                        {message.isStreaming && <span className="ari-cursor" />}
                      </div>
                    </div>
                  </div>
                  <div className="ari-timestamp ari-ai-time">{formatTime(message.timestamp)}</div>
                </div>
              );
            })}

            {!hasUserMessage && (
              <div className="ari-suggestions">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={question}
                    type="button"
                    className="ari-chip"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="ari-message ari-message-ai">
                <div className="ari-ai-row">
                  <div className="ari-avatar ari-message-avatar">AR</div>
                  <div className="ari-bubble ari-bubble-ai">
                    <div className="ari-typing">
                      {[0, 1, 2].map((index) => (
                        <span key={index} className="ari-typing-dot" style={{ animationDelay: `${index * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </section>

          <footer className="ari-input-area">
            <div className="ari-input-row">
              <textarea
                ref={textareaRef}
                className="ari-textarea"
                value={input}
                maxLength={500}
                rows={1}
                placeholder="Ask me anything..."
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className={`ari-send ${isStreaming || !input.trim() ? "ari-send-disabled" : "ari-send-enabled"}`}
                disabled={isStreaming || !input.trim()}
                onClick={() => sendMessage()}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="ari-input-meta">
              <span>Enter to send · Shift+Enter for new line</span>
              {input.length > 0 && <span className={input.length > 450 ? "ari-counter-danger" : ""}>{input.length} / 500</span>}
            </div>
            <div className="ari-footer">Akeel Rishan AI · Powered by Google Gemini</div>
          </footer>
        </main>
      )}
    </div>
  );
}
