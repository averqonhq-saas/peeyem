import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import {
  getWebsiteSchema,
  getOrganizationSchema,
  getLocalBusinessSchema,
} from "@/lib/seo";

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
  metadataBase: new URL("https://www.peeyemtraders.com"),
  title: {
    default: "Peeyem Traders | Industrial Conveyor Belts & Rubber Solutions Coimbatore",
    template: "%s | Peeyem Traders",
  },
  description:
    "Supplying heavy-duty industrial conveyor belts, specialized belts, conveyor accessories, and industrial rubber sheets in Coimbatore, Tamil Nadu. Direct stock, fast dispatch.",
  keywords: [
    "Industrial conveyor belts in Coimbatore",
    "Conveyor belt suppliers in Tamil Nadu",
    "Industrial rubber sheets",
    "Specialized industrial belts",
    "Conveyor belt accessories",
    "Industrial material handling products",
    "Chevron Cleated Belts",
    "Multi-ply Conveyor Belts NN EP",
    "Peeyem Traders South Ukkadam",
    "Heat Resistant Belts HR SHR",
    "Mechanical Belt Fasteners",
  ],
  authors: [{ name: "Peeyem Traders", url: "https://www.peeyemtraders.com" }],
  creator: "Peeyem Traders",
  publisher: "Peeyem Traders",
  alternates: {
    canonical: "https://www.peeyemtraders.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Peeyem Traders | Industrial Conveyor Belts & Rubber Solutions Coimbatore",
    description:
      "Supplying heavy-duty industrial conveyor belts, specialized belts, conveyor accessories, and industrial rubber sheets in Coimbatore, Tamil Nadu.",
    type: "website",
    locale: "en_IN",
    url: "https://www.peeyemtraders.com",
    siteName: "Peeyem Traders",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Peeyem Traders Industrial Conveyor Belts and Rubber Solutions Coimbatore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peeyem Traders | Industrial Conveyor Belts & Rubber Solutions Coimbatore",
    description:
      "Supplying heavy-duty industrial conveyor belts, specialized belts, conveyor accessories, and industrial rubber sheets in Coimbatore, Tamil Nadu.",
    images: ["/images/products/rubber-conveyor-belt-hero.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchemas = [
    getWebsiteSchema(),
    getOrganizationSchema(),
    getLocalBusinessSchema(),
  ];

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
        <JsonLd data={globalSchemas} />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
