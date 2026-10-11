import type { Metadata } from "next";
import Header from "@/components/Header";
import ProductsClientWrapper from "@/components/products/ProductsClientWrapper";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getProductsItemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial Conveyor Belts, Rubber Sheets & Accessories Catalog",
  description:
    "Explore Peeyem Traders complete catalog of industrial conveyor belts, food-grade PU belts, anti-static PVC belts, V-belts, vulcanized rubber sheets, and conveyor belt fasteners in Coimbatore, Tamil Nadu.",
  keywords: [
    "Industrial conveyor belts in Coimbatore",
    "Conveyor belt suppliers in Tamil Nadu",
    "Industrial rubber sheets",
    "Specialized industrial belts",
    "Conveyor belt accessories",
    "Industrial material handling products",
    "Mechanical belt fasteners",
    "Chevron cleated belts Coimbatore",
    "Food grade PU conveyor belt",
    "PVC conveyor belt Tamil Nadu",
  ],
  alternates: {
    canonical: "https://www.peeyemtraders.com/products",
  },
  openGraph: {
    title: "Industrial Conveyor Belts, Rubber Sheets & Accessories Catalog | Peeyem Traders",
    description:
      "Explore Peeyem Traders complete catalog of industrial conveyor belts, specialized belts, rubber sheets, and mechanical fasteners in Coimbatore, Tamil Nadu.",
    url: "https://www.peeyemtraders.com/products",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Conveyor Belts and Rubber Sheets Catalog - Peeyem Traders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Conveyor Belts, Rubber Sheets & Accessories Catalog | Peeyem Traders",
    description:
      "Complete catalog of industrial conveyor belts, specialized belts, rubber sheets, and conveyor accessories in Coimbatore.",
    images: ["/images/products/rubber-conveyor-belt.jpg"],
  },
};

export default function ProductsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ]);
  const productListSchema = getProductsItemListSchema();

  return (
    <>
      <JsonLd data={[breadcrumbSchema, productListSchema]} />
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
