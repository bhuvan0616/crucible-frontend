"use client"

import { createContext, useContext, type ReactNode } from "react"
import { sdk } from "@/lib/sdk"
import Medusa from "@medusajs/js-sdk"

interface MedusaContextValue {
  sdk: typeof sdk
}

const MedusaContext = createContext<MedusaContextValue | null>(null)

export function MedusaProvider({
  children,
  initialClient,
}: {
  children: ReactNode
  initialClient?: InstanceType<typeof Medusa> | null
}) {
  return (
    <MedusaContext.Provider
      value={{ sdk: initialClient || sdk }}
    >
      {children}
    </MedusaContext.Provider>
  )
}

export function useMedusa() {
  const context = useContext(MedusaContext)
  if (!context) {
    return { sdk }
  }
  return context
}