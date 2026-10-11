import type { Metadata } from "next";
import Header from "@/components/Header";
import GalleryClientWrapper from "@/components/gallery/GalleryClientWrapper";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial Visual Gallery & Operations Coimbatore",
  description:
    "Explore Peeyem Traders operational photography, heavy-duty multi-ply carcass stock, chevron cleated profiles, industrial rubber sheets warehouse inventory, and quarry installations in Tamil Nadu.",
  keywords: [
    "Industrial conveyor belt gallery",
    "Chevron cleat belt photos Coimbatore",
    "Quarry conveyor belt installations Tamil Nadu",
    "Industrial rubber sheets warehouse visuals",
    "Peeyem Traders operations gallery",
    "Specialized industrial belts",
    "Conveyor belt accessories",
  ],
  alternates: {
    canonical: "https://www.peeyemtraders.com/gallery",
  },
  openGraph: {
    title: "Industrial Visual Gallery & Operations | Peeyem Traders Coimbatore",
    description:
      "High-resolution operational photography, chevron cleat profiles, and industrial conveyor installations in Coimbatore.",
    url: "https://www.peeyemtraders.com/gallery",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt.jpg",
        width: 1200,
        height: 630,
        alt: "Peeyem Traders Industrial Gallery and Operations Coimbatore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Visual Gallery & Operations | Peeyem Traders Coimbatore",
    description:
      "High-resolution operational photography and industrial conveyor installations in Coimbatore.",
    images: ["/images/products/rubber-conveyor-belt.jpg"],
  },
};

export default function GalleryPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gallery", url: "/gallery" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          <GalleryClientWrapper />
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
