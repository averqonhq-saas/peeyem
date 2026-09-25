"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin, getAdminUser, AdminUser } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getCloudinaryStatus } from "@/lib/cloudinary";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setCloudinaryConfigured(getCloudinaryStatus().configured);

    if (!isLoginPage) {
      if (!isAdminAuthenticated()) {
        router.replace("/admin/login");
        return;
      }
      setAdminUser(getAdminUser());
    }
    setCheckingAuth(false);
  }, [pathname, isLoginPage, router]);

  // If login page, render without admin navigation frame
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent flash of admin dashboard before auth verification
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#090f15] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff8d28] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#090f15] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0e1720] border-r border-slate-800/80 shrink-0 sticky top-0 h-screen select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff8d28] to-[#e66c00] flex items-center justify-center shadow-lg shadow-[#ff8d28]/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-slate-950 font-bold text-2xl">precision_manufacturing</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white leading-tight text-base group-hover:text-[#ff8d28] transition-colors">
                PEEYEM TRADERS
              </span>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overview
            </div>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === "/admin"
                  ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Catalog
            </div>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/admin/products")
                  ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>Products</span>
            </Link>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Content &amp; Marketing
            </div>
            <div className="space-y-1">
              <Link
                href="/admin/testimonials"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/admin/testimonials")
                    ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">stars</span>
                <span>Testimonials</span>
              </Link>

              <Link
                href="/admin/videos"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/admin/videos")
                    ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">smart_display</span>
                <span>Promotion Videos</span>
              </Link>

              <Link
                href="/admin/media"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/admin/media")
                    ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">perm_media</span>
                <span>Media Library</span>
              </Link>

              <Link
                href="/admin/gallery"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/admin/gallery")
                    ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">photo_library</span>
                <span>Gallery Photos</span>
              </Link>
            </div>
          </div>


          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Inquiries
            </div>
            <Link
              href="/admin/enquiries"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/admin/enquiries")
                  ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span>Enquiries</span>
              </div>
            </Link>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System
            </div>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/admin/settings")
                  ? "bg-[#ff8d28] text-slate-950 font-bold shadow-md shadow-[#ff8d28]/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Database & Storage Status Indicator */}
        <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
              Firebase:
            </span>
            <span className="font-semibold text-slate-300">
              {isFirebaseConfigured ? "Live Sync" : "Local Sync"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cloudinaryConfigured ? "bg-emerald-400" : "bg-teal-400"}`}></span>
              Cloudinary:
            </span>
            <span className="font-semibold text-slate-300">
              {cloudinaryConfigured ? "Active" : "Ready"}
            </span>
          </div>
        </div>

        {/* Sidebar Footer with Logout & Website Link */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800/50"
            title="Open Public Website in new tab"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            <span>View Site</span>
          </Link>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors py-1 px-2 rounded hover:bg-rose-950/30"
            title="Sign Out of Admin"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header */}
        <header className="h-16 bg-[#0e1720]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded bg-[#ff8d28] flex items-center justify-center text-slate-950 font-bold">
              <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">PEEYEM ADMIN</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Industrial Conveyor &amp; Rubber Solutions
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>Live Website</span>
            </Link>

            <button
              onClick={logoutAdmin}
              className="md:hidden text-xs text-rose-400 p-1.5 rounded hover:bg-rose-950/30"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
              {adminUser?.photoUrl ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                  <Image
                    src={adminUser.photoUrl}
                    alt={adminUser.name || "Admin"}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-inner">
                  {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : "PT"}
                </div>
              )}
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[170px]">
                  {adminUser?.name || "Admin"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono truncate max-w-[170px]">
                  {adminUser?.email || "Authenticated"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0e1720]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-40">
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 ${
            pathname === "/admin" ? "text-[#ff8d28] font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 ${
            isActive("/admin/products") ? "text-[#ff8d28] font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          <span className="text-[10px]">Products</span>
        </Link>

        {/* Floating Quick Action Button in Center */}
        <div className="relative -top-5">
          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff8d28] to-[#e66c00] text-slate-950 shadow-xl shadow-[#ff8d28]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Quick Add"
          >
            <span className={`material-symbols-outlined text-2xl transition-transform ${fabOpen ? "rotate-45" : ""}`}>
              add
            </span>
          </button>

          {fabOpen && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 space-y-1 z-50">
              <Link
                href="/admin/products?action=new"
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined text-base text-[#ff8d28]">inventory_2</span>
                <span>Add Product</span>
              </Link>
              <Link
                href="/admin/videos?action=new"
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined text-base text-cyan-400">smart_display</span>
                <span>Add Video</span>
              </Link>
              <Link
                href="/admin/testimonials?action=new"
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined text-base text-amber-400">stars</span>
                <span>Add Review</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/admin/enquiries"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 ${
            isActive("/admin/enquiries") ? "text-[#ff8d28] font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">mail</span>
          <span className="text-[10px]">Enquiries</span>
        </Link>

        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 ${
            mobileMoreOpen ? "text-[#ff8d28] font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">more_horiz</span>
          <span className="text-[10px]">More</span>
        </button>
      </div>

      {/* Mobile "More" Drawer */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#0e1720] border-t border-slate-800 rounded-t-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-white">More Management Tools</span>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/testimonials"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-slate-200"
              >
                <span className="material-symbols-outlined text-amber-400">stars</span>
                <span className="text-xs font-semibold">Testimonials</span>
              </Link>

              <Link
                href="/admin/videos"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-slate-200"
              >
                <span className="material-symbols-outlined text-cyan-400">smart_display</span>
                <span className="text-xs font-semibold">Videos</span>
              </Link>

              <Link
                href="/admin/media"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-slate-200"
              >
                <span className="material-symbols-outlined text-teal-400">perm_media</span>
                <span className="text-xs font-semibold">Media</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-slate-200"
              >
                <span className="material-symbols-outlined text-slate-400">settings</span>
                <span className="text-xs font-semibold">Settings</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMoreOpen(false)}
                className="text-xs text-slate-400 flex items-center gap-1.5 py-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open Website</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  logoutAdmin();
                }}
                className="text-xs text-rose-400 flex items-center gap-1.5 py-2 font-medium"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
