"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const scenarios = [
  {
    icon: "💼",
    title: "Desk Work",
    description: "Keep your phone at eye level during long work sessions. Perfect for video calls and multitasking.",
  },
  {
    icon: "✈️",
    title: "Travel",
    description: "Compact enough to take anywhere. Use on plane trays, hotel desks, or any flat surface.",
  },
  {
    icon: "🎁",
    title: "Gifts",
    description: "A thoughtful and unique gift for tech enthusiasts, professionals, or anyone who loves clever gadgets.",
  },
  {
    icon: "🎒",
    title: "Everyday Carry",
    description: "Attach it to your keychain and take it everywhere. Always have a phone stand ready when you need one.",
  },
];

export function UsageScenarios() {
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
            Perfect For Every Situation
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            One product, endless possibilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-[var(--background)] border-[var(--border)] h-full hover:border-[var(--color-accent)] transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{scenario.icon}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {scenario.description}
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