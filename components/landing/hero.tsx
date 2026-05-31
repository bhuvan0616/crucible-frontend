"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className="inline-block cursor-pointer"
      >
        {children}
      </motion.div>
    </Link>
  );
}

export default function V4Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-surface-night)]"
    >
      {/* Starfield Background */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 starfield"
      />

      {/* Gradient Blobs */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -top-60 -right-60 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--color-violet-deep)]/40 to-transparent blur-[120px]"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--color-violet)]/20 to-transparent blur-[100px]"
      />

      {/* Floating Sticker Mascots */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-32 opacity-80"
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="var(--color-lime)" opacity="0.9"/>
          <circle cx="60" cy="60" r="45" fill="var(--color-lime-dark)"/>
          <circle cx="45" cy="50" r="8" fill="var(--color-ink-deep)"/>
          <circle cx="75" cy="50" r="8" fill="var(--color-ink-deep)"/>
          <circle cx="47" cy="48" r="3" fill="white"/>
          <circle cx="77" cy="48" r="3" fill="white"/>
          <path d="M45 75 Q60 90 75 75" stroke="var(--color-ink-deep)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-20 opacity-70"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="var(--color-pink)" opacity="0.9"/>
          <circle cx="40" cy="40" r="30" fill="var(--color-pink-light)"/>
          <circle cx="30" cy="35" r="6" fill="var(--color-ink-deep)"/>
          <circle cx="50" cy="35" r="6" fill="var(--color-ink-deep)"/>
          <path d="M28 52 Q40 62 52 52" stroke="var(--color-ink-deep)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
      </motion.div>

      {/* Decorative SVG Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-1/4 w-32 h-32"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-lime)" strokeWidth="1" strokeDasharray="10 5" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 right-1/4 w-24 h-24"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="var(--color-pink)" strokeWidth="1" rx="8" transform="rotate(45 50 50)" />
        </svg>
      </motion.div>

      {/* Lime Accent Circles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 right-1/3 w-4 h-4 rounded-full bg-[var(--color-lime)]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-[var(--color-pink)]"
      />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[var(--color-lime)]"
              />
              <span className="eyebrow text-white/70">
                Premium 3D Printed
              </span>
            </motion.div>

            {/* Headline with Lime Chips */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl lg:text-9xl font-bold tracking-tight leading-[0.85]"
              >
                <motion.span
                  className="block text-white"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  Pocket-Sized
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[var(--color-lime)] chip-lime">Elegance</span>
                </motion.span>
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl text-white/70 max-w-md leading-relaxed"
            >
              A phone stand that fits on your keychain.{" "}
              <span className="text-[var(--color-lime)] font-semibold">Personalized with your name.</span>{" "}
              Yours forever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap items-center gap-5 pt-4"
            >
              <MagneticButton href="/shop">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-[var(--color-lime)] text-[var(--color-ink-deep)] rounded-lg font-bold flex items-center gap-4 shadow-lg shadow-[var(--color-lime)]/30 animate-pulse-glow"
                >
                  <span className="text-lg uppercase tracking-wider">Shop Now</span>
                  <motion.svg
                    animate={{ x: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </motion.svg>
                </motion.div>
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex gap-16 pt-12 border-t border-[var(--color-hairline-violet)]"
            >
              {[
                { value: "3", label: "Variants" },
                { value: "12", label: "Max Chars" },
                { value: "₹449", label: "Starting" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="text-center"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="text-4xl font-bold text-white block"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-xs text-white/50 uppercase tracking-widest mt-1 block">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 50px 100px -20px rgba(21, 15, 35, 0.8)",
                  "0 50px 120px -20px rgba(194, 239, 78, 0.3)",
                  "0 50px 100px -20px rgba(21, 15, 35, 0.8)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative bg-gradient-to-br from-[var(--color-surface-dark)] to-[var(--color-surface-night)] rounded-[2.5rem] p-10 border border-[var(--color-hairline-violet)]"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[2rem]"
              >
                <img
                  src="/images/captain.png"
                  alt="Portable Keychain Phone Stand"
                  className="w-full aspect-square object-cover"
                />

                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-10 px-6 py-4 bg-[var(--color-surface-night)] rounded-2xl border border-[var(--color-hairline-violet)] shadow-xl"
                >
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Price</p>
                  <p className="text-3xl font-bold text-[var(--color-lime)]">₹449</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-4 bottom-24 px-5 py-2.5 bg-[var(--color-lime)] text-[var(--color-ink-deep)] rounded-full shadow-lg"
                >
                  <span className="text-sm font-bold uppercase tracking-wider">Captain Teal</span>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 border-2 border-dashed border-[var(--color-hairline-violet)]/50 rounded-full -z-10"
            />

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--color-pink)]/10 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 eyebrow">Scroll</span>
          <div className="w-10 h-16 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <motion.div className="w-1.5 h-3 bg-gradient-to-b from-[var(--color-lime)] to-[var(--color-pink)] rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Large Background Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ delay: 1.8 }}
        className="absolute top-1/4 right-16 text-[12rem] font-bold text-white whitespace-nowrap"
      >
        C
      </motion.div>
    </section>
  );
}