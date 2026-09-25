"use client";

import { useState } from "react";
import ProductsHero from "./ProductsHero";
import ProductCatalogGrid from "./ProductCatalogGrid";
import FeaturedProduct from "@/components/FeaturedProduct";
import Applications from "@/components/Applications";
import DepotServices from "./DepotServices";
import ProductsCTA from "./ProductsCTA";
import ProductRFQModal from "./ProductRFQModal";

export default function ProductsClientWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Industrial Conveyor Belt");
  const [selectedApp, setSelectedApp] = useState("Material Handling");

  const scrollToGrid = () => {
    const el = document.getElementById("catalog-grid") || document.getElementById("product-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenEnquiry = (prod = "Industrial Conveyor Belt", app = "Material Handling") => {
    setSelectedProduct(prod);
    setSelectedApp(app);
    setCtaModalOpen(true);
  };

  return (
    <>
      <ProductsHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={scrollToGrid}
        onSendEnquiry={() => handleOpenEnquiry("Industrial Conveyor Belt", "General Industrial")}
      />
      <ProductCatalogGrid searchQuery={searchQuery} />
      <FeaturedProduct />
      <Applications />
      <DepotServices />
      <ProductsCTA onRequestQuote={() => handleOpenEnquiry("Custom Engineered Belt", "Industrial Material Handling")} />

      <ProductRFQModal
        productName={selectedProduct}
        applicationName={selectedApp}
        isOpen={ctaModalOpen}
        onClose={() => setCtaModalOpen(false)}
      />
    </>
  );
}
