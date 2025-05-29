
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import { useToast } from './use-toast';

const AUTH_KEY = 'isLoggedIn_ai_attorney'; // Made key more specific

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check on mount (client-side only)
    const loggedInStatus = localStorage.getItem(AUTH_KEY) === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const login = useCallback((username?: string, password?: string) => {
    // Dummy credentials
    if (username === 'admin' && password === 'password') {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsLoggedIn(true);
      router.push('/'); // Redirect to dashboard
      toast({ title: "Login Successful", description: "Welcome back!" });
      return true;
    }
    setIsLoggedIn(false); // Ensure state is updated on failed login
    toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
    return false;
  }, [router, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    router.push('/login');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [router, toast]);

  return { isLoggedIn, login, logout };
}
