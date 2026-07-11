import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const submissions = new Map<string, RateLimitEntry>();
const DEFAULT_CONTACT_EMAIL = "mohamedrishanakeel13867@gmail.com";
const DEFAULT_RESEND_FROM_EMAIL = "Akeel Rishan <onboarding@resend.dev>";

function sanitize(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const existing = submissions.get(ip);

  if (!existing || existing.resetAt <= now) {
    submissions.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  submissions.set(ip, existing);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";

    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    if (message.length < 20) {
      return NextResponse.json({ error: "Message must be at least 20 characters" }, { status: 400 });
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many messages from this network. Please try again in an hour." },
        { status: 429 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeSubject = sanitize(subject);
    const safeMessage = sanitize(message).replace(/\n/g, "<br />");

    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL;

    const result = await resend.emails.send({
      from: fromEmail,
      to: contactToEmail,
      subject: `[Portfolio] ${subject} from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin: 0 0 16px;">New portfolio contact</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <div style="margin-top: 20px; padding: 16px; border-radius: 8px; background: #f3f4f6;">
            ${safeMessage}
          </div>
        </div>
      `
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    const thankYouResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Thanks for reaching out",
      replyTo: contactToEmail,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <p>Hi ${safeName},</p>
          <p>Thank you for reaching out! I've received your message and appreciate your interest.</p>
          <p>I'll review your inquiry and get back to you as soon as possible, usually within 24-48 hours.</p>
          <p style="margin-top: 20px; margin-bottom: 10px;">In the meantime, feel free to explore:</p>
          <ul style="padding-left: 20px; margin-top: 0;">
            <li>Portfolio: <a href="https://akeelrishan.me" style="color: #2563eb;">https://akeelrishan.me</a></li>
            <li>GitHub: <a href="https://github.com/Akeel-Rishan" style="color: #2563eb;">https://github.com/Akeel-Rishan</a></li>
            <li>Medium: <a href="https://medium.com/@AkeelRishan" style="color: #2563eb;">https://medium.com/@AkeelRishan</a></li>
            <li>LinkedIn: <a href="https://linkedin.com/in/akeelrishan" style="color: #2563eb;">https://linkedin.com/in/akeelrishan</a></li>
          </ul>
          <p style="margin-top: 24px;">Best regards,<br /><strong>Akeel Rishan</strong><br />AI Engineer</p>
        </div>
      `
    });

    if (thankYouResult.error) {
      console.warn("Unable to send contact thank-you email", thankYouResult.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }
}
