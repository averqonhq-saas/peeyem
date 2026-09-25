export default function WhyPeeyem() {
  const points = [
    {
      icon: "verified",
      iconTheme: "text-primary group-hover:bg-primary group-hover:text-on-primary",
      title: "Reliable Products",
      description:
        "Consistent quality compound checks, durable fabric carcass bonding, and dimensional precision across all manufactured batches.",
    },
    {
      icon: "tune",
      iconTheme: "text-secondary group-hover:bg-secondary group-hover:text-on-secondary",
      title: "Application-Focused",
      description:
        "Matched precisely to bulk material density, inclination angles, operating temperatures, and structural conveyor load parameters.",
    },
    {
      icon: "shield",
      iconTheme: "text-primary group-hover:bg-primary group-hover:text-on-primary",
      title: "Durable Performance",
      description:
        "Abrasion-resistant rubber covers that minimize longitudinal tearing, withstand heavy impact, and reduce unscheduled plant downtime.",
    },
    {
      icon: "headset_mic",
      iconTheme: "text-secondary group-hover:bg-secondary group-hover:text-on-secondary",
      title: "Customer Support",
      description:
        "Direct communication with knowledgeable personnel, quick local enquiry resolution, and immediate Coimbatore stock verification.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Proven Industrial Partner
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Why Peeyem Traders?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We align technical specifications with plant realities, delivering consistent reliability without overhead complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt) => (
            <div
              key={pt.title}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group border border-outline-variant/20"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center transition-colors ${pt.iconTheme}`}
              >
                <span className="material-symbols-outlined text-[24px]">{pt.icon}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {pt.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
