"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CartSlideOver } from "@/components/shop/CartSlideOver";
import { useCartStore, selectCartItemCount } from "@/store/cartStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore(selectCartItemCount);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--color-surface-night)]/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                className="w-10 h-10 bg-[var(--color-lime)] rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-[var(--color-ink-deep)] font-bold text-lg">C</span>
              </motion.div>
              <motion.span
                whileHover={{ x: 3 }}
                className="font-bold text-lg text-white group-hover:text-[var(--color-lime)] transition-colors"
              >
                Crucible
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-[var(--color-lime)] transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-[var(--color-lime)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-pink)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <div className="hidden md:block">
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-inverted flex items-center gap-2"
                  >
                    <span>Shop Now</span>
                    <motion.svg
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </motion.svg>
                  </motion.button>
                </Link>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center"
              >
                <div className="space-y-1.5">
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                    className="block w-6 h-0.5 bg-white origin-center"
                  />
                  <motion.span
                    animate={{ opacity: isOpen ? 0 : 1 }}
                    className="block w-6 h-0.5 bg-white"
                  />
                  <motion.span
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                    className="block w-6 h-0.5 bg-white origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--color-surface-night)] pt-24 px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-[var(--color-lime)] transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSlideOver isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}