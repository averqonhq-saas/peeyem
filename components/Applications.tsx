export default function Applications() {
  const applications = [
    {
      icon: "terrain",
      iconColor: "text-primary",
      title: "Mining & Quarry Operations",
      description:
        "Transferring granite, iron ore, crushed stone, and overburden with high-tensile multi-ply EP carcasses.",
    },
    {
      icon: "domain",
      iconColor: "text-secondary",
      title: "Cement & Clinker Handling",
      description:
        "Heat-resistant SHR compounds resisting continuous temperatures up to 200°C in clinker discharges.",
    },
    {
      icon: "agriculture",
      iconColor: "text-tertiary",
      title: "Grain & Agri Processing",
      description:
        "Cleated elevator belts and oil-resistant synthetic covers preventing rancidity and swell in grain silos.",
    },
    {
      icon: "factory",
      iconColor: "text-primary",
      title: "Foundries & Steel Works",
      description:
        "High-puncture resistance belts handling hot casting sand, slag, and heavy metal scrap.",
    },
    {
      icon: "shield",
      iconColor: "text-secondary",
      title: "Chute & Hopper Wear Liners",
      description:
        "Heavy natural rubber sheets absorbing stone impact and dampening severe structural noise.",
    },
    {
      icon: "local_shipping",
      iconColor: "text-tertiary",
      title: "Ports & Logistics Terminals",
      description:
        "High-speed shiploader belts and package distribution conveyor solutions with low rolling resistance.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-10 sm:py-16 lg:py-24" id="applications">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin flex flex-col gap-space-lg">
        <div className="flex flex-col max-w-2xl">
          <span className="font-label-md text-secondary uppercase tracking-widest font-bold text-xs">
            Sectors &amp; Environments
          </span>
          <h2
            className="font-display text-on-surface"
            style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
          >
            Industrial Application Scenarios
          </h2>
          <p className="font-body-md text-on-surface-variant pt-2">
            From high-velocity mineral quarries to precision food and packaging lines, our rubber belts and sheets withstand heavy impact, abrasion, and continuous tension.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {applications.map((app) => (
            <div
              key={app.title}
              className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center ${app.iconColor}`}>
                <span className="material-symbols-outlined text-[28px]">{app.icon}</span>
              </div>
              <h3 className="font-headline-sm text-body-lg font-bold text-on-surface">
                {app.title}
              </h3>
              <p className="font-body-sm text-on-surface-variant">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
