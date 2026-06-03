import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    console.log("Portfolio contact submission", {
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }
}
