import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { syllableItems } from "./syllableItems.fi";
import { useSyllableLogger } from "./useSyllableLogger";
import { seededShuffle } from "./seededShuffle";
import type { SyllableItem, SyllableTile } from "./types";

export function SyllableExercise() {
  const logger = useSyllableLogger(syllableItems);
  const session = logger.session;

  const orderedItems = useMemo(() => {
    if (!session) return [];
    return seededShuffle(syllableItems, session.seed);
  }, [session?.seed]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [shuffledTiles, setShuffledTiles] = useState<SyllableTile[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const hasAutoSubmittedRef = useRef(false);
  const processingRef = useRef(false);

  const currentItem = orderedItems[currentIndex] ?? null;

  // Ref to avoid effect re-running when logger identity changes (startAttempt updates
  // session, which recreates logger callbacks -> infinite loop). We only need to run
  // when the displayed item or session seed changes.
  const loggerRef = useRef(logger);
  loggerRef.current = logger;

  // Shuffle tiles when item changes (do NOT include logger - it changes when session
  // updates, causing an infinite loop that clears selectedSyllables and spazzes the UI)
  useEffect(() => {
    if (!currentItem || !session) return;
    const tileSeed = session.seed + currentIndex * 1000;
    setShuffledTiles(seededShuffle(currentItem.tiles, tileSeed));
    setSelectedSyllables([]);
    hasAutoSubmittedRef.current = false;
    loggerRef.current.startAttempt(currentItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- logger excluded intentionally to prevent effect loop
  }, [currentItem?.id, currentIndex, session?.seed]);

  const advanceToNext = useCallback(() => {
    if (currentIndex >= orderedItems.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, orderedItems.length]);

  const handleTileClick = useCallback(
    (tile: SyllableTile) => {
      if (!currentItem || selectedSyllables.length >= currentItem.expectedSyllableCount)
        return;
      loggerRef.current.logEvent("tile_click", tile.id, tile.value);
      setSelectedSyllables((prev) => [...prev, tile.value]);
    },
    [currentItem, selectedSyllables.length]
  );

  const handleRemoveLast = useCallback(() => {
    if (selectedSyllables.length === 0) return;
    loggerRef.current.logEvent("reset");
    setSelectedSyllables((prev) => prev.slice(0, -1));
  }, [selectedSyllables.length]);

  const handleReset = useCallback(() => {
    loggerRef.current.logEvent("reset");
    setSelectedSyllables([]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!currentItem) return;
    if (processingRef.current) return; // guard against double-submit (like PseudoWordTask)
    processingRef.current = true;

    loggerRef.current.logEvent("submit");
    const result = loggerRef.current.completeAttempt(
      selectedSyllables,
      currentItem,
      false
    );

    if (result.isCorrect) {
      toast.success("Oikein!");
      advanceToNext();
      processingRef.current = false;
    } else {
      setIsShaking(true);
      toast.error("Yritä uudelleen");
      setTimeout(() => {
        setIsShaking(false);
        processingRef.current = false;
      }, 500);
    }
  }, [currentItem, selectedSyllables, advanceToNext]);

  // Auto-submit when count matches (once per item)
  useEffect(() => {
    if (
      currentItem &&
      selectedSyllables.length === currentItem.expectedSyllableCount &&
      !hasAutoSubmittedRef.current
    ) {
      hasAutoSubmittedRef.current = true;
      handleSubmit();
    }
  }, [selectedSyllables, currentItem, handleSubmit]);

  if (isComplete) {
    return (
      <SyllableEndScreen
        attempts={logger.session?.attempts ?? []}
        onRestart={() => {
          logger.resetSession();
          setCurrentIndex(0);
          setIsComplete(false);
        }}
      />
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ladataan...</p>
      </div>
    );
  }

  const progressPct = orderedItems.length > 0
    ? ((currentIndex + 1) / orderedItems.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col gap-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Sanojen muodostaminen tavuista</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Valitse tavut oikeassa järjestyksessä muodostaaksesi sanan. Ota aikaa.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Badge variant="secondary">Taso {currentItem.level}</Badge>
          <span className="text-sm text-muted-foreground">
            Tehtävä {currentIndex + 1} / {orderedItems.length}
          </span>
        </div>

        <Progress value={progressPct} className="h-2" />

        <Card className={cn("transition-all", isShaking && "animate-shake")}>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Valitse tavut
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {shuffledTiles.map((tile) => (
                <Button
                  key={tile.id}
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => handleTileClick(tile)}
                  disabled={
                    selectedSyllables.length >= currentItem.expectedSyllableCount
                  }
                >
                  {tile.value}
                </Button>
              ))}
            </div>

            <div className="border rounded-lg p-4 bg-muted/30 min-h-[4rem]">
              <p className="text-sm text-muted-foreground mb-2">
                Valitut tavut (klikkaa poistaaksesi viimeisen):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSyllables.length === 0 ? (
                  <span className="text-muted-foreground italic">
                    Valitse tavut ylhäältä
                  </span>
                ) : (
                  selectedSyllables.map((syl, i) => {
                    const isLast = i === selectedSyllables.length - 1;
                    return (
                      <button
                        key={`${i}-${syl}`}
                        type="button"
                        onClick={() => isLast && handleRemoveLast()}
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors",
                          isLast
                            ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                            : "bg-primary/10 text-primary cursor-default"
                        )}
                        title={isLast ? "Poista viimeinen tavu" : undefined}
                      >
                        {syl}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Tyhjennä
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedSyllables.length === 0}
              >
                Tarkista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface SyllableEndScreenProps {
  attempts: Array<{
    level: number;
    type: "real" | "pseudo";
    isCorrect: boolean;
    errorTags: string[];
  }>;
  onRestart: () => void;
}

function SyllableEndScreen({ attempts, onRestart }: SyllableEndScreenProps) {
  const navigate = useNavigate();
  const stats = useMemo(() => {
    const real = attempts.filter((a) => a.type === "real");
    const pseudo = attempts.filter((a) => a.type === "pseudo");
    const realCorrect = real.filter((a) => a.isCorrect).length;
    const pseudoCorrect = pseudo.filter((a) => a.isCorrect).length;

    const byLevel = new Map<number, number[]>();
    for (const a of attempts) {
      if (a.isCorrect) {
        const times = byLevel.get(a.level) ?? [];
        times.push(1); // placeholder - we don't have duration per item in attempt
        byLevel.set(a.level, times);
      }
    }

    const errorTagCounts = { double_consonant: 0, vowel_length: 0, syllable_order: 0 };
    for (const a of attempts) {
      for (const tag of a.errorTags) {
        if (tag in errorTagCounts) {
          errorTagCounts[tag as keyof typeof errorTagCounts]++;
        }
      }
    }

    return {
      realTotal: real.length,
      realCorrect,
      realAccuracy: real.length > 0 ? Math.round((realCorrect / real.length) * 100) : 0,
      pseudoTotal: pseudo.length,
      pseudoCorrect,
      pseudoAccuracy: pseudo.length > 0 ? Math.round((pseudoCorrect / pseudo.length) * 100) : 0,
      errorTagCounts,
    };
  }, [attempts]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>Harjoitus valmis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tuloksesi Sanojen muodostaminen tavuista -harjoituksesta
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase">Oikeat sanat</p>
              <p className="text-lg font-semibold">
                {stats.realCorrect} / {stats.realTotal} ({stats.realAccuracy}%)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase">Pseudosanat</p>
              <p className="text-lg font-semibold">
                {stats.pseudoCorrect} / {stats.pseudoTotal} ({stats.pseudoAccuracy}%)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase mb-2">
              Havaitut virhetyypit
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Kaksoiskonsonantti: {stats.errorTagCounts.double_consonant}
              </Badge>
              <Badge variant="secondary">
                Vokaalin pituus: {stats.errorTagCounts.vowel_length}
              </Badge>
              <Badge variant="secondary">
                Tavujärjestys: {stats.errorTagCounts.syllable_order}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button className="flex-1" size="lg" onClick={onRestart}>
              Aloita alusta
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
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
