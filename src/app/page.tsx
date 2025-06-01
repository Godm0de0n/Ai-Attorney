
"use client";

import Link from 'next/link';
import NextImage from 'next/image'; // Import NextImage for static placeholders
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Gavel, MapPin, ArrowRight } from "lucide-react";
import { AIImage } from '@/components/ui/AIImage';

const featureCards = [
  {
    title: "Document Insight",
    description: "Upload legal documents for AI-powered summaries and suggested next steps.",
    href: "/document-insight",
    icon: FileText,
    imgSrc: "https://placehold.co/600x400.png", 
    imgAlt: "Document analysis illustration",
    dataAiHint: "abstract legal document analysis concept",
    useAIImage: true, // Flag to use AIImage for this card
  },
  {
    title: "Legal Guidance",
    description: "Describe your situation to receive legal advice and relevant IPC sections.",
    href: "/legal-guidance",
    icon: Gavel,
    imgSrc: "https://placehold.co/600x400.png", 
    imgAlt: "Legal hammer and book illustration",
    dataAiHint: "gavel justice balance scales concept art",
    useAIImage: false, // Use static image for this card
  },
  {
    title: "Lawyer Locator",
    description: "Find and connect with lawyers in your area based on your legal needs.",
    href: "/lawyer-locator",
    icon: MapPin,
    imgSrc: "https://placehold.co/600x400.png", 
    imgAlt: "Map and location pin illustration",
    dataAiHint: "map with location pins diverse people",
    useAIImage: false, // Use static image for this card
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome to AI-Attorney</h1>
        <p className="text-lg text-muted-foreground">
          Your intelligent partner for navigating the complexities of the legal world.
        </p>
      </header>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                {feature.useAIImage ? (
                  <AIImage
                    prompt={feature.dataAiHint}
                    alt={feature.imgAlt}
                    width={600} 
                    height={400}
                    layout="fill"
                    objectFit="cover"
                    fallbackSrc={feature.imgSrc} // AIImage handles its own fallback
                    className="bg-muted"
                  />
                ) : (
                  <NextImage
                    src={feature.imgSrc} // Directly use placeholder
                    alt={feature.imgAlt}
                    layout="fill"
                    objectFit="cover"
                    className="bg-muted"
                    data-ai-hint={feature.dataAiHint} // Keep hint for potential future use
                    unoptimized // Placeholders don't need optimization
                  />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="w-8 h-8 text-accent" />
                  <CardTitle className="text-2xl text-primary">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href={feature.href} passHref>
                  <Button variant="outline" className="w-full group">
                    Go to {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4">How AI-Attorney Can Help You</h2>
        <ul className="list-disc list-inside space-y-2 text-card-foreground">
          <li><span className="font-semibold">Simplify Complexity:</span> Understand dense legal documents with clear, concise summaries.</li>
          <li><span className="font-semibold">Gain Clarity:</span> Get initial guidance on legal situations and relevant laws.</li>
          <li><span className="font-semibold">Connect with Experts:</span> Easily find qualified lawyers near you for professional assistance.</li>
          <li><span className="font-semibold">Save Time:</span> Quickly process information and identify potential next steps.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Disclaimer: AI-Attorney provides informational support and is not a substitute for professional legal advice. Always consult with a qualified lawyer for critical legal matters.
        </p>
      </section>
    </div>
  );
}
