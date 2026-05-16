"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-[var(--card-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[var(--background)] border-[var(--border)]">
            <CardContent className="p-8 md:p-12 text-center">
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <span className="text-4xl">📬</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
                    Stay in the Loop
                  </h2>
                  <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
                    Get updates on new products, exclusive offers, and creative uses of our 3D printed accessories.
                  </p>
                  
                  <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                      required
                    />
                    <Button 
                      type="submit"
                      className="bg-[var(--color-cta)] hover:bg-[var(--color-cta)]/90 text-white px-6"
                    >
                      Subscribe
                    </Button>
                  </form>
                  
                  <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
                    You&apos;re Subscribed!
                  </h2>
                  <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
                    Thanks for joining the Crucible Creations community. Get ready for exclusive updates and offers!
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                  >
                    Subscribe Another Email
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}