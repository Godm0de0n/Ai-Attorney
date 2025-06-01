
"use client";

import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation'; 
import { useEffect, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/layout/app-shell';

const PUBLIC_PATHS = ['/login', '/register'];

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
      return; // Wait for mount and auth status resolution
    }

    const isPublicPage = PUBLIC_PATHS.includes(pathname);

    if (isLoggedIn) {
      // If logged in and on a public page (login/register), redirect to home
      if (isPublicPage) {
        router.replace('/');
      }
    } else {
      // If not logged in and not on a public page, redirect to login
      if (!isPublicPage) {
        router.replace('/login');
      }
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

  // If on a public page (login/register)
  if (PUBLIC_PATHS.includes(pathname)) {
    // If logged in, redirect is happening (or about to be triggered by useEffect), show loader.
    // Otherwise (not logged in), show the public page content (children).
    return isLoggedIn ? (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    ) : <>{children}</>;
  }

  // For protected routes:
  // If not logged in, redirect is in progress (or about to be triggered by useEffect), show loader.
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Logged in and on a protected page, render AppShell with content
  return (
    <SidebarProvider defaultOpen>
      <AppShell onLogout={logout}>
        {children}
      </AppShell>
    </SidebarProvider>
  );
}
