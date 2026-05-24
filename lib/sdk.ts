import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
    jwtTokenStorageMethod: "custom",
    storage: {
      getItem: (key: string) => {
        if (typeof window === "undefined") return null
        return localStorage.getItem(key)
      },
      setItem: (key: string, value: string) => {
        if (typeof window === "undefined") return
        localStorage.setItem(key, value)
      },
      removeItem: (key: string) => {
        if (typeof window === "undefined") return
        localStorage.removeItem(key)
      },
    },
  },
})

let regionId: string | null = null

export async function initRegion(): Promise<string | null> {
  if (regionId) return regionId

  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    if (regions?.[0]?.id) {
      regionId = regions[0].id
      return regionId
    }
  } catch (e) {
    console.warn("Failed to fetch region:", e)
  }

  return null
}

export async function ensureRegion(): Promise<string | null> {
  if (!regionId) {
    return await initRegion()
  }
  return regionId
}

export function getRegionId(): string | null {
  return regionId
}

export function setRegionId(id: string) {
  regionId = id
}