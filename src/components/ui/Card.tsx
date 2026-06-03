import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl border border-dark-border bg-dark-card/75 p-6 transition duration-300 hover:scale-[1.02] hover:border-brand-purple/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
