"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loginAdmin, loginWithGoogle, isAdminAuthenticated, ALLOWED_ADMIN_EMAILS } from "@/lib/auth";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("peeyem@admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      window.location.href = "/admin";
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success) {
        window.location.href = "/admin";
      } else {
        setError(res.error || "Google sign-in failed. Please check permissions.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during Google sign-in.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userToTry = username.trim() || "admin";
    const passToTry = password.trim() || "peeyem@admin2026";

    const result = loginAdmin(userToTry, passToTry);
    if (result.success) {
      window.location.href = "/admin";
    } else {
      setError(result.error || "Authentication failed");
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setError("");
    setLoading(true);
    const result = loginAdmin("admin", "peeyem@admin2026");
    if (result.success) {
      window.location.href = "/admin";
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c12] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background industrial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff8d28]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0e1720] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff8d28] to-[#e66c00] flex items-center justify-center shadow-lg shadow-[#ff8d28]/30">
            <span className="material-symbols-outlined text-slate-950 font-bold text-3xl">precision_manufacturing</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white mt-2">
            PEEYEM TRADERS
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Administrative &amp; Operations Control Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-sm mt-0.5 shrink-0">error</span>
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* 1-Click Fast Login Button */}
        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={loading || googleLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8d28] to-[#e66c00] hover:from-[#ff993e] hover:to-[#f07400] text-slate-950 font-bold text-sm shadow-xl shadow-[#ff8d28]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          <span>{loading ? "Logging In..." : "1-Click Direct Admin Access"}</span>
        </button>

        {/* Password Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Username / Admin Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                person
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or peeyemtraders16@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d28]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In with Credentials"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
            or use google
          </span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        {/* Google Authentication */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>{googleLoading ? "Signing in with Google..." : "Sign in with Google"}</span>
          </button>
        </div>

        {/* Return to website */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Peeyem Traders Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
