"use client";

import { useState } from "react";
import ProductsHero from "./ProductsHero";
import ProductCatalogGrid from "./ProductCatalogGrid";
import DepotServices from "./DepotServices";
import ProductsCTA from "./ProductsCTA";
import ProductRFQModal from "./ProductRFQModal";

export default function ProductsClientWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  const scrollToGrid = () => {
    const el = document.getElementById("catalog-grid") || document.getElementById("product-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <ProductsHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={scrollToGrid}
      />
      <ProductCatalogGrid searchQuery={searchQuery} />
      <DepotServices />
      <ProductsCTA onRequestQuote={() => setCtaModalOpen(true)} />

      <ProductRFQModal
        productName="Custom Engineered Belt Specification"
        isOpen={ctaModalOpen}
        onClose={() => setCtaModalOpen(false)}
      />
    </>
  );
}
