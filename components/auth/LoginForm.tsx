"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // Error is set in store
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) clearError();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-medium text-[var(--color-on-dark-muted)] uppercase tracking-widest"
        >
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className="w-full bg-[var(--color-primary)]/60 border border-[var(--color-hairline-violet)]/50 rounded-xl px-4 py-3.5 text-white placeholder-[var(--color-on-dark-faint)] transition-all duration-300 focus:outline-none focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)]/20 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-medium text-[var(--color-on-dark-muted)] uppercase tracking-widest"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full bg-[var(--color-primary)]/60 border border-[var(--color-hairline-violet)]/50 rounded-xl px-4 py-3.5 text-white placeholder-[var(--color-on-dark-faint)] transition-all duration-300 focus:outline-none focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)]/20 disabled:opacity-50"
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full relative overflow-hidden bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-semibold py-4 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isHovering ? "translate-x-1" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </span>
        <motion.div
          className="absolute inset-0 bg-[var(--color-lime-dark)]"
          initial={{ x: "-100%" }}
          animate={{ x: isHovering ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.button>
    </motion.form>
  );
}