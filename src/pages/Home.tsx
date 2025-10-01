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
            Dyslexia Screener
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A quick screening tool to assess reading-related skills
          </p>
        </div>

        {/* Main card */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">About This Screener</CardTitle>
              <CardDescription>Understanding what this tool does and doesn't do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground">
                  This screening tool uses a <strong>pseudoword reading task</strong> to assess 
                  skills associated with dyslexia. You'll be shown a series of words and asked 
                  to decide whether each is a real English word or not.
                </p>
                <p className="text-foreground">
                  The task measures your accuracy and response time, which can provide insights 
                  into reading-related cognitive processes.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Quick</h3>
                  <p className="text-xs text-muted-foreground">Takes about 2-3 minutes</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Anonymous</h3>
                  <p className="text-xs text-muted-foreground">No personal data collected</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Evidence-based</h3>
                  <p className="text-xs text-muted-foreground">Uses validated approach</p>
                </div>
              </div>

              {/* Important notice */}
              <div className="bg-muted rounded-lg p-4 border-l-4 border-primary">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Important: This is NOT a diagnosis
                </p>
                <p className="text-sm text-muted-foreground">
                  This screening tool provides preliminary information only. A formal diagnosis 
                  of dyslexia requires comprehensive assessment by a qualified professional.
                </p>
              </div>

              {/* Privacy notice */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your session is completely anonymous. Results are stored locally on your device only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/start")}
              className="px-8 text-lg h-14"
              aria-label="Start the screening"
            >
              Start Screening
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
