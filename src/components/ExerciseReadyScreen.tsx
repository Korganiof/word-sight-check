interface Step {
  heading: string;
  text: string;
}

interface ExerciseReadyScreenProps {
  title: string;
  subtitle?: string;
  steps: Step[];
  onStart: () => void;
  startLabel?: string;
}

export function ExerciseReadyScreen({
  title,
  subtitle,
  steps,
  onStart,
  startLabel = "Aloita harjoitus",
}: ExerciseReadyScreenProps) {
  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-2">{title}</h1>
        {subtitle && (
          <p className="text-[#755e4d] mb-8 leading-relaxed">{subtitle}</p>
        )}

        <div className="space-y-3 mb-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 flex gap-4"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#785a00]">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">{step.heading}</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-4 rounded-lg transition-colors text-base"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
