import { COMPANY_INFO } from "@/data/products";

export default function DepotServices() {
  return (
    <section className="w-full bg-surface py-space-xl">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl items-center">
          {/* Left Column: Fabrication Details */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-space-xs text-primary mb-2">
              <span className="material-symbols-outlined text-[24px]">construction</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Depot Value-Added Services
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-sm">
              Custom Length Slitting &amp; Splicing at South Ukkadam Depot
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
              Our South Ukkadam distribution yard houses continuous longitudinal belt slitting machinery, calibrated hydraulic punch presses, and certified cold-splicing facilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/10 hover-lift">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">straighten</span>
                <div>
                  <h4 className="font-headline-sm text-sm text-on-surface font-semibold">Precision Millimeter Slitting</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">Custom slit widths cut from wide master rolls with laser-guided edge tracking.</p>
                </div>
              </div>
              <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/10 hover-lift">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">all_inclusive</span>
                <div>
                  <h4 className="font-headline-sm text-sm text-on-surface font-semibold">Pre-Spliced Endless Belts</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">Cold chemical vulcanized endless joints ready for immediate installation upon delivery.</p>
                </div>
              </div>
              <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/10 hover-lift">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">local_shipping</span>
                <div>
                  <h4 className="font-headline-sm text-sm text-on-surface font-semibold">40ft Truck Bay Accessibility</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">Heavy overhead crane loading directly onto regional freight trucks for rapid dispatch.</p>
                </div>
              </div>
              <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/10 hover-lift">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">content_cut</span>
                <div>
                  <h4 className="font-headline-sm text-sm text-on-surface font-semibold">Punch Hole &amp; Bucket Perforation</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">Accurate punch-hole spacing templates for grain elevator elevator bucket mounting.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rapid Turnaround Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-3xl p-space-lg shadow-xl flex flex-col justify-between hover-lift">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/10 text-surface-container-lowest font-label-sm text-label-sm mb-space-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                Fast Technical Turnaround
              </div>
              <h4 className="font-headline-md text-headline-md text-white mb-space-xs font-bold">
                Talk to Coimbatore Belting Specialist
              </h4>
              <p className="font-body-md text-body-md text-on-primary-container mb-space-lg leading-relaxed">
                Have specific conveyor parameters, load capacity requirements, or emergency belt breakdown needs? Speak directly with our technical desk in South Ukkadam.
              </p>
            </div>

            <div className="flex flex-col gap-space-sm">
              <a
                className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all"
                href={`tel:${COMPANY_INFO.phoneRaw}`}
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Direct Desk Line</span>
                    <p className="font-headline-sm text-headline-sm leading-none font-bold text-on-surface">{COMPANY_INFO.phone}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </a>

              <div className="p-space-sm rounded-xl bg-on-primary/10 text-on-primary text-xs flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container">location_on</span>
                <span>{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
