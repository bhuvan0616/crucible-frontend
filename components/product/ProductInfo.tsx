import { formatPrice } from "@/lib/utils/formatPrice";

interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
}

export function ProductInfo({
  title,
  price,
  description,
}: ProductInfoProps) {
  const displayPrice = formatPrice(price);
  const debugPrice = price > 0 ? displayPrice : "Contact for price";

  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>

      <div className="flex items-baseline gap-2">
        {price > 0 ? (
          <>
            <span className="text-4xl font-bold text-[var(--color-lime)]">
              {displayPrice}
            </span>
            <span className="text-[var(--color-on-dark-muted)] text-sm">
              Incl. taxes
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-[var(--color-on-dark-muted)]">
            Contact for price
          </span>
        )}
      </div>

      <p className="text-[var(--color-on-dark-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}