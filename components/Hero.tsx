"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParallax3D } from "@/hooks/useParallax3D";
import ProductRFQModal from "@/components/products/ProductRFQModal";

export default function Hero() {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  const containerRef = useParallax3D<HTMLElement>({
    maxTilt: 6,
    maxTranslate: 16,
    scrollFactor: 0.08,
    smoothing: 0.08,
    glare: true,
    deviceOrientation: true,
  });

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-24 preserve-3d border-b border-slate-200/80"
      >
        {/* Far Background Parallax Grid Layer */}
        <div
          className="parallax-layer-back absolute inset-0 pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Soft yellow ambient glow matching Peeyem Traders branding */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl" />

          {/* Technical Blueprint Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="hero-industrial-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-industrial-grid)" />
          </svg>

          {/* Ambient Technical Coordinate Tag */}
          <div className="absolute top-6 right-8 hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            <span>COIMBATORE // PEEYEM TRADERS</span>
            <span>•</span>
            <span>INDUSTRIAL BELT &amp; RUBBER SOLUTIONS</span>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-medium tracking-wide text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" aria-hidden="true" />
                Industrial Belts for Every Application
              </div>

              <h1
                className="font-extrabold text-slate-900 tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl"
                style={{ lineHeight: "1.15" }}
              >
                Industrial Belts Built for Demanding Applications
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                We supply high-quality industrial belts and rubber products for a wide range of industrial and material-handling applications.
              </p>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-2">
                <a
                  href="#products"
                  onClick={scrollToProducts}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-sm hover:shadow active:scale-95 text-sm"
                >
                  <span>Explore Products</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </a>
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-95 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Send Enquiry</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="w-full pt-5 mt-2 border-t border-slate-200 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-slate-500 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">verified</span>
                  <span>Direct Stock Availability</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">precision_manufacturing</span>
                  <span>Custom Width &amp; Length Slitting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">local_shipping</span>
                  <span>South Ukkadam Hub</span>
                </div>
              </div>
            </div>

            {/* Right 3D Parallax Visual Column */}
            <div className="lg:col-span-6 relative flex justify-center items-center perspective-1000 preserve-3d">
              
              {/* Primary 3D Product Showcase Card */}
              <div className="parallax-card-3d relative w-full max-w-[540px] rounded-2xl p-2.5 bg-white shadow-xl border border-slate-200 transition-shadow duration-300 hover:shadow-2xl">
                
                {/* Dynamic Specular Glare */}
                <div className="parallax-glare absolute inset-0 rounded-2xl z-20 pointer-events-none" aria-hidden="true" />

                {/* Main Product Image Container */}
                <div className="relative overflow-hidden rounded-xl bg-slate-100 aspect-[4/3] preserve-3d">
                  <Image
                    src="/images/products/rubber-conveyor-belt.jpg"
                    alt="Heavy Duty Industrial Rubber Conveyor Belt Roll"
                    fill
                    priority
                    fetchPriority="high"
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 540px"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" aria-hidden="true" />

                  {/* Floating Depth Tag */}
                  <div className="parallax-layer-spec absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-lg bg-white/95 backdrop-blur-md shadow-md border border-slate-200 z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black tracking-wider text-amber-600">Core Inventory</span>
                      <span className="text-sm font-bold text-slate-900">Heavy-Duty Rubber Conveyor Belts</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono text-[11px] font-bold shrink-0 ml-2">
                      M24 &bull; SHR Grades
                    </span>
                  </div>
                </div>

                {/* Overlapping Secondary Badge */}
                <div className="parallax-layer-card-overlap absolute -bottom-5 -left-4 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-white shadow-xl max-w-[240px] border border-slate-200 z-20">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <Image
                      src="/images/products/pu-conveyor-belt.jpg"
                      alt="Food Grade PU Belts"
                      fill
                      className="object-cover"
                      sizes="48px"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-black text-amber-600">Hygienic Grade</span>
                    <span className="text-xs font-bold text-slate-900 truncate">Food Machinery PU</span>
                    <span className="text-[10px] text-slate-500 truncate">Appalam &amp; Chapati Lines</span>
                  </div>
                </div>

                {/* Floating Certification Badge */}
                <div className="parallax-layer-floating-pill absolute -top-4 -right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-lg border border-amber-300 z-20 select-none">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-none">Industrial Quality</span>
                    <span className="text-[9px] text-slate-500 font-mono leading-tight">Salem &amp; Cbe Depot</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hero Enquiry Modal */}
      <ProductRFQModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName="Industrial Conveyor Belt"
        applicationName="Heavy Material Handling"
      />
    </>
  );
}
