"use client";

import { useState } from "react";
import Image from "next/image";
import { COMPANY_INFO } from "@/data/products";
import { dbService } from "@/lib/db";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    category: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/enquiries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          subject: formData.category ? `Quote: ${formData.category}` : "Technical Inquiry",
          message: formData.message,
          source: "Homepage Contact Section",
        }),
      });
      const data = await res.json();
      if (data.success && data.enquiry) {
        setSubmittedEnquiryId(data.enquiryId);
        // Also save to client dbService for instant local-sync preview
        await dbService.addEnquiry(data.enquiry);
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      // Fallback to client dbService
      const saved = await dbService.addEnquiry({
        name: formData.name || "Customer",
        phone: formData.phone || "Not provided",
        email: formData.email,
        company: formData.company,
        product_id: formData.category || "General Inquiries",
        subject: formData.category ? `Quote: ${formData.category}` : "Technical Inquiry",
        message: formData.message || "Request for quotation submitted via homepage contact form.",
        source: "Homepage Contact Section",
      });
      setSubmittedEnquiryId(saved.id);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-surface-container-low py-10 sm:py-16 lg:py-24" id="contact">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-space-xl">
          {/* Left: Contact Details & Map Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-secondary uppercase tracking-widest font-bold">
                Direct Contact
              </span>
              <h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface">
                Get in Touch with Peeyem Traders
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Visit our Coimbatore distribution center or submit your technical schedule below for prompt quotes.
              </p>

              <div className="flex flex-col gap-4 pt-space-xs">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold">Office &amp; Warehouse</span>
                    <span className="font-body-sm text-on-surface-variant">{COMPANY_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">call</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold">Telephone Support</span>
                    <a
                      className="font-body-sm text-primary font-semibold hover:underline"
                      href={`tel:${COMPANY_INFO.phoneRaw}`}
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">mail</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold">Email Inquiries</span>
                    <a
                      className="font-body-sm text-primary font-semibold hover:underline"
                      href={`mailto:${COMPANY_INFO.email}`}
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map Card */}
            <div className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20">
              <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-dim">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmooil5yiv7Rx1hJbJk4aHK9d00Z383W_0gqP4JVM3FbjE_FrKdv-l6w-_F60y1dzjz7S1v3HUNJ2AqO39jR__zvqqrbv9gdAoEqoHbBKjriZwDni3uaK5SnjMX6pLpKsB5ObZeZ8xBPFxmuw-11du8SjIi0pu72RFUjBPOYUMUPvzVPmFBRdZav0ZEv6otK5CYnzWfrs4IMJCKezcbCD8R-HMjNdG_af7bfKUg9zrtQE7jFo__dIveg"
                  alt="Peeyem Traders warehouse location in South Ukkadam Coimbatore"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 450px"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-body-sm text-[12px] text-on-surface-variant font-medium">
                  South Ukkadam, Coimbatore
                </span>
                <a
                  className="inline-flex items-center gap-1 font-label-sm text-secondary font-bold hover:underline"
                  href={COMPANY_INFO.mapsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Open in Maps</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Clean Industrial Enquiry Form */}
          <div className="lg:col-span-7 rounded-2xl bg-surface-container-lowest p-5 sm:p-8 lg:p-10 shadow-md border border-outline-variant/30">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Thank You for Your Inquiry!
                </h3>
                {submittedEnquiryId && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                    <span>Enquiry Reference: {submittedEnquiryId}</span>
                  </div>
                )}
                <p className="font-body-md text-on-surface-variant max-w-md">
                  We have received your quotation request for <strong>{formData.category || "Industrial Belting"}</strong>. A confirmation email has been sent to <strong>{formData.email}</strong>. Our technical desk will reach out within 2 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedEnquiryId("");
                    setFormData({ name: "", company: "", phone: "", email: "", category: "", message: "" });
                  }}
                  className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-headline-md text-body-lg sm:text-headline-md font-bold text-on-surface">
                  Request Technical Quotation
                </h3>
                <p className="font-body-sm text-on-surface-variant -mt-2">
                  Provide belt rating, dimensions, or rubber sheet type.
                </p>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-name">
                      Your Name *
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                      id="contact-name"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-company">
                      Company / Plant Name
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                      id="contact-company"
                      placeholder="e.g. Premier Aggregates Ltd"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-phone">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                      id="contact-phone"
                      placeholder="+91 63794 85898"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                      id="contact-email"
                      placeholder="name@company.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-category">
                    Primary Product Requirement *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                    id="contact-category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select a Category</option>
                    <option value="Chevron Conveyor Belts">Chevron Conveyor Belts (C15, C25, C32)</option>
                    <option value="Multi-ply Conveyor Belts">Multi-ply Flat Conveyor Belts (NN / EP)</option>
                    <option value="Industrial Rubber Sheets">Industrial Rubber Sheets (Natural / Neoprene / Nitrile)</option>
                    <option value="Heat Resistant Belts">Heat / Oil Resistant Belts (HR / SHR / OR)</option>
                    <option value="Conveyor Belt Fasteners">Mechanical Belt Fasteners &amp; Lacing</option>
                    <option value="Conveyor Accessories">Conveyor Accessories (Skirting / Pulley Lagging)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-on-surface-variant uppercase font-semibold" htmlFor="contact-message">
                    Specifications / Width / Length / Details
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner border border-outline-variant/20"
                    id="contact-message"
                    placeholder="Please specify belt width (mm), plies, cover thickness, or sheet roll length..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    className="w-full px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-all shadow-md cursor-pointer min-h-[48px]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                  <a
                    className="w-full px-6 py-3.5 rounded-lg bg-surface-container text-secondary font-label-md font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-2 min-h-[48px]"
                    href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
                      "Hi Peeyem Traders, I would like to request a formal quote."
                    )}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chat</span>
                    <span>Enquire via WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
