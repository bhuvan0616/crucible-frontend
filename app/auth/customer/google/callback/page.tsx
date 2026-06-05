import { Suspense } from "react";
import GoogleCallbackClient from "./GoogleCallbackClient";

function CallbackFallback() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase animate-pulse mb-4">
          Verifying...
        </div>
        <p className="text-[var(--color-on-dark-muted)] text-sm">
          Please wait while we verify your account
        </p>
      </div>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <GoogleCallbackClient />
    </Suspense>
  );
}
