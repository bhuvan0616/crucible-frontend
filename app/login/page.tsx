"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const formY = useTransform(scrollY, [0, 400], [0, 30]);
  const formOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/shop");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase"
          >
            Verifying
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] overflow-hidden relative">
      <motion.div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ y: bgY, scale: bgScale }}
      >
        <div
          className="absolute inset-[-10%] opacity-[0.07]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% 0%, var(--color-violet-deep) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 50%, var(--color-pink) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 20% 80%, var(--color-lime) 0%, transparent 45%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/crucible-login/1920/1080')] bg-cover bg-center opacity-[0.04] mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)] via-transparent to-[var(--color-primary)]" />
      </motion.div>

      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24"
        style={{ y: formY, opacity: formOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px]"
        >
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-[var(--color-on-dark-muted)] text-lg tracking-wide"
            >
              Sign in to continue creating
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="relative bg-[var(--color-ink-deep)]/80 backdrop-blur-xl rounded-2xl border border-[var(--color-hairline-violet)]/50 p-10 shadow-[0_0_80px_rgba(106,95,193,0.12)] transition-all duration-500 hover:shadow-[0_0_100px_rgba(106,95,193,0.18)] hover:border-[var(--color-hairline-violet)]/80">

              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-violet-deep)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />

              <div className="relative z-10">
                <LoginForm onSuccess={() => router.push("/shop")} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-center"
          >
            <span className="text-[var(--color-on-dark-muted)] text-sm">New to Crucible? </span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-[var(--color-lime)] hover:text-[var(--color-lime-dark)] font-medium transition-colors duration-300 group"
            >
              Create account
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-hairline-violet)]/30 to-transparent" />
    </main>
  );
}