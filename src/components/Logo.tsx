import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** The favicon motif: gold-tint field, white lens with a gold ring and handle, brown text pills. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("flex-shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="#FAF0D2" />
      <circle cx="14.5" cy="14.5" r="7.75" fill="#FFFFFF" stroke="#C69A2B" strokeWidth="2.5" />
      <path d="M20.4 20.4 25.2 25.2" stroke="#C69A2B" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="10" y="10.6" width="5.6" height="2" rx="1" fill="#4A3728" />
      <rect x="16.8" y="10.6" width="2.4" height="2" rx="1" fill="#4A3728" />
      <rect x="9.4" y="13.8" width="3.4" height="2" rx="1" fill="#4A3728" />
      <rect x="14" y="13.8" width="5.8" height="2" rx="1" fill="#4A3728" />
      <rect x="10.4" y="17" width="5" height="2" rx="1" fill="#4A3728" />
    </svg>
  );
}

interface LogoProps {
  /** Link to the home page. Inside the battery there is no back navigation, so pass false. */
  link?: boolean;
  /** Hide the wordmark (phones inside the app bar). */
  markOnly?: boolean;
  className?: string;
}

export function Logo({ link = true, markOnly = false, className }: LogoProps) {
  const inner = (
    <>
      <LogoMark className="h-[30px] w-[30px] md:h-8 md:w-8" />
      <span
        className={cn(
          "font-ui text-[18px] font-extrabold tracking-[-0.02em] leading-none text-ink md:text-[19px]",
          markOnly && "sr-only md:not-sr-only",
        )}
      >
        LukiSeula
      </span>
    </>
  );
  const classes = cn("inline-flex items-center gap-2.5 rounded-key no-underline text-ink", className);
  if (link) {
    return (
      <Link to="/" className={classes} aria-label="LukiSeula — etusivulle">
        {inner}
      </Link>
    );
  }
  return <span className={classes}>{inner}</span>;
}
