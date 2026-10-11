import type { Metadata } from "next";
import Header from "@/components/Header";
import AboutHero from "@/components/about/AboutHero";
import ProductFocus from "@/components/about/ProductFocus";
import WhyPeeyem from "@/components/about/WhyPeeyem";
import OurApproach from "@/components/about/OurApproach";
import ProductShowcase from "@/components/about/ProductShowcase";
import AboutCTA from "@/components/about/AboutCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us - Conveyor Belt Suppliers in Tamil Nadu",
  description:
    "Learn about Peeyem Traders, leading conveyor belt suppliers in Tamil Nadu based at South Ukkadam, Coimbatore. Supplying certified industrial conveyor belts, rubber sheets, specialized belts, and accessories.",
  keywords: [
    "Conveyor belt suppliers in Tamil Nadu",
    "Industrial conveyor belts in Coimbatore",
    "About Peeyem Traders",
    "Industrial rubber sheets Tamil Nadu",
    "Specialized industrial belts",
    "Conveyor belt accessories",
    "Industrial material handling products",
    "South Ukkadam conveyor belt supplier",
  ],
  alternates: {
    canonical: "https://www.peeyemtraders.com/about",
  },
  openGraph: {
    title: "About Us - Conveyor Belt Suppliers in Tamil Nadu | Peeyem Traders",
    description:
      "Leading conveyor belt suppliers in Tamil Nadu based in South Ukkadam, Coimbatore. Certified industrial conveyor belts, rubber sheets, and accessories.",
    url: "https://www.peeyemtraders.com/about",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt-hero.jpg",
        width: 1200,
        height: 630,
        alt: "About Peeyem Traders - Industrial Conveyor Belts Coimbatore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Conveyor Belt Suppliers in Tamil Nadu | Peeyem Traders",
    description:
      "Leading conveyor belt suppliers in Tamil Nadu based in South Ukkadam, Coimbatore.",
    images: ["/images/products/rubber-conveyor-belt-hero.jpg"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* 1. About Hero Section with 3D Tilt Card */}
          <AboutHero />

          {/* 2. Product Focus Section */}
          <ProductFocus />

          {/* 3. Why Peeyem Traders Section */}
          <WhyPeeyem />

          {/* 4. Standardized Process & Approach Timeline */}
          <OurApproach />

          {/* 5. Product Inventory Showcase */}
          <ProductShowcase />

          {/* 6. Call To Action Section */}
          <AboutCTA />

          {/* 7. Floating WhatsApp Quick Action */}
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
