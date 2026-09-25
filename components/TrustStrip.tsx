export default function TrustStrip() {
  const items = [
    {
      icon: "conveyor_belt",
      badgeColor: "bg-primary-fixed text-primary",
      title: "Conveyor Belts",
      description: "Heavy duty multi-ply NN & EP fabric compounds.",
    },
    {
      icon: "layers",
      badgeColor: "bg-secondary-fixed text-secondary",
      title: "Rubber Products",
      description: "High-grade natural, neoprene, and nitrile sheets.",
    },
    {
      icon: "precision_manufacturing",
      badgeColor: "bg-tertiary-fixed text-tertiary",
      title: "Industrial Solutions",
      description: "Customized cleating, tracking, and skirt designs.",
    },
    {
      icon: "support_agent",
      badgeColor: "bg-surface-variant text-primary",
      title: "Technical Support",
      description: "Engineering calculations, sizing, and roll splicing.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-6 sm:py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-2.5 rounded-lg ${item.badgeColor} flex-shrink-0`}>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-body-md font-bold text-on-surface">{item.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
