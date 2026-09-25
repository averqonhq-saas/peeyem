import Image from "next/image";
import Link from "next/link";

export default function ProductShowcase() {
  const showcases = [
    {
      badge: "CHEVRON PROFILE",
      title: "Heavy-Duty Chevron Belts",
      description:
        "Integrated V-pattern cleats engineered to transport bulk grain, aggregate, and coal at steep angles up to 40° without product rollback.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCEFx7k55IA317wq6EHUhLVmbSA3ZIzfHPhO5hEOz0wHiSUJQ4E92SFzJc_XbeT3uDxrCRorkiaOe_ljIId4g3PdoPG2Kk2bZOsyZ5x5_IyWW_Rv921lBFU2Xj53elmi1iMQ4rd_k-6ECgOgit-5H0otzoyaAWhFhyR6uAw1yM0MKTP-JaFqT-oR8XHc0n3sHz39MMSIYjcqPZFaipoPUTeknJraGhUtyKLaem4GS3kIBzFNki_55xMHw",
      alt: "Heavy chevron cleated conveyor belt on steel frame mount in clean Coimbatore warehouse",
      themeColor: "group-hover:text-primary",
      linkColor: "text-primary hover:text-primary-container",
    },
    {
      badge: "RUBBER ROLLS",
      title: "Industrial Rubber Sheets & Liners",
      description:
        "Wear-resistant rubber rolls for structural impact beds, chute lining, mechanical gaskets, and skirting rubber for spillage containment.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCDnFb7YoTx5LNt7xohS8xUSH4T2ZRVOhhvuE1qX1dvx7mfHEv79x-CH2CtEcAZeVIq_1I2u_EahJmKgu_N0dxV0r0VKpskcMSCG93SOhA9Xhw_So6Ylnko3UAVk9fdiLETW-jdEt1HnBVSPiP_PlPljar4w9_jMmMVwCSv_dVK5lF-yzKk5OOwVCg0tH83EGyZWZEnkwhIi6dwjrDEmNByOfpuEgVnwKrsVSSbf6wx_JL78Qja9KivwA",
      alt: "Stacked industrial rubber sheet rolls on wooden pallets in bright industrial warehouse",
      themeColor: "group-hover:text-secondary",
      linkColor: "text-secondary hover:text-on-surface",
    },
    {
      badge: "PLANT APPLICATIONS",
      title: "Operational Conveyor Belts",
      description:
        "Continuous-duty belting installations configured for quarry operations, cement processing plants, and bulk bulk transport systems.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAKRrZOPqJXpPSjSrxGVnjmbdildAm2z1wWM1K30xrarsGwnRbGl_XqbBrZuPYttgFjPXUOz8JSH8CYhreB7H_nyyLdGRU0rKdNHRg_nCFMDOl48O-3ICoCtFFQQlNdD0XFB06u0bFTKzjwsToi0WYI2n0pQpvELZJ7U16SiBoH6tH7XmU4ZAKL9999ciOLBOF0tHiIw-UdrOF3GiPPUCefpQEeRLnITsB4-qWdiKmQaKwyQZ-GcYuQRQ",
      alt: "Wide high-capacity industrial conveyor belt running in large aggregate processing facility",
      themeColor: "group-hover:text-primary",
      linkColor: "text-primary hover:text-primary-container",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Inventory Visuals
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Explore Our Products
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              High-resolution view into our core warehouse inventory and industrial material-handling belting.
            </p>
          </div>
        </div>

        {/* Showcase 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcases.map((item) => (
            <div
              key={item.title}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 border border-outline-variant/20"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface px-3 py-1 rounded text-label-sm font-label-sm font-semibold">
                  {item.badge}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className={`font-headline-sm text-headline-sm text-on-surface ${item.themeColor} transition-colors`}>
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <Link
                  className={`inline-flex items-center gap-2 font-label-md text-label-md font-semibold ${item.linkColor} transition-colors`}
                  href="/#products"
                >
                  <span>View Product Details</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Bottom CTA Trigger */}
        <div className="flex justify-center pt-4">
          <Link
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-primary-container transition-all"
            href="/#products"
          >
            <span>View All Products &amp; Specifications</span>
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
