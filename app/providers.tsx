"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    checkAuth();
    initCart();
  }, [checkAuth, initCart]);

  return <>{children}</>;
}