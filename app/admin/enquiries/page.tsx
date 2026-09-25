"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/lib/db";
import { DbEnquiry, EnquiryMessage, EnquiryStatus } from "@/types/admin";

function EnquiriesContent() {
  const searchParams = useSearchParams();
  const [enquiries, setEnquiries] = useState<DbEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  // Active Enquiry & Conversation
  const [selectedEnquiry, setSelectedEnquiry] = useState<DbEnquiry | null>(null);
  const [composerMode, setComposerMode] = useState<"REPLY" | "NOTE">("REPLY");
  const [replyText, setReplyText] = useState("");
  const [composerStatus, setComposerStatus] = useState<EnquiryStatus | "KEEP">("KEEP");
  const [sendingReply, setSendingReply] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = dbService.subscribeEnquiries((list) => {
      setEnquiries(list);
      setLoading(false);
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
        setSelectedEnquiry(found);
      }
    }
  }, [searchParams, enquiries]);

  // Scroll to bottom of conversation timeline when selected enquiry changes or replies added
  useEffect(() => {
    if (selectedEnquiry) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedEnquiry?.conversation?.length, selectedEnquiry?.id]);

  // Status Change
  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    try {
      const updated = await dbService.updateEnquiryStatus(selectedEnquiry.id, newStatus);
      setSelectedEnquiry(updated);
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Failed to update status", "error");
    }
  };

  // Submit Reply or Internal Note
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyText.trim()) return;

    setSendingReply(true);
    const isInternal = composerMode === "NOTE";
    const textToSend = replyText.trim();
    const nextStatus = composerStatus !== "KEEP" ? composerStatus : undefined;

    try {
      const res = await fetch("/api/enquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: selectedEnquiry.id,
          replyMessage: textToSend,
          isInternal,
          newStatus: nextStatus,
          adminName: "Peeyem Traders Operations",
          customerName: selectedEnquiry.name,
          customerEmail: selectedEnquiry.email,
          customerPhone: selectedEnquiry.phone,
          subject: selectedEnquiry.subject,
          originalMessage: selectedEnquiry.message,
        }),
      });

      const data = await res.json();

      if (data.success && data.newMessage) {
        // Optimistically record to local service
        await dbService.addEnquiryMessage(
          selectedEnquiry.id,
          {
            sender: "ADMIN",
            sender_name: "Peeyem Traders Operations",
            sender_email: "peeyemtraders16@gmail.com",
            message: textToSend,
            is_internal: isInternal,
            delivery_status: data.emailSent ? "SENT" : isInternal ? undefined : "FAILED",
            email_message_id: data.newMessage.email_message_id,
            error_message: data.error,
          },
          nextStatus
        );

        setReplyText("");
        setComposerStatus("KEEP");
        showToast(
          isInternal
            ? "Internal staff note saved."
            : data.emailSent
            ? "Reply sent to customer's email!"
            : "Reply recorded (Email service note: saved in log)."
        );
      } else {
        showToast(data.error || "Failed to process reply.", "error");
      }
    } catch (err: any) {
      console.error("Reply error:", err);
      // Fallback: save to client db
      await dbService.addEnquiryMessage(
        selectedEnquiry.id,
        {
          sender: "ADMIN",
          sender_name: "Peeyem Traders Operations",
          sender_email: "peeyemtraders16@gmail.com",
          message: textToSend,
          is_internal: isInternal,
        },
        nextStatus
      );
      setReplyText("");
      showToast(isInternal ? "Internal note saved." : "Reply recorded in timeline.");
    } finally {
      setSendingReply(false);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id: string) => {
    try {
      await dbService.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      setDeleteConfirmId(null);
      showToast("Enquiry deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete enquiry", "error");
    }
  };

  // Metrics Calculations
  const totalCount = enquiries.length;
  const countNew = enquiries.filter((e) => e.status === "NEW").length;
  const countContacted = enquiries.filter((e) => e.status === "CONTACTED").length;
  const countInProgress = enquiries.filter((e) => e.status === "IN_PROGRESS").length;
  const countConverted = enquiries.filter((e) => e.status === "CONVERTED").length;
  const countClosed = enquiries.filter((e) => e.status === "CLOSED").length;
  const countPendingReply = enquiries.filter((e) => {
    if (e.status === "CLOSED" || e.status === "CONVERTED") return false;
    const lastMsg = e.conversation?.[e.conversation.length - 1];
    return !lastMsg || lastMsg.sender === "CUSTOMER" || e.status === "NEW";
  }).length;

  // Filtered list
  const filteredEnquiries = enquiries.filter((e) => {
    // Status filter
    if (statusFilter !== "ALL" && e.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== "ALL") {
      const createdDate = new Date(e.created_at);
      const now = new Date();
      if (dateFilter === "TODAY") {
        if (createdDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === "WEEK") {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        if (createdDate < weekAgo) return false;
      } else if (dateFilter === "MONTH") {
        const monthAgo = new Date(now.getTime() - 30 * 86400000);
        if (createdDate < monthAgo) return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = e.name.toLowerCase().includes(q);
      const matchEmail = e.email.toLowerCase().includes(q);
      const matchPhone = e.phone.includes(q);
      const matchSubject = (e.subject || "").toLowerCase().includes(q);
      const matchCompany = (e.company || "").toLowerCase().includes(q);
      const matchId = e.id.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchSubject || matchCompany || matchId;
    }

    return true;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">NEW</span>;
      case "CONTACTED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/30">CONTACTED</span>;
      case "IN_PROGRESS":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/30">IN PROGRESS</span>;
      case "CONVERTED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">CONVERTED</span>;
      case "CLOSED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${text} to clipboard!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border animate-in fade-in slide-in-from-bottom-2 ${
            toastMessage.type === "error"
              ? "bg-red-950 text-red-200 border-red-800"
              : "bg-slate-900 text-white border-[#ff8d28]/60 shadow-[#ff8d28]/20"
          }`}
        >
          <span className="material-symbols-outlined text-sm text-[#ff8d28]">
            {toastMessage.type === "error" ? "error" : "check_circle"}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff8d28] text-2xl">mail</span>
            <span>Enquiries &amp; Customer Conversations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming inquiries, reply directly via email, track communication threads, and log internal team notes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SMTP: peeyemtraders16@gmail.com</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0e1720] border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</div>
          <div className="text-2xl font-extrabold text-white mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">All customer leads received</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1720] border border-amber-500/20 bg-amber-500/5">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>New Leads</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">{countNew}</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">Awaiting initial review</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1720] border border-blue-500/20 bg-blue-500/5">
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Replies</span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          </div>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">{countPendingReply}</div>
          <div className="text-[10px] text-blue-400/80 mt-0.5">Customer message needs response</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1720] border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Converted Orders</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1">{countConverted}</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Successfully fulfilled sales</div>
        </div>
      </div>

      {/* Main Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Filterable Enquiry List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Bar */}
          <div className="p-3 rounded-2xl bg-[#0e1720] border border-slate-800 space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, email, subject, or ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { key: "ALL", label: "All", count: totalCount },
                { key: "NEW", label: "New", count: countNew },
                { key: "CONTACTED", label: "Contacted", count: countContacted },
                { key: "IN_PROGRESS", label: "In Progress", count: countInProgress },
                { key: "CONVERTED", label: "Converted", count: countConverted },
                { key: "CLOSED", label: "Closed", count: countClosed },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                    statusFilter === filter.key
                      ? "bg-[#ff8d28] text-slate-950 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                    statusFilter === filter.key ? "bg-black/20 text-slate-950 font-black" : "bg-slate-800 text-slate-300"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Date filter dropdown */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>Showing {filteredEnquiries.length} results</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300 focus:outline-none focus:border-[#ff8d28]"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">Past 7 Days</option>
                <option value="MONTH">Past 30 Days</option>
              </select>
            </div>
          </div>

          {/* Scrollable Enquiry List */}
          <div className="rounded-2xl bg-[#0e1720] border border-slate-800 overflow-hidden divide-y divide-slate-800/60 max-h-[680px] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">Loading enquiries...</div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-slate-600">inbox</span>
                <span>No enquiries found matching this filter.</span>
              </div>
            ) : (
              filteredEnquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const conversationCount = enq.conversation?.length || 1;
                const lastMsg = enq.conversation?.[enq.conversation.length - 1];
                const lastSender = lastMsg?.sender || "CUSTOMER";

                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-slate-800/80 border-l-4 border-l-[#ff8d28]"
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-[#ff8d28] font-bold text-xs flex items-center justify-center shrink-0">
                          {enq.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-white text-xs truncate">
                          {enq.name}
                        </div>
                        {enq.company && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                            • {enq.company}
                          </span>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {getStatusBadge(enq.status)}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-300 truncate">
                      {enq.subject || "Product Inquiry"}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {lastMsg?.message || enq.message}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-400">{enq.id}</span>
                        {conversationCount > 1 && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            💬 {conversationCount}
                          </span>
                        )}
                        {lastSender === "ADMIN" && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">done_all</span>
                            <span>Replied</span>
                          </span>
                        )}
                      </div>
                      <span>
                        {new Date(enq.updated_at || enq.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation & Thread (7 cols on lg) */}
        <div className="lg:col-span-7">
          {!selectedEnquiry ? (
            <div className="p-16 rounded-2xl bg-[#0e1720] border border-slate-800 text-center flex flex-col items-center justify-center gap-3 min-h-[500px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-3xl">chat</span>
              </div>
              <h3 className="text-sm font-bold text-white">No Enquiry Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Select an enquiry from the left list to view customer requirements, send email replies, and post internal follow-up notes.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0e1720] border border-slate-800 flex flex-col overflow-hidden shadow-xl">
              {/* Header Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-extrabold text-white">
                        {selectedEnquiry.name}
                      </h2>
                      {selectedEnquiry.company && (
                        <span className="text-xs text-slate-400 font-medium">
                          ({selectedEnquiry.company})
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(selectedEnquiry.id)}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-[#ff8d28] border border-slate-800 hover:border-[#ff8d28] transition-colors"
                        title="Click to copy ID"
                      >
                        {selectedEnquiry.id} 📋
                      </button>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5">
                      {selectedEnquiry.subject || "Industrial Product Inquiry"}
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#ff8d28]"
                    >
                      <option value="NEW">Status: NEW</option>
                      <option value="CONTACTED">Status: CONTACTED</option>
                      <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                      <option value="CONVERTED">Status: CONVERTED</option>
                      <option value="CLOSED">Status: CLOSED</option>
                    </select>

                    <button
                      onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
                      title="Delete enquiry"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                {/* Customer Contact Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="material-symbols-outlined text-sm text-slate-500">mail</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-[#ff8d28] truncate">
                      {selectedEnquiry.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="material-symbols-outlined text-sm text-slate-500">phone</span>
                    <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-[#ff8d28] truncate">
                      {selectedEnquiry.phone}
                    </a>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${selectedEnquiry.name}, thank you for contacting Peeyem Traders regarding ${selectedEnquiry.subject || "your enquiry"}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline text-[11px] font-bold"
                      title="Open WhatsApp chat"
                    >
                      WhatsApp
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span className="material-symbols-outlined text-sm text-slate-500">schedule</span>
                    <span>
                      {new Date(selectedEnquiry.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversation Timeline Stream */}
              <div className="p-4 sm:p-6 space-y-4 max-h-[440px] overflow-y-auto bg-[#0a1017]">
                {/* 1. Initial Customer Inquiry Card */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {selectedEnquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span>{selectedEnquiry.name}</span>
                        <span className="text-[10px] text-blue-400 font-normal bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-800/40">
                          Initial Inquiry
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(selectedEnquiry.created_at).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </div>

                    {selectedEnquiry.source && (
                      <div className="text-[10px] text-slate-500 font-mono pt-1">
                        Source: {selectedEnquiry.source}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Thread Messages (Replies & Notes) */}
                {selectedEnquiry.conversation &&
                  selectedEnquiry.conversation.slice(1).map((msg) => {
                    const isCustomer = msg.sender === "CUSTOMER";
                    const isInternalNote = Boolean(msg.is_internal);

                    if (isInternalNote) {
                      return (
                        <div key={msg.id} className="flex items-start gap-3 ml-6 sm:ml-10">
                          <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800 text-amber-300 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xs">lock</span>
                          </div>
                          <div className="flex-1 bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                <span>{msg.sender_name || "Internal Staff Note"}</span>
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                  Staff Only
                                </span>
                              </span>
                              <span className="text-[10px] text-amber-400/60">
                                {new Date(msg.timestamp).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (isCustomer) {
                      return (
                        <div key={msg.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {selectedEnquiry.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{selectedEnquiry.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(msg.timestamp).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Admin Reply to customer
                    return (
                      <div key={msg.id} className="flex items-start gap-3 justify-end ml-6 sm:ml-10">
                        <div className="flex-1 bg-[#152332] border border-blue-900/60 rounded-2xl rounded-tr-sm p-4 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#ff8d28] flex items-center gap-1.5">
                              <span>{msg.sender_name || "Peeyem Traders Operations"}</span>
                              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[10px]">send</span>
                                <span>Emailed to Customer</span>
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.timestamp).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="text-xs text-slate-100 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          {msg.delivery_status && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                              <span className="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>
                              <span>Delivered via Gmail SMTP</span>
                            </div>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#ff8d28] text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                          P
                        </div>
                      </div>
                    );
                  })}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply & Note Composer Area */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 space-y-3">
                {/* Composer Tab Switcher */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setComposerMode("REPLY")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        composerMode === "REPLY"
                          ? "bg-[#ff8d28] text-slate-950 shadow"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Reply via Email to Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setComposerMode("NOTE")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        composerMode === "NOTE"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Internal Staff Note</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {composerMode === "REPLY"
                      ? `Will send email to: ${selectedEnquiry.email}`
                      : "Private to admin portal only"}
                  </span>
                </div>

                {/* Quick Templates Bar (For Email Replies) */}
                {composerMode === "REPLY" && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    <span className="text-[10px] text-slate-500 shrink-0 font-bold uppercase">Quick Snippets:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          (prev) =>
                            (prev ? prev + "\n\n" : "") +
                            `Hello ${selectedEnquiry.name},\n\nWe have ready stock available at our Coimbatore depot for your requirement. Our technical executive can dispatch the rolls within 24 hours of PO confirmation.`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 shrink-0 border border-slate-800"
                    >
                      Ready Stock
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          (prev) =>
                            (prev ? prev + "\n\n" : "") +
                            `Could you please confirm the required belt width (mm), total length in meters, and top/bottom rubber cover thickness (e.g. 4+2 mm)?`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 shrink-0 border border-slate-800"
                    >
                      Request Specs
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          (prev) =>
                            (prev ? prev + "\n\n" : "") +
                            `We also provide on-site vulcanized hot jointing and emergency mechanical splicing across Tamil Nadu and Kerala quarries.`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 shrink-0 border border-slate-800"
                    >
                      On-Site Splicing
                    </button>
                  </div>
                )}

                {/* Textarea Form */}
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      composerMode === "REPLY"
                        ? `Type your email response to ${selectedEnquiry.name}... (Press send to dispatch email)`
                        : "Type private internal notes about pricing negotiation, phone discussion, or dispatch schedule..."
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28] resize-y leading-relaxed"
                  ></textarea>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Status change option on send */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>On send, change status to:</span>
                      <select
                        value={composerStatus}
                        onChange={(e) => setComposerStatus(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#ff8d28]"
                      >
                        <option value="KEEP">Keep Current ({selectedEnquiry.status})</option>
                        <option value="CONTACTED">Mark as CONTACTED</option>
                        <option value="IN_PROGRESS">Mark as IN PROGRESS</option>
                        <option value="CONVERTED">Mark as CONVERTED</option>
                        <option value="CLOSED">Mark as CLOSED</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer ${
                        composerMode === "REPLY"
                          ? "bg-[#ff8d28] hover:bg-[#e66c00] text-slate-950 shadow-[#ff8d28]/20"
                          : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20"
                      }`}
                    >
                      {sendingReply ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          <span>{composerMode === "REPLY" ? "Sending Email..." : "Saving Note..."}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            {composerMode === "REPLY" ? "send" : "save"}
                          </span>
                          <span>{composerMode === "REPLY" ? "Send Email Reply" : "Save Internal Note"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="font-bold text-white text-base">Delete Enquiry?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this enquiry and its entire conversation history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg"
              >
                Confirm Delete
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading enquiries dashboard...</div>}>
      <EnquiriesContent />
    </Suspense>
  );
}
