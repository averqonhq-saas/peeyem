"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PRODUCTS, Product } from "@/data/products";
import ProductRFQModal from "@/components/products/ProductRFQModal";

export default function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<string>("Rubber Conveyor Belt");
  const [modalApp, setModalApp] = useState<string>("Material Handling");

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = 360;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Smoothly scroll spotlight into view if user is on mobile
    if (window.innerWidth < 768) {
      const el = document.getElementById("product-spotlight-view");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleOpenEnquiry = (productName: string, defaultApp?: string) => {
    setModalProduct(productName);
    setModalApp(defaultApp || "Material Handling");
    setModalOpen(true);
  };

  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 lg:py-24 border-b border-slate-200/80" id="products">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Product Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Industrial Products Catalog
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore our core inventory of heavy-duty conveyor belting, power transmission belts, and vulcanized rubber products.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Selected Product Spotlight (Smooth Dynamic Transition) */}
        <div
          id="product-spotlight-view"
          className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Large Product Imagery */}
            <div className="lg:col-span-6 relative rounded-xl overflow-hidden bg-slate-100 aspect-[4/3] shadow-inner border border-slate-100">
              <Image
                key={selectedProduct.id}
                src={selectedProduct.image}
                alt={selectedProduct.alt}
                fill
                priority
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide">
                  {selectedProduct.categoryTag}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow">
                  {selectedProduct.specTag}
                </span>
              </div>
            </div>

            {/* Product Details & Specifications */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5">
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                  Featured Specification Spotlight
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-2.5">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Available Grades */}
              {selectedProduct.grades && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Grades &amp; Variants:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.grades.map((grade) => (
                      <span
                        key={grade}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Technical Specs Table */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2 text-xs">
                {selectedProduct.specifications.slice(0, 3).map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <span className="text-slate-500 font-semibold">{spec.key}</span>
                    <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEnquiry(selectedProduct.name, selectedProduct.applications[0])}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Send Enquiry</span>
                </button>
                <a
                  href={`https://wa.me/916379485898?text=${encodeURIComponent(selectedProduct.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">chat</span>
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Horizontal Interactive Carousel Track */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PRODUCTS.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className={`snap-start flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isSelected ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200"
                  }`}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.alt}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="340px"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                        {prod.categoryTag}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 hover:text-amber-600 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed mt-1 line-clamp-2">
                        {prod.description}
                      </p>

                      {/* Grades Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {prod.grades.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(prod);
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                          isSelected
                            ? "bg-amber-100 text-amber-900 font-black"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        View Product
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEnquiry(prod.name, prod.applications[0]);
                        }}
                        className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center"
                      >
                        Send Enquiry
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Enquiry Modal */}
      <ProductRFQModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={modalProduct}
        applicationName={modalApp}
      />
    </section>
  );
}
