import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { platformConfig } from "@/lib/platform";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RustyCogs.io | Interactive Brain Games Platform",
  description:
    "Create beautiful, embeddable brain games for publishers, educators, and content creators. Crosswords, word games, and more with seamless CMS integration.",
  keywords: [
    "crossword",
    "puzzle",
    "brain games",
    "word game",
    "embeddable",
    "CMS",
    "API",
  ],
  openGraph: {
    title: "RustyCogs.io | Interactive Brain Games Platform",
    description: "Create beautiful, embeddable brain games with auto-layout.",
    type: "website",
    url: "https://rustycogs.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
        style={
          {
            "--platform-accent": platformConfig.accent,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
