"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[75vh] flex items-center justify-center pt-28 pb-16 px-4 bg-surface">
        <div className="max-w-xl mx-auto text-center flex flex-col items-center">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono text-xs font-bold uppercase tracking-wider mb-5">
            404 Error &bull; Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Looking for Conveyor Solutions?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            The page you requested could not be located. Browse our industrial conveyor belt catalog or reach out to our Coimbatore team for immediate assistance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Back to Homepage</span>
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Explore Products</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Contact Depot</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
