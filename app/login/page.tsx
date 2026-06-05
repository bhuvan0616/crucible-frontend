"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { sdk } from "@/lib/sdk";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/shop";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isMounted, setIsMounted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isLoading, isAuthenticated, router, returnUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await sdk.auth.login("customer", "google", {}) as { location?: string } | string;

      if (typeof result === "object" && "location" in result && result.location) {
        window.location.href = result.location;
        return;
      }

      // Token received - SDK should have stored it automatically
      // Check auth and update store, then redirect
      const { customer } = await sdk.store.customer.retrieve();
      console.log("Logged in as:", customer);
      router.push("/shop");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // If it's a redirect happening, don't show error
      if (error?.message?.includes("redirect") || error?.status === 301 || error?.status === 302) {
        return;
      }
      alert("Sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (isLoading || !isMounted) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase">
          Loading
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-[var(--color-ink-deep)] rounded-2xl border border-[var(--color-hairline-violet)]/50 p-10 shadow-2xl">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[var(--color-on-dark-muted)]">Sign in to manage your prints</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-[var(--color-hairline-violet)]/50 text-white py-3.5 px-4 rounded-xl transition-all duration-300 mb-6 disabled:opacity-50"
          >
            {googleLoading ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-sm font-medium">{googleLoading ? "Redirecting..." : "Sign in with Google"}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-hairline-violet)]/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[var(--color-ink-deep)] text-xs text-[var(--color-on-dark-muted)]">
                Or continue with email
              </span>
            </div>
          </div>

          <LoginForm onSuccess={() => router.push(returnUrl)} />

          <div className="mt-6 text-center">
            <span className="text-sm text-[var(--color-on-dark-muted)]">Don&apos;t have an account? </span>
            <Link href="/register" className="text-sm text-[var(--color-lime)] hover:text-[var(--color-lime-dark)] font-medium transition-colors">
              Sign up
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-hairline-violet)]/30 text-center">
            <p className="text-xs text-[var(--color-on-dark-faint)]">
              By logging in, you agree to our{" "}
              <Link href="/terms" className="text-[var(--color-lime)]/70 hover:text-[var(--color-lime)] transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[var(--color-lime)]/70 hover:text-[var(--color-lime)] transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
          <div className="animate-pulse text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase">
            Loading
          </div>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}