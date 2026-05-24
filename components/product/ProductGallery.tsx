"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export function ProductGallery({
  images,
  productTitle,
  selectedIndex,
  onSelectIndex,
}: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      <motion.div
        key={selectedIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square bg-[var(--color-ink-deep)] rounded-2xl overflow-hidden"
      >
        <Image
          src={images[selectedIndex] || "https://picsum.photos/800/800"}
          alt={`${productTitle} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onSelectIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-[var(--color-lime)]"
                  : "border-transparent hover:border-[var(--color-hairline-violet)]"
              }`}
            >
              <Image
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}