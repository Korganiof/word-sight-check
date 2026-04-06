import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      navigate("/start");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Suostumus ja ymmärrys</CardTitle>
            <CardDescription className="text-base">
              Vahvista, että ymmärrät seuraavat asiat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key points */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">Tämä EI ole diagnoosi</h3>
                <p className="text-sm text-muted-foreground">
                  Tämä seula antaa vain alustavaa tietoa. Se ei voi diagnosoida
                  lukivaikeutta tai mitään muutakaan tilaa. Vain pätevä ammattilainen
                  voi tehdä varsinaisen diagnoosin laajan tutkimuksen perusteella.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">Käyttö on anonyymia</h3>
                <p className="text-sm text-muted-foreground">
                  Emme kerää henkilötietoja. Tulokset tallentuvat vain selaimesi
                  istuntotietoihin ja poistuvat automaattisesti, kun suljet selaimen.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">Hakeudu tarvittaessa tutkimuksiin</h3>
                <p className="text-sm text-muted-foreground">
                  Jos sinulla on huolia lukivaikeudesta tai oppimisvaikeuksista,
                  ota yhteyttä esimerkiksi erityisopettajaan, oppimisvaikeuksiin
                  perehtyneeseen psykologiin tai terveydenhuollon ammattilaiseen.
                </p>
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-secondary/30 rounded-lg">
              <Checkbox
                id="consent"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                aria-label="Ymmärrän ja hyväksyn"
                className="mt-1"
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium text-foreground leading-relaxed cursor-pointer"
              >
                Ymmärrän, että tämä ei ole <strong>diagnoosi</strong> ja että käyttökertani on
                <strong> anonyymi</strong>. Hyväksyn nämä ehdot ja haluan jatkaa seulan tekemistä.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!agreed}
                className="w-full text-lg h-12"
                aria-label="Jatka tehtävään"
              >
                Jatka tehtävään
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
                aria-label="Palaa takaisin"
              >
                Takaisin
              </Button>
            </div>

            {agreed && (
              <p className="text-xs text-muted-foreground text-center">
                Valmis aloittamaan? Napsauta yläpuolella olevaa &quot;Jatka tehtävään&quot; -painiketta.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
