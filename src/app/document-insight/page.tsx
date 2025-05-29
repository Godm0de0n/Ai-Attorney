"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeLegalDocument, type SummarizeLegalDocumentInput, type SummarizeLegalDocumentOutput } from '@/ai/flows/summarize-legal-document';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, FileText, ListChecks, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentInsightPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SummarizeLegalDocumentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/plain" || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
        setError(null);
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentText(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
        toast({ title: "File selected", description: selectedFile.name });

      } else {
        setError("Invalid file type. Please upload a .txt file.");
        setFile(null);
        setDocumentText("");
        toast({ variant: "destructive", title: "File Error", description: "Please upload a .txt file." });
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !documentText) {
      setError("Please select a document to analyze.");
      toast({ variant: "destructive", title: "Error", description: "No document selected." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const input: SummarizeLegalDocumentInput = { documentText };
      const result = await summarizeLegalDocument(input);
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Document summary and steps generated." });
    } catch (err) {
      console.error("Error summarizing document:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze document: ${errorMessage}`);
      toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Document Insight</h1>
        <p className="text-muted-foreground">
          Upload your legal document (.txt format) to get an AI-powered summary and suggested next steps.
        </p>
      </header>

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-primary" />
              Upload Legal Document
            </CardTitle>
            <CardDescription>
              Select a .txt file from your device. The content will be displayed below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="legal-document">Legal Document (.txt)</Label>
              <Input id="legal-document" type="file" accept=".txt" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
            </div>
            {documentText && (
              <div className="space-y-2">
                <Label htmlFor="document-content">Document Content (Preview)</Label>
                <Textarea 
                  id="document-content" 
                  value={documentText} 
                  readOnly 
                  rows={8}
                  className="bg-muted/50"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Document"
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

      {analysisResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 text-accent">
                <FileText className="w-5 h-5" />
                Summary
              </h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.summary}</p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2 text-accent">
                <ListChecks className="w-5 h-5" />
                Suggested Next Steps
              </h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{analysisResult.suggestedSteps}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
