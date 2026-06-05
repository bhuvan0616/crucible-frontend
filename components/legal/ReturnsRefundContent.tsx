import Link from "next/link";
import { LegalProse, LegalSection } from "@/components/legal/LegalProse";
import { siteLegal } from "@/lib/legal/siteLegal";

export function ReturnsRefundContent() {
  const { address, phone, returns } = siteLegal;

  return (
    <LegalProse>
      <p className="text-white/90">
        This Returns &amp; Refund Policy applies to purchases made on{" "}
        <a href={siteLegal.website}>{siteLegal.websiteDisplay}</a> from{" "}
        <strong>{siteLegal.brandName}</strong>, part of{" "}
        <strong>{siteLegal.entityName}</strong>. It should be read together with
        our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>

      <LegalSection id="overview" title="1. Overview">
        <p>
          All {siteLegal.brandName} products are{" "}
          <strong>custom-made and manufactured only after you place an order</strong>.
          Because of this, our return rules are different from off-the-shelf retail.
        </p>
        <ul>
          <li>
            <strong>No returns</strong> for change of mind, buyer&apos;s remorse,
            or subjective preference
          </li>
          <li>
            <strong>No returns</strong> for errors in customisation details you
            submitted (spelling, placement, file choice)
          </li>
          <li>
            <strong>Replacements</strong> (or, in limited cases, refunds) for
            verified <strong>manufacturing defects</strong> only
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="no-returns" title="2. What we do not accept for return">
        <p>We do not accept returns or exchanges for:</p>
        <ul>
          <li>Change of mind after ordering</li>
          <li>Colour, texture, or minor layer-line variation normal to 3D printing</li>
          <li>Custom text or artwork you approved at checkout</li>
          <li>Incorrect size or option selected by you</li>
          <li>Damage caused after delivery (misuse, accidents, modifications)</li>
          <li>Orders where production has already started, except as required by law</li>
        </ul>
        <p>
          Please review your cart, customisation preview, and shipping address
          carefully before payment.
        </p>
      </LegalSection>

      <LegalSection id="cancellations" title="3. Order cancellations">
        <p>
          <strong>Before production starts:</strong> If you need to cancel, email{" "}
          <a href={siteLegal.emailHref}>{siteLegal.email}</a> immediately with your
          order number. We may approve a full cancellation and refund at our
          discretion if manufacturing has not begun.
        </p>
        <p>
          <strong>After production starts:</strong> Orders generally cannot be
          cancelled because materials and machine time are allocated to your
          custom item.
        </p>
        <p>
          We may cancel an order ourselves (for example listing errors, inability
          to fulfil, or policy violations) and refund any amount paid.
        </p>
      </LegalSection>

      <LegalSection id="defects" title="4. Manufacturing defects & replacements">
        <p>
          If you receive an item that is <strong>defective due to our
          manufacturing</strong> — not normal 3D-print variation — you may be
          eligible for a <strong>replacement</strong>.
        </p>
        <h3>What counts as a defect</h3>
        <ul>
          <li>Structural failure not caused by misuse</li>
          <li>Major print failure (collapsed layers, missing sections)</li>
          <li>Wrong product or materially different from what you ordered</li>
        </ul>
        <h3>What is not a defect</h3>
        <ul>
          <li>Visible layer lines, slight colour variation, or surface texture typical of FDM/ resin prints</li>
          <li>Minor blemishes that do not affect function</li>
          <li>Differences between screen colour and printed colour</li>
        </ul>
        <h3>How to report</h3>
        <p>Contact us within <strong>{returns.defectReportDays} days</strong> of delivery:</p>
        <ul>
          <li>
            Email: <a href={siteLegal.emailHref}>{siteLegal.email}</a>
          </li>
          <li>
            Phone: <a href={phone.href}>{phone.display}</a>
          </li>
          <li>
            Or use our <Link href="/contact">contact form</Link>
          </li>
        </ul>
        <p>Include:</p>
        <ul>
          <li>Order number and account email</li>
          <li>Description of the issue</li>
          <li>Clear photos from multiple angles</li>
        </ul>
        <p>
          We will review and respond within a reasonable time. We may request
          additional information or return of the item (at our cost if a return
          is required) before sending a replacement.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="5. Refunds">
        <p>
          Our primary remedy for qualifying defects is a <strong>replacement</strong>{" "}
          of the affected item.
        </p>
        <p>
          A <strong>refund</strong> (full or partial for the defective item only)
          or <strong>store credit</strong> may be offered if:
        </p>
        <ul>
          <li>A replacement cannot reasonably be produced or shipped in time</li>
          <li>You and we agree that a refund is the appropriate resolution</li>
          <li>We cancel your order before shipment</li>
        </ul>
        <p>
          Refunds, when approved, are processed to the <strong>original payment
          method</strong> used at checkout (via Cashfree or as otherwise arranged).
          Please allow <strong>7–14 business days</strong> for the refund to appear,
          depending on your bank or payment provider.
        </p>
        <p>Shipping charges are generally non-refundable unless we are at fault.</p>
      </LegalSection>

      <LegalSection id="shipping-issues" title="6. Lost, delayed, or damaged in transit">
        <p>
          If your package is lost or severely damaged by the courier, contact us
          promptly with photos of outer packaging and the product. We will work
          with the carrier and, where appropriate, arrange a replacement or
          refund after investigation.
        </p>
        <p>
          Delivery time estimates are not guaranteed. Delays alone do not
          automatically qualify for a refund unless we fail to ship within a
          reasonable period and cannot fulfil the order.
        </p>
      </LegalSection>

      <LegalSection id="consumer-law" title="7. Your statutory rights">
        <p>
          Nothing in this policy limits rights you may have under applicable
          Indian consumer protection law that cannot be excluded by contract. If
          mandatory law gives you remedies beyond this policy, those remedies
          apply.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="8. Contact">
        <ul>
          <li>
            <strong>{siteLegal.entityName}</strong>
          </li>
          <li>{address.full}, {address.country}</li>
          <li>
            Email: <a href={siteLegal.emailHref}>{siteLegal.email}</a>
          </li>
          <li>
            Phone: <a href={phone.href}>{phone.display}</a>
          </li>
        </ul>
      </LegalSection>
    </LegalProse>
  );
}
