"use client";

import { useState } from "react";
import Image from "next/image";
import ProductRFQModal from "@/components/products/ProductRFQModal";

interface IndustryApp {
  id: string;
  title: string;
  category: string;
  icon: string;
  recommendedBelt: string;
  description: string;
}

const ALL_APPLICATIONS: IndustryApp[] = [
  {
    id: "stone-crushing",
    title: "Stone Crushing Units",
    category: "Stone Crushing",
    icon: "terrain",
    recommendedBelt: "Rubber Conveyor Belt (M24 / N17) & V-Belts",
    description: "Heavy aggregate, quartzite, and granite rock conveying with high impact gouge resistance and durable power transmission.",
  },
  {
    id: "coir-units",
    title: "Coir Units",
    category: "Coir Industry",
    icon: "agriculture",
    recommendedBelt: "Rubber & PVC Conveyor Belts",
    description: "Handling loose coir pith, coconut husks, fiber extraction, and baling processes with high abrasion tolerance.",
  },
  {
    id: "cotton-mills",
    title: "Cotton Mills",
    category: "Cotton Mills",
    icon: "factory",
    recommendedBelt: "High-Torque V-Belts & Transmission Belting",
    description: "Precision spinning frames, carding engines, and blow room machinery requiring steady high-torque transmission.",
  },
  {
    id: "appalam-machines",
    title: "Appalam-Making Machines",
    category: "Food Machinery",
    icon: "bakery_dining",
    recommendedBelt: "Food Grade PU Conveyor Belt",
    description: "Non-toxic, FDA compliant white PU belts engineered for thin papad dough pressing, rolling, and automated drying lines.",
  },
  {
    id: "chapati-machines",
    title: "Chapati Machines",
    category: "Food Machinery",
    icon: "restaurant",
    recommendedBelt: "Food Grade PU Conveyor Belt",
    description: "Non-stick food contact surfaces engineered to resist hot dough oils and continuous commercial roti rolling cycles.",
  },
  {
    id: "parotta-machines",
    title: "Parotta Machines",
    category: "Food Machinery",
    icon: "lunch_dining",
    recommendedBelt: "Oil-Resistant PU Conveyor Belt",
    description: "High oil and edible fat resistance designed for multi-layer dough sheet stretching, oil coating, and shaping equipment.",
  },
  {
    id: "mushroom-transportation",
    title: "Mushroom Transportation",
    category: "Food Machinery",
    icon: "psychology_alt",
    recommendedBelt: "Hygienic PVC Conveyor Belt",
    description: "Smooth, cleanable moisture-resistant surfaces ensuring gentle transfer and zero bruising for delicate harvested mushrooms.",
  },
  {
    id: "carrot-transportation",
    title: "Carrot Transportation",
    category: "Material Handling",
    icon: "eco",
    recommendedBelt: "Water-Resistant Cleated PVC Belt",
    description: "Handling washed root vegetables through sorting troughs and incline de-watering conveyors with anti-slip grip.",
  },
  {
    id: "material-handling",
    title: "Material Handling",
    category: "Material Handling",
    icon: "conveyor_belt",
    recommendedBelt: "Industrial Rubber & PVC Belts",
    description: "General warehouse logistics, bag conveying, carton sortation, bulk hopper feeds, and factory transfer tables.",
  },
];

const FINDER_CATEGORIES = [
  { id: "Stone Crushing", label: "Stone Crushing", icon: "terrain" },
  { id: "Cotton Mills", label: "Cotton Mills", icon: "factory" },
  { id: "Coir Industry", label: "Coir Industry", icon: "agriculture" },
  { id: "Food Machinery", label: "Food Machinery", icon: "restaurant" },
  { id: "Material Handling", label: "Material Handling", icon: "local_shipping" },
  { id: "Other Applications", label: "Other Applications", icon: "category" },
];

const FINDER_PRODUCTS: Record<string, Array<{ name: string; grade: string; image: string; desc: string }>> = {
  "Stone Crushing": [
    {
      name: "Rubber Conveyor Belt (M24 Grade)",
      grade: "M24 Severe Wear Grade",
      image: "/images/products/rubber-conveyor-belt.jpg",
      desc: "Designed for high-impact granite rocks, primary crushers, and screen discharge hoppers.",
    },
    {
      name: "Industrial V-Belt",
      grade: "Classical & Wedge SPB / SPC",
      image: "/images/products/v-belt.jpg",
      desc: "High-torque transmission belts for jaw crushers, cone crushers, and vibrating screens.",
    },
  ],
  "Cotton Mills": [
    {
      name: "Industrial V-Belt",
      grade: "A, B, C Sections & Wedge",
      image: "/images/products/v-belt.jpg",
      desc: "Reliable power transmission with minimal stretch for spinning frames and ring frames.",
    },
    {
      name: "Rubber Sheet",
      grade: "Commercial & Insertion Grade",
      image: "/images/products/rubber-sheet.jpg",
      desc: "Machine foundation pads and vibration damping pads for textile looms and spinning units.",
    },
  ],
  "Coir Industry": [
    {
      name: "Rubber Conveyor Belt (N17 Grade)",
      grade: "N17 Moderate Abrasion",
      image: "/images/products/rubber-conveyor-belt.jpg",
      desc: "Continuous transport of coconut husks, raw coir fiber, and wet pith cakes.",
    },
    {
      name: "PVC Conveyor Belt",
      grade: "Diamond Grip Profile",
      image: "/images/products/pvc-conveyor-belt.jpg",
      desc: "High-grip transport for baled coir blocks, horticultural peat bricks, and sorted fiber.",
    },
  ],
  "Food Machinery": [
    {
      name: "PU Conveyor Belt",
      grade: "Food Grade (FDA Compliant)",
      image: "/images/products/pu-conveyor-belt.jpg",
      desc: "Non-stick, oil-resistant belting for appalam, chapati, parotta, and bakery automation lines.",
    },
    {
      name: "PVC Conveyor Belt (White)",
      grade: "Food-Safe Smooth Finish",
      image: "/images/products/pvc-conveyor-belt.jpg",
      desc: "Sanitary white belting for mushroom, carrot, and fresh agricultural produce grading.",
    },
  ],
  "Material Handling": [
    {
      name: "Rubber Conveyor Belt",
      grade: "Multi-ply EP Fabric Carcass",
      image: "/images/products/rubber-conveyor-belt.jpg",
      desc: "Bulk loading, truck unloading, cement bag transit, and heavy factory logistics.",
    },
    {
      name: "PVC Conveyor Belt",
      grade: "Anti-Static Smooth Top",
      image: "/images/products/pvc-conveyor-belt.jpg",
      desc: "Low-noise sorting lines, assembly conveyors, and parcel distribution belts.",
    },
  ],
  "Other Applications": [
    {
      name: "Cow Mat",
      grade: "17mm - 25mm Heavy Duty",
      image: "/images/products/cow-mat.jpg",
      desc: "Vulcanized anti-slip rubber comfort flooring for dairy barns and livestock housing.",
    },
    {
      name: "Tarpaulin",
      grade: "100% Waterproof Heavy Duty",
      image: "/images/products/tarpaulin.jpg",
      desc: "Protective outdoor yard covers for stored raw materials, machinery, and open cargo trucks.",
    },
    {
      name: "Mud Flap",
      grade: "Reinforced Truck Grade",
      image: "/images/products/mud-flap.jpg",
      desc: "Heavy molded rubber splash guards for commercial tippers, dumpers, and trailers.",
    },
  ],
};

export default function Applications() {
  const [selectedFinderCategory, setSelectedFinderCategory] = useState("Stone Crushing");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState("Rubber Conveyor Belt");
  const [modalApp, setModalApp] = useState("Stone Crushing");

  const handleOpenEnquiry = (productName: string, appName: string) => {
    setModalProduct(productName);
    setModalApp(appName);
    setModalOpen(true);
  };

  const matchingProducts = FINDER_PRODUCTS[selectedFinderCategory] || FINDER_PRODUCTS["Stone Crushing"];

  return (
    <>
      {/* 1. BUILT FOR YOUR INDUSTRY SECTION */}
      <section className="w-full bg-slate-50 py-14 sm:py-20 lg:py-28 border-b border-slate-200/80" id="applications">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
              Industry Applications
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Built for Your Industry
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Engineered belting and vulcanized rubber solutions configured for high-velocity aggregate quarries, food processing lines, and regional manufacturing plants.
            </p>
          </div>

          {/* 9 Modern Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_APPLICATIONS.map((app) => (
              <div
                key={app.id}
                className="group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center transition-colors group-hover:bg-amber-500 group-hover:text-slate-950">
                      <span className="material-symbols-outlined text-[26px]">{app.icon}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {app.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {app.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {app.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Recommended Belt</span>
                    <span className="block text-xs font-bold text-slate-800 truncate">{app.recommendedBelt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEnquiry(app.recommendedBelt, app.title)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 transition-colors shrink-0"
                    title={`Enquire for ${app.title}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. PRODUCT FINDER: "What do you need a belt for?" */}
      <section className="w-full bg-white py-14 sm:py-20 lg:py-24 border-b border-slate-200/80" id="product-finder">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider mb-2">
              Interactive Product Finder
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What do you need a belt for?
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Select your specific industry operation below to view tailored conveyor belts and request an instant quotation.
            </p>
          </div>

          {/* Selectable Filter Options */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {FINDER_CATEGORIES.map((cat) => {
              const isActive = selectedFinderCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFinderCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Matching Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {matchingProducts.map((prod, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 200px"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1 w-full gap-3 text-left">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {prod.grade}
                    </span>
                    <h4 className="text-lg font-black text-slate-900">{prod.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{prod.desc}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(prod.name, selectedFinderCategory)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Send Enquiry for {selectedFinderCategory}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Enquiry Modal */}
      <ProductRFQModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={modalProduct}
        applicationName={modalApp}
      />
    </>
  );
}
