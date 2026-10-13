import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AboutSection from "@/components/AboutSection";
import ProductCarousel from "@/components/ProductCarousel";
import FeaturedProduct from "@/components/FeaturedProduct";
import Applications from "@/components/Applications";
import WhyChooseUs from "@/components/WhyChooseUs";
import Gallery from "@/components/Gallery";
import VideoShowcase from "@/components/VideoShowcase";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial Conveyor Belts in Coimbatore | Peeyem Traders",
  description:
    "Leading conveyor belt suppliers in Tamil Nadu. Peeyem Traders supplies heavy-duty multi-ply belts (NN/EP), chevron cleated belts, conveyor accessories, and industrial rubber sheets in South Ukkadam, Coimbatore.",
  keywords: [
    "Industrial conveyor belts in Coimbatore",
    "Conveyor belt suppliers in Tamil Nadu",
    "Industrial rubber sheets",
    "Specialized industrial belts",
    "Conveyor belt accessories",
    "Industrial material handling products",
    "Heavy duty conveyor belts Coimbatore",
    "Chevron cleated belts Tamil Nadu",
  ],
  alternates: {
    canonical: "https://www.peeyemtraders.com",
  },
  openGraph: {
    title: "Industrial Conveyor Belts in Coimbatore | Peeyem Traders",
    description:
      "Leading conveyor belt suppliers in Tamil Nadu. Heavy-duty multi-ply belts (NN/EP), chevron cleated belts, conveyor accessories, and industrial rubber sheets.",
    url: "https://www.peeyemtraders.com",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Conveyor Belts in Coimbatore - Peeyem Traders",
      },
    ],
  },
};

export default function Home() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* 1. Hero Section with 3D Depth Card */}
          <Hero />

          {/* 2. Trust & Product Category Strip */}
          <TrustStrip />

          {/* 3. About Section */}
          <AboutSection />

          {/* 4. Interactive Product Carousel */}
          <ProductCarousel />

          {/* 5. Featured Product Spotlight */}
          <FeaturedProduct />

          {/* 6. Industrial Application Scenarios */}
          <Applications />

          {/* 7. Why Choose Peeyem Traders */}
          <WhyChooseUs />

          {/* 8. Warehouse & Field Visual Gallery */}
          <Gallery />

          {/* 9. Promotional Videos Showcase (Managed from Admin Promotion Videos) */}
          <VideoShowcase />

          {/* 10. High-Impact Call To Action */}
          <CTASection />

          {/* 10. Contact Details & Interactive Quotation Form */}
          <ContactSection />

          {/* 13. Sticky Floating WhatsApp Action Button */}
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
