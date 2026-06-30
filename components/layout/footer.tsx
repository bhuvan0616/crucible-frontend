"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const footerLinks = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative py-20 bg-[#0a0f1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Brand */}
          <div className="text-center lg:text-left">
            <div className="mb-2">
              <Logo variant="long" linked imageClassName="h-9 max-w-[200px]" />
            </div>
            <p className="text-[#64748b] text-sm">Premium 3D Printed Products</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#64748b] hover:text-white text-sm transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[#475569] text-xs tracking-wide">
            © 2026 Crucible Creations
          </p>
        </div>
      </div>
    </footer>
  );
}