import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawDirectory - OpenClaw Platforms & Tools Directory",
  description: "Discover the best OpenClaw deployment platforms, hosting services, marketplaces, and tools. Free directory for AI agent infrastructure.",
  keywords: ["OpenClaw", "AI agents", "deployment", "hosting", "directory", "platforms"],
  authors: [{ name: "ClawDirectory" }],
  openGraph: {
    title: "ClawDirectory - OpenClaw Platforms & Tools Directory",
    description: "Discover the best OpenClaw deployment platforms, hosting services, marketplaces, and tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawDirectory - OpenClaw Platforms & Tools Directory",
    description: "Discover the best OpenClaw deployment platforms, hosting services, marketplaces, and tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-black text-white`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
