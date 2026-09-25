"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbProduct } from "@/types/admin";
import { useParallax3D } from "@/hooks/useParallax3D";

export default function FeaturedProduct() {
  const [featuredProduct, setFeaturedProduct] = useState<DbProduct | null>(null);

  const containerRef = useParallax3D<HTMLElement>({
    maxTilt: 5,
    maxTranslate: 12,
    scrollFactor: 0.08,
    smoothing: 0.08,
    glare: true,
  });

  useEffect(() => {
    const unsubscribe = dbService.subscribeProducts((list) => {
      const active = list.filter((p) => p.is_active);
      const feat = active.find((p) => p.is_featured) || active[0] || null;
      setFeaturedProduct(feat);
    });
    return () => unsubscribe();
  }, []);

  if (!featuredProduct) return null;

  return (
    <section
      ref={containerRef}
      className="w-full bg-surface-container-lowest py-10 sm:py-16 lg:py-24 preserve-3d"
      id="featured-product"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
        <div className="rounded-2xl bg-surface-container p-5 sm:p-8 lg:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-space-xl items-center">
            {/* Visual Column with subtle 3D parallax depth */}
            <div className="lg:col-span-6 relative flex justify-center items-center perspective-1000 preserve-3d">
              <div className="parallax-card-3d relative w-full rounded-2xl p-2 bg-surface-container-lowest/80 backdrop-blur-sm shadow-xl border border-outline-variant/30">
                {/* Dynamic Specular Glare */}
                <div className="parallax-glare absolute inset-0 rounded-2xl z-20 pointer-events-none" aria-hidden="true" />

                <div className="relative rounded-xl overflow-hidden shadow-lg bg-surface-dim aspect-[4/3] preserve-3d">
                  {featuredProduct.image_url ? (
                    <Image
                      src={featuredProduct.image_url}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 550px"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-6xl">inventory_2</span>
                    </div>
                  )}

                  {/* Floating Depth Tag */}
                  <div className="parallax-layer-spec absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md shadow border border-outline-variant/20 z-10">
                    <span className="font-label-sm text-primary uppercase font-bold tracking-wider text-[10px]">
                      Verified Industrial Spec
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start gap-space-sm">
              <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm uppercase tracking-wider text-xs font-bold">
                Engineering Spotlight • {featuredProduct.category_id}
              </span>
              <h2
                className="font-display text-on-surface font-extrabold"
                style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
              >
                {featuredProduct.name}
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {featuredProduct.description || featuredProduct.short_description}
              </p>

              {/* Dynamic Specifications */}
              {featuredProduct.specifications && featuredProduct.specifications.length > 0 && (
                <div className="flex flex-col gap-2 w-full pt-space-xs">
                  {featuredProduct.specifications.slice(0, 3).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-body-sm text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check</span>
                      <span><strong>{spec.key}:</strong> {spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-4 w-full">
                <Link
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-all text-xs min-h-[44px] flex items-center justify-center"
                  href="/products"
                >
                  View Full Catalog
                </Link>
                <Link
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md font-bold hover:bg-tertiary-fixed transition-all text-xs min-h-[44px] flex items-center justify-center"
                  href="#contact"
                >
                  Request Technical Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
