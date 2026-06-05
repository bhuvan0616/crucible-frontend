"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CartSlideOver } from "@/components/shop/CartSlideOver";
import { useCartStore, selectCartItemCount } from "@/store/cartStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

const accountHref = "/account";

const easeOut = [0.32, 0.72, 0, 1] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AccountIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore(selectCartItemCount);
  const isAccountActive = isActivePath(pathname, accountHref);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-5 sm:px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: easeOut }}
          className="pointer-events-auto w-full max-w-3xl"
        >
          <div className="rounded-full p-1 ring-1 ring-white/[0.08] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]">
            <nav
              aria-label="Main navigation"
              className="flex h-[3.25rem] items-center justify-between gap-3 rounded-full bg-[var(--color-ink-deep)] px-2 pl-3 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:h-14 sm:pl-4 sm:pr-3"
            >
              <Link
                href="/"
                className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-90"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-lime)] text-sm font-bold text-[var(--color-ink-deep)] shadow-[0_4px_14px_rgba(194,239,78,0.22)]">
                  C
                </span>
                <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
                  Crucible
                </span>
              </Link>

              <div className="hidden items-center gap-0.5 md:flex">
                {navLinks.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative rounded-full px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-white/[0.08]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative z-10 ${
                          active ? "text-white" : ""
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] hover:text-white active:scale-[0.96] sm:h-12 sm:w-12"
                >
                  <svg
                    className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--color-lime)] px-1 text-[10px] font-bold leading-none text-[var(--color-ink-deep)] sm:right-1 sm:top-1 sm:h-5 sm:min-w-5 sm:text-[11px]">
                      {itemCount}
                    </span>
                  )}
                </button>

                <Link
                  href={accountHref}
                  aria-label="Account"
                  aria-current={isAccountActive ? "page" : undefined}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96] sm:h-12 sm:w-12 ${
                    isAccountActive
                      ? "bg-white/[0.1] text-white"
                      : "text-white/80 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <AccountIcon className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
                </Link>

                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] active:scale-[0.96] md:hidden"
                >
                  <span className="relative block h-3.5 w-4">
                    <motion.span
                      animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                      transition={{ duration: 0.28, ease: easeOut }}
                      className="absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-white"
                    />
                    <motion.span
                      animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-white"
                    />
                    <motion.span
                      animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                      transition={{ duration: 0.28, ease: easeOut }}
                      className="absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-white"
                    />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="fixed inset-0 z-40 bg-[var(--color-primary)]/92 backdrop-blur-xl md:hidden"
          >
            <div className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-28">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.45,
                        ease: easeOut,
                        delay: 0.08 + index * 0.06,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between rounded-[1.25rem] px-5 py-4 text-2xl font-semibold tracking-tight transition-colors ${
                          active
                            ? "bg-white/[0.08] text-[var(--color-lime)]"
                            : "text-white/90 hover:bg-white/[0.04]"
                        }`}
                      >
                        {link.label}
                        <span className="text-sm font-medium text-white/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.45,
                    ease: easeOut,
                    delay: 0.08 + navLinks.length * 0.06,
                  }}
                >
                  <Link
                    href={accountHref}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-[1.25rem] px-5 py-4 text-2xl font-semibold tracking-tight transition-colors ${
                      isAccountActive
                        ? "bg-white/[0.08] text-[var(--color-lime)]"
                        : "text-white/90 hover:bg-white/[0.04]"
                    }`}
                  >
                    Account
                    <span className="text-sm font-medium text-white/35">
                      {String(navLinks.length + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: easeOut, delay: 0.28 }}
                className="mt-auto pt-8"
              >
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-lime)] px-6 py-3.5 text-sm font-semibold text-[var(--color-ink-deep)] transition-transform active:scale-[0.98]"
                >
                  Browse Shop
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSlideOver isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
