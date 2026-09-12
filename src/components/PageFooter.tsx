export function PageFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`px-6 py-4 text-center text-xs text-[#755e4d] ${className}`}>
      LukiSeula © {new Date().getFullYear()} · Harrasteprojekti
    </footer>
  );
}
