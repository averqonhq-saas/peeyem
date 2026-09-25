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
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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

          {/* 9. Video Showcase */}
          <VideoShowcase />

          {/* 10. Video Client Feedback & Testimonials */}
          <Testimonials />

          {/* 11. High-Impact Call To Action */}
          <CTASection />

          {/* 12. Contact Details & Interactive Quotation Form */}
          <ContactSection />

          {/* 13. Sticky Floating WhatsApp Action Button */}
          <FloatingWhatsApp />
        </div>
      </main>
      <Footer />
    </>
  );
}
