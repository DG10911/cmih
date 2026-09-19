"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-mineral text-background hover:bg-mineral-soft",
        secondary: "border border-border-strong bg-surface-2 text-ink hover:bg-surface-3",
        ghost: "text-ink-soft hover:bg-surface-2 hover:text-ink",
        outline: "border border-border-strong text-ink-soft hover:border-data hover:text-ink",
        data: "bg-data/15 text-data hover:bg-data/25 border border-data/30",
        danger: "border border-danger/40 text-danger hover:bg-danger/10",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { button as buttonVariants };
