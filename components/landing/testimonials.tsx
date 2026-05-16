"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, Bangalore",
    avatar: "👩‍💻",
    rating: 5,
    quote: "This phone stand is genius! I use it daily for video calls and it's so convenient to have on my keychain. The 3D printed quality is impressive.",
    product: "Portable Keychain Phone Stand - Captain Teal",
  },
  {
    name: "Rahul Mehta",
    role: "Digital Nomad, Goa",
    avatar: "🧑‍💻",
    rating: 5,
    quote: "Perfect for my travel setup. It's so compact and the custom engraving makes it uniquely mine. Worth every rupee!",
    product: "Portable Keychain Phone Stand - Wakanda Black",
  },
  {
    name: "Ananya Krishnan",
    role: "Content Creator, Mumbai",
    avatar: "👩‍🎨",
    rating: 5,
    quote: "The best impulse buy ever. My audience always asks about my phone stand and I love showing it off! The teal color is stunning.",
    product: "Portable Keychain Phone Stand - Captain Teal",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 mb-3">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="text-[var(--color-cta)]">★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
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
            What Our Customers Say
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Real reviews from real people who love their stands
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-[var(--card-bg)] border-[var(--border)] h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--foreground)]">{testimonial.name}</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">{testimonial.role}</p>
                    </div>
                  </div>
                  <StarRating count={testimonial.rating} />
                  <p className="text-[var(--muted-foreground)] italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-xs text-[var(--color-accent)]">Purchased: {testimonial.product}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}