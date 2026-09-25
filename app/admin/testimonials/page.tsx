"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/lib/db";
import { DbTestimonial } from "@/types/admin";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { parseYouTubeUrl } from "@/lib/youtube";

function TestimonialsContent() {
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbTestimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [parsedYouTube, setParsedYouTube] = useState<ReturnType<typeof parseYouTubeUrl>>(null);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    // Real-Time subscription for testimonials
    const unsubscribe = dbService.subscribeTestimonials((list) => {
      setTestimonials(list);
      setLoading(false);
    });

    if (searchParams.get("action") === "new") {
      openAddModal();
    }

    return () => unsubscribe();
  }, [searchParams]);

  useEffect(() => {
    if (youtubeUrl.trim()) {
      setParsedYouTube(parseYouTubeUrl(youtubeUrl));
    } else {
      setParsedYouTube(null);
    }
  }, [youtubeUrl]);

  const openAddModal = () => {
    setEditingItem(null);
    setCustomerName("");
    setCompany("");
    setDesignation("");
    setProfileImageUrl("");
    setRating(5);
    setTestimonial("");
    setYoutubeUrl("");
    setIsActive(true);
    setDisplayOrder(testimonials.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (item: DbTestimonial) => {
    setEditingItem(item);
    setCustomerName(item.customer_name);
    setCompany(item.company || "");
    setDesignation(item.designation || "");
    setProfileImageUrl(item.profile_image_url || "");
    setRating(item.rating || 5);
    setTestimonial(item.testimonial || "");
    setYoutubeUrl(item.youtube_url || "");
    setIsActive(item.is_active ?? true);
    setDisplayOrder(item.display_order || 1);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadToCloudinary(file);
      setProfileImageUrl(res.url);
      showToast("Profile image uploaded to Cloudinary!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please check console.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }
    if (!testimonial.trim()) {
      alert("Testimonial text is required.");
      return;
    }

    setSaveLoading(true);
    try {
      if (editingItem) {
        await dbService.updateTestimonial(editingItem.id, {
          customer_name: customerName.trim(),
          company: company.trim(),
          designation: designation.trim(),
          profile_image_url: profileImageUrl.trim(),
          rating,
          testimonial: testimonial.trim(),
          youtube_url: youtubeUrl.trim() || undefined,
          is_active: isActive,
          display_order: displayOrder,
        });
        showToast("Testimonial updated and synced!");
      } else {
        await dbService.addTestimonial({
          customer_name: customerName.trim(),
          company: company.trim(),
          designation: designation.trim(),
          profile_image_url: profileImageUrl.trim(),
          rating,
          testimonial: testimonial.trim(),
          youtube_url: youtubeUrl.trim() || undefined,
          is_active: isActive,
          display_order: displayOrder,
        });
        showToast("New testimonial added and live!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving testimonial:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteTestimonial(id);
      setDeleteConfirmId(null);
      showToast("Testimonial removed.");
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  const toggleActive = async (item: DbTestimonial) => {
    await dbService.updateTestimonial(item.id, { is_active: !item.is_active });
    showToast(`Testimonial ${!item.is_active ? "activated" : "deactivated"} on website.`);
  };

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
            <span className="material-symbols-outlined text-red-500 text-2xl">smart_display</span>
            <span>Customer Video Testimonials (YouTube)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add and manage verified client YouTube video feedback displayed on the home page.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">video_call</span>
          <span>Add YouTube Video Feedback</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Synchronizing reviews...</div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0e1720] border border-slate-800 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Testimonials Added</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              All test data has been removed. Click &ldquo;Add YouTube Video Feedback&rdquo; above to publish verified customer reviews.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">video_call</span>
            <span>Add Real Client Review</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-[#0e1720] border transition-all flex flex-col justify-between ${
                item.is_active ? "border-slate-800 hover:border-amber-500/40" : "border-slate-800/40 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-sm font-variation-fill"
                        style={{ fontVariationSettings: `'FILL' ${star <= item.rating ? 1 : 0}` }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">#{item.display_order}</span>
                    <button
                      onClick={() => toggleActive(item)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        item.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-4 leading-relaxed">
                  &ldquo;{item.testimonial}&rdquo;
                </p>

                {item.youtube_url && (
                  <div className="mt-2 flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-red-500/20">
                    <div className="relative w-12 h-8 rounded overflow-hidden bg-black shrink-0">
                      {item.thumbnail_url ? (
                        <Image
                          src={item.thumbnail_url}
                          alt="Thumbnail"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-red-500">
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">smart_display</span>
                        <span>YouTube Video</span>
                      </span>
                      <a
                        href={item.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-400 hover:text-white hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.youtube_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative shrink-0">
                    {item.profile_image_url ? (
                      <Image
                        src={item.profile_image_url}
                        alt={item.customer_name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                        {item.customer_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white leading-tight">
                      {item.customer_name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {item.designation ? `${item.designation}, ` : ""}{item.company || "Industrial Client"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1720] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">
                  {editingItem ? "edit_note" : "add_reaction"}
                </span>
                <span>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Customer Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Raj Kumar"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Premier Quarry Works"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff8d28]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Operations Head"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff8d28]"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Rating (1 to 5 Stars) <span className="text-amber-400">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <span
                        className="material-symbols-outlined text-2xl font-variation-fill"
                        style={{ fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}` }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Testimonial Quote <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="e.g. Excellent service and reliable conveyor belting quality..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
                />
              </div>

              {/* YouTube Video Link */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  YouTube Video Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-red-500 text-lg">
                    smart_display
                  </span>
                </div>

                {parsedYouTube && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-center gap-3">
                    <div className="relative w-14 h-10 rounded overflow-hidden bg-black shrink-0">
                      <Image
                        src={parsedYouTube.thumbnailHqUrl}
                        alt="Preview"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-red-400">Valid YouTube Video</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">ID: {parsedYouTube.videoId}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Profile Image (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden relative shrink-0">
                    {profileImageUrl ? (
                      <Image
                        src={profileImageUrl}
                        alt="Profile"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                        Avatar
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold">
                      <span className="material-symbols-outlined text-sm">cloud_upload</span>
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={profileImageUrl}
                      onChange={(e) => setProfileImageUrl(e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(isActive)}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-semibold text-slate-200">Active (Show on Website)</span>
                </label>

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
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20"
                >
                  {saveLoading ? "Saving..." : editingItem ? "Update Testimonial" : "Add Testimonial"}
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
            <h3 className="font-bold text-base text-white">Delete Testimonial?</h3>
            <p className="text-xs text-slate-400">
              This review will be removed immediately from the live website.
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

export default function AdminTestimonialsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading reviews...</div>}>
      <TestimonialsContent />
    </Suspense>
  );
}
