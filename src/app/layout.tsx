import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "agent.json — Agent Web Protocol",
  description:
    "The definitive reference for agent.json, the machine-readable manifest that makes any website agent-ready. Part of Agent Web Protocol (AWP).",
  keywords: [
    "agent.json",
    "Agent Web Protocol",
    "AWP",
    "AI agents",
    "agentic web",
    "machine-readable",
    "web standard",
  ],
  openGraph: {
    title: "agent.json — Agent Web Protocol",
    description:
      "The machine-readable manifest that makes any website agent-ready.",
    url: "https://agent-json.org",
    siteName: "agent-json.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "agent.json — Agent Web Protocol",
    description:
      "The machine-readable manifest that makes any website agent-ready.",
  },
  metadataBase: new URL("https://agent-json.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
