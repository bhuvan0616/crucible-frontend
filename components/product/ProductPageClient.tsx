"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import type { HttpTypes } from "@medusajs/types";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { CustomizationInput } from "@/components/product/CustomizationInput";
import { VariantSelector } from "@/components/product/VariantSelector";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { useCartStore } from "@/store/cartStore";
import { trackAddToCart } from "@/lib/analytics/ga4";
import { pageMainClassName } from "@/components/layout/pageShell";

interface ProductPageClientProps {
  product: HttpTypes.StoreProduct;
}

function getColorHex(colorName: string): string {
  const name = colorName.toLowerCase();
  const colorMap: Record<string, string> = {
    black: "#1a1a1a", grey: "#4a4a4a", gray: "#4a4a4a",
    "space grey": "#6b6b6b", "stealth black": "#0d0d0d", charcoal: "#36454f",
    teal: "#008080", purple: "#2d1b4e", green: "#228b22", red: "#b22222",
    brown: "#5d432c", terracotta: "#c04000", navy: "#1a1a4e", white: "#f5f5f5",
    silver: "#c0c0c0", default: "#6b6b6b",
  };
  for (const [key, hex] of Object.entries(colorMap)) {
    if (name.includes(key)) return hex;
  }
  return colorMap.default;
}

interface ProductOption {
  title: string;
  values: Array<{ value: string; hex?: string; variantId: string; price: number }>;
}

function extractOptions(product: HttpTypes.StoreProduct): ProductOption[] {
  const optionTitleById = new Map<string, string>();

  if (product.options && product.options.length > 0) {
    for (const opt of product.options) {
      if (opt && opt.id && opt.title) {
        optionTitleById.set(opt.id, opt.title);
      }
    }
  }

  if (product.variants && product.variants.length > 0) {
    const optionMap = new Map<string, { values: Map<string, { variantId: string; price: number }> }>();

    for (const variant of product.variants) {
      for (const optVal of variant.options || []) {
        const optId = (optVal.option as any)?.id || optVal.option_id || "";
        let optTitle = optionTitleById.get(optId) || "";
        if (!optTitle && (optVal.option as any)?.title) {
          optTitle = (optVal.option as any).title;
        }
        const optValue = String(optVal.value);

        if (!optionMap.has(optTitle)) {
          optionMap.set(optTitle, { values: new Map() });
        }
        const optEntry = optionMap.get(optTitle)!;
        if (!optEntry.values.has(optValue)) {
          optEntry.values.set(optValue, {
            variantId: variant.id || "",
            price: variant.calculated_price?.calculated_amount ?? 0,
          });
        }
      }
    }

    return Array.from(optionMap.entries()).map(([title, entry]) => {
      const isColor = title.toLowerCase().includes('color') || title.toLowerCase() === 'colour';
      return {
        title,
        values: Array.from(entry.values.entries()).map(([value, data]) => ({
          value,
          hex: isColor ? getColorHex(value) : undefined,
          variantId: data.variantId,
          price: data.price,
        })),
      };
    });
  }

  return [];
}

function findMatchingVariant(product: HttpTypes.StoreProduct, selectedOptions: Record<string, string>): string | null {
  if (!product.variants) return null;

  const variantOptionMap = new Map<string, Map<string, string>>();
  if (product.options && product.options.length > 0) {
    for (const opt of product.options) {
      if (opt && opt.id && opt.title) {
        variantOptionMap.set(opt.id, new Map([[opt.title, opt.title]]));
      }
    }
  }

  for (const variant of product.variants) {
    const optionTitleByOptId = new Map<string, string>();
    for (const optVal of variant.options || []) {
      const optId = (optVal.option as any)?.id || optVal.option_id || "";
      if (!optionTitleByOptId.has(optId)) {
        const optTitle = product.options?.find(p => p?.id === optId)?.title || "";
        optionTitleByOptId.set(optId, optTitle);
      }
    }

    const matches = variant.options?.every(opt => {
      const optId = (opt.option as any)?.id || opt.option_id || "";
      const optTitle = optionTitleByOptId.get(optId) || "";
      return selectedOptions[optTitle] === String(opt.value);
    });
    if (matches) return variant.id;
  }
  return product.variants[0]?.id || null;
}

function getVariantPrice(product: HttpTypes.StoreProduct, variantId: string): number {
  const variant = product.variants?.find(v => v.id === variantId);
  return variant?.calculated_price?.calculated_amount ?? 0;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const options = extractOptions(product);
  const images = product.images?.map(img => img.url) || [];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach(opt => {
      if (opt.values.length > 0) {
        initial[opt.title] = opt.values[0].value;
      }
    });
    return initial;
  });
  const [customization, setCustomization] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    notFound();
  }

  const selectedVariantId = findMatchingVariant(product, selectedOptions) || "";
  const price = getVariantPrice(product, selectedVariantId);

  const handleSelectOption = (optionTitle: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionTitle]: value }));
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariantId) return;
    addItem(selectedVariantId, quantity, customization.slice(0, 12));
    trackAddToCart(product.id, product.title, price, quantity);
    setCustomization("");
    setQuantity(1);
  };

  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <ProductGallery
            images={images}
            productTitle={product.title}
            selectedIndex={selectedImageIndex}
            onSelectIndex={setSelectedImageIndex}
          />

          <div className="space-y-6">
            <ProductInfo
              title={product.title}
              price={price}
              description={product.description || ""}
            />

            {options.map(opt => (
              <VariantSelector
                key={opt.title}
                option={opt}
                selectedValue={selectedOptions[opt.title] || ""}
                onSelect={(value) => handleSelectOption(opt.title, value)}
              />
            ))}

            <CustomizationInput
              value={customization}
              onChange={setCustomization}
              maxChars={12}
            />

            <AddToCartSection
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              price={price}
            />

            <div className="border-t border-[var(--color-hairline-violet)] pt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Shipping Info
              </h3>
              <div className="bg-[var(--color-ink-deep)] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-on-dark-muted)]">
                  <svg className="w-4 h-4 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping on orders above ₹499
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-on-dark-muted)]">
                  <svg className="w-4 h-4 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivery in 3-5 business days
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-on-dark-muted)]">
                  <svg className="w-4 h-4 text-[var(--color-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}