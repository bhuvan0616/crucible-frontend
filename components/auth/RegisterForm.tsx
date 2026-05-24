"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await register({ email, password, first_name: firstName, last_name: lastName });
      onSuccess?.();
    } catch {
      // Error is set in store
    }
  };

  const handleChange = (setter: (value: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
    if (error || localError) {
      clearError();
      setLocalError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={handleChange(setFirstName)}
            placeholder="John"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={handleChange(setLastName)}
            placeholder="Doe"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="registerEmail" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Email
        </label>
        <Input
          id="registerEmail"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="registerPassword" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Password
        </label>
        <Input
          id="registerPassword"
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
          placeholder="Minimum 8 characters"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-on-dark-muted)] mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleChange(setConfirmPassword)}
          placeholder="Confirm your password"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {(error || localError) && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
          {localError || error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || password !== confirmPassword || password.length < 8}
        className="w-full bg-[var(--color-lime)] text-[var(--color-ink-deep)] hover:bg-[var(--color-lime-dark)] disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}