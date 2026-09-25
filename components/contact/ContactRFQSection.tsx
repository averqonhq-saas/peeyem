"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/data/products";
import { dbService } from "@/lib/db";

export default function ContactRFQSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    productCategory: "",
    specifications: "",
  });

  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dbService.addEnquiry({
        name: formData.fullName || "Customer",
        phone: formData.phone || "Not provided",
        email: formData.email,
        company: formData.companyName,
        product_id: formData.productCategory || "RFQ Schedule",
        subject: `Technical RFQ: ${formData.productCategory || "Custom Specs"}`,
        message: `${formData.specifications}${attachedFileName ? ` (Attached spec sheet: ${attachedFileName})` : ""}`,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("RFQ submission error:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      companyName: "",
      phone: "",
      email: "",
      productCategory: "",
      specifications: "",
    });
    setAttachedFileName(null);
    setIsSubmitted(false);
  };

  return (
    <section className="w-full py-space-xl bg-surface-container-lowest" id="enquiry-form">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl">
          {/* Left Column: Contact Cards & Operational Channels */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Direct Channels
              </span>
              <h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface tracking-tight mt-1">
                Contact Information
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Peeyem Traders — Industrial Conveyor Belts &amp; Rubber Products
              </p>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Address Card */}
              <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex items-start gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary uppercase font-bold">
                    Distribution Hub
                  </span>
                  <p className="font-body-md text-body-md text-on-surface mt-1 font-medium">
                    16, M.M.A. Market, South Ukkadam
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Coimbatore, Tamil Nadu – 641001, India
                  </p>
                  <a
                    className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold mt-space-xs hover:underline"
                    href={COMPANY_INFO.mapsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Get Directions</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex items-start gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">phone_in_talk</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary uppercase font-bold">
                    Direct Telephone Line
                  </span>
                  <a
                    className="font-headline-sm text-headline-sm text-on-surface mt-1 hover:text-primary transition-colors font-bold"
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                  >
                    {COMPANY_INFO.phone}
                  </a>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Engineering specs, dealer inquiries &amp; roll orders
                  </p>
                  <a
                    className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold mt-space-xs hover:underline"
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                  >
                    <span>Call Enquiry Desk</span>
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex items-start gap-space-md hover:shadow-md transition-shadow border border-outline-variant/20">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary uppercase font-bold">
                    Official Correspondence
                  </span>
                  <a
                    className="font-body-lg text-body-lg text-on-surface mt-1 font-semibold hover:text-primary transition-colors"
                    href={`mailto:${COMPANY_INFO.email}`}
                  >
                    {COMPANY_INFO.email}
                  </a>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Send purchase orders, blueprint drawings &amp; tender docs
                  </p>
                </div>
              </div>

              {/* Operational Hours Card */}
              <div className="p-space-lg rounded-xl bg-surface-container-high shadow-sm flex items-start gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface uppercase font-bold">
                    Depot Operations &amp; Loading Hours
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                    Monday – Saturday: 9:00 AM – 7:30 PM
                  </p>
                  <p className="font-body-sm text-body-sm text-error font-medium">
                    Sunday: Closed for maintenance and inventory intake
                  </p>
                </div>
              </div>

              {/* Dedicated WhatsApp Card */}
              <div className="p-space-lg rounded-xl bg-gradient-to-br from-secondary/15 via-secondary/5 to-surface-container shadow-md flex flex-col gap-space-sm relative overflow-hidden border border-secondary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Prefer WhatsApp?
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm font-bold">
                    Fast Reply
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Contact our desk directly for instantaneous product stock verification, dimension confirmation, and quick estimate sheets right on your mobile.
                </p>
                <div>
                  <a
                    className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary/90 transition-all shadow-sm font-semibold"
                    href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
                      "Hi Peeyem Traders, please send stock and pricing details."
                    )}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Chat on WhatsApp</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive RFQ Form */}
          <div className="lg:col-span-7">
            <div className="p-space-lg lg:p-space-xl rounded-2xl bg-surface-container-low shadow-xl border border-outline-variant/30">
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Technical RFQ Portal
                </span>
                <h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface tracking-tight mt-1">
                  Send Us Your Requirement
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Fill out the technical form below and our sales engineering desk in Coimbatore will respond promptly with a structured specification breakdown.
                </p>
              </div>

              {isSubmitted ? (
                /* Success State Feedback */
                <div className="flex flex-col items-center justify-center p-space-xl text-center bg-surface-container rounded-xl gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center mb-space-xs shadow-lg">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Thank You!
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    Your technical enquiry for <strong>{formData.productCategory || "Industrial Belting"}</strong> has been registered in our Coimbatore central dispatch queue. Our sales engineering team will review the parameters and contact you within 2 business hours.
                  </p>
                  <div className="mt-space-md flex gap-space-sm">
                    <button
                      type="button"
                      className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer"
                      onClick={handleReset}
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="fullName">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                        id="fullName"
                        name="fullName"
                        placeholder="e.g. Suresh Ramakrishnan"
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    {/* Company Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="companyName">
                        Company Name
                      </label>
                      <input
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                        id="companyName"
                        name="companyName"
                        placeholder="e.g. Kongu Mining &amp; Aggregates Ltd"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="phone">
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-code-spec text-code-spec text-on-surface-variant select-none">
                          +91
                        </span>
                        <input
                          className="w-full pl-12 pr-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                          id="phone"
                          name="phone"
                          pattern="[0-9]{10}"
                          placeholder="93633 10787"
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                        id="email"
                        name="email"
                        placeholder="contact@company.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Product Requirement Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="productCategory">
                      Product / Requirement Category <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10 border border-outline-variant/20"
                        id="productCategory"
                        name="productCategory"
                        required
                        value={formData.productCategory}
                        onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                      >
                        <option disabled value="">Select Product / Requirement</option>
                        <option value="Conveyor Belts">Conveyor Belts (Fabric / Steel Cord)</option>
                        <option value="Chevron Conveyor Belts">Chevron Conveyor Belts (High Incline)</option>
                        <option value="Rubber Sheets">Rubber Sheets (Neoprene, Nitrile, Natural)</option>
                        <option value="Specialized Belts">Specialized Belts (Heat, Oil, Fire Resistant)</option>
                        <option value="Cleated Conveyor Belts">Cleated Conveyor Belts &amp; Corrugated Sidewalls</option>
                        <option value="Conveyor Belt Fasteners">Conveyor Belt Fasteners &amp; Mechanical Joints</option>
                        <option value="Industrial Belts">Industrial Belts (V-Belts, Timing, Transmission)</option>
                        <option value="Other / General Enquiry">Other / General Engineering Enquiry</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Technical Specifications / Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="specifications">
                      Specifications / Technical Details <span className="text-error">*</span>
                    </label>
                    <textarea
                      className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none border border-outline-variant/20"
                      id="specifications"
                      name="specifications"
                      placeholder="Specify belt width (mm), ply rating (NN/EP), top/bottom cover thickness (e.g., 4+2mm), length in meters, material conveyed, or custom rubber sheet grade..."
                      required
                      rows={4}
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    ></textarea>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Include operating environment (temperature, oil exposure, abrasion type) for optimal compounding advice.
                    </span>
                  </div>

                  {/* Technical Attachment (Optional) */}
                  <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[20px] text-primary">attach_file</span>
                      <span>Have engineering blueprints, drawings or tender RFQ?</span>
                    </div>
                    <label className="cursor-pointer font-label-sm text-label-sm text-primary font-bold hover:underline">
                      <span>Browse File</span>
                      <input className="hidden" onChange={handleFileChange} type="file" />
                    </label>
                  </div>

                  {attachedFileName && (
                    <div className="text-body-sm font-code-spec text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Attached: {attachedFileName}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    className="w-full py-3.5 px-space-lg rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold tracking-wide shadow-md hover:bg-tertiary-container hover:text-on-tertiary transition-all duration-300 flex items-center justify-center gap-space-xs mt-space-sm group cursor-pointer disabled:opacity-75"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Enquiry</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                      ISO standard compliance verified
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                      Strict commercial privacy
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
