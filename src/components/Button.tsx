import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline";
export type ButtonSize = "md" | "hero" | "sm";

// Primary is gold with INK text (white on gold is only 2.6:1). Inside an
// exercise nothing is gold except what the user has marked, so the
// finish-early button is always the brown secondary.
const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-hover active:bg-gold-press disabled:bg-well disabled:text-ink-2",
  secondary:
    "bg-brown text-white hover:bg-brown-deep active:bg-brown-press disabled:bg-well disabled:text-ink-2",
  tertiary:
    "bg-transparent text-gold-ink hover:bg-gold-tint hover:text-gold-ink-deep active:bg-gold-wash disabled:bg-well disabled:text-ink-2",
  outline:
    "bg-surface text-ink border-[1.5px] border-brown hover:bg-recessed active:bg-brown active:text-white disabled:bg-well disabled:text-ink-2 disabled:border-well",
};

const SIZE: Record<ButtonSize, string> = {
  md: "h-14 px-7 rounded-btn text-[17px]",
  hero: "h-[60px] px-8 rounded-tile text-[18px]",
  sm: "h-11 px-5 rounded-key text-[15px]",
};

const BASE =
  "ls-t inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-ui font-bold leading-none tracking-[-0.005em] no-underline cursor-pointer disabled:cursor-not-allowed [&>svg]:h-5 [&>svg]:w-5 [&>svg]:flex-shrink-0";

function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(BASE, VARIANT[variant], SIZE[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest} />;
});

interface LinkButtonProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

/** Same look as Button, rendered as a router link (keeps semantics for navigation). */
export function LinkButton({ to, variant = "primary", size = "md", className, children }: LinkButtonProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
