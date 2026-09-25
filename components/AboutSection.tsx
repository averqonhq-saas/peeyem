import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-surface-container-lowest py-10 sm:py-16 lg:py-24" id="about">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-space-xl items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden bg-surface-dim shadow-lg aspect-[16/11]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsKPWW63Qi05s9yRq3dC3WVHs1pOGgG0no6Y3MjGLi_56i0E1p8zpaO-7kfsFuv-Yu9neJZLOpXrIh1susAFnE3H20RCCAK3PHgnuxHqsSUbK5IS2q4a-wD3S4tfBzjGn7Ym2wtX8XA39E11B22DsUBsig1bjBhoX4tg-KUhjsgYSqQBbuWbtAQ7M5IoOIYH-xVrt7jPc0EAKyrkYJGotMwTFgZ7OAMseRPhlvdB9xKByme5YgQppGuA"
                alt="Mineral Crushing Plant Conveyor Belting in Active Operation"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 600px"
                loading="lazy"
              />
            </div>
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-container-lowest/90 backdrop-blur text-primary font-label-sm font-semibold shadow-md">
              <span className="material-symbols-outlined text-[16px] text-secondary">factory</span>
              Field Proven Industrial Reliability
            </div>
          </div>

          {/* Technical Description */}
          <div className="lg:col-span-6 flex flex-col items-start gap-space-sm">
            <span className="font-label-md text-secondary uppercase tracking-widest font-bold">
              About Peeyem Traders
            </span>
            <h2
              className="font-display text-on-surface"
              style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
            >
              Reliable Industrial Products for Demanding Applications
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Headquartered at South Ukkadam, Coimbatore, Peeyem Traders stands as a trusted industrial distributor and fabricator of high-performance conveyor belts, rubber sheets, specialized industrial belting, and comprehensive conveyor accessories.
            </p>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Every specification we supply is backed by certified tensile testing, rigorous compound quality checks, and optimal ply bonding to guarantee maximum uptime across quarries, cement plants, foundries, and bulk transshipment sites.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-space-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface font-semibold">Consistent Tensile Strength</span>
                  <span className="font-body-sm text-on-surface-variant text-[12px]">
                    Tested carcass ratings from 200 to 1200 N/mm.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface font-semibold">Specialized Rubber Grades</span>
                  <span className="font-body-sm text-on-surface-variant text-[12px]">
                    Abrasion (M24/N17), Heat (HR/SHR), and Oil grades.
                  </span>
                </div>
              </div>
            </div>

            <Link
              className="inline-flex items-center gap-2 mt-space-sm text-primary font-label-md font-bold hover:text-primary-container transition-colors"
              href="#products"
            >
              <span>Explore Technical Specifications</span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
