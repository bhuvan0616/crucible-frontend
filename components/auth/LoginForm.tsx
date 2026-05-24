"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}