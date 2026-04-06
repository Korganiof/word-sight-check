import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-base">{subtitle}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.heading}</h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={onStart}>
            {startLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
