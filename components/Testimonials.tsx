"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dbService } from "@/lib/db";
import { DbTestimonial } from "@/types/admin";
import { parseYouTubeUrl } from "@/lib/youtube";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = dbService.subscribeTestimonials((list) => {
      const active = list.filter((t) => t.is_active);
      setTestimonials(active);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectReview = (idx: number) => {
    setActiveReviewIndex(idx);
    setIsPlaying(false);
  };

  if (testimonials.length === 0) return null;

  const currentReview = testimonials[activeReviewIndex] || testimonials[0];
  const currentVideoId =
    currentReview.youtube_video_id ||
    (currentReview.youtube_url ? parseYouTubeUrl(currentReview.youtube_url)?.videoId : "dQw4w9WgXcQ");
  const currentEmbedUrl = currentReview.embed_url || `https://www.youtube.com/embed/${currentVideoId}?rel=0`;
  const currentThumbnail =
    currentReview.thumbnail_url || `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`;

  return (
    <section className="w-full bg-surface-container-lowest py-10 sm:py-16 lg:py-24" id="testimonials">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-8 lg:gap-space-lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-outline-variant/20 pb-6 sm:pb-8">
          <div className="max-w-2xl flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-label-sm uppercase tracking-widest font-bold w-fit text-xs">
              <span className="material-symbols-outlined text-red-600 text-[16px]" aria-hidden="true">smart_display</span>
              <span>VERIFIED YOUTUBE VIDEO TESTIMONIALS</span>
            </div>
            <h2
              className="font-display text-on-surface font-extrabold tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: "1.2" }}
            >
              Verified Industrial Client Feedback
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              Watch plant heads and quarry maintenance engineers across South India demonstrate conveyor belt uptime, tensile durability, and Peeyem Traders field service.
            </p>
          </div>

          {/* Plant Maintenance Score Badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm self-start md:self-auto shrink-0">
            <div className="flex text-amber-500" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-label-sm font-bold text-on-surface uppercase tracking-wider text-xs">
              5.0/5 Plant Maintenance Score
            </span>
          </div>
        </div>

        {/* Video Testimonials Showcase Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Featured Video Spotlight */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-container-low border border-outline-variant/30 shadow-xl">
            {/* 16:9 YouTube Video Container – aspect-video prevents CLS */}
            <div className="relative w-full aspect-video bg-black overflow-hidden group">
              {isPlaying ? (
                <iframe
                  src={`${currentEmbedUrl}${currentEmbedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                  title={`${currentReview.customer_name} Video Review`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              ) : (
                /* YouTube Facade – only loads iframe on click (performance optimization) */
                <button
                  className="relative w-full h-full cursor-pointer block"
                  onClick={() => setIsPlaying(true)}
                  aria-label={`Play video review by ${currentReview.customer_name}`}
                  type="button"
                >
                  <Image
                    src={currentThumbnail}
                    alt={`${currentReview.customer_name} video review thumbnail`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:via-black/20 transition-all" aria-hidden="true" />

                  {/* YouTube Red Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500 ring-4 ring-white/30">
                      <span className="material-symbols-outlined text-3xl sm:text-5xl ml-1" aria-hidden="true">play_arrow</span>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase border border-white/20">
                      Click to Watch Video Review
                    </span>
                  </div>

                  {/* Bottom YouTube Badge */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between text-white/90 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-black/70 backdrop-blur-sm">
                      <span className="text-red-500 font-black" aria-hidden="true">▶</span>
                      <span className="font-semibold truncate max-w-[120px] sm:max-w-none">{currentReview.customer_name}</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-sm font-code-spec">
                      Verified Client
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Video Testimonial Description & Author Bar */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex text-amber-500" aria-label={`${currentReview.rating || 5} stars`}>
                    {[...Array(currentReview.rating || 5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        aria-hidden="true"
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentReview.youtube_url && (
                      <a
                        href={currentReview.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold border border-red-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                        <span>Open on YouTube</span>
                      </a>
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-surface-container">
                      Verified Plant Review
                    </span>
                  </div>
                </div>

                <blockquote className="text-sm sm:text-base lg:text-lg font-medium text-on-surface italic leading-relaxed">
                  &ldquo;{currentReview.testimonial}&rdquo;
                </blockquote>
              </div>

              {/* Author Profile */}
              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg overflow-hidden relative shrink-0 ring-2 ring-blue-100">
                    {currentReview.profile_image_url ? (
                      <Image
                        src={currentReview.profile_image_url}
                        alt={currentReview.customer_name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span aria-hidden="true">{currentReview.customer_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-on-surface font-bold text-sm sm:text-base truncate">
                      {currentReview.customer_name}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                      {currentReview.designation ? `${currentReview.designation} — ` : ""}
                      <span className="text-primary font-semibold">{currentReview.company}</span>
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-3xl sm:text-4xl text-outline-variant/40 shrink-0" aria-hidden="true">
                  format_quote
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Video Playlist / List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                Client Video Reviews ({testimonials.length})
              </span>
              <span className="text-xs font-medium text-secondary">
                Select to Watch
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {testimonials.map((t, idx) => {
                const vid =
                  t.youtube_video_id ||
                  (t.youtube_url ? parseYouTubeUrl(t.youtube_url)?.videoId : "dQw4w9WgXcQ");
                const thumb = t.thumbnail_url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                const isSelected = idx === activeReviewIndex;

                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectReview(idx)}
                    type="button"
                    aria-label={`Watch ${t.customer_name}'s review`}
                    aria-pressed={isSelected}
                    className={`p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-left w-full ${
                      isSelected
                        ? "bg-surface-container-high border-red-500/80 shadow-md ring-2 ring-red-500/20"
                        : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant"
                    }`}
                  >
                    {/* Video Thumbnail with Mini Play Badge */}
                    <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-black shrink-0">
                      <Image
                        src={thumb}
                        alt={`${t.customer_name} video thumbnail`}
                        fill
                        sizes="96px"
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center" aria-hidden="true">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                            isSelected ? "bg-red-600 text-white" : "bg-black/70 text-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px] ml-0.5" aria-hidden="true">play_arrow</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded uppercase tracking-wider" aria-hidden="true">
                          Playing
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-bold text-xs sm:text-sm truncate ${
                            isSelected ? "text-red-700" : "text-on-surface"
                          }`}
                        >
                          {t.customer_name}
                        </span>
                        <div className="flex text-amber-500 text-xs shrink-0" aria-label={`${t.rating || 5} stars`}>
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[13px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                              aria-hidden="true"
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-secondary truncate">
                        {t.designation ? `${t.designation}, ` : ""}{t.company}
                      </span>

                      <p className="text-xs text-on-surface-variant line-clamp-1 italic mt-0.5">
                        &ldquo;{t.testimonial}&rdquo;
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
