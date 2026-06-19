import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { stripMarkdown } from "@/lib/utils/stripMarkdown";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const productUrl = `${baseUrl}/product/${id}`;
  const images = product.images?.map((img) => img.url) || [];

  const metaDescription = stripMarkdown(product.description || "").slice(0, 160);

  return {
    title: product.title,
    description: metaDescription,
    keywords: [product.title, "3D printed", "custom keychain", "phone stand"],
    openGraph: {
      type: "website",
      url: productUrl,
      title: product.title,
      description: metaDescription,
      images: images.slice(0, 10).map((url, index) => ({
        url,
        width: 1200,
        height: 1200,
        alt: `${product.title} - Image ${index + 1}`,
      })),
      siteName: "Crucible Creations",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: metaDescription,
      images: images[0] ? [images[0]] : [],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const hasAvailableVariant = product.variants?.some(
    (v) => v.manage_inventory === false || (v.inventory_quantity || 0) > 0
  ) ?? false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripMarkdown(product.description || ""),
    image: product.images?.map((img) => img.url),
    url: `${baseUrl}/product/${id}`,
    brand: {
      "@type": "Brand",
      name: "Crucible Creations",
    },
    offers: {
      "@type": "Offer",
      price: product.variants?.[0]?.calculated_price?.calculated_amount ?? 0,
      priceCurrency: "INR",
      availability: hasAvailableVariant
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Crucible Creations",
      },
    },
    category: "3D Printed Products",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}