import { cn } from "@/lib/utils";

type BadgeVariant = "purple" | "cyan" | "green" | "orange" | "pink";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  purple: "border-brand-purple/35 bg-brand-purple/10 text-purple-200",
  cyan: "border-brand-cyan/35 bg-brand-cyan/10 text-cyan-200",
  green: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  orange: "border-orange-400/35 bg-orange-400/10 text-orange-200",
  pink: "border-pink-400/35 bg-pink-400/10 text-pink-200"
};

export function Badge({ className, children, variant = "purple", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
