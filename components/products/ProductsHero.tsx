"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
}

export default function ProductsHero({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: ProductsHeroProps) {
  return (
    <>
      {/* Top Technical Breadcrumb & Meta Bar */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-medium">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-primary font-bold">Products Catalog</span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface">Coimbatore Central Depot</span>
          </nav>

          <div className="flex items-center gap-4 text-on-surface-variant text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Stock Depot: South Ukkadam
            </span>
            <span className="hidden md:inline text-outline-variant">|</span>
            <span className="hidden md:inline font-medium">IS 1891 (Part 1) &amp; DIN 22102 Compliant</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full bg-surface py-space-xl relative overflow-hidden">
        {/* Subtle radial engineering glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit text-xs font-bold tracking-wider uppercase">
                <span className="material-symbols-outlined text-base">precision_manufacturing</span>
                <span>Industrial Material Handling Solutions</span>
              </div>

              <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Engineered Conveyor Belting &amp; Wear Solutions
              </h1>

              <p className="font-body-md text-base text-on-surface-variant max-w-2xl leading-relaxed">
                Heavy-duty multi-ply fabric belts (NN/EP), steep-incline chevron profiles, abrasion-resistant rubber sheeting, and vulcanizing fasteners stocked for immediate dispatch from Coimbatore.
              </p>

              {/* Interactive Search & Filter Bar */}
              <div className="mt-2 flex flex-col sm:flex-row items-stretch gap-2 bg-surface-container-lowest p-2 rounded-2xl shadow-md border border-outline-variant/30 hover:border-primary/40 transition-colors">
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-outline text-xl">search</span>
                  <input
                    className="w-full bg-transparent font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Search product name, ply rating (NN/EP), or grade (M-24, HR)..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                      title="Clear search"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onFilterClick}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">tune</span>
                  <span>Filter Catalog</span>
                </button>
              </div>

              {/* Highlights Metric Strip */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 hover-lift">
                  <span className="font-headline-sm text-xl font-bold text-primary block">1600 mm</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Max Cut Width</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 hover-lift">
                  <span className="font-headline-sm text-xl font-bold text-secondary block">EP / NN</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Tensile Modulus</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 hover-lift">
                  <span className="font-headline-sm text-xl font-bold text-amber-600 block">24 Hours</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Depot Dispatch</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Engineering Spotlight Card */}
            <div className="lg:col-span-5 animate-fade-in-up delay-150">
              <div className="relative rounded-3xl overflow-hidden bg-surface-container-lowest shadow-xl border border-outline-variant/30 group hover-lift">
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-surface-dim">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9rZd_mnTr1CTvZzvMWgYHLE-fO1KLDn09VkqIpMT7bB2Aq84j2fJIBWl9laruoBVrr2U0OSIZVip_nG_aqmktotIPeTa2_gpc6gKMIeN1NB1-RIR9bpth9qRPOSjwN631vQI_AQm7FbVdcTGhr144nwPrVYAgEgdCgfC5IHR0HI0XGQ14Zj38hzyqvkvIuhxPcVDenMUlbyymmH_ifNDyox6aM1nrcueDlKVNjtxm"
                    alt="Heavy-Duty Chevron Conveyor Belt Roll"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Direct Factory Ready Stock</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#ff8d28] text-slate-950 inline-block mb-1">
                      Featured Specification
                    </span>
                    <h2 className="font-headline-sm text-lg font-bold text-white leading-snug">
                      Chevron Cleated High-Angle Belting
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-200 font-mono">
                      <span>Width: 400mm – 1600mm</span>
                      <span>•</span>
                      <span>Cleat: 15mm / 25mm / 32mm</span>
                      <span>•</span>
                      <span>Angle: Up to 40°</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-on-surface text-xs font-medium">
                    <span className="material-symbols-outlined text-secondary text-base">verified</span>
                    <span>Pre-tested for tensile load &amp; cleat adhesion</span>
                  </div>
                  <button
                    type="button"
                    onClick={onFilterClick}
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Browse Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
