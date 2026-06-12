"use client";

import { useCallback } from "react";
import { trackEvent } from "@/components/Analytics";

type DemoType = "summarize" | "explain" | "optimize";

export function useAnalytics() {
  const trackChatMessage = useCallback((question: string) => {
    trackEvent("chat_message_sent", {
      question_length: question.trim().length
    });
  }, []);

  const trackDemoUse = useCallback((demoType: DemoType) => {
    trackEvent("demo_used", {
      demo_type: demoType
    });
  }, []);

  const trackResumeUpload = useCallback(() => {
    trackEvent("resume_uploaded");
  }, []);

  const trackCVDownload = useCallback(() => {
    trackEvent("cv_downloaded");
  }, []);

  const trackContactSubmit = useCallback(() => {
    trackEvent("contact_form_submitted");
  }, []);

  return {
    trackChatMessage,
    trackDemoUse,
    trackResumeUpload,
    trackCVDownload,
    trackContactSubmit
  };
}
