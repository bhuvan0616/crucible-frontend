import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

function LoginFallback() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="animate-pulse text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase">
        Loading
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
