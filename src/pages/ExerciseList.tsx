import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Layers, AudioLines, SplitSquareHorizontal } from "lucide-react";

export default function ExerciseList() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Harjoitukset</h1>
          <p className="text-lg text-muted-foreground">
            Valitse harjoitus lukutaitojen arviointiin. Tulokset näytetään tällä
            hetkellä erikseen kunkin harjoituksen lopussa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Pseudosanojen tunnistus</CardTitle>
              <CardDescription>
                Päätä onko sana oikea vai ei. Mittaa tarkkuutta ja reaktioaikaa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/task/pseudowords">Aloita</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sanojen etsiminen tekstistä</CardTitle>
              <CardDescription>
                Etsi annetut sanat tekstistä. Aikaraja 2 minuuttia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/task/word-search">Aloita</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sanojen muodostaminen tavuista</CardTitle>
              <CardDescription>
                Valitse tavut oikeassa järjestyksessä muodostaaksesi sanan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/exercise/syllables">Aloita</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <AudioLines className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sanojen pituuden erottaminen</CardTitle>
              <CardDescription>
                Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/exercise/minimal-pairs">Aloita</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <SplitSquareHorizontal className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sanaketjujen erottaminen</CardTitle>
              <CardDescription>
                Lisää välilyönnit oikeisiin kohtiin yhteenkirjoitetussa lauseessa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/exercise/word-chains">Aloita</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link to="/results">Katso tulokset</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Takaisin etusivulle</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
