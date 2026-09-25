"use client";

import { useState } from "react";
import Image from "next/image";
import { useParallax3D } from "@/hooks/useParallax3D";
import ProductRFQModal from "@/components/products/ProductRFQModal";

export default function FeaturedProduct() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("M24 Grade");

  const containerRef = useParallax3D<HTMLElement>({
    maxTilt: 6,
    maxTranslate: 14,
    scrollFactor: 0.08,
    smoothing: 0.08,
    glare: true,
    deviceOrientation: true,
  });

  const GRADES = [
    {
      id: "m24",
      grade: "M24 GRADE",
      title: "Severe Abrasion Resistant",
      description:
        "High tensile rubber compound formulated for extreme gouging, granite stones, sharp aggregate rocks, and high-impact crushing plants.",
      badge: "Heavy Quarry Duty",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      spec: "Tensile: >24 MPa | Abrasion Loss: <150 mm³",
    },
    {
      id: "n17",
      grade: "N17 GRADE",
      title: "Moderate to Heavy Duty",
      description:
        "Engineered for sand, gravel, crushed limestone, cement clinker, bauxite, and general industrial bulk materials.",
      badge: "Industrial Standard",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      spec: "Tensile: >17 MPa | Abrasion Loss: <200 mm³",
    },
    {
      id: "shr",
      grade: "SHR GRADE",
      title: "Super Heat Resistant",
      description:
        "Compounded with synthetic heat-resistant elastomers to withstand extreme continuous material temperatures up to 180°C - 200°C.",
      badge: "High Temp Up to 200°C",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
      spec: "Continuous 180°C | Peak 200°C",
    },
    {
      id: "hr",
      grade: "HR GRADE",
      title: "Heat Resistant",
      description:
        "Designed for hot foundry sand, pellet plants, boiler ash, and chemical processing with continuous operating temperature up to 125°C - 150°C.",
      badge: "Heat Rated 125°C",
      badgeColor: "bg-orange-100 text-orange-900 border-orange-300",
      spec: "Continuous 125°C | Peak 150°C",
    },
  ];

  return (
    <>
      <section
        ref={containerRef}
        className="w-full bg-white py-14 sm:py-20 lg:py-28 preserve-3d border-b border-slate-200/80 overflow-hidden"
        id="rubber-conveyor-section"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
              Dedicated Product Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Rubber Conveyor Belt
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Precision multi-ply industrial rubber belting engineered to withstand heavy impact, continuous tensile stress, and severe abrasion across quarry, cement, and industrial operations.
            </p>
          </div>

          {/* 3D Stage: 4 Floating Specification Cards Surrounding the Center Product Image */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center perspective-1000 preserve-3d">
            
            {/* Left 2 Floating Grade Cards */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1 preserve-3d">
              {GRADES.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGrade(item.grade)}
                  className={`p-5 rounded-2xl bg-white border shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                    selectedGrade === item.grade
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                      : "border-slate-200"
                  }`}
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-base font-black text-slate-900">{item.grade}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-amber-600 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    {item.spec}
                  </div>
                </div>
              ))}
            </div>

            {/* Center Main Belt Image (3D Parallax Centerpiece) */}
            <div className="lg:col-span-6 relative flex justify-center items-center order-1 lg:order-2 preserve-3d py-4">
              <div className="parallax-card-3d relative w-full max-w-[500px] rounded-3xl p-3 bg-white shadow-2xl border border-slate-200">
                {/* Dynamic Specular Glare */}
                <div className="parallax-glare absolute inset-0 rounded-3xl z-20 pointer-events-none" aria-hidden="true" />

                <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] preserve-3d">
                  <Image
                    src="/images/products/rubber-conveyor-belt.jpg"
                    alt="Peeyem Traders Heavy Duty Rubber Conveyor Belt Roll"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 500px"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Floating Center Badge */}
                  <div className="parallax-layer-spec absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-amber-600">Active Grade Spec</div>
                      <div className="text-sm font-black text-slate-900">{selectedGrade} Available</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                    >
                      Enquire Grade
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Floating Grade Cards */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-3 preserve-3d">
              {GRADES.slice(2, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGrade(item.grade)}
                  className={`p-5 rounded-2xl bg-white border shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                    selectedGrade === item.grade
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                      : "border-slate-200"
                  }`}
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-base font-black text-slate-900">{item.grade}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-amber-600 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    {item.spec}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Technical Specs & CTA Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full md:w-auto text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Carcass Type</span>
                <p className="text-sm font-black text-slate-900">EP / NN Fabric</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Stock Widths</span>
                <p className="text-sm font-black text-slate-900">300mm - 1600mm</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Edge Finish</span>
                <p className="text-sm font-black text-slate-900">Cut / Molded Edge</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Delivery</span>
                <p className="text-sm font-black text-slate-900">Immediate Depot Stock</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send Enquiry for Rubber Belts</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Enquiry Modal */}
      <ProductRFQModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={`Rubber Conveyor Belt (${selectedGrade})`}
        applicationName="Heavy Quarry & Material Handling"
      />
    </>
  );
}
