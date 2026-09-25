"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/lib/db";
import { DbProduct, ProductSpecification } from "@/types/admin";
import { uploadToCloudinary } from "@/lib/cloudinary";

const DEFAULT_CATEGORIES = [
  "Carcass NN / EP",
  "Steep Incline",
  "Heavy Wear",
  "HR / SHR / OR",
  "Custom Profiles",
  "Packaging & Sort",
  "Mechanical Splice",
  "System Wear Parts",
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Upload & Save State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    // Real-Time subscription for products
    const unsubscribe = dbService.subscribeProducts((list) => {
      setProducts(list);
      setLoading(false);
    });

    if (searchParams.get("action") === "new") {
      openAddModal();
    }

    return () => unsubscribe();
  }, [searchParams]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(DEFAULT_CATEGORIES[0]);
    setCustomCategory("");
    setShortDescription("");
    setDescription("");
    setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuCEFx7k55IA317wq6EHUhLVmbSA3ZIzfHPhO5hEOz0wHiSUJQ4E92SFzJc_XbeT3uDxrCRorkiaOe_ljIId4g3PdoPG2Kk2bZOsyZ5x5_IyWW_Rv921lBFU2Xj53elmi1iMQ4rd_k-6ECgOgit-5H0otzoyaAWhFhyR6uAw1yM0MKTP-JaFqT-oR8XHc0n3sHz39MMSIYjcqPZFaipoPUTeknJraGhUtyKLaem4GS3kIBzFNki_55xMHw");
    setPriceRange("₹850 - ₹1,400 / meter");
    setSpecifications([
      { key: "Carcass Grade", value: "NN / EP Fabric" },
      { key: "Tensile Strength", value: "315 N/mm - 1600 N/mm" },
    ]);
    setIsActive(true);
    setIsFeatured(false);
    setDisplayOrder(products.length + 1);
    setUploadError("");
    setModalOpen(true);
  };

  const openEditModal = (p: DbProduct) => {
    setEditingProduct(p);
    setName(p.name || "");
    setSlug(p.slug || p.id || "");
    const cat = p.category_id || DEFAULT_CATEGORIES[0];
    const isStandardCat = DEFAULT_CATEGORIES.includes(cat);
    setCategoryId(isStandardCat ? cat : "OTHER");
    setCustomCategory(isStandardCat ? "" : cat);
    setShortDescription(p.short_description || "");
    setDescription(p.description || "");
    setImageUrl(p.image_url || "");
    setPriceRange(p.price_range || "");
    setSpecifications(p.specifications && p.specifications.length > 0 ? [...p.specifications] : [{ key: "", value: "" }]);
    setIsActive(p.is_active ?? true);
    setIsFeatured(p.is_featured ?? false);
    setDisplayOrder(p.display_order ?? 1);
    setUploadError("");
    setModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const result = await uploadToCloudinary(file);
      setImageUrl(result.url);
      await dbService.addMedia({
        name: file.name,
        url: result.url,
        format: result.format,
        sizeBytes: result.bytes,
      });
      showToast("Image uploaded to Cloudinary successfully!");
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err.message || "Upload failed. Please check network or file format.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecRow = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name?.trim()) {
      alert("Product name is required.");
      return;
    }

    setSaveLoading(true);
    const finalCategory = categoryId === "OTHER" ? ((customCategory || "").trim() || "General") : (categoryId || "General");
    const finalSlug = (slug || "").trim() || (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanSpecs = (specifications || [])
      .filter((s) => (s?.key || "").trim() || (s?.value || "").trim())
      .map((s) => ({ key: (s.key || "").trim(), value: (s.value || "").trim() }));

    try {
      if (editingProduct) {
        await dbService.updateProduct(editingProduct.id, {
          name: (name || "").trim(),
          slug: finalSlug,
          category_id: finalCategory,
          short_description: (shortDescription || "").trim(),
          description: (description || "").trim(),
          image_url: (imageUrl || "").trim(),
          price_range: (priceRange || "").trim(),
          specifications: cleanSpecs,
          is_active: Boolean(isActive),
          is_featured: Boolean(isFeatured),
          display_order: Number(displayOrder) || 1,
        });
        showToast("Product updated and synced live!");
      } else {
        await dbService.addProduct({
          name: (name || "").trim(),
          slug: finalSlug,
          category_id: finalCategory,
          short_description: (shortDescription || "").trim(),
          description: (description || "").trim(),
          image_url: (imageUrl || "").trim(),
          price_range: (priceRange || "").trim(),
          specifications: cleanSpecs,
          is_active: Boolean(isActive),
          is_featured: Boolean(isFeatured),
          display_order: Number(displayOrder) || 1,
        });
        showToast("New product created and synced live!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Please check console.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteProduct(id);
      setDeleteConfirmId(null);
      showToast("Product removed from catalog.");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const toggleActive = async (p: DbProduct) => {
    await dbService.updateProduct(p.id, { is_active: !p.is_active });
    showToast(`Product ${!p.is_active ? "activated" : "deactivated"} on website.`);
  };

  const toggleFeatured = async (p: DbProduct) => {
    await dbService.updateProduct(p.id, { is_featured: !p.is_featured });
    showToast(`Product ${!p.is_featured ? "marked as featured" : "unfeatured"}.`);
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || p.category_id === selectedCategory;
    const matchesFeatured = filterFeatured === null || p.is_featured === filterFeatured;

    return matchesSearch && matchesCategory && matchesFeatured;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#ff8d28] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff8d28] text-2xl">inventory_2</span>
            <span>Products Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single source of truth for the public catalog. Edits immediately sync to the live website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-[#0e1720] border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, grade, specification..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#ff8d28]"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilterFeatured(filterFeatured === true ? null : true)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              filterFeatured === true
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-400 border-slate-700/80 hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-sm">star</span>
            <span>Featured</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#0e1720] border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Synchronizing products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-slate-600">inventory_2</span>
            <span>No products found matching your filter criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-16">Image</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Range</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400 text-center">
                      {p.display_order}
                    </td>

                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative shrink-0">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <span className="material-symbols-outlined text-base">image</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {p.short_description || "No description provided."}
                      </div>
                      {p.specifications && p.specifications.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {p.specifications.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                            >
                              {s.key}: {s.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-950/60 text-teal-300 border border-teal-800/40">
                        {p.category_id}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-200">
                      {p.price_range || "On Request"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`p-1 rounded-full transition-colors ${
                          p.is_featured
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={p.is_featured ? "Featured on Home" : "Click to feature"}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {p.is_featured ? "star" : "star_border"}
                        </span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          p.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.is_active ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        ></span>
                        <span>{p.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1720] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8d28]">
                  {editingProduct ? "edit_note" : "add_box"}
                </span>
                <h2 className="font-bold text-base text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingProduct) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  placeholder="e.g. Chevron Cleated Conveyor Belt"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="OTHER">Custom Category...</option>
                  </select>

                  {categoryId === "OTHER" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Type custom category name"
                      className="mt-2 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Price / Price Range
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g. ₹950 - ₹1,600 / m or On Request"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Description (Catalog Cards)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary of carcass, cleat profile, and typical material handled."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Technical Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of grade, carcass fabric, tensile strength, and application notes."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Image (Cloudinary Store)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-3 w-24 h-24 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden relative shrink-0 mx-auto sm:mx-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                        <span>No image</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-9 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold transition-colors">
                        <span className="material-symbols-outlined text-base text-teal-400">cloud_upload</span>
                        <span>{uploadingImage ? "Uploading to Cloudinary..." : "Upload from Device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">Auto uploads to Cloudinary</span>
                    </div>

                    {uploadError && (
                      <div className="text-xs text-rose-400">{uploadError}</div>
                    )}

                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#ff8d28]"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Specifications &amp; Features
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#ff8d28] hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>+ Add Specification</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpecRow(idx, "key", e.target.value)}
                        placeholder="Key (e.g. Tensile Strength)"
                        className="w-1/3 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                        placeholder="Value (e.g. 500 N/mm)"
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order & Toggles */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(isFeatured)}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#ff8d28] bg-slate-900 border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(isActive)}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">Active (Show on Website)</span>
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Display Order:</span>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-14 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading || uploadingImage}
                  className="px-5 py-2.5 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20 disabled:opacity-50"
                >
                  {saveLoading ? "Saving Product..." : editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Delete Product?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this product from the database? It will disappear from the live website immediately.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
