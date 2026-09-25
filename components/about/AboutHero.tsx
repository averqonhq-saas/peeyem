"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutHero() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <section className="relative w-full bg-surface-container-lowest overflow-hidden">
      {/* Subtle technical grid backdrop overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="48" id="tech-grid" patternUnits="userSpaceOnUse" width="48">
              <path
                className="text-surface-container-highest"
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              ></path>
              <circle className="text-primary/20" cx="48" cy="48" fill="currentColor" r="1.5"></circle>
            </pattern>
          </defs>
          <rect fill="url(#tech-grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-label-sm font-label-sm uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>About Peeyem Traders</span>
            </div>

            <h1 className="font-headline-lg text-headline-lg lg:text-display text-on-surface tracking-tight leading-[1.15]">
              Reliable Industrial Solutions <br className="hidden sm:inline" />
              <span className="text-primary">for Your Business</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Peeyem Traders provides conveyor belts, rubber products, specialized belts, and conveyor accessories engineered for rugged industrial material-handling requirements.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-primary-container transition-all group"
                href="/#products"
              >
                <span>Explore Products</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-all"
                href="/#contact"
              >
                <span className="material-symbols-outlined text-[18px]">engineering</span>
                <span>Technical Consultation</span>
              </Link>
            </div>

            {/* Micro Spec Summary Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-4 w-full max-w-lg bg-surface-container-lowest/80 p-4 rounded-xl shadow-sm border border-outline-variant/20">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Hub</p>
                <p className="font-headline-sm text-headline-sm text-primary font-bold">Coimbatore</p>
                <p className="font-code-spec text-code-spec text-on-surface-variant">South Ukkadam</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Standard</p>
                <p className="font-headline-sm text-headline-sm text-secondary font-bold">IS / DIN</p>
                <p className="font-code-spec text-code-spec text-on-surface-variant">Tested Quality</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Focus</p>
                <p className="font-headline-sm text-headline-sm text-tertiary font-bold">Belting</p>
                <p className="font-code-spec text-code-spec text-on-surface-variant">&amp; Rubber Sheets</p>
              </div>
            </div>
          </div>

          {/* Right Visual with Subtle 3D Card Perspective */}
          <div className="lg:col-span-5 relative perspective-[1000px]">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative group rounded-2xl p-3 bg-surface-container-lowest shadow-xl transition-all duration-500 hover:shadow-2xl overflow-hidden border border-outline-variant/30"
              id="hero-belt-card"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKY-B9CXnFz1jtuZQxoRyj6k_IivqHMzItdz_hTvFrubpHXPepHvcNRgw9LdZyyk3DSggKAddGWHttsjMUyWZ13tOKR9Bj19Xed-BmXUsasGGgx0N3lESlduhrkCLLW3PsJ1-m30B12EHu0HUG52hHfJw8KOb3oBQj2M7L8dv2fI3c_XBjTPhXuLSyIhwIOlUDI2sltFHretSBnr6kIbuVelNfgo-kmWYOa3mPz4P30t9byKC7nhaoXA"
                  alt="Heavy-duty Chevron conveyor belt roll securely mounted on a precision steel test stand inside an industrial warehouse facility"
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>

                {/* Floating Depth Badge */}
                <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-code-spec text-code-spec text-on-surface font-semibold">
                    1000mm Chevron Width
                  </span>
                </div>

                {/* Bottom Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container font-semibold">
                    Engineering Grade
                  </span>
                  <p className="font-headline-sm text-headline-sm font-bold text-surface-container-lowest">
                    Industrial Reliability
                  </p>
                </div>
              </div>

              {/* Supporting Micro Spec strip under card image */}
              <div className="flex items-center justify-between px-3 py-2.5 mt-2 bg-surface-container-low rounded-lg text-on-surface-variant">
                <span className="flex items-center gap-1.5 font-code-spec text-code-spec">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  Direct Warehouse Stock
                </span>
                <span className="font-code-spec text-code-spec text-primary font-semibold">
                  Ready Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
