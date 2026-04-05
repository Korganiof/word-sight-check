import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseReadyScreenProps {
  title: string;
  description?: string;
  onStart: () => void;
}

export function ExerciseReadyScreen({ title, description, onStart }: ExerciseReadyScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {description && <p className="text-muted-foreground">{description}</p>}
          <p className="font-medium">Oletko valmis jatkamaan?</p>
          <Button className="w-full" size="lg" onClick={onStart}>
            Aloita
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
