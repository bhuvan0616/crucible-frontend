import type { Element, Text } from "hast";
import type { JSX } from "react";

/** Split paragraph AST into text lines (handles soft breaks as line boundaries). */
export function getParagraphLines(node: Element | undefined): string[] {
  if (!node?.children?.length) {
    return [];
  }

  const lines: string[] = [];
  let current = "";

  for (const child of node.children) {
    if (child.type === "text") {
      current += (child as Text).value;
    } else if (child.type === "element" && (child as Element).tagName === "br") {
      lines.push(current);
      current = "";
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.map((line) => line.trim()).filter(Boolean);
}

export function isStarLine(line: string): boolean {
  return line.startsWith("✦");
}

export function starLineText(line: string): string {
  return line.replace(/^✦\s*/, "");
}

export function renderStarLine(line: string, key: number): JSX.Element {
  return (
    <p key={key} className="flex items-start gap-2.5">
      <span className="shrink-0 text-[var(--color-lime)]" aria-hidden="true">
        ✦
      </span>
      <span>{starLineText(line)}</span>
    </p>
  );
}
