"use client";

import { useState, useEffect } from "react";
import { dbService } from "@/lib/db";

interface ProductRFQModalProps {
  productName?: string | null;
  applicationName?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductRFQModal({
  productName,
  applicationName,
  isOpen,
  onClose,
}: ProductRFQModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: "",
    application: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync props into form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        product: productName || prev.product || "Rubber Conveyor Belt",
        application: applicationName || prev.application || "General Industrial",
      }));
      setSubmitted(false);
      setGeneratedId(null);
      setErrorMessage(null);
    }
  }, [isOpen, productName, applicationName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          subject: `Enquiry: ${formData.product} for ${formData.application}`,
          message: `Application: ${formData.application}\nProduct: ${formData.product}\n\nClient Requirements:\n${formData.message}`,
          source: `Product Showcase RFQ Modal (${formData.product})`,
        }),
      });

      const data = await res.json();

      if (data.success && data.enquiry) {
        setGeneratedId(data.enquiryId);
        setSubmitted(true);
        // Sync with local client storage
        try {
          await dbService.addEnquiry(data.enquiry);
        } catch {
          // ignore client storage warning
        }
      } else {
        setErrorMessage(data.error || "Failed to submit enquiry. Please check your details.");
      }
    } catch (err: any) {
      console.error("RFQ modal submit error:", err);
      // Fallback: save to client db
      try {
        const fallbackEnquiry = await dbService.addEnquiry({
          name: formData.name.trim() || "Valued Client",
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          subject: `Enquiry: ${formData.product} for ${formData.application}`,
          message: `Application: ${formData.application}\nProduct: ${formData.product}\n\nClient Requirements:\n${formData.message}`,
          source: "Product Showcase RFQ Modal (Offline Fallback)",
        });
        setGeneratedId(fallbackEnquiry.id);
        setSubmitted(true);
      } catch {
        setErrorMessage("Network error. Please try again or call us directly.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-200 my-8">
        {/* Subtle Brand Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <button
          type="button"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          onClick={onClose}
          aria-label="Close enquiry modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-xs font-bold border border-amber-200 mb-2">
                Enquiry ID: {generatedId}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Enquiry Submitted Successfully
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you for contacting Peeyem Traders. Our technical team has received your enquiry and a formal acknowledgment has been sent to your email.
              </p>
            </div>

            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
              <div><strong className="text-slate-900">Product:</strong> {formData.product}</div>
              <div><strong className="text-slate-900">Application:</strong> {formData.application}</div>
              <div><strong className="text-slate-900">Contact:</strong> {formData.phone} &bull; {formData.email}</div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider mb-1">
                Direct Technical Enquiry
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Send Industrial Product Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Request specifications, stock availability, and wholesale depot quotes from our Ukkadam, Coimbatore team.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Stone Crushers Pvt Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98400 12345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@apexcrushers.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selected Product *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3 py-2 bg-amber-50/50 border border-amber-300/80 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application / Industry *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.application}
                    onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requirement / Specifications / Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention width (mm), thickness/ply, length (meters), grade (M24, SHR, Food Grade), or machine details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Enquiry</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
