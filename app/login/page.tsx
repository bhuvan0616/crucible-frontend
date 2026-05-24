"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

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
      <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-[var(--color-lime)]">Checking authentication...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-[var(--color-on-dark-muted)]">Sign in to your account</p>
            </div>

            <LoginForm onSuccess={() => router.push("/shop")} />

            <div className="mt-6 text-center text-sm">
              <span className="text-[var(--color-on-dark-muted)]">Don&apos;t have an account? </span>
              <Link href="/register" className="text-[var(--color-lime)] hover:underline font-medium">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}