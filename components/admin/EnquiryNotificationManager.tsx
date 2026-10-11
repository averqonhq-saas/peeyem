"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { dbService } from "@/lib/db";
import { DbEnquiry } from "@/types/admin";

// Plays an audible notification chime using Web Audio API (no external asset required)
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // High clear bell chime (tone 1: 880Hz, tone 2: 1320Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn("Could not play audio chime:", err);
  }
}

export default function EnquiryNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);
  const [recentAlert, setRecentAlert] = useState<{ id: string; name: string; subject?: string; phone: string } | null>(
    null
  );
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const initialLoadedRef = useRef(false);
  const knownIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check Notification API support
    if (typeof window !== "undefined" && "Notification" in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }

    // Load initial known IDs from localStorage to avoid spamming on reload
    try {
      const stored = localStorage.getItem("peeyem_known_enquiry_ids");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          knownIdsRef.current = new Set(parsed);
        }
      }
    } catch {
      // ignore
    }

    // Subscribe to live enquiry updates (Firestore onSnapshot & local broadcast)
    const unsubscribe = dbService.subscribeEnquiries((list: DbEnquiry[]) => {
      if (!list || list.length === 0) return;

      // On very first snapshot, establish baseline IDs
      if (!initialLoadedRef.current) {
        initialLoadedRef.current = true;
        list.forEach((e) => knownIdsRef.current.add(e.id));
        try {
          localStorage.setItem("peeyem_known_enquiry_ids", JSON.stringify(Array.from(knownIdsRef.current).slice(0, 50)));
        } catch {}
        return;
      }

      // Check for genuinely new incoming enquiries
      const newItems = list.filter((e) => !knownIdsRef.current.has(e.id));

      if (newItems.length > 0) {
        newItems.forEach((newEnq) => {
          knownIdsRef.current.add(newEnq.id);

          // 1. Play audible sound chime
          playNotificationChime();

          // 2. Trigger in-app top banner
          setRecentAlert({
            id: newEnq.id,
            name: newEnq.name,
            subject: newEnq.subject || "Industrial Quotation Enquiry",
            phone: newEnq.phone,
          });

          // 3. Trigger Mobile / PWA Native System Notification via Service Worker
          triggerSystemNotification(newEnq);
        });

        // Persist updated known IDs
        try {
          localStorage.setItem("peeyem_known_enquiry_ids", JSON.stringify(Array.from(knownIdsRef.current).slice(0, 50)));
        } catch {}
      }
    });

    return () => unsubscribe();
  }, []);

  // Request browser/mobile push permission
  const requestPermission = async () => {
    if (!supported) {
      alert("Notifications are not supported in this browser. Install the PWA to your home screen to enable alerts.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        playNotificationChime();

        // Send a test confirmation notification
        triggerSystemNotification({
          id: "welcome",
          name: "Enquiry Alerts Active",
          subject: "You will now receive instant alerts whenever a customer submits an enquiry on Peeyem Traders.",
          phone: "Peeyem Admin",
        } as DbEnquiry);

        setShowPermissionModal(false);
      } else if (result === "denied") {
        alert("Notifications were blocked in your browser settings. Please enable notifications for peeyemtraders.com in your device settings.");
      }
    } catch (e) {
      console.warn("Error requesting notification permission:", e);
    }
  };

  const triggerSystemNotification = (enquiry: DbEnquiry) => {
    if (typeof window === "undefined") return;
    if (Notification.permission !== "granted") return;

    const title = `🔔 New Customer Enquiry: ${enquiry.name}`;
    const body = `${enquiry.company ? `Company: ${enquiry.company} • ` : ""}Phone: ${enquiry.phone}\n${enquiry.subject || enquiry.message || "New industrial quotation request."}`;
    const targetUrl = `/admin/enquiries?id=${enquiry.id}`;

    // Prefer triggering through active Service Worker (required for mobile & background)
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "TRIGGER_ENQUIRY_NOTIFICATION",
        payload: {
          title,
          body,
          url: targetUrl,
          enquiryId: enquiry.id,
          tag: `enquiry-${enquiry.id}`,
        },
      });
    } else {
      // Fallback to standard Notification API
      try {
        const notif = new Notification(title, {
          body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag: `enquiry-${enquiry.id}`,
        });
        notif.onclick = () => {
          window.focus();
          window.location.href = targetUrl;
        };
      } catch (err) {
        console.warn("Direct Notification error:", err);
      }
    }
  };

  return (
    <>
      {/* Top Banner Alert when a new enquiry arrives while inside the app */}
      {recentAlert && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-bounce">
          <div className="bg-[#0e1720] border-2 border-[#ff8d28] rounded-2xl p-4 shadow-2xl text-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff8d28] to-[#e66c00] flex items-center justify-center text-slate-950 font-bold shrink-0">
              <span className="material-symbols-outlined text-2xl">notifications_active</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#ff8d28] uppercase tracking-wider">
                  New Customer Enquiry!
                </span>
                <button
                  onClick={() => setRecentAlert(null)}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p className="text-sm font-bold text-white mt-0.5 truncate">{recentAlert.name}</p>
              <p className="text-xs text-slate-300 truncate">{recentAlert.subject}</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">📞 {recentAlert.phone}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href={`/admin/enquiries?id=${recentAlert.id}`}
                  onClick={() => setRecentAlert(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#ff8d28] hover:bg-[#ffa756] text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Open Enquiry</span>
                </Link>
                <button
                  onClick={() => setRecentAlert(null)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Notification Bell Icon with Permission Status */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (permission !== "granted") {
              setShowPermissionModal(true);
            } else {
              // Trigger a test alert to verify
              playNotificationChime();
              triggerSystemNotification({
                id: "test",
                name: "Alerts Working Properly",
                subject: "Mobile & desktop notifications for new enquiries are active.",
                phone: "Peeyem Admin",
              } as DbEnquiry);
            }
          }}
          className={`relative p-2 rounded-lg border transition-all ${
            permission === "granted"
              ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white"
              : "bg-amber-500/15 border-amber-500/40 text-[#ff8d28] hover:bg-amber-500/25 animate-pulse"
          }`}
          title={
            permission === "granted"
              ? "Enquiry Notifications Active (Click to test sound & alert)"
              : "Click to Enable Enquiry Mobile Notifications"
          }
        >
          <span className="material-symbols-outlined text-xl">
            {permission === "granted" ? "notifications" : "notifications_unread"}
          </span>
          <span
            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
              permission === "granted" ? "bg-emerald-400" : "bg-amber-400 animate-ping"
            }`}
          ></span>
        </button>

        {/* Modal Prompt to Enable Notifications */}
        {showPermissionModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1720] border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ff8d28] text-2xl">notifications_active</span>
                  <span className="font-bold text-sm">Enquiry Notifications</span>
                </div>
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Stay updated instantly when a customer submits a quotation inquiry on Peeyem Traders.
              </p>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                  <span>Instant mobile lockscreen &amp; PWA alerts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                  <span>Customer name, phone &amp; product details</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                  <span>1-tap to open &amp; reply to customer</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={requestPermission}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff8d28] to-[#e66c00] hover:from-[#ff993e] hover:to-[#f07400] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Enable Notifications Now
                </button>
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
