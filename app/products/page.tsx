import type { Metadata } from "next";
import Header from "@/components/Header";
import ProductsClientWrapper from "@/components/products/ProductsClientWrapper";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Industrial Products Catalog | Peeyem Traders Coimbatore",
  description:
    "Explore Peeyem Traders complete catalog of heavy-duty conveyor belts, chevron cleated profiles, industrial rubber sheeting, idler rollers, and fasteners. Stocked for swift regional dispatch from South Ukkadam, Coimbatore.",
  keywords: [
    "Industrial Conveyor Belts Catalog Coimbatore",
    "Chevron Cleated Belts Specifications",
    "Rubber Sheets Price Tamil Nadu",
    "Mechanical Belt Fasteners",
    "Heat Resistant Conveyor Belts HR SHR",
    "Peeyem Traders Catalog",
  ],
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          <ProductsClientWrapper />
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
