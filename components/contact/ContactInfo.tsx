import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteContact } from "@/lib/contact/siteContact";
import { siteLegal } from "@/lib/legal/siteLegal";
import { cn } from "@/lib/utils";

type ContactInfoProps = {
  layout?: "list" | "grid";
};

export function ContactInfo({ layout = "grid" }: ContactInfoProps) {
  const items = [
    {
      icon: MapPin,
      label: "Registered address",
      href: siteContact.mapsUrl,
      external: true,
      children: (
        <>
          <span className="mt-1 block">{siteContact.address.line1}</span>
          <span className="block text-[var(--color-on-dark-muted)]">
            {siteContact.address.city}-{siteContact.address.postalCode},{" "}
            {siteContact.address.country}
          </span>
        </>
      ),
    },
    {
      icon: Phone,
      label: "Phone",
      href: siteContact.phone.href,
      children: siteContact.phone.display,
    },
    {
      icon: Mail,
      label: "Email",
      href: siteLegal.emailHref,
      children: siteLegal.email,
    },
    {
      icon: Clock,
      label: "Business hours",
      children: siteContact.hours.label,
    },
  ] as const;

  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          : "space-y-6"
      )}
    >
      {items.map((item) => (
        <ContactRow
          key={item.label}
          icon={item.icon}
          label={item.label}
          href={"href" in item ? item.href : undefined}
          external={"external" in item ? item.external : undefined}
          compact={layout === "grid"}
        >
          {item.children}
        </ContactRow>
      ))}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
  external,
  compact,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  href?: string;
  external?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}) {
  const value = (
    <div
      className={cn(
        "text-sm leading-relaxed text-white",
        compact && "mt-2"
      )}
    >
      {children}
    </div>
  );

  if (compact) {
    return (
      <div className="text-center sm:text-left">
        <div
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-lime)]/10 text-[var(--color-lime)] sm:mx-0"
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-dark-muted)]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="mt-2 block transition-colors hover:text-[var(--color-lime)]"
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-lime)]/10 text-[var(--color-lime)]"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-dark-muted)]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="block text-sm leading-relaxed text-white transition-colors hover:text-[var(--color-lime)]"
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {children}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
