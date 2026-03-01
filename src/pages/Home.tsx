import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Shield, Clock } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lukivaikeuden seulonta
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lyhyt, anonyymi seulontatehtävä lukemiseen liittyvien taitojen arviointiin.
          </p>
        </div>

        {/* Main card */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Tietoa seulasta</CardTitle>
              <CardDescription>Mitä tämä työkalu tekee – ja mitä ei</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground">
                  Tämä seula käyttää <strong>pseudosanatehtävää</strong> lukivaikeuteen
                  liittyvien taitojen arviointiin. Näet joukon sanoja ja päätät,
                  onko kukin niistä oikea suomen sana vai ei.
                </p>
                <p className="text-foreground">
                  Tehtävä mittaa sekä tarkkuutta että reaktioaikaa. Näiden avulla saadaan
                  viitteitä lukemiseen liittyvistä prosesseista.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Nopea</h3>
                  <p className="text-xs text-muted-foreground">Kestää noin 2–3 minuuttia</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Anonyymi</h3>
                  <p className="text-xs text-muted-foreground">Henkilötietoja ei kerätä</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Tutkimukseen perustuva</h3>
                  <p className="text-xs text-muted-foreground">Perustuu tutkittuihin menetelmiin</p>
                </div>
              </div>

              {/* Important notice */}
              <div className="bg-muted rounded-lg p-4 border-l-4 border-primary">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Huomio: Tämä ei ole diagnoosi
                </p>
                <p className="text-sm text-muted-foreground">
                  Tämä seula antaa vain alustavaa tietoa. Varsinainen diagnoosi
                  edellyttää laajaa tutkimusta ja ammattilaisen arviota.
                </p>
              </div>

              {/* Privacy notice */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Käyttö on täysin anonyymia. Tulokset tallentuvat vain omalle laitteellesi.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-3">
            <Button
              size="lg"
              onClick={() => navigate("/start")}
              className="px-8 text-lg h-14"
              aria-label="Aloita seulonta"
            >
              Aloita seulonta
            </Button>
            <div>
              <Button
                variant="outline"
                onClick={() => navigate("/exercises")}
                aria-label="View all exercises"
              >
                Harjoitukset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
