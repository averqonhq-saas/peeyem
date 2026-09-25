import Image from "next/image";
import Link from "next/link";

export default function ProductFocus() {
  return (
    <section className="w-full bg-surface-container-lowest py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Specialized Inventory
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Our Product Focus
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Targeted material-handling solutions engineered for operational durability across high-demand industrial environments.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-primary-container transition-colors group font-semibold"
            href="/#products"
          >
            <span>Complete Catalog</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 4 Product Focus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Conveyor Belts */}
          <div className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-outline-variant/20">
            <div className="flex flex-col gap-4">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-container relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3_buoWxyGzU0ywanzn2SfpTbj0BG58YmEAibe81SezkIC7p66a6YkCyZ0LMP8DWviLA-Volznrco0P2Jf_nlYKKp5UL2prH6f9WDqEZoMA8HJ0wrdy3ds67awsVVChnVIh3A9E8SUuRF1Ih_Piqb28KHxd79W7Wm9ekOz0s2MmJWRwItkAG8H2zsAPgelghoyQs9Ay_Wgy88mNzg7jNVmH1hzafBNkmVwr-PpIKQa95hHAUpIg4gXDA"
                  alt="Long heavy-duty industrial conveyor system carrying crushed rock"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-label-sm font-label-sm text-primary font-bold">
                  CORE RANGE
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  Conveyor Belts
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Reliable conveyor belt products for heavy-duty material handling requirements across mining, aggregate, and manufacturing lines.
                </p>
              </div>
            </div>
            <Link
              href="/#products"
              className="pt-5 mt-4 flex items-center justify-between text-primary font-label-md text-label-md"
            >
              <span>Explore Category</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Card 2: Rubber Products */}
          <div className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-outline-variant/20">
            <div className="flex flex-col gap-4">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-container relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs7yTSXlzcVax7PnNCQvjTa6XDREv5oH9E4W48DlxLVJNI8q_qpUogVXA1GT3kf76303hv0Xn82TgcRTpxxZTGo2xwXWNzbDUXOaRmXBQwx50MKroHRm4VWUr9s15xjl3Y-QWEamUWSHLIlt31KZKr4PxznfDzpxama7jNdbiFJHD-_J2al4GYniaTi5SLn-q1S7-Hn-yUj1HJ3HBkDRzLT-iwxELFZtmMVvxN1vtpFKDwcMig2Lcx-A"
                  alt="Neatly arranged rolls of black industrial rubber sheets"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-label-sm font-label-sm text-secondary font-bold">
                  SHEET &amp; LINING
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                  Rubber Products
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  High-grade rubber sheets, skirting rolls, and wear-resistant liners designed for impact damping, chutes, and hopper protection.
                </p>
              </div>
            </div>
            <Link
              href="/#products"
              className="pt-5 mt-4 flex items-center justify-between text-secondary font-label-md text-label-md"
            >
              <span>Explore Category</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Card 3: Specialized Belts */}
          <div className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-outline-variant/20">
            <div className="flex flex-col gap-4">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-container relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7boiATdF2nuBkfN6smt5axi7rtZDJ64cB5-lSMKQboPyumzeQXQIZ3NpGcmu6pJvjKEvv4gUp4qWf_GGK-owP-qwsnZwVQBPCZg0Iczu68Fyf0wW7guTn6cFw3CGYVk-xQ342qs2NIPZ_JuYUQ3BrfcjxGbHBZCRKs0PJPNZ3cYfOgq5S9P5sF0MzIj2EmnlPRZZEd7HKwodlNEm7raOhtkd0a32mXMicCEzKyTggSHiEI6aY1tIcog"
                  alt="Closeup view of a chevron pattern molded industrial conveyor belt roll"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-label-sm font-label-sm text-tertiary font-bold">
                  SPECIALIZED
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-tertiary transition-colors">
                  Specialized Belts
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Steep-angle chevron belts, cleated profiles, heat-resistant, and oil-resistant belts custom tailored to specific process demands.
                </p>
              </div>
            </div>
            <Link
              href="/#products"
              className="pt-5 mt-4 flex items-center justify-between text-tertiary font-label-md text-label-md"
            >
              <span>Explore Category</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Card 4: Conveyor Accessories */}
          <div className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-outline-variant/20">
            <div className="flex flex-col gap-4">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-container-low flex flex-col items-center justify-center p-4 relative">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-[32px]">hardware</span>
                </div>
                <span className="font-code-spec text-code-spec text-primary font-semibold">
                  Fasteners &amp; Hardware
                </span>
                <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-label-sm font-label-sm text-primary font-bold">
                  HARDWARE
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  Conveyor Accessories
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Supporting products such as mechanical belt fasteners, cold-vulcanizing cement, rubber skirtings, and roller accessories.
                </p>
              </div>
            </div>
            <Link
              href="/#products"
              className="pt-5 mt-4 flex items-center justify-between text-primary font-label-md text-label-md"
            >
              <span>Explore Category</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
