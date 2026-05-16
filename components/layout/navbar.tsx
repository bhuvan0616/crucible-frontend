"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-primary)]/90 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--color-accent)]">Crucible</span>
            <span className="text-lg text-white">Creations</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white hover:text-[var(--color-accent)] transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-white hover:text-[var(--color-accent)] transition-colors">
              Shop
            </Link>
            <Link 
              href="/shop" 
              className="px-4 py-2 rounded-full bg-[var(--color-cta)] text-white font-medium hover:bg-[var(--color-cta)]/90 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}