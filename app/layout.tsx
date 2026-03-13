import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles
import ClientLayout from './client-layout';
import Header from '@/components/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Intervox – AI Interview Practice',
  description: 'Latih kemampuan interview kamu dengan AI. Intervox memberikan pengalaman interview realistis dengan feedback mendalam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ClientLayout>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
