import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import PWARegister from '@/components/system/PWARegister';
import LanguageGate from "@/components/guards/LanguageGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Template',
  description: 'Template',
  themeColor: '#ff681a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#ff681a" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <LanguageGate>
              <PWARegister />
              {children}
            </LanguageGate>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
