import Link from "next/link";
import { LegalProse, LegalSection } from "@/components/legal/LegalProse";
import { siteLegal } from "@/lib/legal/siteLegal";

export function PrivacyContent() {
  const { address, phone, privacy } = siteLegal;

  return (
    <LegalProse>
      <p className="text-white/90">
        This Privacy Policy explains how <strong>{siteLegal.entityName}</strong>{" "}
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, stores,
        and shares personal data when you use{" "}
        <a href={siteLegal.website}>{siteLegal.websiteDisplay}</a> and related
        services for <strong>{siteLegal.brandName}</strong>.
      </p>
      <p className="rounded-lg border border-[var(--color-hairline-violet)]/60 bg-[var(--color-primary)]/20 px-4 py-3 text-xs text-[var(--color-on-dark-faint)]">
        <strong className="text-white/80">Notice:</strong> This policy is provided
        for transparency. It is not legal advice. For compliance under applicable
        Indian law (including the Digital Personal Data Protection Act, 2023, where
        it applies to you), consult a qualified professional.
      </p>

      <LegalSection id="controller" title="1. Who is responsible for your data">
        <ul>
          <li>
            <strong>Data fiduciary / controller:</strong> {siteLegal.entityName}
          </li>
          <li>
            <strong>Brand:</strong> {siteLegal.brandName}
          </li>
          <li>
            <strong>GSTIN:</strong> {siteLegal.gstin}
          </li>
          <li>
            <strong>Address:</strong> {address.full}, {address.country}
          </li>
          <li>
            <strong>Privacy &amp; grievance contact:</strong>{" "}
            <a href={siteLegal.emailHref}>{privacy.grievanceEmail}</a>
          </li>
          <li>
            <strong>Phone:</strong> <a href={phone.href}>{phone.display}</a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="scope" title="2. Scope">
        <p>
          This policy applies to personal data collected through our website,
          customer accounts, checkout, contact form, newsletter sign-up, and
          related communications. It does not apply to third-party websites or
          services linked from our site.
        </p>
        <p>
          By using our services, you acknowledge this policy. Where we rely on
          consent (for example marketing emails), you may withdraw consent as
          described below.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="3. Personal data we collect">
        <p>Depending on how you use the site, we may collect:</p>
        <h3>Account and profile</h3>
        <ul>
          <li>Name, email address, password (stored securely by our systems)</li>
          <li>
            Profile information from Google when you choose &quot;Sign in with
            Google&quot; (such as name and email, as permitted by Google)
          </li>
          <li>Shipping and billing addresses, phone number</li>
        </ul>
        <h3>Orders and customisation</h3>
        <ul>
          <li>Order history, products purchased, customisation choices</li>
          <li>
            Files you upload for custom products (for example logos), stored to
            fulfil your order
          </li>
          <li>Payment status and transaction references (we do not store full card details)</li>
        </ul>
        <h3>Contact and support</h3>
        <ul>
          <li>
            Information you send via our contact form: name, email, optional
            phone, subject, and message
          </li>
        </ul>
        <h3>Marketing</h3>
        <ul>
          <li>
            Email address when you subscribe to our newsletter or opt in to
            marketing communications
          </li>
        </ul>
        <h3>Technical and usage data</h3>
        <ul>
          <li>
            Device and browser type, IP address, pages viewed, and interactions
            (including via cookies and similar technologies)
          </li>
          <li>
            Analytics events such as add-to-cart and purchase (when GA4 is
            enabled)
          </li>
          <li>
            Cart and session identifiers stored locally in your browser
            (localStorage / sessionStorage) to operate the shop
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="use" title="4. How we use your data">
        <p>We use personal data to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Process orders, payments, shipping, and custom manufacturing</li>
          <li>Communicate about orders, defects, and customer support</li>
          <li>Respond to contact form enquiries</li>
          <li>
            Send marketing emails where you have subscribed or opted in (you may
            unsubscribe at any time)
          </li>
          <li>Improve our website, products, and security</li>
          <li>Measure site usage and conversion (GA4, when configured)</li>
          <li>Comply with law, tax, and enforce our Terms</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-basis" title="5. Legal bases (India)">
        <p>
          Under applicable Indian privacy law, we process personal data where:
        </p>
        <ul>
          <li>
            <strong>Contract:</strong> processing is necessary to provide the
            products or services you request
          </li>
          <li>
            <strong>Consent:</strong> you have agreed (for example marketing
            emails or non-essential cookies when we request them)
          </li>
          <li>
            <strong>Legitimate uses:</strong> permitted under law, such as
            preventing fraud, securing our systems, or improving services, where
            not overridden by your rights
          </li>
          <li>
            <strong>Legal obligation:</strong> retaining records required for tax
            or regulatory purposes
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="6. Who we share data with">
        <p>
          We do not sell your personal data. We share data only as needed to
          operate our business:
        </p>
        <ul>
          <li>
            <strong>Commerce platform:</strong> {privacy.medusaHosting} — order,
            customer, and product data
          </li>
          <li>
            <strong>Payment processing:</strong> {privacy.paymentProcessor} —
            payment initiation and confirmation (card/UPI details are handled by
            the payment provider)
          </li>
          <li>
            <strong>Email delivery:</strong> {privacy.emailProvider} — contact
            form notifications and operational or marketing emails we send
          </li>
          <li>
            <strong>Authentication:</strong> {privacy.authProvider}
          </li>
          <li>
            <strong>Analytics:</strong> {privacy.analytics} — aggregated and
            event-based usage data
          </li>
          <li>
            <strong>Logistics partners:</strong> couriers and shipping providers
            — name, address, and phone to deliver orders within India
          </li>
          <li>
            <strong>Professional advisers or authorities</strong> when required by
            law or to protect rights and safety
          </li>
        </ul>
        <p>
          Each provider processes data under their own terms and privacy policies.
          We choose providers that support secure handling of data.
        </p>
      </LegalSection>

      <LegalSection id="cross-border" title="7. Storage location and international transfers">
        <p>
          Our primary commerce data is hosted on infrastructure you control in{" "}
          <strong>India (Oracle Cloud, Mumbai region)</strong>. However,{" "}
          {privacy.crossBorderNotice} Providers such as Google, Resend, and
          analytics or payment partners may store or process data on servers
          outside India.
        </p>
        <p>
          Where data is transferred internationally, we take reasonable steps to
          ensure appropriate safeguards consistent with applicable law.
        </p>
      </LegalSection>

      <LegalSection id="marketing" title="8. Marketing communications">
        <p>
          If you subscribe to our newsletter or opt in to marketing, we use your
          email to send updates, offers, and news about {siteLegal.brandName}.
          You can unsubscribe using the link in any marketing email or by
          emailing{" "}
          <a href={siteLegal.emailHref}>{privacy.grievanceEmail}</a>.
        </p>
        <p>
          Order-related and transactional messages (confirmations, shipping) are
          not marketing and may still be sent when necessary to fulfil your
          purchase.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="9. Cookies and similar technologies">
        <p>
          We use cookies and local storage to keep you signed in, remember your
          cart, and support checkout. When GA4 is enabled, Google may set
          analytics cookies or use similar technologies to collect usage data.
        </p>
        <p>
          A dedicated cookie consent banner may be added later. Until then, you
          can control cookies through your browser settings; disabling essential
          cookies may affect site functionality.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="10. How long we keep data">
        <p>
          We retain personal data {privacy.retention}. Order and account records
          may be kept longer where required for GST, accounting, or legal claims.
        </p>
        <p>
          Marketing lists: until you unsubscribe or ask us to delete your details.
          Contact form correspondence: for as long as needed to handle your
          enquiry and reasonable follow-up.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="11. Your rights and choices">
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Request access to personal data we hold about you</li>
          <li>Ask us to correct inaccurate data</li>
          <li>
            Request deletion of your account and associated personal data (see
            below)
          </li>
          <li>Withdraw consent for marketing at any time</li>
          <li>Object to or restrict certain processing where the law allows</li>
        </ul>
        <p>
          To exercise these rights, email{" "}
          <a href={siteLegal.emailHref}>{privacy.grievanceEmail}</a> with enough
          detail for us to verify your identity. We will respond within a
          reasonable period.
        </p>
      </LegalSection>

      <LegalSection id="deletion" title="12. Account deletion">
        <p>
          To delete your account and associated personal data, email{" "}
          <a href={siteLegal.emailHref}>{privacy.grievanceEmail}</a> from the
          email address linked to your account. We will confirm once deletion is
          complete or explain if certain records must be retained (for example
          invoices or tax records).
        </p>
      </LegalSection>

      <LegalSection id="security" title="13. Security">
        <p>
          We use reasonable technical and organisational measures to protect
          personal data, including secure hosting, access controls, and
          reputable payment and email providers. No method of transmission over
          the internet is completely secure; we cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection id="grievance" title="14. Grievance redressal">
        <p>
          If you have concerns about how we handle your personal data, contact
          our grievance channel:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href={siteLegal.emailHref}>{privacy.grievanceEmail}</a>
          </li>
          <li>
            Postal: {siteLegal.entityName}, {address.full}, {address.country}
          </li>
        </ul>
        <p>
          We will endeavour to resolve complaints promptly. You may also have
          rights to approach relevant authorities under applicable Indian law.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="15. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last
          updated&quot; date on this page will change when we do. Material
          changes may be communicated via the website or email where appropriate.
        </p>
      </LegalSection>

      <LegalSection id="related" title="16. Related policies">
        <p>
          Please also read our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>. For general
          enquiries, use our <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalProse>
  );
}
