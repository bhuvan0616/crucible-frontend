"use client"

import { useState, useMemo } from "react"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { FilterBar } from "@/components/shop/FilterBar"
import type { HttpTypes } from "@medusajs/types"

interface ShopClientProps {
  initialProducts: any[]
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEdition, setSelectedEdition] = useState<string>("all")
  const [selectedColor, setSelectedColor] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    if (selectedEdition !== "all") {
      filtered = filtered.filter((p) => {
        const collectionTitle = p.collection?.title?.toLowerCase() || ""
        const tags = p.tags || []
        const hasTag = tags.some((t: any) => t.value?.toLowerCase().includes(selectedEdition))
        return collectionTitle.includes(selectedEdition) || hasTag
      })
    }

    if (selectedColor !== "all") {
      filtered = filtered.filter((p) => {
        const colorName = selectedColor.toLowerCase()
        return p.variants?.some((v: any) => v.title?.toLowerCase().includes(colorName))
      })
    }

    const getPrice = (variant: any) => variant?.calculated_price?.calculated_amount ?? 0

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => getPrice(a.variants?.[0]) - getPrice(b.variants?.[0]))
        break
      case "price-high":
        filtered.sort((a, b) => getPrice(b.variants?.[0]) - getPrice(a.variants?.[0]))
        break
      default:
        filtered.sort((a, b) => {
          const aFeatured = a.tags?.some((t: any) => t.value?.toLowerCase().includes("featured")) ? 1 : 0
          const bFeatured = b.tags?.some((t: any) => t.value?.toLowerCase().includes("featured")) ? 1 : 0
          return bFeatured - aFeatured
        })
    }

    return filtered
  }, [searchQuery, selectedEdition, selectedColor, sortBy, initialProducts])

  return (
    <>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filteredProducts.length}
      />

      <ProductGrid products={filteredProducts} />
    </>
  )
}