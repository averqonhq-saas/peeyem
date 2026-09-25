"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/data/products";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getCloudinaryStatus } from "@/lib/cloudinary";
import { dbService } from "@/lib/db";

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState(COMPANY_INFO.name);
  const [tagline, setTagline] = useState(COMPANY_INFO.tagline);
  const [phone, setPhone] = useState(COMPANY_INFO.phone);
  const [email, setEmail] = useState(COMPANY_INFO.email);
  const [address, setAddress] = useState(COMPANY_INFO.address);
  const [whatsapp, setWhatsapp] = useState("+91 98765 43210");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const cloudinaryStatus = getCloudinaryStatus();

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = async () => {
    if (confirm("Reset local database to initial demonstration dataset? All edits made during testing will be reset.")) {
      setSeedingLoading(true);
      await dbService.resetSampleData();
      setSeedingLoading(false);
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-2xl">settings</span>
          <span>System &amp; Company Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage corporate contact information and review database and cloud storage connections.
        </p>
      </div>

      {/* Cloud & Database Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Firebase / Firestore Status */}
        <div className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#ff8d28] flex items-center justify-center font-bold">
                🔥
              </div>
              <h2 className="font-bold text-sm text-white">Firebase Firestore Database</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isFirebaseConfigured
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isFirebaseConfigured ? "Connected (Live)" : "Local Persistent Fallback"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isFirebaseConfigured
              ? "Your production Firestore collections (products, testimonials, videos, enquiries) are connected."
              : "Running in local persistent mode. To connect your live Firebase project, create or update .env.local with your Firebase project keys."}
          </p>

          <button
            type="button"
            disabled={seedingLoading}
            onClick={async () => {
              setSeedingLoading(true);
              const res = await dbService.syncSeedToFirestore();
              setSeedingLoading(false);
              alert(res.message);
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#ff8d28] border border-[#ff8d28]/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            <span>{seedingLoading ? "Syncing..." : "Sync & Store All Data in Firestore"}</span>
          </button>
        </div>

        {/* Firebase Auth & Google Login Status */}
        <div className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                🛡️
              </div>
              <h2 className="font-bold text-sm text-white">Firebase Google Auth</h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Administrative access is secured via Firebase Google Authentication, restricted to authorized emails:
          </p>

          <div className="space-y-1 font-mono text-[11px] text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>• averqonhq@gmail.com</div>
            <div>• peeyemtraders16@gmail.com</div>
          </div>
        </div>

        {/* Cloudinary Status */}
        <div className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                ☁️
              </div>
              <h2 className="font-bold text-sm text-white">Cloudinary Image Store</h2>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                cloudinaryStatus.configured
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-teal-500/10 text-teal-300 border border-teal-500/30"
              }`}
            >
              {cloudinaryStatus.configured ? "Active" : "Ready (Preview Mode)"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {cloudinaryStatus.configured
              ? `Images are uploaded to Cloudinary cloud "${cloudinaryStatus.cloudName}" with global CDN caching.`
              : "Uploads are saved with instant high-performance client data storage. Add Cloudinary credentials to .env.local for automatic cloud hosting."}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-400 overflow-x-auto">
            <div>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...</div>
            <div>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...</div>
          </div>
        </div>
      </div>

      {/* Company Contact Information */}
      <div className="p-6 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff8d28]">business</span>
            <span>Company Profile &amp; Contact Info</span>
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check</span>
              <span>Settings Updated</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Primary Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                WhatsApp Business
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Physical Depot &amp; Warehouse Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff8d28]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20 transition-all hover:scale-[1.02]"
            >
              Save Company Settings
            </button>
          </div>
        </form>
      </div>

      {/* Data Maintenance & Demonstration Seeding */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-sm text-white">Reset Demonstration Data</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quickly reload all default products, promotion videos, reviews, and test inquiries.
          </p>
          {seedSuccess && (
            <span className="text-xs text-emerald-400 font-bold mt-1 inline-block">
              ✓ Database restored to default demonstration state!
            </span>
          )}
        </div>

        <button
          onClick={handleResetData}
          disabled={seedingLoading}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors shrink-0"
        >
          {seedingLoading ? "Resetting..." : "Restore Sample Data"}
        </button>
      </div>
    </div>
  );
}
