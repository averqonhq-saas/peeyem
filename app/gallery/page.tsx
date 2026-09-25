import type { Metadata } from "next";
import Header from "@/components/Header";
import GalleryClientWrapper from "@/components/gallery/GalleryClientWrapper";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Industrial Visual Gallery & Field Operations | Peeyem Traders Coimbatore",
  description:
    "Explore Peeyem Traders operational photography, chevron cleated profiles, heavy-duty multi-ply carcass stock, rubber sheeting warehouse inventory, and active quarry mineral processing installations in Tamil Nadu.",
  keywords: [
    "Industrial Conveyor Gallery Coimbatore",
    "Chevron Cleat Photographs",
    "Quarry Conveyor Operational Visuals",
    "Rubber Sheets Depot Staging",
    "Peeyem Traders Warehouse Gallery",
    "Conveyor Belt Installation Tamil Nadu",
  ],
  openGraph: {
    title: "Visual Gallery & Operational Installations | Peeyem Traders",
    description:
      "High-resolution operational photography, chevron cleat profiles, and industrial conveyor installations in Coimbatore.",
    type: "website",
    locale: "en_IN",
  },
};

export default function GalleryPage() {
  return (
    <>
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
