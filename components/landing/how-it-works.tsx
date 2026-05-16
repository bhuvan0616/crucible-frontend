"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Choose Your Style",
    description: "Select from our collection of premium 3D printed phone stands in Wakanda Black, Batman Grey, or Captain Teal.",
    icon: "🎨",
  },
  {
    number: "02",
    title: "Add Custom Text",
    description: "Personalize your stand with up to 12 characters. Make it uniquely yours with a name or message.",
    icon: "✍️",
  },
  {
    number: "03",
    title: "Order & Enjoy",
    description: "Place your order and receive your custom phone stand delivered to your door. Enjoy hands-free viewing anywhere.",
    icon: "📦",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            How It Works
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Simple, intuitive, and ready in seconds
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <Card className="bg-[var(--card-bg)] border-[var(--border)] h-full">
                  <CardContent className="p-8 text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                        <span className="text-3xl">{step.icon}</span>
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white font-bold flex items-center justify-center text-sm">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)]">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}