import Image from "next/image";
import { COMPANY_INFO } from "@/data/products";

export default function DepotLocationSection() {
  return (
    <section className="w-full py-space-xl bg-surface">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
              Find Us
            </span>
            <h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface tracking-tight mt-1">
              Visit Our Coimbatore Warehouse &amp; Distribution Office
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
              Centrally situated at South Ukkadam Market with immediate access to highway haulage corridors across Tamil Nadu, Kerala, and Karnataka.
            </p>
          </div>
          <a
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex-shrink-0"
            href="https://maps.google.com/?q=MMA+Market+South+Ukkadam+Coimbatore"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Map Display Container */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-surface-container-low border border-outline-variant/20">
          <div className="w-full h-96 lg:h-[460px] relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFlVASimRvzV6NHItPHByRosACkKO0v9jP0yAM7Uq2CFsYnVh66fCk46cBUjElkkMhCy5y7m22v-DGVRsOnwWYqGrj0XRlt_e4jaJVGTZ8-G0QzBRuctnh9uAkhhdcx9H-PfOUxJ7__uV1ZesWrikMEjGDskh4hMLPyV97WG6bDu-8BpYNjHGkrwZevKUj5aDQCv71FJVx6yuCk1tSeFphbH4wSHhMHYWSMq_p96-rvtpS-he0oMAAUg"
              alt="Map view showing Peeyem Traders in South Ukkadam Coimbatore"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Ambient Map Pin Overlay */}
            <div className="absolute inset-0 bg-surface-variant/20 backdrop-blur-[1px] flex items-center justify-center p-space-md pointer-events-none">
              <div className="bg-surface-container-lowest/95 backdrop-blur-md p-space-md lg:p-space-lg rounded-xl shadow-2xl max-w-md w-full pointer-events-auto border border-outline-variant/30">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-[22px]">factory</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Peeyem Traders
                    </h3>
                    <p className="font-code-spec text-code-spec text-primary mt-0.5">
                      Heavy Belting Warehouse &amp; Cutting Bay
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-snug">
                      {COMPANY_INFO.address}
                    </p>
                    <div className="flex items-center gap-space-sm mt-space-sm pt-space-xs">
                      <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-secondary font-bold">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Heavy Truck Bay Active
                      </span>
                      <a
                        className="text-primary font-label-sm text-label-sm hover:underline ml-auto font-semibold"
                        href={COMPANY_INFO.mapsUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Navigate →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Landmark / Transit Info Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 bg-surface-container-high p-space-md gap-space-md text-on-surface border-t border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">local_shipping</span>
              <div>
                <div className="font-label-md text-label-md font-semibold">Direct Truck Access</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Smooth unloading for 40ft container lorries</div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">train</span>
              <div>
                <div className="font-label-md text-label-md font-semibold">Railway Junction Proximity</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">3.5 km from Coimbatore Central Junction</div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">forklift</span>
              <div>
                <div className="font-label-md text-label-md font-semibold">On-Site Slitting &amp; Splicing</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Custom length roll cutting within hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
