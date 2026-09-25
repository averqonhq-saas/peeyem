import { COMPANY_INFO } from "@/data/products";

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="WhatsApp Quick Inquiry" className="fixed bottom-6 right-6 z-40">
      <a
        className="group flex items-center gap-2 px-4 py-3 rounded-full bg-secondary text-on-secondary shadow-xl hover:scale-105 hover:bg-secondary/90 transition-all duration-300"
        href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
          "Hi Peeyem Traders, I am interested in your conveyor belts and rubber solutions."
        )}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="material-symbols-outlined text-[24px]">chat</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-label-md">
          WhatsApp Chat
        </span>
      </a>
    </aside>
  );
}
