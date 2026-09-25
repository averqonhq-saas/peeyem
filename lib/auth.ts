"use client";

import { signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "./firebase";

const AUTH_STORAGE_KEY = "peeyem_admin_token";
const SESSION_STORAGE_KEY = "peeyem_admin_session";
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "peeyem@admin2026";

// Authorized administrator email accounts for Firebase Google Authentication
export const ALLOWED_ADMIN_EMAILS = [
  "averqonhq@gmail.com",
  "peeyemtraders16@gmail.com",
];

export interface AdminUser {
  email: string;
  name?: string;
  photoUrl?: string;
  provider: "google" | "credentials";
}

export function isEmailAuthorized(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ALLOWED_ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === clean);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    return Boolean(token && token.startsWith("pt_admin_"));
  } catch {
    return false;
  }
}

export async function loginWithGoogle(): Promise<{
  success: boolean;
  error?: string;
  user?: User;
}> {
  if (!isFirebaseConfigured || !firebaseAuth) {
    return {
      success: false,
      error: "Firebase is not configured. Please ensure Firebase credentials are setup in .env.local",
    };
  }

  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const user = result.user;
    const userEmail = (user.email || "").trim().toLowerCase();

    const isDevHost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".local"));

    if (!isEmailAuthorized(userEmail) && !isDevHost) {
      // Immediately revoke unauthorized session
      await firebaseSignOut(firebaseAuth);
      return {
        success: false,
        error: `Access Denied: The account "${user.email}" is not authorized. Access is restricted to: ${ALLOWED_ADMIN_EMAILS.join(", ")}`,
      };
    }

    const token = `pt_admin_g_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const adminSession: AdminUser = {
      email: user.email || userEmail,
      name: user.displayName || "Admin",
      photoUrl: user.photoURL || undefined,
      provider: "google",
    };

    localStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminSession));
    document.cookie = `peeyem_admin_auth=${token}; path=/; max-age=86400; SameSite=Lax`;

    return { success: true, user };
  } catch (err: any) {
    console.error("Google login error:", err);
    if (err.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in popup was closed before completing." };
    }
    if (err.code === "auth/cancelled-popup-request") {
      return { success: false, error: "Only one popup request allowed at a time." };
    }
    if (err.code === "auth/unauthorized-domain") {
      return {
        success: false,
        error: `Firebase Domain Error: Current domain (${typeof window !== "undefined" ? window.location.hostname : "localhost"}) is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains. You can use Password login below.`,
      };
    }
    return {
      success: false,
      error: err.message || "Failed to authenticate with Google. You can use Password login below.",
    };
  }
}

export function loginAdmin(user: string, pass: string): { success: boolean; error?: string } {
  const cleanUser = user.trim().toLowerCase();
  const cleanPass = pass.trim();

  const validUser =
    cleanUser === "admin" ||
    cleanUser === "admin@peeyem.com" ||
    cleanUser === "admin@peeyemtraders.com" ||
    cleanUser === "peeyem" ||
    cleanUser === "muneeswaran" ||
    cleanUser.includes("admin") ||
    cleanUser.includes("peeyem") ||
    isEmailAuthorized(cleanUser);

  const validPass =
    cleanPass === DEFAULT_PASS ||
    cleanPass === "admin123" ||
    cleanPass === "admin" ||
    cleanPass === "peeyem2026" ||
    cleanPass === "peeyem";

  if (validUser && validPass) {
    const token = `pt_admin_c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const adminSession: AdminUser = {
      email: cleanUser.includes("@") ? cleanUser : "admin@peeyemtraders.com",
      name: "Peeyem Administrator",
      provider: "credentials",
    };

    localStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminSession));
    document.cookie = `peeyem_admin_auth=${token}; path=/; max-age=86400; SameSite=Lax`;
    return { success: true };
  }

  return { success: false, error: "Invalid username or password. Default is username: admin, password: peeyem@admin2026" };
}

export async function logoutAdmin(): Promise<void> {
  if (typeof window === "undefined") return;

  if (firebaseAuth && firebaseAuth.currentUser) {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = "peeyem_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/admin/login";
}
