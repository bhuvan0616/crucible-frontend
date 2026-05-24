"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedEdition: string;
  onEditionChange: (value: string) => void;
  selectedColor: string;
  onColorChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  resultCount: number;
}

const editions = [
  { value: "all", label: "All Editions" },
  { value: "standard", label: "Standard" },
  { value: "pro", label: "Pro" },
  { value: "limited", label: "Limited" },
];

const colors = [
  { value: "all", label: "All Colors" },
  { value: "black", label: "Black" },
  { value: "grey", label: "Grey" },
  { value: "teal", label: "Teal" },
  { value: "purple", label: "Purple" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "brown", label: "Brown" },
  { value: "white", label: "White" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedEdition,
  onEditionChange,
  selectedColor,
  onColorChange,
  sortBy,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-on-dark-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[var(--color-ink-deep)] border-[var(--color-hairline-violet)] text-white placeholder:text-[var(--color-on-dark-muted)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-dark-muted)] hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[var(--color-on-dark-muted)] text-sm">
            {resultCount} {resultCount === 1 ? "product" : "products"}
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[var(--color-ink-deep)] border border-[var(--color-hairline-violet)] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-on-dark-muted)] text-sm">Edition:</span>
          <div className="flex gap-2">
            {editions.map((edition) => (
              <button
                key={edition.value}
                onClick={() => onEditionChange(edition.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedEdition === edition.value
                    ? "bg-[var(--color-lime)] text-[var(--color-ink-deep)]"
                    : "bg-[var(--color-ink-deep)] text-[var(--color-on-dark-muted)] border border-[var(--color-hairline-violet)] hover:border-[var(--color-lime)]"
                }`}
              >
                {edition.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-[var(--color-hairline-violet)] hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-[var(--color-on-dark-muted)] text-sm">Color:</span>
          <select
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="bg-[var(--color-ink-deep)] border border-[var(--color-hairline-violet)] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)]"
          >
            {colors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}