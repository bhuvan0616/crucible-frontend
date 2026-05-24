import type { MetadataRoute } from "next";
import { sdk } from "@/lib/sdk";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const { products } = await sdk.store.product.list({
      limit: 100,
      fields: "id,title,updated_at",
    });

    productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticPages, ...productPages];
}