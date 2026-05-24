import { sdk, initRegion, getRegionId } from "@/lib/sdk"
import { formatPrice } from "@/lib/utils/formatPrice"
import type { Product, ColorVariant } from "@/types"
import type { HttpTypes } from "@medusajs/types"

async function ensureRegion() {
  try {
    await initRegion()
  } catch {
    // Region init is optional, products may still load
  }
}

// Helper to transform Medusa product to our Product type
function transformProduct(medusaProduct: HttpTypes.StoreProduct): Product {
  const firstVariant = medusaProduct.variants?.[0]
  const calculatedPrice = typeof firstVariant?.calculated_price?.calculated_amount === 'number' 
    ? firstVariant.calculated_price.calculated_amount 
    : 0

  // Extract edition from tags or collection
  let edition: "standard" | "pro" | "limited" = "standard"
  const collectionTitle = medusaProduct.collection?.title?.toLowerCase() || ""
  const tags = medusaProduct.tags || []

  if (collectionTitle.includes("pro") || tags.some((t) => t.value?.toLowerCase().includes("pro"))) {
    edition = "pro"
  } else if (collectionTitle.includes("limited") || tags.some((t) => t.value?.toLowerCase().includes("limited"))) {
    edition = "limited"
  }

  // Transform colors from Medusa options/variants
  const colors: ColorVariant[] = medusaProduct.variants?.map((variant) => {
    const colorName = variant.title || "Default"
    const isAvailable =
      variant.manage_inventory === false || (variant.inventory_quantity || 0) > 0

    // Derive hex from color name (simplified mapping)
    const hex = getColorHex(colorName)

    return {
      name: colorName,
      hex,
      available: isAvailable,
      medusaVariantId: variant.id,
    }
  }) || []

  // Build specs from product options or metadata
  const specs: Record<string, string> = {}
  if (medusaProduct.options) {
    medusaProduct.options.forEach((opt) => {
      if (opt.values?.length) {
        specs[opt.title || ""] = opt.values.map(v => v.value).join(", ")
      }
    })
  }

  // Use thumbnail or first image
  const imageUrl = medusaProduct.thumbnail || medusaProduct.images?.[0]?.url || "/placeholder.jpg"
  const allImages = medusaProduct.images?.length
    ? medusaProduct.images.map((img) => img.url)
    : [imageUrl]

  // Check if featured
  const isFeatured = tags.some((t) => t.value?.toLowerCase().includes("featured")) || false

  return {
    id: medusaProduct.id,
    title: medusaProduct.title,
    variant: firstVariant?.title || "Default",
    description: medusaProduct.description || "",
    price: calculatedPrice,
    images: allImages,
    edition,
    colors,
    specs,
    featured: isFeatured,
  }
}

// Simple color hex mapping based on color name
function getColorHex(colorName: string): string {
  const name = colorName.toLowerCase()
  const colorMap: Record<string, string> = {
    // Blacks/greys
    black: "#1a1a1a",
    grey: "#4a4a4a",
    gray: "#4a4a4a",
    "space grey": "#6b6b6b",
    "stealth black": "#0d0d0d",
    charcoal: "#36454f",
    midnight: "#1a1a4e",
    // Colors
    teal: "#008080",
    purple: "#2d1b4e",
    green: "#228b22",
    red: "#b22222",
    brown: "#5d432c",
    terracotta: "#c04000",
    navy: "#1a1a4e",
    white: "#f5f5f5",
    silver: "#c0c0c0",
    "carbon fiber": "#2c2c2c",
    "midnight purple": "#2d1b4e",
    obsidian: "#0f0f0f",
    "forest green": "#228b22",
    "cherry red": "#b22222",
    natural: "#d2b48c",
    sage: "#9dc183",
    clay: "#8b8589",
    walnut: "#5d432c",
    "walnut dark": "#3d2817",
    "arctic white": "#f5f5f5",
    default: "#6b6b6b",
  }

  // Check exact or partial matches
  for (const [key, hex] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return hex
    }
  }

  return colorMap.default
}

export async function getProducts(): Promise<HttpTypes.StoreProduct[]> {
  let regionId: string | null = null
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    regionId = regions?.[0]?.id || null
  } catch {}
  
  const params: Record<string, any> = {
    limit: 100,
    fields: "id,title,description,handle,thumbnail,images,*variants,*collection,*tags",
  }
  if (regionId) {
    params.region_id = regionId
  }
  const { products } = await sdk.store.product.list(params)
  return products
}

export async function getProductById(id: string): Promise<HttpTypes.StoreProduct | undefined> {
  let regionId: string | null = null
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    regionId = regions?.[0]?.id || null
  } catch {}

  const params: Record<string, any> = {
    fields: "id,title,description,handle,*images,*variants,*variants.options,*options,*collection,*tags",
  }
  if (regionId) {
    params.region_id = regionId
  }
  try {
    const { product } = await sdk.store.product.retrieve(id, params)
    return product
  } catch {
    return undefined
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const allProducts = await getProducts()
  return allProducts.filter((p) => p.featured)
}