import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  target?: string;
  rel?: string;
  download?: string | boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-[0_0_22px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(6,182,212,0.4)]",
  outline:
    "border-brand-purple/70 bg-transparent text-brand-purple hover:bg-brand-purple hover:text-white",
  ghost: "border-transparent bg-transparent text-text-muted hover:border-dark-border hover:bg-white/5 hover:text-text-primary"
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, href, variant = "primary", size = "md", icon, children, target, rel, download, onClick, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:ring-offset-2 focus:ring-offset-dark-bg",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <a href={href} className={classes} target={target} rel={rel} download={download} onClick={onClick}>
          {icon}
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
