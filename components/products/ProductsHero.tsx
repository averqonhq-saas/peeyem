"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onSendEnquiry?: () => void;
}

export default function ProductsHero({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onSendEnquiry,
}: ProductsHeroProps) {
  return (
    <>
      {/* Top Technical Breadcrumb & Meta Bar */}
      <section className="w-full bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 font-medium">
            <Link className="hover:text-amber-600 transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
            <span className="text-amber-600 font-bold">Products Catalog</span>
            <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
            <span className="text-slate-900 font-semibold">Coimbatore Central Depot</span>
          </nav>

          <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stock Depot: South Ukkadam
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline font-medium">IS 1891 Tested &bull; High Tensile EP Fabric</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full bg-white py-12 sm:py-16 relative overflow-hidden border-b border-slate-200">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 w-fit text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                Industrial Belts for Every Application
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Industrial Belts Built for Demanding Applications
              </h1>

              <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                We supply high-quality industrial belts and rubber products for a wide range of industrial and material-handling applications.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onFilterClick}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Explore Products</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
                <button
                  type="button"
                  onClick={onSendEnquiry}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Send Enquiry</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="mt-3 flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                  <input
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Search Rubber Conveyor, PU, PVC, V-Belt, Cow Mat, Sheets, Tarpaulin, Mud Flaps..."
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
              </div>

              {/* Highlights Metric Strip */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-xl font-black text-slate-900 block">8 Series</span>
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Standard Catalog</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-xl font-black text-amber-600 block">M24 &amp; SHR</span>
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Quarry &amp; Heat Rated</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-xl font-black text-slate-900 block">Same-Day</span>
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Depot Dispatch</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-200 group">
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/products/rubber-conveyor-belt.jpg"
                    alt="Heavy-Duty Rubber Conveyor Belt Roll"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Direct Factory Ready Stock</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 text-white">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider bg-amber-500 text-slate-950 inline-block mb-1">
                      Featured Specification
                    </span>
                    <h2 className="text-lg font-black text-white leading-snug">
                      Rubber Conveyor Belt (M24 / N17 / SHR / HR)
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300 font-mono">
                      <span>Width: 300mm – 1600mm</span>
                      <span>&bull;</span>
                      <span>High Tensile EP Fabric</span>
                      <span>&bull;</span>
                      <span>Quarry Tested</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                    <span className="material-symbols-outlined text-amber-600 text-base">verified</span>
                    <span>Pre-tested for tensile load &amp; cover adhesion</span>
                  </div>
                  <button
                    type="button"
                    onClick={onFilterClick}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
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
