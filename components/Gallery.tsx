"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbGalleryImage } from "@/types/admin";

const DEFAULT_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgqOYZAdlPsSXp8KRxib9a55ZCWgAEiemhK7uh5ijWHxzXlOav-Mg0yOoE5kNo0biwJvY_Y8XOZiIZxRNCTBJJlN6IbNI_Y2WmnHvQOqZK4F5OfaLPillUb3dsWv5_UcraxLEZCcVffhdSFoVddQqnqf1R-hy9zXRISaU0VjA9iSR2UMe5n5nP5UtZfbsz0hnjCFB0_QJi0vTontyB6GxmAKdvHq8Vf1xWNhafprxP-YgoJaO_fzgFqg",
    alt: "Chevron Cleated Conveyor Roll Detail",
    tag: "Stock View",
    title: "Chevron Roll Assembly",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkBo8yqVorpCynzioX_BBPHgU0JBhLzroHNbWerJok2IBjlVxe4a19F0hwSjJA_A-u7VEHV7_GNP1j1Z-fag9ZLHgSlcIBTXIvWaE7LyR9c-DXY5JtZoI1MRpj2sW9jev62dt1NU7MZnHWs_B6w-LR6R4el0ls06totDAeYn18QkRVZTWEqH9JtH4qV3ViWwT0nKK3UCamfWnqm4VKDkuBCtKnLRDSIF-b_KlqPOTF_bnwcjzgdyX5kA",
    alt: "Industrial Rubber Roll Stock in Coimbatore Warehouse",
    tag: "Warehouse Staging",
    title: "Industrial Rubber Sheets",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsKPWW63Qi05s9yRq3dC3WVHs1pOGgG0no6Y3MjGLi_56i0E1p8zpaO-7kfsFuv-Yu9neJZLOpXrIh1susAFnE3H20RCCAK3PHgnuxHqsSUbK5IS2q4a-wD3S4tfBzjGn7Ym2wtX8XA39E11B22DsUBsig1bjBhoX4tg-KUhjsgYSqQBbuWbtAQ7M5IoOIYH-xVrt7jPc0EAKyrkYJGotMwTFgZ7OAMseRPhlvdB9xKByme5YgQppGuA",
    alt: "Continuous Mineral Conveyor Running at Crushing Site",
    tag: "Operational Site",
    title: "Quarry Belt Line",
  },
];

export default function Gallery() {
  const [displayImages, setDisplayImages] = useState(DEFAULT_IMAGES);

  useEffect(() => {
    const unsub = dbService.subscribeGalleryImages((list) => {
      const active = (list || [])
        .filter((g) => g.is_active)
        .sort((a, b) => a.display_order - b.display_order);

      if (active.length > 0) {
        setDisplayImages(
          active.slice(0, 3).map((g) => ({
            src: g.url,
            alt: g.caption,
            tag: g.category.toUpperCase(),
            title: g.caption,
          }))
        );
      }
    });

    return () => unsub();
  }, []);

  return (
    <section className="w-full bg-surface-container-lowest py-10 sm:py-16 lg:py-24" id="gallery">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-label-md text-secondary uppercase tracking-widest font-bold">
              Industrial Visuals
            </span>
            <h2
              className="font-display text-on-surface"
              style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
            >
              Warehouse &amp; Field Gallery
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-primary font-label-md font-bold hover:underline"
            href="/gallery"
          >
            <span>Explore Full Visual Gallery</span>
            <span className="material-symbols-outlined text-[18px]">east</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {displayImages.map((item) => (
            <Link
              key={item.title}
              href="/gallery"
              className="group relative rounded-3xl overflow-hidden shadow-md bg-surface-dim aspect-square cursor-pointer hover-lift"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/85 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-col text-on-primary">
                  <span className="font-label-sm text-secondary-fixed uppercase font-semibold text-xs">
                    {item.tag}
                  </span>
                  <span className="font-headline-sm text-body-lg font-bold">
                    {item.title}
                  </span>
                </div>
                <span className="material-symbols-outlined text-on-primary text-[24px]">
                  zoom_in
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            href="/gallery"
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-base">photo_library</span>
            <span>View Full Visual Gallery &amp; Field Demos</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
