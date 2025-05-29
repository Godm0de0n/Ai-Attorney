"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { provideLegalGuidance, type ProvideLegalGuidanceInput, type ProvideLegalGuidanceOutput } from '@/ai/flows/provide-legal-guidance';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquareQuote, BookOpen, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LegalGuidancePage() {
  const [situationDescription, setSituationDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guidanceResult, setGuidanceResult] = useState<ProvideLegalGuidanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!situationDescription.trim()) {
      setError("Please describe your situation.");
      toast({ variant: "destructive", title: "Error", description: "Situation description is empty." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGuidanceResult(null);

    try {
      const input: ProvideLegalGuidanceInput = { situationDescription };
      const result = await provideLegalGuidance(input);
      setGuidanceResult(result);
      toast({ title: "Guidance Received", description: "Legal guidance has been generated."});
    } catch (err) {
      console.error("Error providing legal guidance:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get legal guidance: ${errorMessage}`);
      toast({ variant: "destructive", title: "Guidance Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Legal Guidance</h1>
        <p className="text-muted-foreground">
          Describe your situation to receive AI-powered legal advice, including relevant Indian Penal Code sections.
        </p>
      </header>

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="w-6 h-6 text-primary" />
              Describe Your Situation
            </CardTitle>
            <CardDescription>
              Provide a detailed account of your legal query or situation. The more details you provide, the better the guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="situation-description">Your Situation</Label>
              <Textarea
                id="situation-description"
                placeholder="Enter details here..."
                value={situationDescription}
                onChange={(e) => setSituationDescription(e.target.value)}
                rows={10}
                className="focus:ring-accent"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Guidance...
                </>
              ) : (
                "Get Legal Guidance"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {guidanceResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <Sparkles className="w-6 h-6 text-accent" />
              AI-Generated Legal Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 text-accent">
                <ShieldCheck className="w-5 h-5" />
                Legal Advice
              </h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{guidanceResult.legalAdvice}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 text-accent">
                <BookOpen className="w-5 h-5" />
                Relevant IPC Sections
              </h3>
              {guidanceResult.ipcSections && guidanceResult.ipcSections.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {guidanceResult.ipcSections.map((section, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">{section}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific IPC sections identified.</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-accent">Incorporated Details Decision</h3>
              <p className="text-foreground/90">
                Specific details incorporated based on precedents: <Badge variant={guidanceResult.shouldIncorporateDetails ? "default" : "outline"}>{guidanceResult.shouldIncorporateDetails ? "Yes" : "No"}</Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
       <Card className="mt-8 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The legal guidance provided by AI-Attorney is for informational purposes only and should not be considered as a substitute for professional legal advice from a qualified lawyer. Laws and their interpretations can be complex and vary based on specific circumstances. Always consult with a licensed attorney for any legal issues or decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
