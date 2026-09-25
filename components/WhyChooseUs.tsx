export default function WhyChooseUs() {
  const points = [
    {
      icon: "verified_user",
      iconColor: "text-primary",
      title: "Tested Strength",
      description:
        "Certified tensile ratings, exact thickness calibration, and tested rubber compound abrasion indices.",
    },
    {
      icon: "calculate",
      iconColor: "text-secondary",
      title: "Engineered Sizing",
      description:
        "Assistance with pulley drum diameters, take-up stroke allowances, and transition distance ratios.",
    },
    {
      icon: "timelapse",
      iconColor: "text-tertiary",
      title: "Durable Lifespan",
      description:
        "Minimal elongation properties in EP/NN carcasses, decreasing maintenance retensioning cycles.",
    },
    {
      icon: "quickreply",
      iconColor: "text-primary",
      title: "Rapid Turnaround",
      description:
        "Extensive warehouse inventory in South Ukkadam enabling same-day roll cutting and rapid dispatch.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-lowest py-10 sm:py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-space-xl">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-secondary uppercase tracking-widest font-bold">
                Industrial Integrity
              </span>
              <h2
                className="font-display text-on-surface"
                style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.5rem)", lineHeight: "1.2" }}
              >
                Why Plant Operators Rely on Peeyem
              </h2>
              <p className="font-body-md text-on-surface-variant pt-2">
                We bridge standard manufacturing runs with custom application parameters so your systems avoid unplanned downtime.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-2 pt-6">
              <span className="font-code-spec text-label-sm text-on-surface-variant">
                COIMBATORE HUB DISPATCH
              </span>
              <span className="font-headline-sm text-primary font-bold">
                Immediate Stock Availability
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {points.map((pt) => (
              <div
                key={pt.title}
                className="p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${pt.iconColor} text-[24px]`}>
                    {pt.icon}
                  </span>
                  <h3 className="font-headline-sm text-body-lg font-bold text-on-surface">
                    {pt.title}
                  </h3>
                </div>
                <p className="font-body-sm text-on-surface-variant">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
