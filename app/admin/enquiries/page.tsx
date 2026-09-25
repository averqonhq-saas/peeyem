"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/lib/db";
import { DbEnquiry, EnquiryStatus } from "@/types/admin";

function EnquiriesContent() {
  const searchParams = useSearchParams();
  const [enquiries, setEnquiries] = useState<DbEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedEnquiry, setSelectedEnquiry] = useState<DbEnquiry | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    // Real-Time subscription for enquiries (subscribes once on mount)
    const unsubscribe = dbService.subscribeEnquiries((list) => {
      setEnquiries(list);
      setLoading(false);
      // Keep selected enquiry in sync if open using functional state updater
      setSelectedEnquiry((prev) => {
        if (!prev) return null;
        const fresh = list.find((e) => e.id === prev.id);
        return fresh ?? prev;
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && enquiries.length > 0) {
      const found = enquiries.find((e) => e.id === id);
      if (found) {
        setSelectedEnquiry((prev) => {
          if (prev?.id === id) return prev;
          setNotesInput(found.notes || "");
          return found;
        });
      }
    }
  }, [searchParams, enquiries]);

  const openEnquiryDrawer = (enquiry: DbEnquiry) => {
    setSelectedEnquiry(enquiry);
    setNotesInput(enquiry.notes || "");
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    setUpdatingStatus(true);
    try {
      const updated = await dbService.updateEnquiryStatus(
        selectedEnquiry.id,
        newStatus,
        notesInput
      );
      setSelectedEnquiry(updated);
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setUpdatingStatus(true);
    try {
      const updated = await dbService.updateEnquiryStatus(
        selectedEnquiry.id,
        selectedEnquiry.status,
        notesInput
      );
      setSelectedEnquiry(updated);
      showToast("Follow-up note saved!");
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      await dbService.deleteEnquiry(id);
      setSelectedEnquiry(null);
      setDeleteConfirmId(null);
      showToast("Enquiry deleted.");
    } catch (err) {
      console.error("Error deleting enquiry:", err);
    }
  };

  const getCleanPhone = (raw: string) => {
    return raw.replace(/[^0-9]/g, "");
  };

  const getWhatsAppLink = (enq: DbEnquiry) => {
    const phoneClean = getCleanPhone(enq.phone);
    const formattedPhone = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    const text = encodeURIComponent(
      `Hello ${enq.name}, thank you for contacting Peeyem Traders regarding your inquiry for "${enq.product_id || enq.subject || "conveyor belting"}". How can we assist you with technical specifications or pricing today?`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.product_id && e.product_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.subject && e.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countNew = enquiries.filter((e) => e.status === "NEW").length;
  const countContacted = enquiries.filter((e) => e.status === "CONTACTED").length;
  const countClosed = enquiries.filter((e) => e.status === "CLOSED").length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#ff8d28] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff8d28] text-2xl">mail</span>
            <span>Customer Enquiries</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pipeline of requests submitted from public contact and catalog quotation forms.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Total: <strong className="text-white">{enquiries.length}</strong> inquiries
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0e1720] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              statusFilter === "ALL"
                ? "bg-[#ff8d28] text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter("NEW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "NEW"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "bg-slate-900 text-amber-400 hover:bg-slate-800"
            }`}
          >
            <span>NEW</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950/40 text-amber-200">
              {countNew}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("CONTACTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "CONTACTED"
                ? "bg-blue-500 text-white font-black shadow-sm"
                : "bg-slate-900 text-blue-400 hover:bg-slate-800"
            }`}
          >
            <span>CONTACTED</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-950/40 text-blue-200">
              {countContacted}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("CLOSED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === "CLOSED"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "bg-slate-900 text-emerald-400 hover:bg-slate-800"
            }`}
          >
            <span>CLOSED</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/40 text-emerald-200">
              {countClosed}
            </span>
          </button>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries by customer name, phone number, email, or requirements..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl bg-[#0e1720] border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Synchronizing live enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-slate-600">inbox</span>
            <span>No enquiries found matching this filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Subject / Product</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEnquiries.map((enq) => {
                  const dateStr = new Date(enq.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => openEnquiryDrawer(enq)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          {enq.status === "NEW" && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          )}
                          <span>{enq.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-200">
                        {enq.phone}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {enq.product_id || enq.subject || "General Inquiry"}
                        </span>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {enq.message}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-4 text-center">
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

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEnquiryDrawer(enq)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#ff8d28] hover:text-white px-3 py-1.5 rounded-lg bg-[#ff8d28]/10 hover:bg-[#ff8d28] transition-colors"
                        >
                          <span>Open</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ENQUIRY DETAILS MODAL ================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1720] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8d28]">contact_page</span>
                <h2 className="font-bold text-base text-white">Enquiry Details</h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-white">{selectedEnquiry.name}</h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedEnquiry.status === "NEW"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : selectedEnquiry.status === "CONTACTED"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {selectedEnquiry.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-mono text-white hover:text-[#ff8d28] font-bold"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  {selectedEnquiry.email && (
                    <div>
                      <span className="text-slate-500 block">Email:</span>
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="text-slate-300 hover:text-white break-all"
                      >
                        {selectedEnquiry.email}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block">Product Interest:</span>
                    <span className="text-amber-300 font-semibold">
                      {selectedEnquiry.product_id || selectedEnquiry.subject || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Received:</span>
                    <span className="text-slate-300">
                      {new Date(selectedEnquiry.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Client Message / Specifications:
                </label>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  &ldquo;{selectedEnquiry.message}&rdquo;
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Inquiry Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["NEW", "CONTACTED", "CLOSED"] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        selectedEnquiry.status === st
                          ? st === "NEW"
                            ? "bg-amber-500 text-slate-950 border-amber-400"
                            : st === "CONTACTED"
                            ? "bg-blue-600 text-white border-blue-400"
                            : "bg-emerald-600 text-white border-emerald-400"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Internal Follow-Up Notes:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Sent quote via WhatsApp, waiting for site specs..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Direct Response Actions:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Call</span>
                  </a>

                  <a
                    href={getWhatsAppLink(selectedEnquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={selectedEnquiry.email ? `mailto:${selectedEnquiry.email}?subject=Peeyem Traders - ${encodeURIComponent(selectedEnquiry.product_id || "Inquiry Response")}` : "#"}
                    onClick={(e) => {
                      if (!selectedEnquiry.email) {
                        e.preventDefault();
                        alert("No email address provided for this enquiry. Please use Call or WhatsApp.");
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">mail</span>
                    <span>Email</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete Enquiry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Delete Enquiry?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently remove this customer enquiry record?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEnquiriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading enquiries...</div>}>
      <EnquiriesContent />
    </Suspense>
  );
}
