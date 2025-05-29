
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// SidebarProvider and AppShell are now conditionally rendered by AuthGuard
import { AuthGuard } from '@/components/layout/AuthGuard'; // New import
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI-Attorney: AI for Legal Help',
  description: 'Your AI powered legal assistant for document insights, legal guidance, and lawyer discovery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthGuard>
          {children} 
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
