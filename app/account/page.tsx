"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-[var(--color-lime)]">Loading account...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[var(--color-ink-deep)] rounded-xl border border-[var(--color-hairline-violet)] p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--color-lime)] flex items-center justify-center">
                <span className="text-3xl font-bold text-[var(--color-ink-deep)]">
                  {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-[var(--color-on-dark-muted)]">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-[var(--color-hairline-violet)] pt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Account Options</h2>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[var(--color-hairline-violet)] hover:bg-[var(--color-surface-dark)]"
                  onClick={() => router.push("/orders")}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Order History
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-white border-[var(--color-hairline-violet)] hover:bg-[var(--color-surface-dark)]"
                  onClick={() => router.push("/shop")}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continue Shopping
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-hairline-violet)]">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              >
                {isLoggingOut ? (
                  <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}