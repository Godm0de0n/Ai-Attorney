
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogIn, Scale, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn === true) {
      router.replace('/');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === true) {
    return ( // Show loader while redirecting
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isLoggedIn === undefined) { // Still checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const success = login(username, password); // login handles toast and redirect internally
    
    if (!success) {
      setIsLoading(false);
    }
    // On success, useAuth hook handles redirect
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Scale className="w-16 h-16 text-primary mx-auto" />
          <CardTitle className="text-3xl font-bold text-primary">AI-Attorney Login</CardTitle>
          <CardDescription>Access your AI-powered legal assistant.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </>
              )}
            </Button>
            <Button variant="link" className="text-muted-foreground hover:text-primary" asChild>
              {/* For now, this link won't go anywhere functional, but it sets up the UI element */}
              {/* In a real app, this would link to a /register page or similar */}
              <Link href="#"> 
                <UserPlus className="mr-2 h-4 w-4" /> Create an account
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">Use <code className="font-semibold text-primary/80">admin</code> / <code className="font-semibold text-primary/80">password</code> for demo.</p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
