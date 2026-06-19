import type { CSSProperties } from "react";
import { ProductDescription } from "@/components/product/ProductDescription";
import styles from "./EffortHighlight.module.css";

interface EffortHighlightProps {
  content: string;
}

const SPARKLE_STARS = [
  { top: "-6px", left: "10%", delay: "0s", size: 4, color: "#ffffff" },
  { top: "-8px", left: "42%", delay: "0.7s", size: 3, color: "#c2ef4e" },
  { top: "-5px", right: "12%", delay: "1.3s", size: 4, color: "#fa7faa" },
  { top: "18%", left: "-7px", delay: "0.4s", size: 3, color: "#c2ef4e" },
  { top: "52%", left: "-9px", delay: "1.1s", size: 4, color: "#ffffff" },
  { top: "82%", left: "-6px", delay: "1.9s", size: 3, color: "#3a86ff" },
  { top: "22%", right: "-7px", delay: "0.9s", size: 4, color: "#ffbe0b" },
  { top: "58%", right: "-9px", delay: "1.6s", size: 3, color: "#ffffff" },
  { top: "86%", right: "-6px", delay: "0.2s", size: 4, color: "#c2ef4e" },
  { bottom: "-7px", left: "18%", delay: "0.5s", size: 3, color: "#8338ec" },
  { bottom: "-9px", left: "48%", delay: "1.2s", size: 4, color: "#ffffff" },
  { bottom: "-6px", right: "16%", delay: "1.8s", size: 3, color: "#06d6a0" },
] as const;

export function EffortHighlight({ content }: EffortHighlightProps) {
  return (
    <div className={styles.wrapper}>
      {SPARKLE_STARS.map((star, index) => (
        <span
          key={index}
          className={styles.star}
          aria-hidden="true"
          style={
            {
              top: star.top,
              left: "left" in star ? star.left : undefined,
              right: "right" in star ? star.right : undefined,
              bottom: "bottom" in star ? star.bottom : undefined,
              "--star-size": `${star.size}px`,
              "--star-color": star.color,
              "--delay": star.delay,
            } as CSSProperties
          }
        />
      ))}

      <div className={styles.outline}>
        <div className={styles.inner}>
          <ProductDescription content={content} />
        </div>
      </div>
    </div>
  );
}
