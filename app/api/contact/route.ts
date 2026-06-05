import { NextResponse } from "next/server";
import { contactSubjects, type ContactSubject } from "@/lib/contact/siteContact";
import {
  toContactPayload,
  validateContactForm,
  hasContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact/validateContactForm";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function subjectLabel(subject: string): string {
  return (
    contactSubjects.find((s) => s.value === subject)?.label ?? subject
  );
}

async function sendViaResend(payload: ReturnType<typeof toContactPayload>) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to =
    process.env.CONTACT_TO_EMAIL ?? "contact@cruciblecreations.studio";

  if (!apiKey) {
    return { ok: false as const, status: 503, error: "Contact email is not configured yet." };
  }

  if (!from) {
    return {
      ok: false as const,
      status: 503,
      error: "Contact sender email is not configured.",
    };
  }

  const phoneLine = payload.phone ? `Phone: ${payload.phone}\n` : "";
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    phoneLine,
    `Subject: ${subjectLabel(payload.subject)}`,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[Contact] ${subjectLabel(payload.subject)} — ${payload.name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend API error:", res.status, await res.text());
    return {
      ok: false as const,
      status: 500,
      error: "Failed to send your message. Please try again later.",
    };
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const values: ContactFormValues = {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    subject:
      typeof raw.subject === "string"
        ? (raw.subject as ContactSubject | "")
        : "",
    message: typeof raw.message === "string" ? raw.message : "",
  };

  const errors = validateContactForm(values);
  if (hasContactFormErrors(errors)) {
    return NextResponse.json(
      { error: "Validation failed.", fields: errors },
      { status: 400 }
    );
  }

  const payload = toContactPayload(values);
  const result = await sendViaResend(payload);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ ok: true });
}
