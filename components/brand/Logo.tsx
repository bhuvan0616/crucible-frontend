import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGOS = {
  short: { src: "/crucible_short_white.svg", width: 625, height: 627 },
  long: { src: "/crucible.svg", width: 1359, height: 315 },
} as const;

type LogoVariant = "short" | "long" | "responsive";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  imageClassName?: string;
  linked?: boolean;
  href?: string;
  priority?: boolean;
  /** Inverts the long wordmark so it reads on dark surfaces */
  onDark?: boolean;
}

export function Logo({
  variant = "short",
  className,
  imageClassName,
  linked = false,
  href = "/",
  priority = false,
  onDark = true,
}: LogoProps) {
  const longOnDarkClass = onDark ? "brightness-0 invert" : "";

  const content =
    variant === "responsive" ? (
      <Image
        src={LOGOS.long.src}
        alt="Crucible Creations"
        width={LOGOS.long.width}
        height={LOGOS.long.height}
        priority={priority}
        className={cn(
          "h-6 w-auto max-w-[112px] object-contain object-left sm:h-8 sm:max-w-[160px]",
          longOnDarkClass,
          imageClassName
        )}
      />
    ) : (
      <Image
        src={LOGOS[variant].src}
        alt="Crucible Creations"
        width={LOGOS[variant].width}
        height={LOGOS[variant].height}
        priority={priority}
        className={cn(
          variant === "short"
            ? "h-9 w-9 object-contain"
            : "h-10 w-auto max-w-[220px] object-contain object-left",
          variant === "long" && longOnDarkClass,
          imageClassName
        )}
      />
    );

  if (linked) {
    return (
      <Link href={href} className={cn("inline-flex items-center", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex items-center", className)}>{content}</div>;
}
