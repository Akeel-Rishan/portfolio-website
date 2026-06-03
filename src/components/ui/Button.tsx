import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-brand-purple bg-brand-purple text-white shadow-neon hover:border-brand-cyan hover:bg-brand-cyan",
  outline:
    "border-dark-border bg-transparent text-text-primary hover:border-brand-purple hover:bg-brand-purple/10",
  ghost: "border-transparent bg-transparent text-text-muted hover:border-dark-border hover:text-text-primary"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, href, variant = "primary", children, ...props }, ref) => {
    const classes = cn(
      "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:ring-offset-2 focus:ring-offset-dark-bg",
      variants[variant],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
