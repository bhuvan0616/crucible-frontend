import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[8rem] w-full min-w-0 resize-y rounded-xl border border-[var(--color-hairline-violet)] bg-[var(--color-primary)]/30 px-4 py-3 text-base text-white placeholder:text-[var(--color-on-dark-faint)] transition-all duration-300 outline-none focus:border-[var(--color-lime)] focus:ring-2 focus:ring-[var(--color-lime)]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
