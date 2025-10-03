// app/api/request/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type RequestBody = {
  name: string;
  email: string;
  company?: string;
  location?: string;
  role?: string;
  phone?: string;
  needs?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
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
      to: process.env.TO_EMAIL!,               // Vercel 환경변수에 설정
      replyTo: body.email,
      subject: "New support request",
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    console.error(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}