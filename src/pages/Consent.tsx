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
      navigate("/task/pseudowords");
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
            <CardTitle className="text-3xl">Consent & Understanding</CardTitle>
            <CardDescription className="text-base">
              Please confirm you understand the following
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key points */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">This is NOT a diagnosis</h3>
                <p className="text-sm text-muted-foreground">
                  This screening tool provides preliminary information only. It cannot diagnose 
                  dyslexia or any other condition. Only a qualified professional can provide 
                  a formal diagnosis through comprehensive assessment.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">Your session is anonymous</h3>
                <p className="text-sm text-muted-foreground">
                  We do not collect any personal information. Your results are stored only 
                  in your browser's session storage and will be automatically cleared when 
                  you close your browser.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-foreground mb-2">Seek professional advice</h3>
                <p className="text-sm text-muted-foreground">
                  If you have concerns about dyslexia or learning difficulties, please consult 
                  with a qualified educational psychologist, special education professional, 
                  or healthcare provider.
                </p>
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-secondary/30 rounded-lg">
              <Checkbox
                id="consent"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                aria-label="I understand and agree"
                className="mt-1"
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium text-foreground leading-relaxed cursor-pointer"
              >
                I understand that this is <strong>not a diagnosis</strong> and that my session 
                is <strong>anonymous</strong>. I agree to proceed with the screening.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!agreed}
                className="w-full text-lg h-12"
                aria-label="Continue to task"
              >
                Continue to Task
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/start")}
                className="w-full"
                aria-label="Go back"
              >
                Back
              </Button>
            </div>

            {agreed && (
              <p className="text-xs text-muted-foreground text-center">
                Ready to begin? Click "Continue to Task" above
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
