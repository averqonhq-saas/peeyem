import type { Metadata } from "next";
import Header from "@/components/Header";
import ContactHero from "@/components/contact/ContactHero";
import ContactRFQSection from "@/components/contact/ContactRFQSection";
import DepotLocationSection from "@/components/contact/DepotLocationSection";
import ContactCTA from "@/components/contact/ContactCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us - South Ukkadam, Coimbatore",
  description:
    "Direct contact and RFQ portal for Peeyem Traders, South Ukkadam, Coimbatore. Submit your conveyor belt specifications, tensile ratings, or rubber sheet dimensions for rapid formal quotations.",
  keywords: [
    "Contact Peeyem Traders",
    "Conveyor belt supplier Coimbatore phone",
    "Peeyem Traders South Ukkadam address",
    "Conveyor belt quotation Tamil Nadu",
    "Industrial rubber sheet enquiry Coimbatore",
    "Conveyor belt suppliers in Tamil Nadu",
    "Industrial material handling products",
  ],
  alternates: {
    canonical: "https://www.peeyemtraders.com/contact",
  },
  openGraph: {
    title: "Contact Peeyem Traders | South Ukkadam, Coimbatore",
    description:
      "Direct contact and RFQ portal for Peeyem Traders, South Ukkadam, Coimbatore. Fast formal quotations for industrial conveyor belts and rubber sheets.",
    url: "https://www.peeyemtraders.com/contact",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/rubber-conveyor-belt-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Peeyem Traders South Ukkadam Coimbatore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Peeyem Traders | South Ukkadam, Coimbatore",
    description:
      "Direct contact and RFQ portal for Peeyem Traders, South Ukkadam, Coimbatore.",
    images: ["/images/products/rubber-conveyor-belt-hero.jpg"],
  },
};

export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* 1. Contact Hero with Logistics Indicator & Warehouse Showcase */}
          <ContactHero />

          {/* 2. Direct Channels & Interactive RFQ Form */}
          <ContactRFQSection />

          {/* 3. Coimbatore Physical Depot & Google Maps Section */}
          <DepotLocationSection />

          {/* 4. Specialist Engineering Consultation CTA */}
          <ContactCTA />

          {/* 5. Quick Floating WhatsApp Action */}
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
