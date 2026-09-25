"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_INFO } from "@/data/products";

const navLinks = [
  { name: "Home", href: "/", icon: "home" },
  { name: "About", href: "/about", icon: "info" },
  { name: "Products", href: "/products", icon: "inventory_2" },
  { name: "Gallery", href: "/gallery", icon: "photo_library" },
  { name: "Contact", href: "/contact", icon: "contact_mail" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-[0_4px_24px_-4px_rgba(11,94,168,0.12)] backdrop-blur-xl border-b border-blue-100/60"
            : "bg-white/80 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Brand Logo ── */}
            <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none flex-shrink-0">
              <div className="relative h-10 w-11 overflow-hidden rounded-lg shadow-sm ring-1 ring-blue-100 transition-shadow group-hover:shadow-md">
                <Image
                  src={COMPANY_INFO.logoUrl}
                  alt="Peeyem Traders Logo"
                  fill
                  className="object-contain p-0.5"
                  priority
                  sizes="44px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-black text-blue-700 tracking-tight">
                  PEEYEM
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Traders
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
                      active
                        ? "text-blue-700 bg-blue-50"
                        : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/60"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-blue-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                title="Call Us"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="hidden xl:inline">{COMPANY_INFO.phone}</span>
              </a>
              <Link
                href="/contact#enquiry-form"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[13px] font-bold rounded-xl shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)] hover:shadow-[0_6px_20px_-4px_rgba(37,99,235,0.6)] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[17px]">request_quote</span>
                <span>Get a Quote</span>
              </Link>
            </div>

            {/* ── Mobile: Call + Hamburger ── */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="w-10 h-10 min-h-[40px] flex items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                aria-label={`Call us at ${COMPANY_INFO.phone}`}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">call</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className={`w-10 h-10 min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
                  mobileOpen
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Overlay Backdrop ── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── Mobile Slide-in Drawer ── */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[min(320px,85vw)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out will-change-transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="relative h-9 w-10 rounded-lg overflow-hidden ring-1 ring-blue-100">
              <Image
                src={COMPANY_INFO.logoUrl}
                alt="Peeyem Traders"
                fill
                className="object-contain p-0.5"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[16px] font-black text-blue-700 tracking-tight">PEEYEM</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Traders</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(37,99,235,0.4)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${active ? "text-white" : "text-blue-500"}`}
                >
                  {link.icon}
                </span>
                {link.name}
                {active && (
                  <span className="material-symbols-outlined text-[16px] ml-auto opacity-70">
                    chevron_right
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer CTAs */}
        <div className="px-4 pb-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
          <Link
            href="/contact#enquiry-form"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">request_quote</span>
            Get a Quote
          </Link>
          <a
            href={`https://wa.me/${COMPANY_INFO.phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[14px] font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            WhatsApp Us
          </a>
          <div className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 font-medium">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span>Coimbatore, Tamil Nadu</span>
          </div>
        </div>
      </div>
    </>
  );
}

