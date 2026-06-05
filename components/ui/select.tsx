"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
  id,
}: SelectProps) {
  const items = React.useMemo(
    () => options.map((option) => ({ value: option.value, label: option.label })),
    [options]
  );

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue);
        }
      }}
      items={items}
      disabled={disabled}
      modal={false}
    >
      <SelectPrimitive.Trigger
        id={id}
        data-slot="select-trigger"
        className={cn(
          "group flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] px-4 py-3 text-left text-sm font-medium text-white outline-none transition-[border-color,box-shadow] duration-200",
          "hover:border-[var(--color-violet-mid)]",
          "focus-visible:border-[var(--color-lime)] focus-visible:ring-2 focus-visible:ring-[var(--color-lime)]/25",
          "data-[popup-open]:border-[var(--color-lime)] data-[popup-open]:ring-2 data-[popup-open]:ring-[var(--color-lime)]/20",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="min-w-0 flex-1 truncate data-[placeholder]:text-[var(--color-on-dark-muted)]"
        />
        <SelectPrimitive.Icon className="flex shrink-0 items-center justify-center text-[var(--color-on-dark-muted)] transition-transform duration-200 ease-out group-data-[popup-open]:rotate-180">
          <ChevronDown className="size-4" strokeWidth={2} aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          className="z-40 outline-none"
        >
          <SelectPrimitive.Popup
            data-slot="select-popup"
            className={cn(
              "select-popup w-[var(--anchor-width)] overflow-hidden rounded-xl border border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] shadow-[0_16px_40px_rgba(0,0,0,0.45)]",
              "origin-[var(--transform-origin)]"
            )}
          >
            <SelectPrimitive.List className="flex max-h-60 flex-col gap-1.5 overflow-y-auto p-2 outline-none">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none",
                    "transition-colors duration-150 ease-out",
                    "data-[highlighted]:bg-[var(--color-hairline-violet)]/60",
                    "data-[selected]:bg-[var(--color-lime)]/10 data-[selected]:text-[var(--color-lime)]",
                    "data-[highlighted]:data-[selected]:bg-[var(--color-lime)]/15"
                  )}
                >
                  <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="flex size-4 shrink-0 items-center justify-center text-[var(--color-lime)]">
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export { Select };
