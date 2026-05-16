"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  title: string;
  variant: string;
  price: number;
  imageUrl: string;
  href: string;
  delay?: number;
}

export function ProductCard({ title, variant, price, imageUrl, href, delay = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link href={href}>
        <Card className="bg-[var(--card-bg)] border-[var(--border)] hover:border-[var(--color-accent)] transition-colors overflow-hidden group">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-[var(--muted)] overflow-hidden">
              <Image
                src={imageUrl}
                alt={variant}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">{title}</p>
              <h3 className="text-lg font-semibold text-[var(--card-foreground)]">{variant}</h3>
              <p className="text-[var(--color-accent)] font-bold">₹{price}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}