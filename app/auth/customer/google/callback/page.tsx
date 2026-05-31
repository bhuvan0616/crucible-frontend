"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sdk } from "@/lib/sdk";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "creating" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const queryParams = Object.fromEntries(searchParams.entries());
        
        const result = await sdk.auth.callback("customer", "google", queryParams);
        
        // SDK returns the JWT token directly as a string
        let token: string | undefined;
        if (typeof result === "string") {
          token = result;
        } else if (result && typeof result === "object" && "token" in result) {
          token = (result as { token: string }).token;
        }
        
        if (token) {
          localStorage.setItem("medusa_jwt_token", token);
        }

        const storedToken = localStorage.getItem("medusa_jwt_token");
        if (!storedToken) {
          throw new Error("No token stored after callback");
        }

        const base64Url = storedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = atob(base64);
        const decoded = JSON.parse(jsonPayload);

        if (!decoded.actor_id && decoded.user_metadata?.email) {
          setStatus("creating");
          await sdk.store.customer.create({
            email: decoded.user_metadata.email,
          });
          await sdk.auth.refresh();
        }

        setStatus("success");
        router.push("/shop");
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        setTimeout(() => router.push("/login?error=auth_failed"), 2000);
      }
    };

    if (searchParams.toString()) {
      handleCallback();
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase animate-pulse mb-4">
          {status === "loading" && "Verifying..."}
          {status === "creating" && "Creating account..."}
          {status === "success" && "Success!"}
          {status === "error" && "Authentication failed"}
        </div>
        <p className="text-[var(--color-on-dark-muted)] text-sm">
          {status === "loading" && "Please wait while we verify your account"}
          {status === "creating" && "Setting up your account"}
          {status === "success" && "Redirecting to shop..."}
          {status === "error" && "Redirecting to login..."}
        </p>
      </div>
    </main>
  );
}