import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResultCard } from "@/components/ResultCard";
import { loadSession, computeAccuracy, computeAvgRt, type Trial } from "@/lib/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const [trials, setTrials] = useState<Trial[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = loadSession();
    setTrials(sessionData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (!trials || trials.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              We couldn't find any screening data for your session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This can happen if you navigate directly to this page without completing 
              the screening, or if your session data has been cleared.
            </p>
            <Button
              onClick={() => navigate("/start")}
              className="w-full"
              size="lg"
              aria-label="Start a new screening"
            >
              Start New Screening
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
              aria-label="Go to home page"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy = computeAccuracy(trials);
  const avgRt = computeAvgRt(trials);

  return <ResultCard accuracy={accuracy} avgRt={avgRt} />;
}
