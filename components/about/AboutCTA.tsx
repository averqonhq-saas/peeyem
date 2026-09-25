import Link from "next/link";
import { COMPANY_INFO } from "@/data/products";

export default function AboutCTA() {
  return (
    <section className="w-full bg-primary relative overflow-hidden py-16 lg:py-20 text-on-primary">
      {/* Subtle technical grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="cta-grid" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1"></path>
            </pattern>
          </defs>
          <rect fill="url(#cta-grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-margin-mobile lg:px-margin text-center flex flex-col items-center gap-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
          <span>Ready For Deployment</span>
        </div>

        <h2 className="font-headline-lg text-headline-lg lg:text-display text-surface-container-lowest tracking-tight max-w-3xl leading-tight">
          Looking for the Right Industrial Product?
        </h2>

        <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl leading-relaxed">
          Explore our comprehensive product range or contact Peeyem Traders with your exact operational requirements and dimensional parameters.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md text-label-md font-bold shadow-lg hover:bg-tertiary-fixed transition-all group"
            href="/#contact"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Contact Us</span>
          </Link>
          <Link
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-md text-label-md transition-all"
            href="/#products"
          >
            <span className="material-symbols-outlined text-[20px]">list_alt</span>
            <span>View Products</span>
          </Link>
        </div>

        <div className="pt-6 flex items-center gap-6 text-on-primary-container font-code-spec text-code-spec">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {COMPANY_INFO.address.split(",")[1]?.trim()}, Coimbatore
          </span>
          <span className="hidden sm:inline">•</span>
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="hidden sm:flex items-center gap-1.5 hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            {COMPANY_INFO.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
