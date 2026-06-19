import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Element } from "hast";
import { cn } from "@/lib/utils";
import { normalizeProductDescriptionMarkdown } from "@/lib/utils/normalizeProductDescriptionMarkdown";
import {
  getParagraphLines,
  isStarLine,
  renderStarLine,
} from "@/components/product/productDescriptionUtils";

interface ProductDescriptionProps {
  content: string;
  className?: string;
}

export function ProductDescription({ content, className }: ProductDescriptionProps) {
  const normalized = normalizeProductDescriptionMarkdown(content);

  if (!normalized) {
    return null;
  }

  return (
    <div
      className={cn(
        "product-description text-[var(--color-on-dark-muted)] leading-relaxed",
        "[&>*+*]:mt-4",
        "[&_a]:text-[var(--color-lime)] [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:marker:text-[var(--color-lime)]/60",
        "[&_li>input[type=checkbox]]:mr-2 [&_li>input[type=checkbox]]:accent-[var(--color-lime)]",
        "[&_strong]:font-medium [&_strong]:text-white/90",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ node, children }) => {
            const lines = getParagraphLines(node as Element | undefined);

            if (lines.length > 1 && lines.every(isStarLine)) {
              return <div className="space-y-2">{lines.map(renderStarLine)}</div>;
            }

            if (lines.length === 1 && isStarLine(lines[0])) {
              return renderStarLine(lines[0], 0);
            }

            return <p>{children}</p>;
          },
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
