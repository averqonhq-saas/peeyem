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

export const metadata: Metadata = {
  title: "About Us | Peeyem Traders - Industrial Conveyor Belts & Rubber Sheets Coimbatore",
  description:
    "Learn about Peeyem Traders, South Ukkadam Coimbatore. We supply certified industrial conveyor belts, rubber products, specialized belts, and conveyor accessories engineered for rugged industrial material-handling.",
  keywords: [
    "About Peeyem Traders",
    "Conveyor Belt Supplier Coimbatore",
    "Industrial Rubber Sheets Tamil Nadu",
    "Chevron Cleated Belts Coimbatore",
    "Material Handling Solutions South Ukkadam",
  ],
};

export default function AboutPage() {
  return (
    <>
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
