"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/lib/db";
import { DbPromotionVideo, PromotionVideoSize } from "@/types/admin";
import { parseYouTubeUrl } from "@/lib/youtube";

function VideosContent() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<DbPromotionVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DbPromotionVideo | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activePlayerVideo, setActivePlayerVideo] = useState<DbPromotionVideo | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<PromotionVideoSize>("wide");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Parsed YouTube State
  const [parsedInfo, setParsedInfo] = useState<ReturnType<typeof parseYouTubeUrl>>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    // Real-Time subscription for videos
    const unsubscribe = dbService.subscribeVideos((list) => {
      setVideos(list);
      setLoading(false);
    });

    if (searchParams.get("action") === "new") {
      openAddModal();
    }

    return () => unsubscribe();
  }, [searchParams]);

  useEffect(() => {
    if (youtubeUrl) {
      const info = parseYouTubeUrl(youtubeUrl);
      setParsedInfo(info);
    } else {
      setParsedInfo(null);
    }
  }, [youtubeUrl]);

  const openAddModal = () => {
    setEditingVideo(null);
    setTitle("");
    setYoutubeUrl("");
    setDescription("");
    setSize("wide");
    setIsActive(true);
    setIsFeatured(false);
    setDisplayOrder(videos.length + 1);
    setParsedInfo(null);
    setModalOpen(true);
  };

  const openEditModal = (v: DbPromotionVideo) => {
    setEditingVideo(v);
    setTitle(v.title || "");
    setYoutubeUrl(v.youtube_url || "");
    setDescription(v.description || "");
    setSize(v.size || "wide");
    setIsActive(v.is_active ?? true);
    setIsFeatured(v.is_featured ?? false);
    setDisplayOrder(v.display_order || 1);
    setParsedInfo(parseYouTubeUrl(v.youtube_url));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Video title is required.");
      return;
    }
    if (!parsedInfo) {
      alert("Please provide a valid YouTube URL.");
      return;
    }

    setSaveLoading(true);
    try {
      if (editingVideo) {
        await dbService.updateVideo(editingVideo.id, {
          title: title.trim(),
          youtube_url: parsedInfo.cleanUrl,
          youtube_video_id: parsedInfo.videoId,
          thumbnail_url: parsedInfo.thumbnailUrl,
          embed_url: parsedInfo.embedUrl,
          description: description.trim(),
          size: size,
          is_active: isActive,
          is_featured: isFeatured,
          display_order: displayOrder,
        });
        showToast("Video updated and synced!");
      } else {
        await dbService.addVideo({
          title: title.trim(),
          youtube_url: parsedInfo.cleanUrl,
          youtube_video_id: parsedInfo.videoId,
          thumbnail_url: parsedInfo.thumbnailUrl,
          embed_url: parsedInfo.embedUrl,
          description: description.trim(),
          size: size,
          is_active: isActive,
          is_featured: isFeatured,
          display_order: displayOrder,
        });
        showToast("New video published and synced!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving video:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteVideo(id);
      setDeleteConfirmId(null);
      showToast("Video removed.");
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  const toggleVisibility = async (v: DbPromotionVideo) => {
    await dbService.updateVideo(v.id, { is_active: !v.is_active });
    showToast(`Video ${!v.is_active ? "activated" : "deactivated"} on website.`);
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
            <span className="material-symbols-outlined text-cyan-400 text-2xl">smart_display</span>
            <span>Promotion Videos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single source of truth for promotional and field testing YouTube videos.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Promotion Video</span>
        </button>
      </div>

      {/* Videos Table */}
      <div className="rounded-2xl bg-[#0e1720] border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Synchronizing videos...</div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No promotion videos added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-40">Video</th>
                  <th className="py-3 px-4">Title &amp; Details</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 text-center">
                      {vid.display_order}
                    </td>

                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => setActivePlayerVideo(vid)}
                        className="w-32 h-20 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative group cursor-pointer"
                      >
                        <Image
                          src={vid.thumbnail_url || `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`}
                          alt={vid.title}
                          fill
                          sizes="128px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <div className="w-8 h-8 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-white text-base">play_arrow</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-white text-sm">{vid.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {vid.description || "No description provided."}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                          ID: {vid.youtube_video_id}
                        </span>
                        <span className="text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-semibold uppercase">
                          {vid.size === "tall" ? "4:3 Tall" : vid.size === "compact" ? "16:10 Compact" : vid.size === "standard" ? "16:9 Standard" : "21:9 Wide"}
                        </span>
                        <a
                          href={vid.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                        >
                          <span>Open YouTube</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          vid.is_featured ? "text-amber-400" : "text-slate-600"
                        }`}
                      >
                        {vid.is_featured ? "star" : "star_border"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleVisibility(vid)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          vid.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vid.is_active ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        ></span>
                        <span>{vid.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePlayerVideo(vid)}
                          className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/40 transition-colors"
                          title="Preview Video Player"
                        >
                          <span className="material-symbols-outlined text-base">play_circle</span>
                        </button>
                        <button
                          onClick={() => openEditModal(vid)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(vid.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete"
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
          <div className="bg-[#0e1720] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">
                  {editingVideo ? "edit" : "video_call"}
                </span>
                <span>{editingVideo ? "Edit Promotion Video" : "Add Promotion Video"}</span>
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
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Video Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavy Duty Chevron Conveyor Belting in Action"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  YouTube URL <span className="text-amber-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=XXXXXXXX or https://youtu.be/XXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Paste any YouTube URL or short link. Video ID, thumbnail, and embed player will be automatically extracted.
                </span>
              </div>

              {parsedInfo ? (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>YouTube Video Detected</span>
                    </span>
                    <span className="font-mono text-xs text-slate-400">ID: {parsedInfo.videoId}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-lg bg-black border border-slate-800 overflow-hidden relative shrink-0">
                      <Image
                        src={parsedInfo.thumbnailUrl || parsedInfo.thumbnailHqUrl}
                        alt="Preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-300 space-y-0.5">
                      <div className="font-semibold text-white truncate max-w-xs">
                        {title || "Untitled Video"}
                      </div>
                      <div className="text-[11px] text-emerald-400">Embed URL Ready</div>
                    </div>
                  </div>
                </div>
              ) : youtubeUrl ? (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=W1YV5piOBmw).
                </div>
              ) : null}

              {/* Video Size / Aspect Ratio Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Carousel Card Display Size (Aspect Ratio)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "wide", label: "Cinematic", ratio: "21:9", desc: "Ultra-wide banner" },
                    { id: "standard", label: "Standard", ratio: "16:9", desc: "Classic video" },
                    { id: "compact", label: "Compact", ratio: "16:10", desc: "Slim height" },
                    { id: "tall", label: "Expanded", ratio: "4:3", desc: "Tall showcase" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSize(opt.id as PromotionVideoSize)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                        size === opt.id
                          ? "bg-cyan-950/60 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/40"
                          : "bg-slate-900 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{opt.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">{opt.ratio}</span>
                      </div>
                      <span className="text-[10px] opacity-75">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short note about the application, factory process, or field demonstration."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(isFeatured)}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">Featured Video</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(isActive)}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">Show on Website</span>
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
                  disabled={saveLoading || !parsedInfo}
                  className="px-5 py-2 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20 disabled:opacity-50"
                >
                  {saveLoading ? "Saving..." : editingVideo ? "Update Video" : "Add Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Player Preview Modal */}
      {activePlayerVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-white truncate max-w-md">
                {activePlayerVideo.title}
              </span>
              <button
                onClick={() => setActivePlayerVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={activePlayerVideo.embed_url}
                title={activePlayerVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-slate-900/60 text-xs text-slate-300">
              {activePlayerVideo.description || "Promotion demonstration video for Peeyem Traders client presentations."}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Delete Video?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this promotion video from your website showcase?
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

export default function AdminVideosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading promotion videos...</div>}>
      <VideosContent />
    </Suspense>
  );
}
