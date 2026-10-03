import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Small page pieces shared by Home, Consent, the ready screens and Results
 * (HANDOFF.md § 7.7). Exercise-specific marks live in marks.tsx, the shell in
 * shell.tsx.
 */

interface SheetProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

/** White sheet: 1 px line, radius 20–22 on phones / 24–28 on desktop, shadow-sheet. */
export function Sheet({ as: Tag = "div", className, children, ...rest }: SheetProps) {
  return (
    <Tag
      className={cn("rounded-[22px] border border-line bg-surface shadow-sheet md:rounded-sheet-lg", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Two-word uppercase section label in gold-ink (or ink-2 for secondary groups). */
export function Label({
  children,
  muted = false,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "m-0 font-ui text-label uppercase",
        muted ? "text-ink-2" : "text-gold-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface IconTileProps {
  icon: ReactNode;
  /** 48 px by default. */
  size?: 36 | 40 | 44 | 48 | 56;
  /** Well background with a brown icon (advisory notes). */
  muted?: boolean;
  /** Brown background with a white icon (support-need block). */
  dark?: boolean;
  className?: string;
}

/** Gold-tint tile with a gold-ink Lucide icon. */
export function IconTile({ icon, size = 48, muted = false, dark = false, className }: IconTileProps) {
  const radius = size >= 48 ? "rounded-tile" : size >= 44 ? "rounded-[14px]" : "rounded-key";
  const iconSize = size >= 48 ? "[&>svg]:h-[22px] [&>svg]:w-[22px]" : "[&>svg]:h-5 [&>svg]:w-5";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center",
        radius,
        iconSize,
        dark ? "bg-brown text-white" : muted ? "bg-well text-brown" : "bg-gold-tint text-gold-ink",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {icon}
    </span>
  );
}

/** "Huomio" note: well fill, radius 28, label in brown with the info icon. */
export function NoteBlock({
  title = "Huomio",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("rounded-sheet bg-well p-6 md:rounded-sheet-lg md:p-8", className)}>
      <p className="m-0 mb-3 flex items-center gap-2 font-ui text-[13px] font-extrabold uppercase tracking-[0.1em] text-brown">
        <Info className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
        {title}
      </p>
      <div className="text-body-sm text-ink md:text-body">{children}</div>
    </aside>
  );
}

interface ResourceLinkProps {
  href: string;
  title: string;
  description: string;
  /** Print the URL under the description (Results print stylesheet). */
  showUrl?: boolean;
}

/** Full-row external link; rows are separated by hairlines inside one Sheet. */
export function ResourceLink({ href, title, description, showUrl = false }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ls-t flex items-start justify-between gap-4 px-5 py-4 text-ink no-underline hover:bg-recessed hover:text-ink md:px-7 md:py-5"
    >
      <span className="min-w-0">
        <span className="block font-ui text-[18px] font-extrabold leading-[26px] tracking-[-0.01em] text-ink">
          {title}
        </span>
        <span className="block text-[16px] leading-[26px] text-ink-2">{description}</span>
        {showUrl && (
          <span className="hidden text-[13px] leading-5 text-ink-2 print:block">{href}</span>
        )}
      </span>
      <ArrowUpRight className="mt-0.5 h-[22px] w-[22px] flex-shrink-0 text-gold-ink print:hidden" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}

interface NumberedStepProps {
  n: number;
  /** Gold-tint circle with a gold-ink number (Results); otherwise white with a hairline (ready screens). */
  tone?: "tint" | "outline";
  title?: string;
  children: ReactNode;
}

export function NumberedStep({ n, tone = "outline", title, children }: NumberedStepProps) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className={cn(
          "mt-[5px] inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill font-ui text-[17px] font-extrabold tabular-nums",
          tone === "tint" ? "bg-gold-tint text-gold-ink" : "border border-line bg-surface text-gold-ink",
        )}
      >
        {n}
      </span>
      <div className="min-w-0 pt-[5px]">
        {title && <p className="m-0 mb-1 font-ui text-h4 text-ink">{title}</p>}
        <div className="text-body text-ink">{children}</div>
      </div>
    </li>
  );
}

/** Hairline + logo + Tietosuoja link + © line. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-line print:hidden", className)}>
      <div className="mx-auto flex w-full max-w-home flex-col items-start gap-3 px-gutter py-8 text-caption text-ink-2 md:flex-row md:items-center md:justify-between md:px-8">
        <span className="font-ui text-[16px] font-extrabold tracking-[-0.02em] text-ink">LukiSeula</span>
        <a href="/#tietosuoja" className="text-gold-ink hover:text-gold-ink-deep">
          Tietosuoja
        </a>
        <span>© {new Date().getFullYear()} LukiSeula · Harrasteprojekti</span>
      </div>
    </footer>
  );
}
