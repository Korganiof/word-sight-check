import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { clearSession } from "@/lib/metrics";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ResultCardProps {
  accuracy: number;
  avgRt: number;
}

export function ResultCard({ accuracy, avgRt }: ResultCardProps) {
  const navigate = useNavigate();

  const handleRestart = () => {
    clearSession();
    navigate("/start");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Screening Complete</CardTitle>
          <CardDescription className="text-base">
            Thank you for completing the dyslexia screening task
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-6 text-center space-y-2">
              <div className="flex justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <p className="text-4xl font-bold text-foreground">{accuracy}%</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 text-center space-y-2">
              <div className="flex justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Average Response Time</p>
              <p className="text-4xl font-bold text-foreground">{avgRt}<span className="text-xl text-muted-foreground ml-1">ms</span></p>
            </div>
          </div>

          {/* Risk band placeholder */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2">
            <div className="flex justify-center">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Risk Band</p>
            <p className="text-lg text-muted-foreground italic">(Coming soon)</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Risk assessment model will be added in a future update
            </p>
          </div>

          {/* Important notice */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Important Notice</p>
            <p className="text-sm text-muted-foreground">
              This screening tool is <strong>not a diagnosis</strong>. If you have concerns about dyslexia, 
              please consult with a qualified educational psychologist or healthcare professional.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleRestart}
              className="flex-1"
              size="lg"
              aria-label="Restart the screening"
            >
              Restart Screening
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex-1"
              size="lg"
              aria-label="Return to home page"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
