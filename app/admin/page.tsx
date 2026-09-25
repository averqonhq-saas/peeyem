"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbProduct, DbTestimonial, DbPromotionVideo, DbEnquiry } from "@/types/admin";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getCloudinaryStatus } from "@/lib/cloudinary";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [videos, setVideos] = useState<DbPromotionVideo[]>([]);
  const [enquiries, setEnquiries] = useState<DbEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const [greeting, setGreeting] = useState("Good Day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Real-Time Subscriptions for all datasets
    const unsubProducts = dbService.subscribeProducts((list) => {
      setProducts(list);
      setLoading(false);
    });

    const unsubTestimonials = dbService.subscribeTestimonials((list) => {
      setTestimonials(list);
    });

    const unsubVideos = dbService.subscribeVideos((list) => {
      setVideos(list);
    });

    const unsubEnquiries = dbService.subscribeEnquiries((list) => {
      setEnquiries(list);
    });

    return () => {
      unsubProducts();
      unsubTestimonials();
      unsubVideos();
      unsubEnquiries();
    };
  }, []);

  // Calculated Real-Time Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const featuredProducts = products.filter((p) => p.is_featured).length;

  const totalTestimonials = testimonials.length;
  const activeTestimonials = testimonials.filter((t) => t.is_active).length;

  const totalVideos = videos.length;
  const activeVideos = videos.filter((v) => v.is_active).length;

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "NEW").length;
  const contactedEnquiries = enquiries.filter((e) => e.status === "CONTACTED").length;
  const closedEnquiries = enquiries.filter((e) => e.status === "CLOSED").length;

  const recentEnquiries = enquiries.slice(0, 6);
  const cloudinaryStatus = getCloudinaryStatus();

  return (
    <div className="space-y-8">
      {/* ================= GREETING HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, Admin</span>
            <span className="inline-block animate-wave text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span>Peeyem Traders Operations Control Center</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-semibold">Live Real-Time Sync</span>
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/videos?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-cyan-400">smart_display</span>
            <span>Add Video</span>
          </Link>
          <Link
            href="/admin/testimonials?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-amber-400">stars</span>
            <span>Add Review</span>
          </Link>
        </div>
      </div>

      {/* ================= SUMMARY STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Card */}
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 hover:border-[#ff8d28]/50 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Products</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#ff8d28] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">inventory_2</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : totalProducts}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 flex-wrap">
              <span className="text-emerald-400 font-semibold">{activeProducts} Active</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{featuredProducts} Featured</span>
            </div>
          </div>
        </Link>

        {/* Testimonials Card */}
        <Link
          href="/admin/testimonials"
          className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 hover:border-amber-500/50 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Testimonials</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">stars</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : totalTestimonials}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{activeTestimonials} Active</span>
              <span>• client reviews</span>
            </div>
          </div>
        </Link>

        {/* Videos Card */}
        <Link
          href="/admin/videos"
          className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Videos</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">smart_display</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : activeVideos}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-cyan-400 font-semibold">{totalVideos} Total</span>
              <span>• YouTube promotions</span>
            </div>
          </div>
        </Link>

        {/* Total Enquiries Card */}
        <Link
          href="/admin/enquiries"
          className="p-5 rounded-2xl bg-[#0e1720] border border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : totalEnquiries}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-semibold">{newEnquiries} NEW</span>
              <span>needs response</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ================= ENQUIRIES STATUS PIPELINE ================= */}
      <div className="p-6 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff8d28]">pie_chart</span>
            <h2 className="font-bold text-base text-white">Live Enquiry Pipeline</h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-[#ff8d28] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* New */}
          <Link
            href="/admin/enquiries?status=NEW"
            className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">New Enquiries</span>
              <span className="text-2xl font-black text-amber-300 mt-1">{newEnquiries}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Pending first contact</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined">mark_email_unread</span>
            </div>
          </Link>

          {/* Contacted */}
          <Link
            href="/admin/enquiries?status=CONTACTED"
            className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Contacted</span>
              <span className="text-2xl font-black text-blue-300 mt-1">{contactedEnquiries}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Quote or call in progress</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined">phone_in_talk</span>
            </div>
          </Link>

          {/* Closed */}
          <Link
            href="/admin/enquiries?status=CLOSED"
            className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Closed</span>
              <span className="text-2xl font-black text-emerald-300 mt-1">{closedEnquiries}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Order completed / fulfilled</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ================= RECENT ENQUIRIES ================= */}
      <div className="rounded-2xl bg-[#0e1720] border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">schedule</span>
            <h2 className="font-bold text-base text-white">Recent Customer Submissions</h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-[#ff8d28] hover:underline"
          >
            Manage Enquiries &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading live enquiries...</div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No enquiries received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Product / Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentEnquiries.map((enq) => {
                  const dateStr = new Date(enq.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={enq.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{enq.name}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs text-slate-200">{enq.phone}</div>
                        {enq.email && (
                          <div className="text-[11px] text-slate-400">{enq.email}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {enq.product_id || enq.subject || "General Inquiry"}
                        </span>
                        <div className="text-[11px] text-slate-400">{dateStr}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            enq.status === "NEW"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : enq.status === "CONTACTED"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/enquiries?id=${enq.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#ff8d28] hover:text-white px-2.5 py-1 rounded bg-[#ff8d28]/10 hover:bg-[#ff8d28] transition-colors"
                        >
                          <span>Open</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Status Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isFirebaseConfigured ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
            <span>Firestore: <strong>{isFirebaseConfigured ? "Connected (Live Cloud Sync)" : "Local Persistent (Offline Ready)"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cloudinaryStatus.configured ? "bg-emerald-400" : "bg-teal-400"}`}></span>
            <span>Cloudinary: <strong>{cloudinaryStatus.configured ? `Active (${cloudinaryStatus.cloudName})` : "Local Preview Ready"}</strong></span>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="text-xs font-semibold text-slate-300 hover:text-[#ff8d28] flex items-center gap-1 self-start sm:self-auto"
        >
          <span>System Settings</span>
          <span className="material-symbols-outlined text-sm">settings</span>
        </Link>
      </div>
    </div>
  );
}
