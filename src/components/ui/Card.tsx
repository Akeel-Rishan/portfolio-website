"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: boolean;
}

export function Card({ className, children, hover = true, glow = false, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "card rounded-xl border border-dark-border bg-dark-card/80 p-6 backdrop-blur-md transition-colors duration-300",
        hover && "hover:border-brand-purple/80",
        glow && "hover:shadow-[0_0_34px_rgba(124,58,237,0.34)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
