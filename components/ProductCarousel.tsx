"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "@/data/products";
import { dbService } from "@/lib/db";
import { DbProduct } from "@/types/admin";

export default function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activePage, setActivePage] = useState<number>(0);
  const [products, setProducts] = useState<DbProduct[]>([]);

  useEffect(() => {
    // Real-Time subscription for active products
    const unsubscribe = dbService.subscribeProducts((list) => {
      const active = list.filter((p) => p.is_active);
      setProducts(active);
    });
    return () => unsubscribe();
  }, []);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const scrollLeft = track.scrollLeft;

    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < maxScroll - 15);

    if (maxScroll > 0) {
      const pageIndex = scrollLeft > maxScroll / 2 ? 1 : 0;
      setActivePage(pageIndex);
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 340;
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;

    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollToPage = (pageIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const targetLeft = pageIndex === 0 ? 0 : track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-surface-container-low py-10 sm:py-16 lg:py-24" id="products">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-space-lg">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-label-md text-secondary uppercase tracking-widest font-bold text-xs">
              Engineering Inventory
            </span>
            <h2
              className="font-display text-on-surface"
              style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
            >
              Core Products &amp; Solutions
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Heavy-duty vulcanized flat, chevron, and specialized belting held in stock at our Coimbatore central depot.
            </p>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Page Indicators */}
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                aria-label="Carousel page 1"
                onClick={() => scrollToPage(0)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activePage === 0 ? "w-6 bg-primary" : "w-2 bg-outline-variant hover:bg-on-surface-variant"
                }`}
              />
              <button
                type="button"
                aria-label="Carousel page 2"
                onClick={() => scrollToPage(1)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activePage === 1 ? "w-6 bg-primary" : "w-2 bg-outline-variant hover:bg-on-surface-variant"
                }`}
              />
            </div>

            {/* Left/Right Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous products"
                disabled={!canScrollLeft}
                onClick={() => handleScroll("left")}
                className={`w-11 h-11 rounded-full border border-outline-variant/60 bg-surface-container flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "hover:bg-primary hover:text-on-primary hover:border-primary cursor-pointer text-on-surface shadow-sm"
                    : "opacity-40 cursor-not-allowed text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <button
                type="button"
                aria-label="Next products"
                disabled={!canScrollRight}
                onClick={() => handleScroll("right")}
                className={`w-11 h-11 rounded-full border border-outline-variant/60 bg-surface-container flex items-center justify-center transition-all ${
                  canScrollRight
                    ? "hover:bg-primary hover:text-on-primary hover:border-primary cursor-pointer text-on-surface shadow-sm"
                    : "opacity-40 cursor-not-allowed text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 -mx-1 px-1 focus:outline-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((prod) => {
            const specText = prod.specifications?.[0] ? `${prod.specifications[0].key}: ${prod.specifications[0].value}` : "Standard Spec";
            const whatsappMessage = `Hi Peeyem Traders, I am interested in ${prod.name} (${prod.category_id}). Please share technical quote and stock details.`;

            return (
              <div
                key={prod.id}
                className="snap-start flex-none w-[260px] sm:w-[300px] md:w-[320px] lg:w-[calc(25%-18px)] flex flex-col justify-between rounded-xl bg-surface-container-lowest p-4 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-outline-variant/20"
              >
                <div className="flex flex-col gap-3">
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-dim">
                    {prod.image_url ? (
                      <Image
                        src={prod.image_url}
                        alt={prod.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 280px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-3xl">inventory_2</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm uppercase tracking-wider text-primary font-bold text-xs">
                      {prod.category_id}
                    </span>
                    <span className="font-code-spec text-[11px] text-on-surface-variant">
                      {specText}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-body-lg font-bold text-on-surface line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant line-clamp-2 text-xs">
                    {prod.short_description || prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/30">
                  <a
                    className="inline-flex items-center gap-1.5 text-secondary font-label-md hover:underline text-xs font-semibold min-h-[44px] py-2"
                    href={`https://wa.me/${COMPANY_INFO.phoneRaw.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chat</span>
                    <span>Enquire</span>
                  </a>
                  <Link
                    className="font-label-md text-primary hover:text-primary-container font-semibold text-xs"
                    href="/products"
                  >
                    Catalog →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
