export default function OurApproach() {
  const steps = [
    {
      num: "01",
      stepBadge: "bg-surface-container-low text-primary",
      title: "Understand Requirement",
      description:
        "Evaluating bulk material density, ambient temperatures, operating inclination, troughing angles, and structural pulley dimensions.",
    },
    {
      num: "02",
      stepBadge: "bg-surface-container-low text-secondary",
      title: "Identify Suitable Product",
      description:
        "Selecting optimal carcass rating (EP/NN tension fabrics), top/bottom rubber cover grades (M24, N17, HR), and appropriate profile.",
    },
    {
      num: "03",
      stepBadge: "bg-surface-container-low text-primary",
      title: "Provide Product Information",
      description:
        "Furnishing comprehensive technical datasheets, dimensional parameters, splice guidance, and itemized commercial quotations.",
    },
    {
      num: "04",
      stepBadge: "bg-primary text-on-primary",
      title: "Support Enquiry",
      description:
        "Coordinating swift dispatch from our South Ukkadam Coimbatore inventory with consistent post-inquiry and logistics communication.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-lowest py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col gap-14">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Standardized Process
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Our Approach
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A straightforward, technical consultation process ensuring the right belting and rubber specs are configured for every industrial project.
          </p>
        </div>

        {/* Horizontal Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line indicator (Desktop) */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-surface-container-highest z-0"></div>

          {steps.map((step, idx) => (
            <div key={step.num} className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl ${step.stepBadge} font-headline-sm text-headline-sm flex items-center justify-center shadow-sm font-bold`}
                >
                  {step.num}
                </div>
                <span className="lg:hidden font-label-md text-label-md text-on-surface-variant font-semibold">
                  Step {idx + 1}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {step.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
