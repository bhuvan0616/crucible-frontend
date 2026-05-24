import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products"
import { ShopClient } from "./ShopClient"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shop All Products | Crucible Creations",
    description: "Browse our complete collection of premium 3D printed products. Find the perfect portable keychain phone stand for your lifestyle.",
    openGraph: {
      title: "Shop All Products | Crucible Creations",
      description: "Browse our complete collection of premium 3D printed products.",
    },
  };
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-[var(--color-primary)] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop All Products
          </h1>
          <p className="text-[var(--color-on-dark-muted)] text-lg">
            Browse our complete collection of premium 3D printed products
          </p>
        </div>

        <ShopClient initialProducts={products} />
      </div>
    </main>
  )
}