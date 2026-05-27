"use client";

import { create } from "zustand";
import { sdk } from "@/lib/sdk";

interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await sdk.auth.login("customer", "emailpass", { email, password });
      const { customer } = await sdk.store.customer.retrieve();
      set({
        isAuthenticated: true,
        user: {
          id: customer.id,
          email: customer.email || "",
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
        },
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.message?.includes("invalid")
        ? "Invalid email or password"
        : error.message || "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterInput) => {
    set({ isLoading: true, error: null });
    try {
      await sdk.auth.register("customer", "emailpass", data);
      const { customer } = await sdk.store.customer.create({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      await sdk.auth.refresh();
      set({
        isAuthenticated: true,
        user: {
          id: customer.id,
          email: customer.email || "",
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
        },
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.message?.includes("already exists")
        ? "Email already registered"
        : error.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await sdk.auth.logout();
    set({ isAuthenticated: false, user: null, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { customer } = await sdk.store.customer.retrieve();
      set({
        isAuthenticated: true,
        user: {
          id: customer.id,
          email: customer.email || "",
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
        },
        isLoading: false,
      });
    } catch (error: any) {
      if (error?.status === 401 || error?.message?.includes("401")) {
        // Silently ignore - user not authenticated
      }
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUser = (state: AuthStore) => state.user;