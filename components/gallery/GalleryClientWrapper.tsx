"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbPromotionVideo, AdminMediaAsset } from "@/types/admin";
import { COMPANY_INFO } from "@/data/products";
import ProductRFQModal from "@/components/products/ProductRFQModal";

interface GalleryItem {
  id: string;
  title: string;
  category: "belts" | "chevron" | "sheets" | "operations" | "depot" | "video";
  categoryLabel: string;
  src: string;
  alt: string;
  description: string;
  embedUrl?: string;
  isVideo?: boolean;
}

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Chevron Cleated High-Angle Roll Assembly",
    category: "chevron",
    categoryLabel: "Chevron Belting",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgqOYZAdlPsSXp8KRxib9a55ZCWgAEiemhK7uh5ijWHxzXlOav-Mg0yOoE5kNo0biwJvY_Y8XOZiIZxRNCTBJJlN6IbNI_Y2WmnHvQOqZK4F5OfaLPillUb3dsWv5_UcraxLEZCcVffhdSFoVddQqnqf1R-hy9zXRISaU0VjA9iSR2UMe5n5nP5UtZfbsz0hnjCFB0_QJi0vTontyB6GxmAKdvHq8Vf1xWNhafprxP-YgoJaO_fzgFqg",
    alt: "Precision molded chevron cleated conveyor belt roll",
    description: "25mm chevron cleat profile on EP-315 carcass belting staged for high-angle quarry incline transfer in Tamil Nadu.",
  },
  {
    id: "gal-2",
    title: "Industrial Rubber Sheeting Warehouse Staging",
    category: "sheets",
    categoryLabel: "Rubber Sheets",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkBo8yqVorpCynzioX_BBPHgU0JBhLzroHNbWerJok2IBjlVxe4a19F0hwSjJA_A-u7VEHV7_GNP1j1Z-fag9ZLHgSlcIBTXIvWaE7LyR9c-DXY5JtZoI1MRpj2sW9jev62dt1NU7MZnHWs_B6w-LR6R4el0ls06totDAeYn18QkRVZTWEqH9JtH4qV3ViWwT0nKK3UCamfWnqm4VKDkuBCtKnLRDSIF-b_KlqPOTF_bnwcjzgdyX5kA",
    alt: "Rolls of industrial natural and neoprene rubber sheeting",
    description: "6mm to 25mm thick abrasion-resistant natural and nitrile rubber sheeting rolls stored in our South Ukkadam facility.",
  },
  {
    id: "gal-3",
    title: "Granite Aggregate Primary Crushing Line",
    category: "operations",
    categoryLabel: "Operations",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsKPWW63Qi05s9yRq3dC3WVHs1pOGgG0no6Y3MjGLi_56i0E1p8zpaO-7kfsFuv-Yu9neJZLOpXrIh1susAFnE3H20RCCAK3PHgnuxHqsSUbK5IS2q4a-wD3S4tfBzjGn7Ym2wtX8XA39E11B22DsUBsig1bjBhoX4tg-KUhjsgYSqQBbuWbtAQ7M5IoOIYH-xVrt7jPc0EAKyrkYJGotMwTFgZ7OAMseRPhlvdB9xKByme5YgQppGuA",
    alt: "Continuous operational conveyor transporting blasted quarry rock",
    description: "Peeyem M-24 grade 4-ply carcass conveyor belt operating in harsh dry quarry conditions under continuous impact shock.",
  },
  {
    id: "gal-4",
    title: "Multi-Ply Flat Carcass Belting Inventory",
    category: "belts",
    categoryLabel: "Conveyor Belts",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEFx7k55IA317wq6EHUhLVmbSA3ZIzfHPhO5hEOz0wHiSUJQ4E92SFzJc_XbeT3uDxrCRorkiaOe_ljIId4g3PdoPG2Kk2bZOsyZ5x5_IyWW_Rv921lBFU2Xj53elmi1iMQ4rd_k-6ECgOgit-5H0otzoyaAWhFhyR6uAw1yM0MKTP-JaFqT-oR8XHc0n3sHz39MMSIYjcqPZFaipoPUTeknJraGhUtyKLaem4GS3kIBzFNki_55xMHw",
    alt: "Industrial multi-ply fabric belting ready rolls",
    description: "Full master rolls of NN-200 and EP-400 belting available for custom width slitting and immediate site dispatch.",
  },
  {
    id: "gal-5",
    title: "Steep-Angle Conveyor Cleat Adhesion Detail",
    category: "chevron",
    categoryLabel: "Chevron Belting",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3_buoWxyGzU0ywanzn2SfpTbj0BG58YmEAibe81SezkIC7p66a6YkCyZ0LMP8DWviLA-Volznrco0P2Jf_nlYKKp5UL2prH6f9WDqEZoMA8HJ0wrdy3ds67awsVVChnVIh3A9E8SUuRF1Ih_Piqb28KHxd79W7Wm9ekOz0s2MmJWRwItkAG8H2zsAPgelghoyQs9Ay_Wgy88mNzg7jNVmH1hzafBNkmVwr-PpIKQa95hHAUpIg4gXDA",
    alt: "Close-up macro of chevron cleat molded rubber edge",
    description: "High-grade rubber compound integrally vulcanized to ensure zero cleat detachment even under steep 38-degree transit.",
  },
  {
    id: "gal-6",
    title: "Heavy Wear Natural Rubber Lining Rolls",
    category: "sheets",
    categoryLabel: "Rubber Sheets",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs7yTSXlzcVax7PnNCQvjTa6XDREv5oH9E4W48DlxLVJNI8q_qpUogVXA1GT3kf76303hv0Xn82TgcRTpxxZTGo2xwXWNzbDUXOaRmXBQwx50MKroHRm4VWUr9s15xjl3Y-QWEamUWSHLIlt31KZKr4PxznfDzpxama7jNdbiFJHD-_J2al4GYniaTi5SLn-q1S7-Hn-yUj1HJ3HBkDRzLT-iwxELFZtmMVvxN1vtpFKDwcMig2Lcx-A",
    alt: "Natural rubber lining sheets stacked in depot",
    description: "High tensile resilience 60 Shore A rubber sheets specifically formulated for hopper chutes and cyclone wall linings.",
  },
  {
    id: "gal-7",
    title: "South Ukkadam Central Slitting Depot",
    category: "depot",
    categoryLabel: "Depot Facilities",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9rZd_mnTr1CTvZzvMWgYHLE-fO1KLDn09VkqIpMT7bB2Aq84j2fJIBWl9laruoBVrr2U0OSIZVip_nG_aqmktotIPeTa2_gpc6gKMIeN1NB1-RIR9bpth9qRPOSjwN631vQI_AQm7FbVdcTGhr144nwPrVYAgEgdCgfC5IHR0HI0XGQ14Zj38hzyqvkvIuhxPcVDenMUlbyymmH_ifNDyox6aM1nrcueDlKVNjtxm",
    alt: "Industrial slitting floor at Peeyem Traders Coimbatore",
    description: "Hydraulic cutting and roll rewinding machinery providing millimetric tolerance custom width conveyor belts.",
  },
];

export default function GalleryClientWrapper() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [items, setItems] = useState<GalleryItem[]>(STATIC_GALLERY_ITEMS);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [rfqItemName, setRfqItemName] = useState<string | null>(null);

  useEffect(() => {
    // Helper to map DB gallery category to public gallery category
    const mapCategory = (cat: string): GalleryItem["category"] => {
      if (cat === "chevron") return "chevron";
      if (cat === "sheets") return "sheets";
      if (cat === "field" || cat === "equipment") return "operations";
      if (cat === "depots" || cat === "delivery" || cat === "other") return "depot";
      return "belts";
    };

    const mapCategoryLabel = (cat: string): string => {
      if (cat === "chevron") return "Chevron Belting";
      if (cat === "sheets") return "Rubber Sheets";
      if (cat === "field") return "Field Operations";
      if (cat === "equipment") return "Plant Equipment";
      if (cat === "delivery") return "Fleet & Delivery";
      if (cat === "depots") return "Warehouse Depot";
      return "Conveyor Belts";
    };

    let unsubGallery = () => {};
    let unsubVideos = () => {};

    // Subscribe to live admin gallery updates
    unsubGallery = dbService.subscribeGalleryImages((galleryList) => {
      const activeGallery = (galleryList || [])
        .filter((g) => g.is_active)
        .sort((a, b) => a.display_order - b.display_order)
        .map((g) => ({
          id: g.id,
          title: g.caption,
          category: mapCategory(g.category),
          categoryLabel: mapCategoryLabel(g.category),
          src: g.url,
          alt: g.caption,
          description: `${g.caption} - Peeyem Traders facility and field installation.`,
        }));

      dbService.getVideos().then((videos) => {
        const videoItems: GalleryItem[] = (videos || [])
          .filter((v) => v.is_active)
          .map((v) => ({
            id: v.id,
            title: v.title,
            category: "video" as const,
            categoryLabel: "Video Showcase",
            src: v.thumbnail_url || "https://img.youtube.com/vi/" + v.youtube_video_id + "/maxresdefault.jpg",
            alt: v.title,
            description: v.description || "Field demonstration video for industrial material handling.",
            embedUrl: v.embed_url,
            isVideo: true,
          }));

        if (activeGallery.length > 0) {
          setItems([...videoItems, ...activeGallery]);
        } else {
          setItems([...videoItems, ...STATIC_GALLERY_ITEMS]);
        }
      });
    });

    return () => {
      unsubGallery();
      unsubVideos();
    };
  }, []);

  const categories = [
    { key: "all", label: "All Exhibits" },
    { key: "belts", label: "Conveyor Belts" },
    { key: "chevron", label: "Chevron Profiles" },
    { key: "sheets", label: "Rubber Sheeting" },
    { key: "operations", label: "Field Operations" },
    { key: "depot", label: "Depot & Fabrications" },
    { key: "video", label: "Video Field Demos" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Lightbox navigation helpers
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredItems.length - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! < filteredItems.length - 1 ? prev! + 1 : 0
    );
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) =>
          prev! > 0 ? prev! - 1 : filteredItems.length - 1
        );
      }
      if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) =>
          prev! < filteredItems.length - 1 ? prev! + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const currentItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <>
      {/* Top Breadcrumb Bar */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-medium">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-primary font-bold">Visual Gallery</span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface">Depot Stock &amp; Plant Operations</span>
          </nav>

          <div className="flex items-center gap-4 text-on-surface-variant text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              High-Definition Industrial Imagery
            </span>
          </div>
        </div>
      </section>

      {/* Gallery Hero Header */}
      <section className="w-full bg-surface py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin relative z-10 space-y-6">
          <div className="max-w-3xl space-y-3 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold tracking-wider uppercase">
              <span className="material-symbols-outlined text-base">photo_library</span>
              <span>Visual Staging &amp; Field Operations</span>
            </div>

            <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Warehouse Depot &amp; Field Installation Gallery
            </h1>

            <p className="font-body-md text-base text-on-surface-variant leading-relaxed">
              Explore high-resolution operational photographs, chevron cleat profiles, heavy-duty carcass stock, and active quarry mineral processing lines supplied by Peeyem Traders across Tamil Nadu and South India.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover-lift">
              <span className="font-headline-sm text-2xl font-bold text-primary block">1500+ Tons</span>
              <span className="text-xs text-on-surface-variant font-medium">Belting Stocked Annually</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover-lift">
              <span className="font-headline-sm text-2xl font-bold text-secondary block">500+ Plants</span>
              <span className="text-xs text-on-surface-variant font-medium">Equipped &amp; Maintained</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover-lift">
              <span className="font-headline-sm text-2xl font-bold text-amber-600 block">IS 1891:1994</span>
              <span className="text-xs text-on-surface-variant font-medium">Rigid Quality Benchmark</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover-lift">
              <span className="font-headline-sm text-2xl font-bold text-emerald-600 block">25+ Years</span>
              <span className="text-xs text-on-surface-variant font-medium">Regional Leadership</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Filter Pills Bar */}
      <section className="w-full bg-surface-container-lowest border-y border-outline-variant/30 sticky top-16 z-30 backdrop-blur-md bg-white/95">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const count =
                cat.key === "all"
                  ? items.length
                  : items.filter((i) => i.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.key
                      ? "bg-primary text-on-primary shadow-sm scale-[1.02]"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === cat.key ? "bg-white/20 text-white" : "bg-black/10 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant font-semibold shrink-0">
            <span className="material-symbols-outlined text-sm text-primary">zoom_in</span>
            <span>Click any item for full-screen inspection</span>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="w-full py-10 lg:py-16 bg-surface-container-low/50 min-h-[500px]">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl p-8 border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-slate-400">photo_library</span>
              <h3 className="font-bold text-base text-on-surface">No Exhibits in this Section</h3>
              <p className="text-xs text-on-surface-variant max-w-sm">
                No items are currently listed under this category filter.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl"
              >
                View All Exhibits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-outline-variant/30 shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                >
                  {/* Image Display */}
                  <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

                    {/* Category Chip */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 shadow">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Play Badge if Video */}
                    {item.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-[#ff8d28] text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expand icon bottom right */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-base">fullscreen</span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-3 left-3 right-12 z-10 text-white">
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Description Footer */}
                  <div className="p-4 bg-white flex flex-col justify-between flex-1 gap-3">
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <span className="text-primary font-bold text-[11px] group-hover:underline flex items-center gap-1">
                        <span>Inspect Details</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRfqItemName(item.title);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        RFQ Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          INTERACTIVE FULL-SCREEN LIGHTBOX MODAL
          ========================================================= */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0a1017] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between text-white bg-[#0e1720]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-primary text-on-primary">
                  {currentItem.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeLightboxIndex! + 1} of {filteredItems.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (ESC)"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Media Presentation Area */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {currentItem.isVideo && currentItem.embedUrl ? (
                <iframe
                  src={`${currentItem.embedUrl}&autoplay=1`}
                  title={currentItem.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt}
                  fill
                  sizes="1100px"
                  className="object-contain"
                  priority
                />
              )}

              {/* Prev / Next Floating Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg"
                title="Previous Image (Left Arrow)"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg"
                title="Next Image (Right Arrow)"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>
            </div>

            {/* Modal Footer Caption & Actions */}
            <div className="p-5 px-6 bg-[#0e1720] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className="text-base font-bold text-white">
                  {currentItem.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentItem.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const title = currentItem.title;
                    setActiveLightboxIndex(null);
                    setRfqItemName(title);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">request_quote</span>
                  <span>Inquire on this Item</span>
                </button>

                <a
                  href={`https://wa.me/${COMPANY_INFO.phoneRaw.replace("+", "")}?text=${encodeURIComponent(
                    `Hello Peeyem Traders, I saw this exhibit in your gallery: "${currentItem.title}". Please share technical specifications and pricing.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Quotation Modal from Gallery */}
      <ProductRFQModal
        productName={rfqItemName}
        isOpen={Boolean(rfqItemName)}
        onClose={() => setRfqItemName(null)}
      />
    </>
  );
}
