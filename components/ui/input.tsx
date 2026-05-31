import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-[var(--color-hairline-violet)] text-white bg-[var(--color-primary)]/30 px-4 py-0 text-base text-white placeholder:text-[var(--color-on-dark-faint)] transition-all duration-300 outline-none focus:border-[var(--color-lime)] focus:ring-2 focus:ring-[var(--color-lime)]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }