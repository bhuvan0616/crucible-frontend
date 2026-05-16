"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./product-card";

const products = [
  {
    id: "var_black",
    title: "Portable Keychain Phone Stand",
    variant: "Wakanda Black",
    price: 449,
    imageUrl: "/images/keychain-stand-front.jpg",
    handle: "portable-keychain-phone-stand",
  },
  {
    id: "var_grey",
    title: "Portable Keychain Phone Stand",
    variant: "Batman Grey",
    price: 449,
    imageUrl: "/images/keychain-stand-side.jpg",
    handle: "portable-keychain-phone-stand",
  },
  {
    id: "var_teal",
    title: "Portable Keychain Phone Stand",
    variant: "Captain Teal",
    price: 449,
    imageUrl: "/images/keychain-stand-lifestyle.jpg",
    handle: "portable-keychain-phone-stand",
  },
];

export function FeaturedProducts() {
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
            Choose Your Style
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Three premium variants, each crafted with precision 3D printing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              title={product.title}
              variant={product.variant}
              price={product.price}
              imageUrl={product.imageUrl}
              href={`/product/${product.handle}`}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}