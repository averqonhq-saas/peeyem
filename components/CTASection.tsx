"use client";

import Link from "next/link";
import { COMPANY_INFO } from "@/data/products";
import { useParallax3D } from "@/hooks/useParallax3D";

export default function CTASection() {
  const containerRef = useParallax3D<HTMLElement>({
    maxTilt: 0,
    maxTranslate: 0,
    scrollFactor: 0.12,
    smoothing: 0.08,
    glare: false,
  });

  return (
    <section
      ref={containerRef}
      className="w-full bg-primary text-on-primary py-10 sm:py-16 lg:py-20 relative overflow-hidden preserve-3d"
    >
      {/* Subtle Scroll Parallax Background Layer */}
      <div
        className="parallax-layer-back absolute inset-0 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-on-primary-container/10 blur-3xl" />
        
        {/* Subtle Industrial Guideline Grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin relative z-10 flex flex-col items-center text-center gap-5">
        <span className="px-3.5 py-1.5 rounded-full bg-on-primary/10 text-on-primary-container font-label-sm uppercase tracking-widest font-bold text-xs">
          Quick Sizing &amp; Roll Quotations
        </span>
        <h2
          className="font-display text-on-primary max-w-2xl"
          style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)", lineHeight: "1.15" }}
        >
          Looking for the Right Conveyor Solution?
        </h2>
        <p className="text-on-primary-container max-w-xl text-sm sm:text-base leading-relaxed">
          Share your required belt width, carcass tension (NN/EP), cover thickness, or sheet dimensions. Our engineering sales desk prepares swift formal quotations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
          <Link
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md font-bold shadow-lg hover:bg-tertiary-fixed transition-all hover:scale-105 min-h-[48px] flex items-center justify-center"
            href="#contact"
          >
            Request a Quote Now
          </Link>
          <a
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-surface-container-lowest text-primary font-label-md font-bold shadow-lg hover:bg-surface-container transition-all flex items-center justify-center gap-2 min-h-[48px]"
            href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
              "Hi Peeyem Traders, I need a quote for industrial belts."
            )}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary" aria-hidden="true">chat</span>
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
