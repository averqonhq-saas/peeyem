"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { dbService } from "@/lib/db";
import { DbPromotionVideo, PromotionVideoSize } from "@/types/admin";
import { parseYouTubeUrl } from "@/lib/youtube";

export default function VideoShowcase() {
  const [videos, setVideos] = useState<DbPromotionVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Real-Time subscription for promotional videos
    const unsubscribe = dbService.subscribeVideos((list) => {
      const active = list.filter((v) => v.is_active);
      setVideos(active);
    });
    return () => unsubscribe();
  }, []);

  // Auto-advance carousel every 7s unless hovered or playing
  useEffect(() => {
    if (videos.length <= 1 || isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videos.length, isPlaying, isHovered]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handleSelect = (idx: number) => {
    setIsPlaying(false);
    setCurrentIndex(idx);
  };

  if (videos.length === 0) return null;

  const currentVideo = videos[currentIndex] || videos[0];
  const title = currentVideo.title || "Industrial Conveyor Operations & Field Testing";
  const thumbnail =
    currentVideo.thumbnail_url ||
    (currentVideo.youtube_video_id
      ? `https://img.youtube.com/vi/${currentVideo.youtube_video_id}/maxresdefault.jpg`
      : "https://lh3.googleusercontent.com/aida-public/AB6AXuCsKPWW63Qi05s9yRq3dC3WVHs1pOGgG0no6Y3MjGLi_56i0E1p8zpaO-7kfsFuv-Yu9neJZLOpXrIh1susAFnE3H20RCCAK3PHgnuxHqsSUbK5IS2q4a-wD3S4tfBzjGn7Ym2wtX8XA39E11B22DsUBsig1bjBhoX4tg-KUhjsgYSqQBbuWbtAQ7M5IoOIYH-xVrt7jPc0EAKyrkYJGotMwTFgZ7OAMseRPhlvdB9xKByme5YgQppGuA");
  const embedUrl = currentVideo.embed_url || (currentVideo.youtube_video_id ? `https://www.youtube.com/embed/${currentVideo.youtube_video_id}?rel=0` : null);

  // Dynamic aspect ratio & size class based on admin selection
  const getSizeClasses = (sz?: PromotionVideoSize) => {
    switch (sz) {
      case "tall":
        // 4:3 Expanded format
        return "aspect-[4/3] min-h-[380px] sm:min-h-[480px] max-h-[580px]";
      case "standard":
        // 16:9 Standard widescreen
        return "aspect-video min-h-[340px] sm:min-h-[440px] max-h-[540px]";
      case "compact":
        // 16:10 Compact banner
        return "aspect-[16/10] min-h-[280px] sm:min-h-[340px] max-h-[420px]";
      case "wide":
      default:
        // 21:9 Ultra-wide cinematic
        return "aspect-[21/9] min-h-[300px] sm:min-h-[360px] max-h-[460px]";
    }
  };

  const activeSizeClass = getSizeClasses(currentVideo.size);

  return (
    <section
      className="w-full bg-surface-container-low py-10 sm:py-16 lg:py-24"
      id="video-showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-5 sm:gap-6">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-label-sm uppercase tracking-widest font-bold w-fit text-xs">
              <span className="material-symbols-outlined text-red-600 text-[16px]" aria-hidden="true">smart_display</span>
              <span>PROMOTION VIDEO CAROUSEL</span>
            </div>
            <h2
              className="font-display text-on-surface font-extrabold tracking-tight"
              style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
            >
              Industrial Operational &amp; Field Demos
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              Watch heavy-duty incline testing, hot vulcanized jointing, and warehouse staging.
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          {videos.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-on-surface-variant mr-1" aria-live="polite">
                {currentIndex + 1} / {videos.length}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous promotional video"
                className="w-10 h-10 min-h-[40px] rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container flex items-center justify-center text-on-surface shadow-sm hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next promotional video"
                className="w-10 h-10 min-h-[40px] rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container flex items-center justify-center text-on-surface shadow-sm hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Video Carousel Card */}
        <div className="relative w-full">
          <div
            className={`relative rounded-3xl overflow-hidden bg-black shadow-2xl transition-all duration-500 flex items-center justify-center ${activeSizeClass}`}
          >
            {/* Background Thumbnail Image with Smooth Fade */}
            <Image
              src={thumbnail}
              alt={title}
              fill
              key={currentVideo.id}
              className="object-cover filter brightness-[0.72] transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25"></div>
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>

            {/* Floating Aspect Ratio Badge (Selected by Admin) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>
                  {currentVideo.size === "tall"
                    ? "4:3 Showcase"
                    : currentVideo.size === "compact"
                    ? "16:10 Compact"
                    : currentVideo.size === "standard"
                    ? "16:9 Standard"
                    : "21:9 Ultra-Wide"}
                </span>
              </span>
              {currentVideo.is_featured && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>

            {/* Floating Direct YouTube Link Button */}
            {currentVideo.youtube_url && (
              <a
                href={currentVideo.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105"
              >
                <span>YouTube</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            )}

            {/* Central Video Information & Play Trigger */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-10 gap-4 max-w-3xl">
              <button
                aria-label={`Play operational showcase video: ${title}`}
                onClick={() => setIsPlaying(true)}
                className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer group ring-4 ring-white/30"
                type="button"
              >
                <span
                  className="material-symbols-outlined text-4xl sm:text-5xl ml-1 group-hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </button>

              <div className="flex flex-col items-center gap-2 text-white">
                <span className="font-label-sm uppercase tracking-widest text-amber-400 font-bold text-[10px] sm:text-xs">
                  Promotion Video Showcase
                </span>
                <h3
                  className="font-extrabold text-white max-w-2xl leading-tight"
                  style={{ fontSize: "clamp(1rem, 3vw, 1.875rem)" }}
                >
                  {title}
                </h3>
                {currentVideo.description && (
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-xl font-medium">
                    {currentVideo.description}
                  </p>
                )}
                <span className="font-code-spec text-[11px] text-white/60 tracking-wider">
                  YouTube Promotion Feature • Peeyem Traders
                </span>
              </div>
            </div>

            {/* Left & Right In-Banner Chevron Buttons */}
            {videos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous video"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next video"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              </>
            )}

            {/* Bottom Dots Indicator */}
            {videos.length > 1 && (
              <div className="absolute bottom-4 z-20 flex items-center gap-2">
                {videos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelect(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`transition-all rounded-full ${
                      i === currentIndex
                        ? "w-8 h-2.5 bg-red-500 shadow-md"
                        : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Preview Strip for Other Carousel Videos */}
        {videos.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 pt-2">
            {videos.map((vid, idx) => {
              const isSelected = idx === currentIndex;
              const thumb =
                vid.thumbnail_url ||
                `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`;

              return (
                <div
                  key={vid.id}
                  onClick={() => handleSelect(idx)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-surface-container-high border-red-500 shadow-md ring-2 ring-red-500/20"
                      : "bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant"
                  }`}
                >
                  <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-black shrink-0">
                    <Image
                      src={thumb}
                      alt={vid.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-red-600 text-white" : "bg-black/70 text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs ml-0.5">play_arrow</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs font-bold line-clamp-1 ${
                        isSelected ? "text-red-700" : "text-on-surface"
                      }`}
                    >
                      {vid.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono">
                      {vid.size === "tall"
                        ? "4:3"
                        : vid.size === "compact"
                        ? "16:10"
                        : vid.size === "standard"
                        ? "16:9"
                        : "21:9"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Video Player Modal */}
        {isPlaying && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsPlaying(false)}
          >
            <div
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[24px]">
                    smart_display
                  </span>
                  <h4 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface truncate max-w-xl">
                    {title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-error hover:text-on-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mt-4 bg-black flex items-center justify-center shadow-inner">
                {embedUrl ? (
                  <iframe
                    src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                    title={title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={thumbnail}
                      alt="Operational Video Preview"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-on-primary">
                      <p className="font-body-md font-semibold">
                        Dynamic Load &amp; Carcass Tensile Rig Demonstration
                      </p>
                      <p className="font-body-sm text-surface-container-high">
                        To request full on-site plant testing recordings or engineering inspection files, contact our technical team.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
