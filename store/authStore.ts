"use client";

import { create } from "zustand";
import { sdk } from "@/lib/sdk";

interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  address_name?: string;
}

interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  addresses?: Address[];
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
  addAddress: (address: Omit<Address, "id">) => Promise<Address>;
  getAddresses: () => Promise<Address[]>;
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
          addresses: (customer.addresses as Address[]) || [],
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
          addresses: (customer.addresses as Address[]) || [],
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
          addresses: (customer.addresses as Address[]) || [],
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

  addAddress: async (addressData) => {
    const { customer } = await sdk.store.customer.createAddress({
      first_name: addressData.first_name,
      last_name: addressData.last_name,
      address_1: addressData.address_1,
      address_2: addressData.address_2,
      city: addressData.city,
      postal_code: addressData.postal_code,
      country_code: addressData.country_code || "in",
      phone: addressData.phone,
      address_name: addressData.address_name,
    });
    set((state) => ({
      user: state.user ? {
        ...state.user,
        addresses: (customer.addresses as Address[]) || [],
      } : null,
    }));
    return (customer.addresses as Address[])[(customer.addresses as Address[]).length - 1];
  },

  getAddresses: async () => {
    const { addresses } = await sdk.store.customer.listAddress();
    return addresses as Address[];
  },

  clearError: () => set({ error: null }),
}));

export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUser = (state: AuthStore) => state.user;