"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dbService } from "@/lib/db";
import { AdminMediaAsset } from "@/types/admin";
import { uploadToCloudinary, getCloudinaryStatus } from "@/lib/cloudinary";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<AdminMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const cloudinaryStatus = getCloudinaryStatus();

  const refreshMedia = async () => {
    try {
      const data = await dbService.getMedia();
      setMedia(data);
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadToCloudinary(file);
        await dbService.addMedia({
          name: file.name,
          url: res.url,
          format: res.format,
          sizeBytes: res.bytes,
        });
      }
      await refreshMedia();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please check console for details.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteMedia(id);
      await refreshMedia();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-2xl">perm_media</span>
            <span>Media Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloudinary image repository for product photos, factory banners, and warehouse certificates.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-lg shadow-[#ff8d28]/20 transition-all hover:scale-[1.02]">
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>{uploading ? "Uploading..." : "Upload New Images"}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Cloudinary Status Banner */}
      {!cloudinaryStatus.configured && (
        <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-xs text-teal-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">info</span>
            <span>
              Cloudinary preview mode active. Uploads are stored as local persistent images for instant preview. Configure credentials in <strong>Settings</strong> to enable remote CDN cloud hosting.
            </span>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading media library...</div>
      ) : media.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-slate-600">image</span>
          <span>No media files found. Upload your first product or factory photo!</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((asset) => (
            <div
              key={asset.id}
              className="group rounded-xl bg-[#0e1720] border border-slate-800 overflow-hidden flex flex-col hover:border-teal-500/50 transition-all shadow-sm"
            >
              {/* Image Preview Container */}
              <div className="aspect-square w-full bg-slate-950 relative overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyUrl(asset.id, asset.url)}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-[#ff8d28] text-white hover:text-slate-950 shadow transition-colors"
                    title="Copy Image URL"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedId === asset.id ? "check" : "content_copy"}
                    </span>
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-cyan-500 text-white hover:text-slate-950 shadow transition-colors"
                    title="Open Full Image"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                  </a>

                  <button
                    onClick={() => setDeleteConfirmId(asset.id)}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-rose-600 text-rose-400 hover:text-white shadow transition-colors"
                    title="Delete Image"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="p-2.5 bg-slate-900/50 flex flex-col justify-between flex-1">
                <span className="text-[11px] font-semibold text-white truncate" title={asset.name}>
                  {asset.name}
                </span>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{asset.format ? asset.format.toUpperCase() : "IMG"}</span>
                  <button
                    onClick={() => copyUrl(asset.id, asset.url)}
                    className="text-[#ff8d28] hover:underline"
                  >
                    {copiedId === asset.id ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Delete Media Item?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this image from the media library?
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
