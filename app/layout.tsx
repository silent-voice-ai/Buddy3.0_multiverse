import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegister } from '@/components/sw-register';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://buddy3.app'),
  title: 'BUDDY 3.0 — Money Multiverse',
  description: 'Your personal money companion across three worlds: Little Saver, Teen Moneyverse, and Young Investor Pro.',
  manifest: '/manifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'BUDDY 3.0',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'BUDDY 3.0 — Money Multiverse',
    description: 'Your personal money companion for every age.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
