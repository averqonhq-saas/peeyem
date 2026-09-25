import type { Metadata } from "next";
import Header from "@/components/Header";
import ContactHero from "@/components/contact/ContactHero";
import ContactRFQSection from "@/components/contact/ContactRFQSection";
import DepotLocationSection from "@/components/contact/DepotLocationSection";
import ContactCTA from "@/components/contact/ContactCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Peeyem Traders | Coimbatore Heavy Conveyor Belting & Rubber Sheets",
  description:
    "Direct contact and RFQ portal for Peeyem Traders, South Ukkadam Coimbatore. Submit your belt specifications, tensile ratings, or rubber sheet dimensions for rapid 2-hour formal quotations.",
  keywords: [
    "Contact Peeyem Traders",
    "Conveyor Belt RFQ Coimbatore",
    "Peeyem Traders South Ukkadam Phone",
    "Rubber Sheet Supplier Address Coimbatore",
    "Industrial Conveyor Belt Price Quote Tamil Nadu",
  ],
};

export default function ContactPage() {
  return (
    <>
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
