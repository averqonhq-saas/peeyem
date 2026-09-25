"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dbService } from "@/lib/db";
import { DbGalleryImage } from "@/types/admin";
import { uploadToCloudinary, getCloudinaryStatus } from "@/lib/cloudinary";

const CATEGORY_OPTIONS = [
  { value: "depots", label: "Depots", icon: "warehouse", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30 text-blue-300" },
  { value: "equipment", label: "Equipment", icon: "precision_manufacturing", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30 text-orange-300" },
  { value: "delivery", label: "Delivery", icon: "local_shipping", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30 text-green-300" },
  { value: "field", label: "Field Ops", icon: "construction", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300" },
  { value: "products", label: "Products", icon: "inventory_2", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30 text-purple-300" },
  { value: "other", label: "Other", icon: "more_horiz", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30 text-slate-300" },
] as const;

type Category = DbGalleryImage["category"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<DbGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  
  // Pending batch uploads
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string; caption: string; category: Category }[]>([]);
  
  // Direct URL Add
  const [showUrlAddModal, setShowUrlAddModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlCaption, setUrlCaption] = useState("");
  const [urlCategory, setUrlCategory] = useState<Category>("products");
  const [urlSaving, setUrlSaving] = useState(false);

  // Edit / Update Modal
  const [editItem, setEditItem] = useState<DbGalleryImage | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("products");
  const [editUrl, setEditUrl] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editOrder, setEditOrder] = useState<number>(1);
  const [editSaving, setEditSaving] = useState(false);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreview, setReplacementPreview] = useState<string>("");

  // Delete & Lightbox
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const cloudinaryStatus = getCloudinaryStatus();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    const unsub = dbService.subscribeGalleryImages((list) => {
      setImages([...list].sort((a, b) => a.display_order - b.display_order));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Multi-file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      caption: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      category: "products" as Category,
    }));
    setPendingFiles((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removePending = (i: number) => {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, j) => j !== i);
    });
  };

  // Upload pending batch
  const handleUploadAll = async () => {
    if (!pendingFiles.length) return;
    setUploading(true);
    setUploadProgress(0);
    const count = pendingFiles.length;
    try {
      const nextOrder = images.length > 0 ? Math.max(...images.map((i) => i.display_order)) + 1 : 1;
      for (let i = 0; i < count; i++) {
        const p = pendingFiles[i];
        const res = await uploadToCloudinary(p.file);
        await dbService.addGalleryImage({
          url: res.url,
          caption: p.caption.trim() || p.file.name,
          category: p.category,
          display_order: nextOrder + i,
          is_active: true,
        });
        setUploadProgress(Math.round(((i + 1) / count) * 100));
      }
      setPendingFiles([]);
      showToast(`Successfully uploaded ${count} image(s) to gallery!`);
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Upload failed. Please check internet connection or Cloudinary settings.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Direct URL Add
  const handleAddByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUrlSaving(true);
    try {
      const nextOrder = images.length > 0 ? Math.max(...images.map((i) => i.display_order)) + 1 : 1;
      await dbService.addGalleryImage({
        url: urlInput.trim(),
        caption: urlCaption.trim() || "Gallery Exhibit",
        category: urlCategory,
        display_order: nextOrder,
        is_active: true,
      });
      setUrlInput("");
      setUrlCaption("");
      setShowUrlAddModal(false);
      showToast("Photo added successfully from URL!");
    } catch {
      showToast("Failed to add photo.");
    } finally {
      setUrlSaving(false);
    }
  };

  // Open Edit Modal
  const openEdit = (img: DbGalleryImage) => {
    setEditItem(img);
    setEditCaption(img.caption);
    setEditCategory(img.category);
    setEditUrl(img.url);
    setEditActive(img.is_active);
    setEditOrder(img.display_order);
    setReplacementFile(null);
    setReplacementPreview("");
  };

  // Replacement file in edit modal
  const handleReplacementFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReplacementFile(file);
      setReplacementPreview(URL.createObjectURL(file));
    }
  };

  // Save changes to gallery image
  const handleSaveEdit = async () => {
    if (!editItem) return;
    setEditSaving(true);
    try {
      let finalUrl = editUrl.trim() || editItem.url;

      // If user provided a replacement file, upload it
      if (replacementFile) {
        const uploadRes = await uploadToCloudinary(replacementFile);
        finalUrl = uploadRes.url;
      }

      await dbService.updateGalleryImage(editItem.id, {
        url: finalUrl,
        caption: editCaption.trim() || editItem.caption,
        category: editCategory,
        is_active: editActive,
        display_order: Number(editOrder) || editItem.display_order,
      });

      setEditItem(null);
      showToast("Gallery photo updated successfully!");
    } catch (err) {
      console.error("Save edit error:", err);
      showToast("Failed to save changes.");
    } finally {
      setEditSaving(false);
    }
  };

  // Quick order adjustment (Move Up / Move Down)
  const handleMoveOrder = async (img: DbGalleryImage, direction: "up" | "down") => {
    const currentIndex = images.findIndex((i) => i.id === img.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const targetImg = images[targetIndex];
    const currentOrder = img.display_order;
    const targetOrder = targetImg.display_order;

    await Promise.all([
      dbService.updateGalleryImage(img.id, { display_order: targetOrder }),
      dbService.updateGalleryImage(targetImg.id, { display_order: currentOrder }),
    ]);

    showToast(`Moved "${img.caption}" ${direction}.`);
  };

  const handleDelete = async (id: string) => {
    await dbService.deleteGalleryImage(id);
    setDeleteId(null);
    showToast("Photo deleted from gallery.");
  };

  const handleToggleActive = async (img: DbGalleryImage) => {
    await dbService.updateGalleryImage(img.id, { is_active: !img.is_active });
    showToast(img.is_active ? `"${img.caption}" hidden from public gallery.` : `"${img.caption}" published to gallery.`);
  };

  // Filter & Search
  const filteredImages = images.filter((img) => {
    const matchesCategory = filterCat === "all" || img.category === filterCat;
    const matchesSearch =
      searchQuery.trim() === "" ||
      img.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const catMeta = (cat: string) => CATEGORY_OPTIONS.find((c) => c.value === cat) || CATEGORY_OPTIONS[5];

  const totalCount = images.length;
  const activeCount = images.filter((i) => i.is_active).length;
  const hiddenCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ff8d28] text-2xl">photo_library</span>
            <span>Gallery &amp; Installation Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload, update captions, re-order, and manage photos displayed on the public{" "}
            <span className="text-white font-semibold">/gallery</span> page and homepage showcase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowUrlAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-blue-400">link</span>
            <span>Add by URL</span>
          </button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/20 transition-all hover:scale-[1.02]">
            <span className="material-symbols-outlined text-base font-bold">add_photo_alternate</span>
            <span>Upload Images</span>
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0e1720] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-[#ff8d28]">
            <span className="material-symbols-outlined text-xl">collections</span>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{totalCount}</div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Exhibits</div>
          </div>
        </div>

        <div className="bg-[#0e1720] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <span className="material-symbols-outlined text-xl">visibility</span>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{activeCount}</div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Live on Website</div>
          </div>
        </div>

        <div className="bg-[#0e1720] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <span className="material-symbols-outlined text-xl">visibility_off</span>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-400">{hiddenCount}</div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Hidden Drafts</div>
          </div>
        </div>

        <div className="bg-[#0e1720] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-xl">cloud_done</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {cloudinaryStatus.configured ? "Cloudinary Active" : "Local Mock CDN"}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
              {cloudinaryStatus.cloudName ? `@${cloudinaryStatus.cloudName}` : "Browser storage"}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Batch Uploads Queue */}
      {pendingFiles.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#ff8d28]">cloud_upload</span>
              Ready to Upload ({pendingFiles.length} photo{pendingFiles.length !== 1 ? "s" : ""})
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPendingFiles([])}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Clear All
              </button>
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-lg shadow-green-600/20"
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">upload</span>
                    <span>Confirm &amp; Add All to Gallery</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {uploading && (
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingFiles.map((p, i) => (
              <div key={i} className="rounded-xl bg-slate-800/90 overflow-hidden border border-slate-700 flex flex-col">
                <div className="aspect-video relative bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePending(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                <div className="p-3 space-y-2 flex-1">
                  <input
                    type="text"
                    value={p.caption}
                    onChange={(e) =>
                      setPendingFiles((prev) =>
                        prev.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x))
                      )
                    }
                    placeholder="Photo caption / title..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff8d28]"
                  />
                  <select
                    value={p.category}
                    onChange={(e) =>
                      setPendingFiles((prev) =>
                        prev.map((x, j) => (j === i ? { ...x, category: e.target.value as Category } : x))
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ff8d28]"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0e1720] border border-slate-800 p-3 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setFilterCat("all")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCat === "all" ? "bg-[#ff8d28] text-slate-950 shadow" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All ({images.length})
          </button>
          {CATEGORY_OPTIONS.map((c) => {
            const count = images.filter((i) => i.category === c.value).length;
            return (
              <button
                key={c.value}
                onClick={() => setFilterCat(c.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterCat === c.value ? "bg-[#ff8d28] text-slate-950 font-bold" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${filterCat === c.value ? "text-slate-950" : c.color}`}>
                  {c.icon}
                </span>
                <span>{c.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ff8d28] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading gallery exhibits...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-[#0e1720] border border-slate-800 rounded-3xl">
          <span className="material-symbols-outlined text-5xl text-slate-700">add_photo_alternate</span>
          <p className="text-slate-300 text-sm font-semibold">No gallery photos match your current filter.</p>
          <p className="text-slate-500 text-xs">Click Upload Images above or clear search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((img, idx) => {
            const meta = catMeta(img.category);
            return (
              <div
                key={img.id}
                className={`group rounded-2xl bg-[#0e1720] border overflow-hidden flex flex-col transition-all shadow-md ${
                  img.is_active
                    ? "border-slate-800 hover:border-[#ff8d28]/60 hover:shadow-xl"
                    : "border-slate-800/40 opacity-60 hover:opacity-90"
                }`}
              >
                {/* Photo Aspect Square */}
                <div
                  className="aspect-square relative bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => setLightboxUrl(img.url)}
                >
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-slate-300 border border-slate-800">
                        #{img.display_order}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveOrder(img, "up");
                          }}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-[#ff8d28] text-white hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed shadow transition-colors"
                          title="Move earlier"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveOrder(img, "down");
                          }}
                          disabled={idx === filteredImages.length - 1}
                          className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-[#ff8d28] text-white hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed shadow transition-colors"
                          title="Move later"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle: Click to zoom */}
                    <div className="self-center">
                      <span className="material-symbols-outlined text-3xl text-white/80 hover:text-white drop-shadow">
                        zoom_in
                      </span>
                    </div>

                    {/* Bottom action bar */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(img);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900/95 hover:bg-[#ff8d28] text-white hover:text-slate-950 font-bold text-xs shadow flex items-center gap-1 transition-colors"
                        title="Update details"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(img);
                        }}
                        className={`p-1.5 rounded-lg shadow transition-colors ${
                          img.is_active
                            ? "bg-slate-900/95 hover:bg-amber-500 text-amber-400 hover:text-white"
                            : "bg-slate-900/95 hover:bg-green-600 text-slate-400 hover:text-white"
                        }`}
                        title={img.is_active ? "Hide from website" : "Publish to website"}
                      >
                        <span className="material-symbols-outlined text-base">
                          {img.is_active ? "visibility_off" : "visibility"}
                        </span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(img.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900/95 hover:bg-rose-600 text-rose-400 hover:text-white shadow transition-colors"
                        title="Delete photo"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  {!img.is_active && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-[10px] font-bold text-slate-950 shadow">
                      HIDDEN
                    </div>
                  )}
                </div>

                {/* Card Meta Footer */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white truncate" title={img.caption}>
                      {img.caption}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${meta.bg}`}>
                        <span className="material-symbols-outlined text-[12px]">{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Ord: {img.display_order}
                      </span>
                    </div>
                  </div>

                  {/* Quick Edit Trigger */}
                  <button
                    type="button"
                    onClick={() => openEdit(img)}
                    className="w-full mt-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-[#ff8d28] text-slate-300 hover:text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Update Photo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          FULL UPDATE / EDIT MODAL
          Allows modifying Caption, Category, Replacing Photo File or URL,
          Display Order, and Live Visibility
          ======================================================== */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1720] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8d28] text-xl">tune</span>
                <span>Update Gallery Photo Details</span>
              </h3>
              <button
                onClick={() => setEditItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Photo Preview & Replace Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Photo Preview &amp; Replacement
              </label>
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative group">
                <Image
                  src={replacementPreview || editUrl || editItem.url}
                  alt={editCaption}
                  fill
                  className="object-cover"
                  sizes="500px"
                />
                {replacementPreview && (
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-green-500 text-slate-950 font-bold text-[10px]">
                    NEW FILE SELECTED
                  </div>
                )}
              </div>

              {/* Upload Replacement Image */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm text-[#ff8d28]">upload_file</span>
                  <span>Replace from Device</span>
                  <input type="file" accept="image/*" onChange={handleReplacementFile} className="hidden" />
                </label>
                {replacementPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplacementFile(null);
                      setReplacementPreview("");
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Revert to original
                  </button>
                )}
              </div>
            </div>

            {/* Direct Image URL input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image CDN URL
              </label>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Caption / Display Title
              </label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
                placeholder="E.g. Chevron Cleat 1000mm Profile Installation..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Gallery Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setEditCategory(c.value)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                      editCategory === c.value
                        ? "bg-[#ff8d28] border-[#ff8d28] text-slate-950 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${editCategory === c.value ? "text-slate-950" : c.color}`}>
                      {c.icon}
                    </span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Order & Visibility */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editOrder}
                  onChange={(e) => setEditOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    editActive
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {editActive ? "visibility" : "visibility_off"}
                  </span>
                  <span>{editActive ? "Public Active" : "Hidden Draft"}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ff8d28] hover:bg-[#e66c00] disabled:bg-slate-700 text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/25 transition-all hover:scale-[1.01]"
              >
                {editSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base font-bold">save</span>
                    <span>Update Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ADD BY URL MODAL
          ======================================================== */}
      {showUrlAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddByUrl}
            className="bg-[#0e1720] border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">link</span>
                <span>Add Image from Direct URL</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUrlAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image URL (JPG, PNG, WebP)
              </label>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or CDN link"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            {urlInput && (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlInput} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Caption / Title
              </label>
              <input
                type="text"
                required
                value={urlCaption}
                onChange={(e) => setUrlCaption(e.target.value)}
                placeholder="E.g. Heavy Duty Conveyor Roller Depot Staging"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={urlCategory}
                onChange={(e) => setUrlCategory(e.target.value as Category)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8d28]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUrlAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={urlSaving}
                className="px-5 py-2.5 rounded-xl bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg"
              >
                {urlSaving ? "Adding..." : "Add to Gallery"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-400">delete</span>
              <span>Delete Photo?</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This photo will be permanently removed from the website gallery. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom / Lightbox Preview */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxUrl} alt="Full preview" className="w-full h-full object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}