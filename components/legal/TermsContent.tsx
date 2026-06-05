import Link from "next/link";
import { LegalProse, LegalSection } from "@/components/legal/LegalProse";
import { siteLegal } from "@/lib/legal/siteLegal";

export function TermsContent() {
  const { address, phone } = siteLegal;

  return (
    <LegalProse>
      <p className="text-white/90">
        These Terms and Conditions (&quot;Terms&quot;) govern your access to and use
        of the website{" "}
        <a href={siteLegal.website} rel="noopener noreferrer">
          {siteLegal.websiteDisplay}
        </a>{" "}
        and purchases from {siteLegal.brandName}, part of{" "}
        <strong>{siteLegal.entityName}</strong> (&quot;we&quot;, &quot;us&quot;,
        &quot;our&quot;). By placing an order or using our website, you agree to
        these Terms.
      </p>
      <p className="rounded-lg border border-[var(--color-hairline-violet)]/60 bg-[var(--color-primary)]/20 px-4 py-3 text-xs text-[var(--color-on-dark-faint)]">
        <strong className="text-white/80">Notice:</strong> This document is
        provided for transparency and operational clarity. It is not legal advice.
        For advice specific to your business, consult a qualified professional in
        India.
      </p>

      <LegalSection id="about" title="1. About us">
        <ul>
          <li>
            <strong>Legal entity:</strong> {siteLegal.entityName}
          </li>
          <li>
            <strong>Brand / storefront:</strong> {siteLegal.brandName}
          </li>
          <li>
            <strong>GSTIN:</strong> {siteLegal.gstin}
          </li>
          <li>
            <strong>Registered address:</strong> {address.full}, {address.country}
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a href={siteLegal.website}>{siteLegal.websiteDisplay}</a>
          </li>
          <li>
            <strong>Contact:</strong>{" "}
            <a href={siteLegal.emailHref}>{siteLegal.email}</a> ·{" "}
            <a href={phone.href}>{phone.display}</a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="acceptance" title="2. Acceptance of terms">
        <p>
          By browsing our website, creating an account, or completing a purchase,
          you confirm that you have read, understood, and agree to be bound by
          these Terms and any policies referenced here (including our Privacy
          Policy, when published).
        </p>
        <p>
          If you do not agree, please do not use the website or place orders.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="3. Eligibility">
        <p>
          We do not impose a minimum age requirement to browse the website.
          However, by placing an order you represent that you are legally capable
          of entering into a binding contract under applicable Indian law and that
          any payment method used is authorised for your use.
        </p>
      </LegalSection>

      <LegalSection id="products" title="4. Products and custom manufacturing">
        <p>
          {siteLegal.brandName} sells 3D-printed products. Unless we state
          otherwise on a product page, items are{" "}
          <strong>made to order</strong> and may include{" "}
          <strong>customisation</strong> (such as text, colour choices, or
          customer-supplied artwork) based on options you select at checkout.
        </p>
        <ul>
          <li>
            Product images, renders, and descriptions are for illustration.
            Minor variations in colour, texture, layer lines, or finish are
            normal for 3D printing and are not defects.
          </li>
          <li>
            You are responsible for reviewing customisation details (spelling,
            design placement, file quality) before submitting an order. We are
            not liable for errors in customer-provided content.
          </li>
          <li>
            We may refuse or cancel orders that violate law, are abusive, or
            cannot be fulfilled for technical or safety reasons.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="pricing" title="5. Prices, GST, and shipping charges">
        <ul>
          <li>
            All prices are shown in <strong>Indian Rupees (INR)</strong> unless
            stated otherwise.
          </li>
          <li>
            Displayed product prices are <strong>inclusive of applicable GST</strong>{" "}
            (Goods and Services Tax), where applicable.
          </li>
          <li>
            <strong>Shipping:</strong> We ship within <strong>{siteLegal.shipping.regions}</strong>.
            Shipping charges apply to orders below{" "}
            <strong>₹{siteLegal.shipping.freeShippingMinimumInr}</strong>. Orders
            at or above ₹{siteLegal.shipping.freeShippingMinimumInr} qualify for{" "}
            <strong>free shipping</strong> (subject to destination and promotions
            shown at checkout).
          </li>
          <li>
            We may correct pricing or listing errors. If an error affects your
            order, we may cancel the order and refund any amount paid.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="orders" title="6. Orders and payment">
        <p>
          When you place an order, you offer to purchase the selected items
          subject to these Terms. A contract is formed when we confirm your order
          and successfully receive payment (or confirm cash-on-delivery
          arrangements, if offered at checkout).
        </p>
        <p>
          We accept payment methods displayed at checkout, which may include UPI,
          debit/credit cards, net banking, wallets, or other processors made
          available from time to time. You agree to provide accurate billing and
          contact information.
        </p>
        <p>
          Production typically begins after order confirmation. Because products
          are custom and made to order, please review your order carefully before
          paying.
        </p>
      </LegalSection>

      <LegalSection id="shipping" title="7. Shipping and delivery">
        <ul>
          <li>
            Delivery is offered to serviceable addresses within India only.
          </li>
          <li>
            Estimated delivery timelines shown at checkout or in communications
            are <strong>estimates only</strong> and not guaranteed. Delays may
            occur due to logistics, weather, holidays, or events outside our
            reasonable control.
          </li>
          <li>
            Risk of loss or damage may pass to you upon delivery to the address
            you provide or as per applicable carrier terms.
          </li>
          <li>
            You are responsible for providing a complete and accurate shipping
            address. Additional charges may apply for failed delivery or
            re-dispatch due to incorrect details.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="returns" title="8. Returns, cancellations, and defective items">
        <p>
          Because our products are custom-made to order, returns and refunds are
          limited. The full rules are in our{" "}
          <Link href="/returns-refund">Returns &amp; Refund Policy</Link>.
        </p>
        <p>In summary:</p>
        <ul>
          <li>
            <strong>No returns</strong> for change of mind, incorrect
            customisation choices made by you, or subjective preference
          </li>
          <li>
            <strong>Cancellations</strong> may be possible only before production
            starts — contact{" "}
            <a href={siteLegal.emailHref}>{siteLegal.email}</a> promptly
          </li>
          <li>
            <strong>Manufacturing defects:</strong> report within{" "}
            <strong>{siteLegal.returns.defectReportDays} days</strong> of delivery
            for a possible <strong>replacement</strong> (or refund if a
            replacement cannot be provided)
          </li>
        </ul>
        <p>
          See the{" "}
          <Link href="/returns-refund">Returns &amp; Refund Policy</Link> for
          eligibility, how to report issues, refund timing, and shipping
          problems. Nothing in these Terms limits rights you may have under
          applicable consumer protection law.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="9. Intellectual property and third-party brands">
        <p>
          <strong>Our content:</strong> Website design, product photography where
          original, descriptions, and branding for {siteLegal.brandName} are
          protected by intellectual property laws. You may not copy, scrape, or
          resell our content without permission.
        </p>
        <p>
          <strong>Illustrations on the website:</strong> Images or renders that
          depict third-party characters, logos, or brands (for example Marvel,
          DC, or similar) are shown <strong>for idea and inspiration purposes
          only</strong>. They do not mean we are authorised licensees of those
          brands unless explicitly stated on the product page.
        </p>
        <p>
          <strong>Customer requests involving third-party IP:</strong> If you
          order customisation that incorporates third-party trademarks,
          characters, or copyrighted works, you represent that your use is{" "}
          <strong>for personal, non-commercial use only</strong> and that you
          understand we do not own those intellectual properties. We manufacture
          at your request based on the files or instructions you provide. You are
          responsible for ensuring your order complies with applicable law. We
          are <strong>not responsible</strong> for intellectual property we do
          not own and do not grant any licence to third-party IP.
        </p>
        <p>
          We may decline orders that we reasonably believe infringe third-party
          rights or violate law.
        </p>
        <p>
          <strong>Your uploads:</strong> If you upload logos, text, or files, you
          warrant that you have the right to use them for the purpose of
          fulfilling your order and you grant us a limited licence to use them
          solely to produce and deliver your order.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="10. Accounts and acceptable use">
        <p>
          You may need an account for certain features. Keep your credentials
          confidential. You are responsible for activity under your account.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>Use the website for unlawful, fraudulent, or abusive purposes;</li>
          <li>Attempt to interfere with website security or operations;</li>
          <li>Submit malware, offensive content, or material you do not have rights to use.</li>
        </ul>
        <p>
          We may suspend or terminate access for violations of these Terms.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="11. Privacy">
        <p>
          Our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how we collect,
          use, store, and share personal data. For privacy requests or grievances,
          contact{" "}
          <a href={siteLegal.emailHref}>{siteLegal.email}</a>.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="12. Disclaimers and limitation of liability">
        <p>
          The website and products are provided on an &quot;as is&quot; and
          &quot;as available&quot; basis to the fullest extent permitted by law.
          We do not warrant uninterrupted or error-free operation of the website.
        </p>
        <p>
          To the maximum extent permitted by applicable law, we are not liable
          for indirect, incidental, special, or consequential damages arising from
          your use of the website or products. Our total liability for any claim
          relating to a specific order is limited to the amount you paid for that
          order.
        </p>
        <p>
          Nothing in these Terms excludes liability that cannot be excluded under
          Indian law.
        </p>
      </LegalSection>

      <LegalSection id="law" title="13. Governing law and disputes">
        <p>
          These Terms are governed by the laws of <strong>India</strong>, and
          courts in <strong>{siteLegal.governingLaw}</strong> shall have
          exclusive jurisdiction, subject to any mandatory consumer forum
          provisions that apply to you.
        </p>
        <p>
          We encourage you to contact us first at{" "}
          <a href={siteLegal.emailHref}>{siteLegal.email}</a> so we can try to
          resolve concerns informally.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to these Terms">
        <p>
          We may update these Terms from time to time. The &quot;Last updated&quot;
          date at the top of this page will change when we do. Continued use of
          the website after changes constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact">
        <p>
          For questions about these Terms, orders, or defects:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href={siteLegal.emailHref}>{siteLegal.email}</a>
          </li>
          <li>
            Phone: <a href={phone.href}>{phone.display}</a>
          </li>
          <li>
            Address: {address.full}, {address.country}
          </li>
          <li>
            <Link href="/contact">Contact form</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalProse>
  );
}
