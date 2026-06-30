import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";
import { pageMainClassName } from "@/components/layout/pageShell";

function LoginFallback() {
  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-[var(--color-lime)] text-sm tracking-[0.3em] uppercase">
          Loading
        </div>
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
