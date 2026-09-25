"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { COMPANY_INFO } from "@/data/products";
import { dbService } from "@/lib/db";
import { DbProduct } from "@/types/admin";
import ProductRFQModal from "./ProductRFQModal";

interface ProductCatalogGridProps {
  searchQuery: string;
}

export default function ProductCatalogGrid({
  searchQuery,
}: ProductCatalogGridProps) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modalProduct, setModalProduct] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<DbProduct | null>(null);

  useEffect(() => {
    // Real-Time subscription for products
    const unsubscribe = dbService.subscribeProducts((list) => {
      // Only active products appear on the public catalog
      const activeList = list.filter((p) => p.is_active);
      setProducts(activeList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Extract unique categories dynamically from active products
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category_id))).filter(Boolean);

  const filteredProducts = products.filter((prod) => {
    if (selectedCategory !== "all" && prod.category_id !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        prod.name.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.short_description?.toLowerCase().includes(q) ||
        prod.specifications?.some(
          (s) =>
            s.key.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );
      if (!match) return false;
    }

    return true;
  });

  return (
    <>
      {/* Category Filter Pills & View Mode Bar */}
      <section className="w-full bg-surface-container-lowest border-y border-outline-variant/30 sticky top-16 z-30 backdrop-blur-md bg-white/95">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-primary text-on-primary shadow-sm scale-[1.02]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              All Series ({products.length})
            </button>

            {uniqueCategories.map((cat) => {
              const count = products.filter((p) => p.category_id === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? "bg-primary text-on-primary shadow-sm scale-[1.02]"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat ? "bg-white/20 text-white" : "bg-black/10 text-slate-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: View Switcher (Grid vs Technical Table) */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">
              Layout:
            </span>
            <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Card Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span className="hidden sm:inline pr-1">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Technical Specifications Table View"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
                <span className="hidden sm:inline pr-1">Specs Table</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="w-full py-8 lg:py-12 bg-surface-container-lowest" id="catalog-grid">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
          {/* Header count indicator */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/30">
            <div className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
              <span>Showing</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {filteredProducts.length}
              </span>
              <span>industrial specifications</span>
              {selectedCategory !== "all" && (
                <span className="text-xs font-normal text-slate-500">
                  in &ldquo;{selectedCategory}&rdquo;
                </span>
              )}
            </div>

            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">clear_all</span>
                <span>Reset Category Filter</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center text-on-surface-variant">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-semibold">Synchronizing industrial product catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/30 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">search_off</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface text-lg">No Products Found</h3>
              <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
                No active conveyor belting or rubber sheet specifications match your current search query. Try broadening your terms or reset the filters.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="mt-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer hover:bg-primary-container transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* =========================================
               CARD GRID VIEW
               ========================================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((prod, index) => {
                const whatsappUrl = `https://wa.me/${COMPANY_INFO.phoneRaw.replace("+", "")}?text=${encodeURIComponent(
                  `Hello Peeyem Traders, I would like to request a quotation for: ${prod.name} (${prod.category_id}). Please provide pricing, stock availability, and technical datasheet.`
                )}`;

                return (
                  <div
                    key={prod.id}
                    className="flex flex-col rounded-3xl overflow-hidden bg-white border border-outline-variant/30 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
                  >
                    {/* Image Area */}
                    <div
                      className="relative aspect-[16/10] w-full bg-surface-dim overflow-hidden cursor-pointer"
                      onClick={() => setDetailProduct(prod)}
                    >
                      {prod.image_url ? (
                        <Image
                          src={prod.image_url}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-5xl">inventory_2</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-primary text-on-primary shadow-md">
                          {prod.category_id}
                        </span>

                        {prod.is_featured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ff8d28] text-slate-950 flex items-center gap-1 shadow-md">
                            <span className="material-symbols-outlined text-xs">star</span>
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      {/* Price / Quote Ribbon */}
                      {prod.price_range && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-amber-300 font-mono text-xs font-bold shadow-lg border border-white/10">
                          {prod.price_range}
                        </div>
                      )}

                      {/* Click overlay hint */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>Quick Specs</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h3
                          className="font-headline-sm font-bold text-on-surface text-base group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                          onClick={() => setDetailProduct(prod)}
                        >
                          {prod.name}
                        </h3>

                        <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {prod.short_description || prod.description}
                        </p>

                        {/* Specifications Pills */}
                        {prod.specifications && prod.specifications.length > 0 && (
                          <div className="pt-3 border-t border-outline-variant/30 space-y-1.5">
                            {prod.specifications.slice(0, 3).map((spec, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-0.5"
                              >
                                <span className="text-on-surface-variant font-medium text-[11px]">{spec.key}:</span>
                                <span className="font-bold text-on-surface text-[11px] font-mono text-right truncate max-w-[180px]">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setModalProduct(prod.name)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">request_quote</span>
                          <span>Request RFQ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDetailProduct(prod)}
                          className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                          title="View Technical Specifications"
                        >
                          <span className="material-symbols-outlined text-base">info</span>
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-md"
                          title="Instant WhatsApp Technical Quote"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* =========================================
               TECHNICAL SPECIFICATION TABLE VIEW
               ========================================= */
            <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-white shadow-sm animate-fade-in">
              <table className="w-full text-left text-xs text-on-surface border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant/30">
                  <tr>
                    <th scope="col" className="p-4">Product &amp; Visual</th>
                    <th scope="col" className="p-4">Category</th>
                    <th scope="col" className="p-4">Key Specifications</th>
                    <th scope="col" className="p-4">Est. Rate / Stock</th>
                    <th scope="col" className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredProducts.map((prod) => {
                    const whatsappUrl = `https://wa.me/${COMPANY_INFO.phoneRaw.replace("+", "")}?text=${encodeURIComponent(
                      `Hello Peeyem Traders, I would like to request an official quote for: ${prod.name} (${prod.category_id}).`
                    )}`;

                    return (
                      <tr key={prod.id} className="hover:bg-surface-container-lowest/70 transition-colors">
                        {/* Product & Visual */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-dim shrink-0 border border-outline-variant/20 cursor-pointer"
                              onClick={() => setDetailProduct(prod)}
                            >
                              {prod.image_url ? (
                                <Image
                                  src={prod.image_url}
                                  alt={prod.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className="font-bold text-on-surface hover:text-primary transition-colors cursor-pointer text-sm"
                                onClick={() => setDetailProduct(prod)}
                              >
                                {prod.name}
                              </span>
                              <span className="text-[11px] text-on-surface-variant line-clamp-1 max-w-xs">
                                {prod.short_description || prod.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-surface-container text-primary border border-primary/20">
                            {prod.category_id}
                          </span>
                        </td>

                        {/* Specifications */}
                        <td className="p-4">
                          <div className="space-y-1">
                            {prod.specifications?.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="text-[11px]">
                                <span className="text-on-surface-variant">{s.key}: </span>
                                <span className="font-semibold text-on-surface">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Price / Stock */}
                        <td className="p-4">
                          <div className="font-mono font-bold text-amber-700 text-xs">
                            {prod.price_range || "On Request"}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-medium">Ready Stock</span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setModalProduct(prod.name)}
                              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-colors cursor-pointer"
                            >
                              RFQ
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailProduct(prod)}
                              className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                              title="Specs"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                              title="WhatsApp"
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail / Quick Specs Modal */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image Banner */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
              {detailProduct.image_url ? (
                <Image
                  src={detailProduct.image_url}
                  alt={detailProduct.name}
                  fill
                  sizes="650px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-6xl">inventory_2</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary text-on-primary">
                  {detailProduct.category_id}
                </span>
                <h3 className="font-headline-sm text-xl font-bold mt-1 text-white">
                  {detailProduct.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Product Overview
                </h4>
                <p className="text-sm text-on-surface leading-relaxed">
                  {detailProduct.description}
                </p>
              </div>

              {/* Specifications Table */}
              {detailProduct.specifications && detailProduct.specifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Technical Specifications
                  </h4>
                  <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-outline-variant/20">
                        {detailProduct.specifications.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-surface-container-low/40" : "bg-white"}>
                            <td className="p-3 font-semibold text-on-surface-variant w-1/3">{spec.key}</td>
                            <td className="p-3 font-bold text-on-surface font-mono">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Price & Lead time */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">Estimated Pricing</span>
                  <span className="font-mono text-base font-bold text-amber-700">
                    {detailProduct.price_range || "Official Quote on Request"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">Stock Status</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Immediate Dispatch Depot
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const name = detailProduct.name;
                    setDetailProduct(null);
                    setModalProduct(name);
                  }}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-base">request_quote</span>
                  <span>Request RFQ for this Item</span>
                </button>

                <a
                  href={`https://wa.me/${COMPANY_INFO.phoneRaw.replace("+", "")}?text=${encodeURIComponent(
                    `Hello Peeyem Traders, I would like full technical details and pricing for: ${detailProduct.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Quotation Modal */}
      <ProductRFQModal
        productName={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
      />
    </>
  );
}
