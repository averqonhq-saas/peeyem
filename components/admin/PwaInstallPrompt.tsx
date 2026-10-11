"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // Register Service Worker for Admin PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/admin-sw.js", { scope: "/admin" })
          .then((registration) => {
            console.log("[PWA] Admin Service Worker registered successfully with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("[PWA] Admin Service Worker registration failed:", error);
          });
      });
    }

    // Capture beforeinstallprompt event (Chromium, Edge, Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      console.log("[PWA] Peeyem Admin App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isStandalone) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Running as App</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#ff8d28] to-[#e66c00] hover:from-[#ff993e] hover:to-[#f07400] text-slate-950 font-bold text-xs shadow-md shadow-[#ff8d28]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        title="Install Peeyem Admin as Progressive Web App on your device"
      >
        <span className="material-symbols-outlined text-base">install_mobile</span>
        <span>Install App</span>
      </button>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1720] border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#ff8d28] text-2xl">install_mobile</span>
                <span className="font-bold text-sm">Install Peeyem Admin</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To install this dashboard on your iPhone or iPad:
            </p>
            <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <li>
                Tap the <strong className="text-white">Share</strong> icon (
                <span className="material-symbols-outlined text-xs align-middle inline">ios_share</span>) in Safari.
              </li>
              <li>
                Scroll down and tap <strong className="text-white">Add to Home Screen</strong> (
                <span className="material-symbols-outlined text-xs align-middle inline">add_box</span>).
              </li>
              <li>
                Tap <strong className="text-white">Add</strong> in the top-right corner.
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
