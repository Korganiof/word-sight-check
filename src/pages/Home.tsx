import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, Shield, BookOpen } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lukihäiriön seulonta
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Lyhyt testi, joka antaa viitteitä siitä, liittyykö lukemiseesi haasteita.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/consent")}
            className="px-10 text-xl h-16 w-full sm:w-auto shadow-lg"
          >
            Aloita lukihäiriötesti
          </Button>

        </div>

        {/* What is dyslexia */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Mitä on lukihäiriö?</h2>
          <p className="text-muted-foreground">
            Lukihäiriö eli dysleksia on oppimisvaikeus, joka vaikuttaa lukemisen ja kirjoittamisen
            sujuvuuteen. Se ei liity älykkyyteen tai laiskuuteen — kyse on siitä, miten aivot
            käsittelevät kirjoitettua kieltä.
          </p>
          <p className="text-muted-foreground">
            Lukihäiriö on yleinen: arviolta 5–10 % suomalaisista kokee sen vaikutuksia jossakin
            elämänsä vaiheessa. Se voi näkyä esimerkiksi hitaana lukemisena, tavujen sekoittumisena,
            oikeinkirjoituksen vaikeutena tai tekstin ymmärtämisen hitautena.
          </p>
          <p className="text-muted-foreground">
            Lukihäiriö tunnistetaan usein kouluiässä, mutta se jää monella aikuiselta diagnosoimatta.
            Oikeilla tukitoimilla sen kanssa oppii kuitenkin pärjäämään hyvin.
          </p>
        </div>

        {/* What this test does */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Mitä tämä testi tekee?</h2>
          <p className="text-muted-foreground">
            Testi koostuu useasta lyhyestä harjoituksesta, jotka mittaavat eri lukemiseen liittyviä
            taitoja: sanojen tunnistamista, tavujen käsittelyä, lukunopeutta ja pituuserojen
            erottamista. Yhteensä testi kestää noin 10–15 minuuttia.
          </p>
          <p className="text-muted-foreground">
            Testin lopussa saat yhteenvedon tuloksistasi osa-alueittain.
          </p>
        </div>

        {/* Notice */}
        <div className="bg-muted rounded-lg p-4 border-l-4 border-primary mb-8">
          <p className="text-sm font-semibold text-foreground mb-1">Tämä ei ole virallinen diagnoosi</p>
          <p className="text-sm text-muted-foreground">
            Testi antaa suuntaa, mutta ei korvaa ammattilaisen tekemää arviota. Jos tulokset
            herättävät kysymyksiä, kannattaa hakeutua tarkempaan tutkimukseen.
          </p>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col items-center text-center space-y-2 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">10–15 min</p>
            <p className="text-xs text-muted-foreground">Kesto</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">Anonyymi</p>
            <p className="text-xs text-muted-foreground">Ei henkilötietoja</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">Ilmainen</p>
            <p className="text-xs text-muted-foreground">Ei rekisteröintiä</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          <Button
            size="lg"
            onClick={() => navigate("/consent")}
            className="px-8 text-lg h-14 w-full sm:w-auto"
          >
            Aloita testi
          </Button>
        </div>

      </div>
    </div>
  );
}
