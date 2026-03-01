import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadWordSearchResult, type WordSearchResult } from "@/lib/wordsearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function WordSearchResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState<WordSearchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = loadWordSearchResult();
    setResult(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading word search results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>No word search results</CardTitle>
            <CardDescription>
              We couldn&apos;t find any word search data for your session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This can happen if you navigate directly to this page without
              completing the word search task, or if your session data has been cleared.
            </p>
            <Button
              onClick={() => navigate("/task/word-search")}
              className="w-full"
              size="lg"
            >
              Retry Word Search
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy =
    result.totalTargets > 0
      ? Math.round((result.foundCorrect / result.totalTargets) * 100)
      : 0;
  const totalSeconds = Math.round(result.durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle>Word Search Results</CardTitle>
          <CardDescription>
            Summary of your performance on the word-in-text task.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Correct hits
              </p>
              <p className="text-lg font-semibold">
                {result.foundCorrect} / {result.totalTargets}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Missed targets
              </p>
              <p className="text-lg font-semibold">{result.missedTargets}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Incorrect clicks
              </p>
              <p className="text-lg font-semibold">{result.incorrectClicks}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Accuracy
              </p>
              <p className="text-lg font-semibold">{accuracy}%</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Time used
            </p>
            <p className="text-lg font-semibold">{formattedTime}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <Button className="flex-1" onClick={() => navigate("/task/word-search")}>
              Try Again
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/result")}
            >
              View Pseudoword Results
            </Button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => navigate("/exercise/syllables")}
            >
              Seuraava harjoitus: tavuttaminen
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/exercises")}
            >
              Takaisin harjoituslistaan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

