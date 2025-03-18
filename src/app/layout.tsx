import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClerkProvider from '@/providers/ClerkProvider';
import { PHProvider } from '@/providers/PostHogProvider';
import CrispProvider from '@/providers/CrispProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Analytics } from '@/components/Analytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TextCraft - Text Editing SaaS Platform',
  description: 'A powerful text editing SaaS platform for all your content needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <PHProvider>
        <CrispProvider>
          <html lang="en">
            <ThemeProvider>
              <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-300 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
                {children}
                <Analytics />
              </body>
            </ThemeProvider>
          </html>
        </CrispProvider>
      </PHProvider>
    </ClerkProvider>
  );
}
