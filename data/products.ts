export interface Product {
  id: string;
  name: string;
  categoryTag: string;
  categoryColor: string;
  specTag: string;
  description: string;
  grades: string[];
  specifications: { key: string; value: string }[];
  applications: string[];
  image: string;
  alt: string;
  whatsappMessage: string;
  detailsLink: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "rubber-conveyor-belt",
    name: "Rubber Conveyor Belt",
    categoryTag: "Heavy Industrial Belting",
    categoryColor: "text-amber-500",
    specTag: "M24 / N17 / SHR / HR",
    description: "Heavy-duty industrial rubber conveyor belting engineered to withstand continuous tensile stress, high impact loads, and abrasive materials encountered in quarry, mining, and bulk material handling operations.",
    grades: ["M24 Grade", "N17 Grade", "SHR Grade", "HR Grade"],
    specifications: [
      { key: "Abrasion Grades", value: "M24 (Severe Wear), N17 (Moderate Wear)" },
      { key: "Heat Resistance", value: "HR (up to 125°C), SHR (up to 180°C - 200°C)" },
      { key: "Carcass Reinforcement", value: "Multi-ply Polyester / Polyamide (EP / NN Fabric)" },
      { key: "Standard Widths", value: "300mm to 1600mm held in depot stock" },
    ],
    applications: ["Stone Crushing Units", "Material Handling", "Coir Units"],
    image: "/images/products/rubber-conveyor-belt.jpg",
    alt: "Heavy Duty Rubber Conveyor Belt Roll on Pallet",
    whatsappMessage: "Hi Peeyem Traders, I am interested in Rubber Conveyor Belts (M24/N17/SHR/HR). Please share pricing and technical specs.",
    detailsLink: "#rubber-conveyor-section",
  },
  {
    id: "pu-conveyor-belt",
    name: "PU Conveyor Belt",
    categoryTag: "Food & Light Industrial",
    categoryColor: "text-blue-500",
    specTag: "FDA Food Grade Compliant",
    description: "Hygienic polyurethane conveyor belting engineered for direct food contact, dough rolling, and confectionery packaging with high oil and chemical resistance.",
    grades: ["Food Grade (FDA)", "Oil & Grease Resistant", "Anti-Bacterial Surface"],
    specifications: [
      { key: "Food Safety", value: "FDA Compliant Non-Toxic Polyurethane" },
      { key: "Surface Finish", value: "Mirror Smooth / Matte White & Sky Blue" },
      { key: "Temperature Range", value: "-20°C to +90°C" },
      { key: "Chemical Resistance", value: "Vegetable Oils, Fats & Wash-down Detergents" },
    ],
    applications: ["Appalam-Making Machines", "Chapati Machines", "Parotta Machines", "Food Machinery"],
    image: "/images/products/pu-conveyor-belt.jpg",
    alt: "Food Grade PU Polyurethane Conveyor Belt on Stainless Steel Line",
    whatsappMessage: "Hi Peeyem Traders, I am looking for food-grade PU Conveyor Belts for food processing machinery. Please share a quote.",
    detailsLink: "#products",
  },
  {
    id: "pvc-conveyor-belt",
    name: "PVC Conveyor Belt",
    categoryTag: "Agro & Logistics Conveying",
    categoryColor: "text-emerald-500",
    specTag: "Anti-Static / Grip Surface",
    description: "Versatile light to medium-duty synthetic belting offering exceptional lateral stability, low noise operation, and wear endurance for sorting, produce handling, and packaging lines.",
    grades: ["Diamond Grip", "Smooth Top", "Anti-Static 2-Ply / 3-Ply"],
    specifications: [
      { key: "Profile Options", value: "Smooth Top, Diamond Grip, Longitudinal Rib" },
      { key: "Anti-Static Properties", value: "ISO 284 Standard Anti-Static Compound" },
      { key: "Color Variants", value: "Industrial Dark Green, White, Petrol Blue" },
      { key: "Fabric Ply", value: "2-Ply & 3-Ply Low-Stretch Polyester Weft" },
    ],
    applications: ["Mushroom Transportation", "Carrot Transportation", "Material Handling", "Coir Units"],
    image: "/images/products/pvc-conveyor-belt.jpg",
    alt: "Industrial PVC Conveyor Belt Roll in Warehouse",
    whatsappMessage: "Hi Peeyem Traders, I need PVC Conveyor Belts for produce and sorting conveyors. Please share details.",
    detailsLink: "#products",
  },
  {
    id: "v-belt",
    name: "V-Belt",
    categoryTag: "Power Transmission",
    categoryColor: "text-amber-500",
    specTag: "High Torque Transmission",
    description: "Industrial power transmission V-belts manufactured with high-modulus polyester cords and heat-resistant polychloroprene rubber for high-torque industrial machinery.",
    grades: ["Classical (A, B, C, D)", "Wedge (SPZ, SPA, SPB, SPC)", "Raw Edge Cogged"],
    specifications: [
      { key: "Sections Available", value: "Classical Sections (A, B, C, D) & Wedge (SPZ to SPC)" },
      { key: "Tensile Member", value: "Treated Low-Elongation Polyester Cord" },
      { key: "Resistance", value: "Anti-Static, Heat & Mineral Oil Resistant" },
      { key: "Standards", value: "IS 2494 / DIN 2215 Standard Compliant" },
    ],
    applications: ["Stone Crushing Units", "Cotton Mills", "Material Handling"],
    image: "/images/products/v-belt.jpg",
    alt: "Industrial Rubber Transmission V-Belts on Workshop Bench",
    whatsappMessage: "Hi Peeyem Traders, I need high-torque industrial V-Belts. Please share available sizes and quotes.",
    detailsLink: "#products",
  },
  {
    id: "cow-mat",
    name: "Cow Mat",
    categoryTag: "Agricultural Rubber Flooring",
    categoryColor: "text-green-500",
    specTag: "Anti-Slip Vulcanized Rubber",
    description: "High-density vulcanized rubber comfort flooring with non-slip hammer/diamond textures, engineered for dairy barn hygiene, joint insulation, and animal welfare.",
    grades: ["Interlocking Tiles", "Straight Edge", "17mm - 25mm Heavy Duty"],
    specifications: [
      { key: "Thickness Range", value: "17mm, 20mm & 25mm Heavy Gauge" },
      { key: "Surface Texture", value: "Hammer Top / Diamond Anti-Skid Grip" },
      { key: "Base Drainage", value: "Micro-groove underside for effluent run-off" },
      { key: "Material", value: "100% High-Density Vulcanized Natural Rubber" },
    ],
    applications: ["Dairy Farms", "Animal Husbandry", "Livestock Sheds"],
    image: "/images/products/cow-mat.jpg",
    alt: "Heavy Duty Vulcanized Rubber Cow Mats for Livestock Barns",
    whatsappMessage: "Hi Peeyem Traders, I am interested in heavy-duty Rubber Cow Mats. Please share sizing and rates.",
    detailsLink: "#products",
  },
  {
    id: "rubber-sheet",
    name: "Rubber Sheet",
    categoryTag: "Industrial Sheeting & Liners",
    categoryColor: "text-slate-600",
    specTag: "1mm to 50mm Thickness",
    description: "Heavy-duty vulcanized industrial rubber sheeting manufactured in smooth and insertion grades for hopper chute lining, gasket cutting, vibration dampening, and floor protection.",
    grades: ["Natural Rubber (NR)", "Neoprene (CR)", "Nitrile (NBR)", "EPDM"],
    specifications: [
      { key: "Thickness Range", value: "1.0mm up to 50.0mm Heavy Slabs" },
      { key: "Compound Types", value: "Commercial NR, Oil-Resistant Nitrile, Weather EPDM" },
      { key: "Insertion Ply", value: "Available with 1-ply / 2-ply Cotton/Nylon Fabric" },
      { key: "Roll Widths", value: "1.0m and 1.2m Standard Width Rolls" },
    ],
    applications: ["Material Handling", "Stone Crushing Units", "Chute & Hopper Liners"],
    image: "/images/products/rubber-sheet.jpg",
    alt: "Industrial Vulcanized Rubber Sheet Inventory Rolls",
    whatsappMessage: "Hi Peeyem Traders, I need Industrial Rubber Sheets. Please share available thicknesses and roll prices.",
    detailsLink: "#products",
  },
  {
    id: "tarpaulin",
    name: "Tarpaulin",
    categoryTag: "Protective Covers",
    categoryColor: "text-blue-600",
    specTag: "100% Waterproof UV Shield",
    description: "Heavy-duty waterproof HDPE and PVC multi-layer protective tarpaulins with heat-welded reinforced hems and rust-free eyelets for open-yard storage and logistics transport.",
    grades: ["HDPE Woven", "PVC Multi-Layer Coated", "UV Stabilized Waterproof"],
    specifications: [
      { key: "Material Grade", value: "Virgin HDPE Woven / PVC Laminated Fabric" },
      { key: "Weather Protection", value: "100% Waterproof & UV Stabilized (No Sun Rot)" },
      { key: "Reinforcement", value: "PP Rope Reinforced Edges & Aluminum Eyelets" },
      { key: "Standard Sizes", value: "Custom cuts and ready stock from 12x12ft to 60x40ft" },
    ],
    applications: ["Open Yard Storage", "Material Handling", "Truck Cargo Covers"],
    image: "/images/products/tarpaulin.jpg",
    alt: "Heavy Duty Waterproof Industrial Blue Tarpaulin Sheet",
    whatsappMessage: "Hi Peeyem Traders, I am looking for Heavy-Duty Industrial Tarpaulins. Please send size options and pricing.",
    detailsLink: "#products",
  },
  {
    id: "mud-flap",
    name: "Mud Flap",
    categoryTag: "Commercial Vehicle Rubber",
    categoryColor: "text-slate-800",
    specTag: "High Impact Molded Rubber",
    description: "Heavy-gauge vulcanized rubber mud flaps designed for commercial tipper trucks, trailers, and earth-moving machinery to block flying stones, road spray, and debris.",
    grades: ["Heavy Commercial Tipper", "Trailer Flaps", "Custom Canvas Reinforced"],
    specifications: [
      { key: "Material", value: "Tear-Resistant Molded Rubber with Fabric Canvas" },
      { key: "Impact Endurance", value: "Withstands Gravel Strike & High-Speed Highway Spray" },
      { key: "Fitting", value: "Pre-punched Mounting Holes for Fast Installation" },
      { key: "Durability", value: "Zero Weather Cracking under Severe Heat & Rain" },
    ],
    applications: ["Commercial Vehicles", "Stone Crushing Units", "Mining Tippers"],
    image: "/images/products/mud-flap.jpg",
    alt: "Heavy Duty Commercial Truck Rubber Mud Flaps",
    whatsappMessage: "Hi Peeyem Traders, I am inquiring about Commercial Vehicle Rubber Mud Flaps. Please share sizes and rates.",
    detailsLink: "#products",
  },
];

export const COMPANY_INFO = {
  name: "Peeyem Traders",
  tagline: "Industrial Conveyor & Rubber Solutions",
  address: "16, M.M.A. Market, South Ukkadam, Coimbatore, Tamil Nadu – 641001",
  phone: "+91 63794 85898",
  phoneRaw: "+916379485898",
  email: "peeyemtraders16@gmail.com",
  mapsUrl: "https://maps.google.com/?q=Peeyem+Traders+South+Ukkadam+Coimbatore",
  logoUrl: "/logo.svg",
};
