"use client";

import Image from "next/image";
import Link from "next/link";
import { useParallax3D } from "@/hooks/useParallax3D";

export default function Hero() {
  const containerRef = useParallax3D<HTMLElement>({
    maxTilt: 7,
    maxTranslate: 18,
    scrollFactor: 0.1,
    smoothing: 0.08,
    glare: true,
    deviceOrientation: true,
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-surface-container-lowest py-10 sm:py-14 lg:py-20 preserve-3d"
    >
      {/* ========================================================
          DEPTH LAYER 0 (FAR BACKGROUND): Technical Grid & Ambient Glow
          Moves gently in reverse direction for deep cinematic parallax
          ======================================================== */}
      <div
        className="parallax-layer-back absolute inset-0 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Soft Industrial Gradient Highlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-secondary/6 blur-3xl" />

        {/* Subtle Conveyor Geometry & Blueprint Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Ambient Technical Blueprint Coordinate Tag */}
        <div className="absolute top-6 right-8 hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-widest text-outline-variant/60 uppercase">
          <span>COIMBATORE // IND-SPEC 1891:1994</span>
          <span>•</span>
          <span>MULTI-PLY EP/NN</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-space-xl items-center">
          
          {/* ========================================================
              LEFT CONTENT COLUMN: Stable, readable, and rock-solid
              Maintains high legibility without disorienting tilt
              ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-primary font-label-sm uppercase tracking-wider text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" aria-hidden="true"></span>
              Industrial Conveyor &amp; Rubber Solutions
            </div>

            <h1
              className="font-display text-on-surface tracking-tight leading-tight"
              style={{ fontSize: "clamp(1.875rem, 5vw, 3.5rem)", lineHeight: "1.15" }}
            >
              Continuous Power.<br />
              <span className="text-primary">Precision Handling.</span>
            </h1>

            <p
              className="font-body-lg text-on-surface-variant max-w-xl"
              style={{ fontSize: "clamp(0.9375rem, 2.5vw, 1.125rem)", lineHeight: "1.7" }}
            >
              Heavy-duty multi-ply belting, chevron cleated solutions, and abrasion-resistant industrial rubber sheets engineered for high-tonnage mining, aggregate, and manufacturing operations.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-on-primary font-label-md hover:bg-primary-container transition-all shadow-md hover:shadow-lg active:scale-95 min-h-[48px] text-sm font-bold"
                href="#products"
              >
                <span>Explore Products</span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md hover:bg-tertiary-fixed transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[48px] text-sm font-bold"
                href="#contact"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">request_quote</span>
                <span>Request a Quote</span>
              </Link>
            </div>

            {/* Trust Micro-Stats */}
            <div className="w-full pt-4 mt-2 border-t border-outline-variant/30 flex flex-wrap items-center gap-y-2.5 gap-x-5 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[17px]" aria-hidden="true">verified</span>
                <span>100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[17px]" aria-hidden="true">precision_manufacturing</span>
                <span>Heavy-Duty Specs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[17px]" aria-hidden="true">local_shipping</span>
                <span>Coimbatore Logistics Hub</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT 3D VISUAL STAGE: Multi-Layer Parallax Composition
              - Main tilted 3D product card with dynamic specular glare
              - Floating specification badge
              - Overlapping secondary thumbnail card
              - Floating technical certification pill
              ======================================================== */}
          <div className="lg:col-span-6 relative flex justify-center items-center perspective-1200 preserve-3d">
            
            {/* Primary 3D Product Showcase Card */}
            <div className="parallax-card-3d relative w-full max-w-[540px] rounded-2xl p-2.5 bg-surface-container-lowest/95 backdrop-blur-sm shadow-xl border border-outline-variant/30 transition-shadow duration-300 hover:shadow-2xl">
              
              {/* Dynamic Specular Glare Highlight Overlay */}
              <div className="parallax-glare absolute inset-0 rounded-2xl z-20 pointer-events-none" aria-hidden="true" />

              {/* LCP Image Container – fixed aspect ratio prevents CLS */}
              <div className="relative overflow-hidden rounded-xl bg-surface-dim aspect-[4/3] preserve-3d">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgqOYZAdlPsSXp8KRxib9a55ZCWgAEiemhK7uh5ijWHxzXlOav-Mg0yOoE5kNo0biwJvY_Y8XOZiIZxRNCTBJJlN6IbNI_Y2WmnHvQOqZK4F5OfaLPillUb3dsWv5_UcraxLEZCcVffhdSFoVddQqnqf1R-hy9zXRISaU0VjA9iSR2UMe5n5nP5UtZfbsz0hnjCFB0_QJi0vTontyB6GxmAKdvHq8Vf1xWNhafprxP-YgoJaO_fzgFqg"
                  alt="Heavy Duty Chevron Conveyor Belts Manufactured by Peeyem Traders"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 540px"
                  priority
                  fetchPriority="high"
                />
                
                {/* Visual Depth Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-on-background/10 to-transparent" aria-hidden="true" />

                {/* Floating Specification Badge (Forward 3D Plane) */}
                <div className="parallax-layer-spec absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md shadow-md border border-outline-variant/30 z-10">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-secondary uppercase tracking-wider text-[10px] font-bold">Core Product</span>
                    <span className="font-headline-sm text-body-md font-bold text-on-surface text-sm">Chevron Incline Cleat Belting</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-code-spec text-label-sm font-bold text-[11px] shrink-0 ml-2">
                    1000mm Profile
                  </span>
                </div>
              </div>

              {/* Overlapping Secondary Card – High-Grade Rubber Rolls */}
              <div className="parallax-layer-card-overlap absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-2xl max-w-[225px] border border-outline-variant/30 z-20">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-dim">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkBo8yqVorpCynzioX_BBPHgU0JBhLzroHNbWerJok2IBjlVxe4a19F0hwSjJA_A-u7VEHV7_GNP1j1Z-fag9ZLHgSlcIBTXIvWaE7LyR9c-DXY5JtZoI1MRpj2sW9jev62dt1NU7MZnHWs_B6w-LR6R4el0ls06totDAeYn18QkRVZTWEqH9JtH4qV3ViWwT0nKK3UCamfWnqm4VKDkuBCtKnLRDSIF-b_KlqPOTF_bnwcjzgdyX5kA"
                    alt="Industrial Rubber Roll Stocks and Sheets"
                    fill
                    className="object-cover"
                    sizes="56px"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-primary uppercase font-bold tracking-wider text-[10px]">Warehouse Stock</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold text-xs truncate">High-Grade Rubber</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant truncate">Natural &amp; Synthetic</span>
                </div>
              </div>

              {/* Foreground Technical Certification Pill (Top-Right High Depth) */}
              <div className="parallax-layer-floating-pill absolute -top-3.5 -right-3.5 sm:-top-5 sm:-right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-xl border border-secondary/30 z-20 select-none">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-on-surface uppercase tracking-wider leading-none">Heavy-Duty Grade</span>
                  <span className="text-[9px] text-on-surface-variant font-mono leading-tight">IS 1891 Tested</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
