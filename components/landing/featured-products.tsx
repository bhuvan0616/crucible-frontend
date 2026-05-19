"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "var_black",
    title: "Portable Keychain Phone Stand",
    variant: "Wakanda Black",
    price: 449,
    imageUrl: "/images/batman.png",
    handle: "portable-keychain-phone-stand",
    description: "Bold and sleek, engineered for everyday carry."
  },
  {
    id: "var_grey",
    title: "Portable Keychain Phone Stand",
    variant: "Batman Grey",
    price: 449,
    imageUrl: "/images/black panther.png",
    handle: "portable-keychain-phone-stand",
    description: "Understated elegance with premium finish."
  },
  {
    id: "var_teal",
    title: "Portable Keychain Phone Stand",
    variant: "Captain Teal",
    price: 449,
    imageUrl: "/images/captain.png",
    handle: "portable-keychain-phone-stand",
    description: "Distinctive teal for those who stand out."
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
  }
};

export function FeaturedProducts() {
  return (
    <section className="relative py-40 bg-[#0a0f1a]">
      {/* Section background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#0a0f1a]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }
          }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="text-[11px] uppercase tracking-[0.25em] text-[#14b8a6] mb-4"
          >
            Choose Your Style
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5"
          >
            Three Signature Editions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="text-[#94a3b8] max-w-xl mx-auto text-base leading-relaxed"
          >
            Each variant crafted with precision 3D printing for a premium feel.
          </motion.p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.9, delay: index * 0.15, ease: [0.32, 0.72, 0, 1] }
                }
              }}
            >
              {/* Double-bezel card with enhanced hover */}
              <div className="group relative p-1.5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-[#14b8a6]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#14b8a6]/5">
                <div className="relative rounded-[calc(2rem-0.375rem)] overflow-hidden bg-[#0f172a]">
                  {/* Product image with zoom effect */}
                  <Link href={`/product/${product.handle}`} className="block">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0f172a]/20 to-transparent z-10" />
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        src={product.imageUrl}
                        alt={product.variant}
                        className="w-full h-full object-cover"
                      />
                      {/* Variant badge with hover lift */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute top-4 left-4 z-20"
                      >
                        <span className="px-3 py-1.5 rounded-full bg-[#0a0f1a]/80 backdrop-blur-sm text-[10px] uppercase tracking-[0.15em] text-white border border-white/10 hover:border-[#14b8a6]/30 transition-all duration-300">
                          {product.variant}
                        </span>
                      </motion.div>
                    </div>
                  </Link>

                  {/* Product info */}
                  <div className="p-6">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#64748b] mb-2">{product.title}</p>
                    <h3 className="text-lg font-medium text-white mb-2">{product.variant}</h3>
                    <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <motion.p
                        className="text-xl font-semibold text-white"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      >
                        ₹{product.price}
                      </motion.p>
                      <Link href={`/product/${product.handle}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          className="inline-block"
                        >
                          <Button
                            variant="outline"
                            className="rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.1em] border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            View
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}