import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Keyboard, Timer } from "lucide-react";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Before We Begin</CardTitle>
            <CardDescription className="text-base">
              Please read these instructions carefully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Task Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    You will be shown 10 words, one at a time. Your job is to decide whether 
                    each word is a <strong>real English word</strong> or <strong>not a word</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">How to Respond</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can use either the buttons on screen or keyboard shortcuts:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">A</kbd>
                      <span>for <strong>Real word</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">L</kbd>
                      <span>for <strong>Not a word</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Timer className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Take Your Time</h3>
                  <p className="text-sm text-muted-foreground">
                    There's no time limit, but try to respond as <strong>quickly and accurately</strong> as 
                    you can. Trust your first instinct.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                size="lg"
                onClick={() => navigate("/consent")}
                className="w-full text-lg h-12"
                aria-label="Continue to consent page"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
                aria-label="Go back to home page"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
