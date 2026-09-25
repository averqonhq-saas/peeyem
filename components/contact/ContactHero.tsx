import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "@/data/products";

export default function ContactHero() {
  return (
    <>
      {/* Top Technical Indicator Bar */}
      <section className="w-full bg-surface-container-high text-on-surface-variant py-2">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-wrap items-center justify-between text-body-sm font-body-sm gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-code-spec text-code-spec uppercase tracking-wider text-on-surface font-semibold">
              Coimbatore Central Logistics Depot: Stock Active
            </span>
          </div>
          <div className="flex items-center gap-space-md font-code-spec text-code-spec">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
              Mon–Sat 9:00 AM – 7:30 PM
            </span>
            <span className="hidden sm:inline-block text-outline-variant">/</span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
              Rapid 2hr Quote TAT
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full bg-surface py-space-xl lg:py-16">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-wider mb-space-sm">
                <span className="material-symbols-outlined text-[15px] text-primary">engineering</span>
                <span>Contact Peeyem Traders</span>
              </div>

              <h1 className="font-display text-headline-lg lg:text-display text-on-surface tracking-tight leading-tight mb-space-sm">
                Let&apos;s Discuss Your Requirement
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg leading-relaxed">
                Have a product requirement or need technical sizing advice? Connect directly with our material handling specialists in Coimbatore for stock availability, engineered specs, and bulk quotations.
              </p>

              <div className="flex flex-wrap items-center gap-space-sm w-full sm:w-auto">
                <Link
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-primary-container transition-all"
                  href="#enquiry-form"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Submit RFQ Form</span>
                </Link>
                <a
                  className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-container text-secondary font-label-md text-label-md hover:bg-surface-variant transition-all"
                  href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
                    "Hello Peeyem Traders, I have an industrial belt enquiry."
                  )}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">chat</span>
                  <span>Fast WhatsApp Sizing</span>
                </a>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-space-md w-full pt-space-xl mt-space-md border-t border-outline-variant/30">
                <div>
                  <div className="font-headline-md text-headline-md text-primary font-bold">1000+</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Standard Belts in Stock</div>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-secondary font-bold">24 Hrs</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Dispatch Readiness</div>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-tertiary font-bold">35+ Yrs</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Tamil Nadu Industrial Trust</div>
                </div>
              </div>
            </div>

            {/* Hero Right Column (Showcase Card) */}
            <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
              <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl border border-outline-variant/20">
                {/* Product Preview Tag */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Direct Enquiry Desk • Coimbatore Warehouse
                  </span>
                </div>

                {/* Heavy Duty Belt Photo */}
                <div className="h-80 w-full overflow-hidden relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwoWFXn4634ASPGUiMwNiGsjUFDow2Z3kVhuPb--X-nTOuTkWXxwI8rAFe9fW8l-SX5tym2jlFdQHq7S09tirKBVOsGmYCK7NcQKipdSVnfaOVJpvwu0Dz___etMcQ0e_AWQ9c28BsvtHqvXffgKafL05y-UizZSSnAffOP1hYnc1SFL7jKYmdN-2_XvTQzpR24SfVeiDDeCkhF2MH_m-MYznmbM5lv4Vvqb1JWpnbDeCiIfHzaReRfw"
                    alt="Heavy industrial conveyor belt drum in clean modern industrial warehouse Coimbatore"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-inverse-on-surface">
                    <p className="font-code-spec text-code-spec text-secondary-fixed">
                      CHEVRON BELTING 1000MM WIDTH
                    </p>
                    <p className="font-headline-sm text-headline-sm text-surface-bright font-bold">
                      South Ukkadam Ready Inventory
                    </p>
                  </div>
                </div>

                {/* Bottom micro detail strip */}
                <div className="p-space-md bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                    <span>Immediate pickup &amp; interstate road cargo available</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold uppercase">
                    Grade A Belts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
