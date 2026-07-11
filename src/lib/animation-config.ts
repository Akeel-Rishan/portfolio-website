"use client";

import { useReducedMotion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function useAnimationConfig() {
  const prefersReduced = useReducedMotion();
  const bp = useBreakpoint();
  const isMobile = bp === "mobile" || bp === "mobile-sm";

  return {
    fadeInUp: {
      hidden: { opacity: 0, y: prefersReduced ? 0 : isMobile ? 16 : 40 },
      visible: { opacity: 1, y: 0 },
      transition: {
        duration: prefersReduced ? 0.01 : isMobile ? 0.4 : 0.6,
        ease: "easeOut"
      }
    },
    staggerContainer: {
      visible: {
        transition: {
          staggerChildren: isMobile ? 0.06 : 0.1
        }
      }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: prefersReduced || isMobile ? 0 : -40 },
      visible: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: prefersReduced || isMobile ? 0 : 40 },
      visible: { opacity: 1, x: 0 }
    }
  };
}
