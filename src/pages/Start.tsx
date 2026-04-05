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
            <CardTitle className="text-3xl">Ennen kuin aloitat</CardTitle>
            <CardDescription className="text-base">
              Lue nämä ohjeet huolellisesti
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
                  <h3 className="font-semibold text-foreground mb-1">Tehtävän kuvaus</h3>
                  <p className="text-sm text-muted-foreground">
                    Näet sanoja yksi kerrallaan. Tehtäväsi on päättää,{" "}
                    onko kukin sana <strong>oikeaa suomea</strong> vai ei.
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
                  <h3 className="font-semibold text-foreground mb-1">Näin vastaat</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Voit käyttää joko näytön painikkeita tai näppäimistöä:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">A</kbd>
                      <span>= <strong>Oikea sana</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">L</kbd>
                      <span>= <strong>Ei sana</strong></span>
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
                  <h3 className="font-semibold text-foreground mb-1">Vastaa rauhassa</h3>
                  <p className="text-sm text-muted-foreground">
                    Tehtävällä ei ole aikarajaa, mutta pyri vastaamaan{" "}
                    <strong>mahdollisimman nopeasti ja tarkasti</strong>. Usein ensimmäinen
                    tuntuma on oikea.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                size="lg"
                onClick={() => navigate("/consent")}
                className="w-full text-lg h-12"
                aria-label="Jatka suostumussivulle"
              >
                Jatka
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
                aria-label="Palaa etusivulle"
              >
                Takaisin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
