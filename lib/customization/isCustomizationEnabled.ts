import type { CustomizationWhen } from "./types";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Returns whether customization fields should be shown for the current variant selection.
 * No `when` rule means customization is always enabled (legacy / array-only metadata).
 */
export function isCustomizationEnabled(
  when: CustomizationWhen | undefined,
  selectedOptions: Record<string, string>
): boolean {
  if (!when) return true;

  const targetOption = normalize(when.option);
  const targetValue = normalize(when.value);

  for (const [title, value] of Object.entries(selectedOptions)) {
    if (normalize(title) === targetOption && normalize(value) === targetValue) {
      return true;
    }
  }

  return false;
}
