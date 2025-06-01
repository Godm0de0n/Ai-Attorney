
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { useToast } from './use-toast';

const AUTH_KEY = 'isLoggedIn_ai_attorney'; 
// For demo, we can store registered users in localStorage.
// In a real app, this would be a backend call.
const DEMO_USERS_KEY = 'ai_attorney_demo_users';

interface DemoUser {
  username: string;
  // In a real app, password would be hashed and stored securely on a server.
  // For this demo, we won't store the password itself after registration,
  // just knowing the user "exists" is enough.
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem(AUTH_KEY) === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const login = useCallback((username?: string, password?: string) => {
    // Demo admin user
    if (username === 'admin' && password === 'password') {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsLoggedIn(true);
      router.replace('/');
      toast({ title: "Login Successful", description: "Welcome back, Admin!" });
      return true;
    }

    // Check demo registered users
    const storedUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]') as DemoUser[];
    const foundUser = storedUsers.find(user => user.username === username);

    // For demo, any password works if the username exists (except for admin)
    if (foundUser) {
       localStorage.setItem(AUTH_KEY, 'true');
       setIsLoggedIn(true);
       router.replace('/');
       toast({ title: "Login Successful", description: `Welcome back, ${username}!` });
       return true;
    }
    
    setIsLoggedIn(false); 
    toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
    return false;
  }, [router, toast]);

  const register = useCallback(async (username?: string, password?: string) => {
    if (!username || !password) {
      toast({ variant: "destructive", title: "Registration Failed", description: "Username and password are required." });
      return false;
    }
    if (username.toLowerCase() === 'admin') {
      toast({ variant: "destructive", title: "Registration Failed", description: "Username 'admin' is reserved." });
      return false;
    }

    let storedUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]') as DemoUser[];
    if (storedUsers.find(user => user.username.toLowerCase() === username.toLowerCase())) {
      toast({ variant: "destructive", title: "Registration Failed", description: "Username already exists." });
      return false;
    }

    // Add new user (username only for simplicity in this demo)
    storedUsers.push({ username });
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(storedUsers));
    
    toast({ title: "Registration Successful", description: `Welcome, ${username}! You are now logged in.` });
    
    // Automatically log in the user after registration
    // For this demo, we set the auth key and state, then redirect.
    localStorage.setItem(AUTH_KEY, 'true');
    setIsLoggedIn(true);
    router.replace('/');
    return true;

  }, [router, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    // Ensure redirect happens even if already on login page to clear any state
    if (pathname !== '/login') {
      router.replace('/login');
    }
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [router, toast, pathname]);

  return { isLoggedIn, login, logout, register };
}
