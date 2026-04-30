import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, IBM_Plex_Sans } from "next/font/google";
import { platformConfig } from "@/lib/platform";
import Providers from "@/components/Providers";
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

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateMetadata(): Metadata {
  return {
    title: `${platformConfig.name} | Interactive Brain Games Platform`,
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
      title: `${platformConfig.name} | Interactive Brain Games Platform`,
      description: "Create beautiful, embeddable brain games with auto-layout.",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${ibmPlex.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
