"use client";

import { useState } from "react";
import { dbService } from "@/lib/db";

interface ProductRFQModalProps {
  productName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductRFQModal({
  productName,
  isOpen,
  onClose,
}: ProductRFQModalProps) {
  const [formData, setFormData] = useState({
    width: "",
    length: "",
    material: "",
    phone: "",
    email: "",
    specs: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Customer (${formData.phone})`,
          phone: formData.phone,
          email: formData.email || "inquiry@peeyemtraders.com",
          subject: `Product RFQ: ${productName || "Conveyor Solution"}`,
          message: `Width: ${formData.width || "N/A"}, Length: ${formData.length || "N/A"}, Material: ${formData.material || "N/A"}. Specific Notes: ${formData.specs || "None"}`,
          source: "Product Catalog Quick RFQ Modal",
        }),
      });
      const data = await res.json();
      if (data.success && data.enquiry) {
        await dbService.addEnquiry(data.enquiry);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("RFQ modal submit error:", err);
      await dbService.addEnquiry({
        name: `Customer (${formData.phone})`,
        phone: formData.phone || "Not provided",
        email: formData.email || "inquiry@peeyemtraders.com",
        product_id: productName || "Conveyor Solution",
        subject: `Product RFQ: ${productName || "Product"}`,
        message: `Width: ${formData.width || "N/A"}, Length: ${formData.length || "N/A"}, Material: ${formData.material || "N/A"}. Notes: ${formData.specs || "None"}`,
        source: "Product Catalog Quick RFQ Modal",
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl relative overflow-hidden border border-outline-variant/30">
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="mb-space-md">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Direct Specification Request
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
            {productName || "Conveyor Solution Request"}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Immediate pricing and inventory availability from Peeyem Traders Coimbatore.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Required Belt Width (mm) *
              </label>
              <input
                className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                placeholder="e.g. 800mm"
                required
                type="text"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Total Length (Meters) *
              </label>
              <input
                className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                placeholder="e.g. 120 meters"
                required
                type="text"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Material Handled
              </label>
              <input
                className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                placeholder="e.g. Crushed Aggregate, Sand, Clinker"
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Contact Phone / WhatsApp *
              </label>
              <input
                className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                placeholder="+91 93633 10787"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Email Address (For Quote PDF &amp; Pricing)
              </label>
              <input
                className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                placeholder="name@company.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant">
              Additional Specifications or Questions
            </label>
            <textarea
              className="w-full mt-1 p-2.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container resize-none border border-outline-variant/20"
              placeholder="e.g. Cleat height requirement, specific pulley diameter..."
              rows={2}
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              className="px-space-md py-2 rounded-lg font-label-md text-label-md bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-space-lg py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-70 font-semibold"
              type="submit"
              disabled={submitted}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{submitted ? "Sending..." : "Send RFQ Directly"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
