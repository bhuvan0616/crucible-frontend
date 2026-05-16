"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: "🏆",
    title: "Premium 3D Printed",
    description: "Crafted with precision using high-quality PLA/PETG materials for durability and style.",
  },
  {
    icon: "🔑",
    title: "Compact & Portable",
    description: "Designed to fit on your keychain. Take it anywhere - desk, travel, or on-the-go.",
  },
  {
    icon: "✂️",
    title: "Custom Engraving",
    description: "Personalize with your name or message (up to 12 characters) for a unique touch.",
  },
  {
    icon: "🎁",
    title: "Perfect Gift",
    description: "An innovative gift for tech enthusiasts, professionals, or anyone who loves gadgets.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-[var(--card-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Why Choose Crucible Creations
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Every product is designed with attention to detail and manufactured with care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-[var(--background)] border-[var(--border)] h-full">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}