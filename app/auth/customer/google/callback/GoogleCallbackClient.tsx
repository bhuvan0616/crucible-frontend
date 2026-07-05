"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sdk } from "@/lib/sdk";
import { useAuthStore } from "@/store/authStore";

type GoogleJwtPayload = {
  actor_id?: string;
  user_metadata?: {
    email?: string;
    given_name?: string;
    family_name?: string;
  };
};

function decodeJwtPayload(token: string): GoogleJwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  return (error as { status?: number }).status === 404;
}

function shouldLinkExistingCustomer(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { status?: number; message?: string };
  const message = (e.message ?? "").toLowerCase();
  return (
    e.status === 422 ||
    e.status === 409 ||
    e.status === 400 ||
    (e.status === 500 && message.includes("unknown error")) ||
    message.includes("already has an account") ||
    message.includes("already exists") ||
    message.includes("already authenticated") ||
    message.includes("duplicate")
  );
}

async function linkGoogleToExistingCustomer(
  email?: string
): Promise<{ linked?: boolean; cleared?: boolean }> {
  return sdk.client.fetch("/store/auth/google/link", {
    method: "POST",
    body: email ? { email } : undefined,
  });
}

function getOAuthHandledKey(code: string): string {
  return `google_oauth_handled_${code}`;
}

export default function GoogleCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [status, setStatus] = useState<"loading" | "creating" | "linking" | "success" | "error">("loading");
  const [isMounted, setIsMounted] = useState(false);
  const handledRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      const oauthCode = searchParams.get("code");
      if (!oauthCode) {
        return;
      }

      if (
        handledRef.current ||
        sessionStorage.getItem(getOAuthHandledKey(oauthCode)) === "1"
      ) {
        return;
      }
      handledRef.current = true;
      sessionStorage.setItem(getOAuthHandledKey(oauthCode), "1");

      try {
        const queryParams = Object.fromEntries(searchParams.entries());

        if (queryParams.error) {
          throw new Error(
            typeof queryParams.error_description === "string"
              ? queryParams.error_description
              : String(queryParams.error)
          );
        }

        const callbackResult = await sdk.auth.callback("customer", "google", queryParams);
        if (typeof callbackResult !== "string") {
          throw new Error("Additional authentication steps are required.");
        }

        const decoded = decodeJwtPayload(callbackResult);
        const email = decoded.user_metadata?.email;

        if (email) {
          const customerPayload = {
            email,
            first_name: decoded.user_metadata?.given_name,
            last_name: decoded.user_metadata?.family_name,
          };

          setStatus("linking");
          try {
            const linkResult = await linkGoogleToExistingCustomer(email);
            if (linkResult?.cleared) {
              await sdk.auth.refresh();
              setStatus("creating");
              await sdk.store.customer.create(customerPayload);
            }
          } catch (linkError) {
            if (!isNotFoundError(linkError)) {
              throw linkError;
            }

            setStatus("creating");
            try {
              await sdk.store.customer.create(customerPayload);
            } catch (createError) {
              if (!shouldLinkExistingCustomer(createError)) {
                throw createError;
              }

              await sdk.auth.refresh();
              setStatus("linking");
              await linkGoogleToExistingCustomer(email);
            }
          }

          await sdk.auth.refresh();
        }

        await checkAuth();

        if (!useAuthStore.getState().isAuthenticated) {
          throw new Error("Authentication failed");
        }

        setStatus("success");
        router.replace("/shop");
      } catch (error) {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message?: string }).message)
            : "Authentication failed";
        console.error("Google callback error:", error);
        setStatus("error");
        setTimeout(
          () =>
            router.replace(
              `/login?error=auth_failed&reason=${encodeURIComponent(message)}`
            ),
          2000
        );
      }
    };

    if (searchParams.toString()) {
      void handleCallback();
    }
  }, [searchParams, router, checkAuth]);

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase animate-pulse mb-4">
          {!isMounted || status === "loading" ? "Verifying..." : null}
          {isMounted && status === "creating" ? "Creating account..." : null}
          {isMounted && status === "linking" ? "Signing you in..." : null}
          {isMounted && status === "success" ? "Success!" : null}
          {isMounted && status === "error" ? "Authentication failed" : null}
        </div>
        <p className="text-[var(--color-on-dark-muted)] text-sm">
          {!isMounted || status === "loading"
            ? "Please wait while we verify your account"
            : null}
          {isMounted && status === "creating" ? "Setting up your account" : null}
          {isMounted && status === "linking"
            ? "Linking your Google account"
            : null}
          {isMounted && status === "success" ? "Redirecting to shop..." : null}
          {isMounted && status === "error" ? "Redirecting to login..." : null}
        </p>
      </div>
    </main>
  );
}
