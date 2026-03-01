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
            <CardTitle>Ei tuloksia</CardTitle>
            <CardDescription>
              Emme löytäneet seulontatietoja tältä istunnolta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Tämä voi johtua siitä, että tulit tälle sivulle ilman että teit
              tehtävän loppuun, tai että tiedot on tyhjennetty.
            </p>
            <Button
              onClick={() => navigate("/start")}
              className="w-full"
              size="lg"
              aria-label="Aloita uusi seulonta"
            >
              Aloita uusi seulonta
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
              aria-label="Palaa etusivulle"
            >
              Takaisin etusivulle
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy = computeAccuracy(trials);
  const avgRt = computeAvgRt(trials);


  return (
    <>
      <ResultCard accuracy={accuracy} avgRt={avgRt} />

      <div className="max-w-2xl mx-auto px-4 mt-6 flex flex-col sm:flex-row gap-2">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => navigate("/task/word-search")}
          aria-label="Siirry seuraavaan tehtävään (sanahaku tekstistä)"
        >
          Seuraava harjoitus: sanahaku tekstistä
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/exercises")}
          aria-label="Palaa harjoituslistaan"
        >
          Takaisin harjoituslistaan
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="max-w-2xl mx-auto px-4">
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer">Debug: trials</summary>
            <pre className="mt-2 overflow-auto max-h-64 bg-muted/30 p-2 rounded">
              {JSON.stringify(trials, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </>
  );
}
