import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const text = `
Name: ${body.name}
Email: ${body.email}
Company: ${body.company || ""}
Location: ${body.location || ""}
Role: ${body.role || ""}
Phone: ${body.phone || ""}
Supports / Needs:
${body.needs || ""}
    `.trim();

    await resend.emails.send({
      from: `Support Match <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: process.env.TO_EMAIL!,
      reply_to: body.email,
      subject: "New support request",
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e?.message ?? "error" }, { status: 500 });
  }
}