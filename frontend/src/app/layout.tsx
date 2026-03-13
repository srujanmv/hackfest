import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Urban Incident Reporter",
  description:
    "Autonomous voice-agent civic infrastructure reporting system for smart cities."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} min-h-screen bg-bg text-text antialiased font-sans`}>
        <div className="pointer-events-none fixed inset-0 gridlines" />
        <div className="fixed inset-0 pointer-events-none bg-hero-sheen" />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

