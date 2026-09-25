import Link from "next/link";
import { COMPANY_INFO } from "@/data/products";

const quickLinks = [
  { name: "Home", href: "/", isHome: true },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Applications", href: "/#applications" },
  { name: "Technical Resources", href: "/products#specifications" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const productsList = [
  { name: "Conveyor Belts", icon: "sync_alt", href: "/products" },
  { name: "Chevron Belts", icon: "linear_scale", href: "/products#chevron-belts" },
  { name: "Rubber Sheets", icon: "layers", href: "/products#rubber-sheets" },
  { name: "Belt Fasteners", icon: "link", href: "/products#belt-fasteners" },
  { name: "Roller Accessories", icon: "settings", href: "/products#accessories" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f0f4f9] text-slate-700 border-t border-slate-200/70 font-sans">
      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* ── Column 1: Brand & Overview ── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-black uppercase tracking-tight text-[#1b365d]">
              PEEYEM TRADERS
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed max-w-xs">
              Peeyem Traders - Industrial Conveyor Belts, Rubber Sheets, Specialized Belts, Conveyor Accessories and Material-Handling Products.
            </p>
            <div className="pt-2">
              <a
                href={COMPANY_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-700 hover:text-blue-700 transition-colors group"
              >
                <span className="material-symbols-outlined text-[17px] text-teal-600 group-hover:text-blue-700">
                  location_on
                </span>
                <span>View on Google Maps</span>
              </a>
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1b365d]">
              QUICK LINKS
            </h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] transition-colors ${
                    link.isHome
                      ? "font-bold text-slate-900 hover:text-blue-700"
                      : "text-slate-600 hover:text-blue-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Column 3: Products (with Icons) ── */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1b365d]">
              PRODUCTS
            </h4>
            <ul className="flex flex-col gap-2.5">
              {productsList.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-[13px] text-slate-600 hover:text-blue-700 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[16px] text-teal-600 group-hover:text-blue-700 shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact Information ── */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1b365d]">
              CONTACT INFORMATION
            </h4>
            <div className="flex flex-col gap-3 text-[13px] text-slate-600">
              <p className="leading-snug">
                16, M.M.A. Market, South Ukkadam,<br />
                Coimbatore, Tamil Nadu – 641001.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-600 group-hover:text-blue-700 shrink-0">
                    call
                  </span>
                  <span>{COMPANY_INFO.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${COMPANY_INFO.phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-600 group-hover:text-teal-700 shrink-0">
                    chat
                  </span>
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors group"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-600 group-hover:text-blue-700 shrink-0">
                    mail
                  </span>
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Sub-Footer / Copyright Strip ── */}
      <div className="w-full bg-[#e3ecf6] border-t border-slate-200/80 py-3.5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-slate-600">
          <p>© Peeyem Traders. All Rights Reserved.</p>
          <p className="text-slate-600">Industrial Material Handling Solutions</p>
        </div>
      </div>
    </footer>
  );
}
