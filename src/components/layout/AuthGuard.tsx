
"use client";

import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation'; // Corrected import
import { useEffect, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/layout/app-shell';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoggedIn === undefined) {
      // Still waiting for mount or auth status to be determined
      return;
    }

    const isLoginPage = pathname === '/login';

    if (!isLoggedIn && !isLoginPage) {
      router.replace('/login');
    } else if (isLoggedIn && isLoginPage) {
      // If logged in and trying to access login page, redirect to home
      router.replace('/');
    }
  }, [isLoggedIn, pathname, router, isMounted]);

  // Show loader while waiting for mount or initial auth status
  if (!isMounted || isLoggedIn === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If on the login page
  if (pathname === '/login') {
    // If logged in, redirect is happening, show loader. Otherwise, show login page content.
    return isLoggedIn ? (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    ) : <>{children}</>;
  }

  // For protected routes
  if (!isLoggedIn) {
    // Not logged in, redirect is in progress (or about to be triggered by useEffect), show loader.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Logged in and not on login page, render AppShell with content
  return (
    <SidebarProvider defaultOpen>
      <AppShell onLogout={logout}>
        {children}
      </AppShell>
    </SidebarProvider>
  );
}
