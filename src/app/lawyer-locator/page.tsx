
"use client";

import { useState, type FormEvent, useEffect } from 'react';
// Removed Image from 'next/image' as AIImage will be used
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Search, UserCheck, Phone, Mail, Star, Building, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIImage } from '@/components/ui/AIImage'; // New Import

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  location: string;
  phone: string;
  email: string;
  imageUrl?: string; // Made optional, AIImage will handle placeholder
  rating: number;
  firm?: string;
  experience?: number;
  dataAiHint: string; // Ensure this is always present for AIImage
}

// Placeholder data - in a real app, this would come from a database/API
const allLawyers: Lawyer[] = [
  { id: '1', name: 'Adv. Priya Sharma', specialization: 'Criminal Law', location: 'Delhi, India', phone: '+91 98765 43210', email: 'priya.sharma@example.com', rating: 4.8, firm: "Sharma & Associates", experience: 12, dataAiHint: "professional indian woman lawyer portrait" },
  { id: '2', name: 'Adv. Rohan Mehta', specialization: 'Corporate Law', location: 'Mumbai, India', phone: '+91 91234 56789', email: 'rohan.mehta@example.com', rating: 4.5, firm: "Mehta Legal Solutions", experience: 8, dataAiHint: "professional indian man lawyer portrait" },
  { id: '3', name: 'Adv. Anjali Singh', specialization: 'Family Law', location: 'Bangalore, India', phone: '+91 87654 32109', email: 'anjali.singh@example.com', rating: 4.7, firm: "Singh & Partners", experience: 10, dataAiHint: "elegant indian female attorney" },
  { id: '4', name: 'Adv. Vikram Rao', specialization: 'Property Law', location: 'Chennai, India', phone: '+91 70123 45678', email: 'vikram.rao@example.com', rating: 4.6, firm: "Rao Property Chambers", experience: 15, dataAiHint: "experienced male lawyer india" },
  { id: '5', name: 'Adv. Sunita Reddy', specialization: 'Cyber Law', location: 'Hyderabad, India', phone: '+91 63098 76543', email: 'sunita.reddy@example.com', rating: 4.9, firm: "Reddy Tech Legal", experience: 7, dataAiHint: "modern indian woman tech lawyer" },
  { id: '6', name: 'Adv. Alok Verma', specialization: 'Civil Law', location: 'Kolkata, India', phone: '+91 88877 55544', email: 'alok.verma@example.com', rating: 4.3, firm: "Verma Civil Litigators", experience: 9, dataAiHint: "indian man lawyer in suit" },
  // New Lawyers
  { id: '7', name: 'Adv. Sneha Das', specialization: 'Intellectual Property', location: 'Kolkata, India', phone: '+91 99887 76655', email: 'sneha.das@example.com', rating: 4.6, firm: "Das IP Experts", experience: 8, dataAiHint: "creative indian woman lawyer" },
  { id: '8', name: 'Adv. Arjun Kapoor', specialization: 'Tax Law', location: 'Mumbai, India', phone: '+91 77665 54433', email: 'arjun.kapoor@example.com', rating: 4.4, firm: "Kapoor Tax Advisors", experience: 11, dataAiHint: "sharp indian man tax lawyer" },
  { id: '9', name: 'Adv. Meera Iyer', specialization: 'Labor Law', location: 'Delhi, India', phone: '+91 66554 43322', email: 'meera.iyer@example.com', rating: 4.7, firm: "Iyer Employment Law", experience: 9, dataAiHint: "confident south indian woman lawyer" },
  { id: '10', name: 'Adv. Rahul Nair', specialization: 'Criminal Law', location: 'Hyderabad, India', phone: '+91 55443 32211', email: 'rahul.nair@example.com', rating: 4.5, firm: "Nair Defense Firm", experience: 10, dataAiHint: "serious indian man criminal lawyer" },
  { id: '11', name: 'Adv. Diya Reddy', specialization: 'Corporate Law', location: 'Bangalore, India', phone: '+91 44332 21100', email: 'diya.reddy@example.com', rating: 4.8, firm: "Reddy Corp Legal", experience: 13, dataAiHint: "professional young indian woman corporate lawyer" },
  { id: '12', name: 'Adv. Karan Joshi', specialization: 'Property Law', location: 'Pune, India', phone: '+91 33221 10099', email: 'karan.joshi@example.com', rating: 4.6, firm: "Joshi Real Estate Law", experience: 14, dataAiHint: "smart indian man property lawyer" },
  { id: '13', name: 'Adv. Fatima Khan', specialization: 'Family Law', location: 'Pune, India', phone: '+91 22110 09988', email: 'fatima.khan@example.com', rating: 4.9, firm: "Khan Family Advocates", experience: 7, dataAiHint: "empathetic indian woman family lawyer" },
];

const legalSpecializations = [
  "Civil Law", "Criminal Law", "Family Law", "Corporate Law", "Property Law", "Cyber Law", "Intellectual Property", "Tax Law", "Labor Law"
];

export default function LawyerLocatorPage() {
  const [location, setLocation] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [foundLawyers, setFoundLawyers] = useState<Lawyer[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location.trim() && !specialization) {
      toast({ variant: "destructive", title: "Search Error", description: "Please enter location or select a specialization." });
      return;
    }

    setIsLoading(true);
    setFoundLawyers(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced delay

    let results = allLawyers;
    if (location.trim()) {
      results = results.filter(lawyer => lawyer.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (specialization) {
      results = results.filter(lawyer => lawyer.specialization === specialization);
    }
    
    setFoundLawyers(results);
    setIsLoading(false);
    if (results.length > 0) {
      toast({ title: "Search Complete", description: `${results.length} lawyer(s) found.` });
    } else {
      toast({ title: "Search Complete", description: "No lawyers found matching your criteria." });
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Lawyer Locator</h1>
        <p className="text-muted-foreground">
          Find qualified legal professionals in your area based on their specialization.
        </p>
      </header>

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Find a Lawyer
            </CardTitle>
            <CardDescription>
              Enter your location and select the area of law you need assistance with.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location (City/Pincode)</Label>
              <Input 
                id="location" 
                placeholder="e.g., Mumbai or 400001" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Area of Law</Label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {legalSpecializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search Lawyers"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {foundLawyers !== null && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Search Results</h2>
          {foundLawyers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {foundLawyers.map(lawyer => (
                <Card key={lawyer.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader className="flex flex-row items-start gap-4 pb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary shrink-0">
                       <AIImage 
                         prompt={lawyer.dataAiHint} 
                         alt={lawyer.name} 
                         width={96} 
                         height={96}
                         layout="fill"
                         objectFit="cover"
                         fallbackSrc={lawyer.imageUrl || `https://placehold.co/120x120.png`}
                       />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{lawyer.name}</CardTitle>
                      <CardDescription className="text-accent font-medium">{lawyer.specialization}</CardDescription>
                       <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(lawyer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">({lawyer.rating.toFixed(1)})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm flex-grow">
                    {lawyer.firm && (
                       <p className="flex items-center gap-2 text-foreground/90">
                        <Building className="w-4 h-4 text-muted-foreground" /> {lawyer.firm}
                      </p>
                    )}
                     {lawyer.experience && (
                       <p className="flex items-center gap-2 text-foreground/90">
                        <Briefcase className="w-4 h-4 text-muted-foreground" /> {lawyer.experience} years experience
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-foreground/90">
                      <MapPin className="w-4 h-4 text-muted-foreground" /> {lawyer.location}
                    </p>
                    <p className="flex items-center gap-2 text-foreground/90">
                      <Phone className="w-4 h-4 text-muted-foreground" /> {lawyer.phone}
                    </p>
                    <p className="flex items-center gap-2 text-foreground/90">
                      <Mail className="w-4 h-4 text-muted-foreground" /> {lawyer.email}
                    </p>
                  </CardContent>
                   <CardFooter>
                    <Button variant="outline" className="w-full">Contact Lawyer</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <UserCheck className="h-4 w-4" />
              <AlertTitle>No Lawyers Found</AlertTitle>
              <AlertDescription>
                We couldn't find any lawyers matching your search criteria. Try broadening your search.
              </AlertDescription>
            </Alert>
          )}
        </section>
      )}
    </div>
  );
}

