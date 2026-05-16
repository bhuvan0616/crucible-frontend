"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "pt-0" : "pt-6"
      }`}
    >
      {/* Backdrop blur when scrolled */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          scrolled ? "bg-[#0a0f1a]/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      />

      {/* Floating pill */}
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className={`flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-500 ${
            scrolled
              ? "bg-[#0a0f1a]/95 border-white/10 shadow-2xl shadow-black/20"
              : "bg-[#0f172a]/80 border-white/10 shadow-2xl"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="pl-4 pr-6 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">Crucible</span>
              <span className="text-sm font-light tracking-tight text-[#94a3b8]">Creations</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[13px] text-[#94a3b8] hover:text-white transition-colors duration-300 rounded-full hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="pl-4 pr-2">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f97316] hover:bg-[#f97316]/90 text-white text-[13px] font-medium transition-all duration-300 active:scale-[0.97]"
            >
              <span>Shop Now</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8L8 2M8 2H3M8 2V7" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}