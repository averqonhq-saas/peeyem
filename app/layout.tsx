import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  themeColor: "#004682",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://peeyemtraders.com"),
  title: "Peeyem Traders | Industrial Conveyor Belts & Rubber Solutions Coimbatore",
  description:
    "Heavy-duty multi-ply belting (NN/EP), chevron cleated solutions, and abrasion-resistant industrial rubber sheets engineered for high-tonnage mining, aggregate, and manufacturing operations. Based in Coimbatore, Tamil Nadu.",
  keywords: [
    "Conveyor Belts Coimbatore",
    "Chevron Cleated Belts",
    "Industrial Rubber Sheets",
    "Multi-ply Conveyor Belts NN EP",
    "Peeyem Traders South Ukkadam",
    "Heat Resistant Belts HR SHR",
    "Mechanical Belt Fasteners",
  ],
  authors: [{ name: "Peeyem Traders" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Peeyem Traders | Industrial Conveyor & Rubber Solutions",
    description:
      "Continuous Power. Precision Handling. Heavy-duty multi-ply belting, chevron cleated solutions, and abrasion-resistant industrial rubber sheets.",
    type: "website",
    locale: "en_IN",
    siteName: "Peeyem Traders",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Preconnect for remote image hosts */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        {/* Material Symbols – async to avoid render blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
