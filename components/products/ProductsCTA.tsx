"use client";

import { COMPANY_INFO } from "@/data/products";

interface ProductsCTAProps {
  onRequestQuote: () => void;
}

export default function ProductsCTA({ onRequestQuote }: ProductsCTAProps) {
  return (
    <section className="w-full bg-primary text-on-primary py-space-xl">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-space-lg">
          <div className="max-w-2xl">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-bold">
              Custom Engineering Support
            </span>
            <h2 className="font-headline-lg text-headline-lg text-white tracking-tight mt-1">
              Looking for a Specific Belt Specification or Custom Width?
            </h2>
            <p className="font-body-md text-body-md text-on-primary-container mt-2 leading-relaxed">
              Send us your conveyor center distance, belt width, material bulk density, and drive drum diameter. Our technical desk will provide immediate specification confirmation and pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={onRequestQuote}
              className="w-full sm:w-auto px-space-lg py-space-sm bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md rounded-lg shadow-md hover:bg-tertiary-fixed-dim transition-all flex items-center justify-center gap-space-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">request_quote</span>
              <span>Request Technical Quote</span>
            </button>
            <a
              className="w-full sm:w-auto px-space-lg py-space-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-space-xs font-semibold shadow-sm"
              href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
                "Hello Peeyem Traders, I have custom conveyor specifications for a project quote."
              )}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
