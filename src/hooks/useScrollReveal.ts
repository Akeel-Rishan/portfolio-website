"use client";

import { useRef } from "react";
import { useInView, type Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return { ref, inView, fadeInUp, fadeInLeft, staggerChildren };
}
