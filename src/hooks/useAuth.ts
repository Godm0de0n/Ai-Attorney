
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import { useToast } from './use-toast';

const AUTH_KEY = 'isLoggedIn_ai_attorney'; 

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem(AUTH_KEY) === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const login = useCallback((username?: string, password?: string) => {
    if (username === 'admin' && password === 'password') {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsLoggedIn(true);
      router.replace('/'); // Use replace to avoid login page in history
      toast({ title: "Login Successful", description: "Welcome back!" });
      return true;
    }
    setIsLoggedIn(false); 
    toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
    return false;
  }, [router, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    router.replace('/login'); // Use replace for consistency
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [router, toast]);

  return { isLoggedIn, login, logout };
}
