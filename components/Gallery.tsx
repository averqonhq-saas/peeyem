"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbGalleryImage } from "@/types/admin";

const DEFAULT_IMAGES = [
  {
    src: "/images/products/rubber-conveyor-belt.jpg",
    alt: "Heavy Duty Rubber Conveyor Belt Roll on Pallet",
    tag: "CONVEYOR BELT",
    title: "Rubber Conveyor Belt",
  },
  {
    src: "/images/products/pu-conveyor-belt.jpg",
    alt: "Food Grade PU Polyurethane Conveyor Belt",
    tag: "FOOD GRADE BELT",
    title: "PU Conveyor Belt",
  },
  {
    src: "/images/products/pvc-conveyor-belt.jpg",
    alt: "Industrial PVC Conveyor Belt Roll",
    tag: "LOGISTICS & AGRO",
    title: "PVC Conveyor Belt",
  },
  {
    src: "/images/products/v-belt.jpg",
    alt: "Industrial Rubber Transmission V-Belts",
    tag: "POWER TRANSMISSION",
    title: "Industrial V-Belt",
  },
  {
    src: "/images/products/cow-mat.jpg",
    alt: "Heavy Duty Vulcanized Rubber Cow Mats",
    tag: "RUBBER FLOORING",
    title: "Vulcanized Cow Mat",
  },
  {
    src: "/images/products/rubber-sheet.jpg",
    alt: "Industrial Vulcanized Rubber Sheet Rolls",
    tag: "RUBBER SHEETING",
    title: "Industrial Rubber Sheet",
  },
  {
    src: "/images/products/conveyor-belt-fasteners.jpg",
    alt: "Mechanical Conveyor Belt Fasteners and Splicing",
    tag: "BELT FASTENERS",
    title: "Conveyor Belt Fasteners",
  },
  {
    src: "/images/products/tarpaulin.jpg",
    alt: "Heavy Duty Waterproof Industrial Blue Tarpaulin",
    tag: "PROTECTIVE COVERS",
    title: "Industrial Tarpaulin",
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
          active.slice(0, 8).map((g) => ({
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
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
