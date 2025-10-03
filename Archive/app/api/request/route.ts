// app/api/request/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type RequestBody = {
  name: string;
  email: string; // replyTo로 사용할 발신자 이메일
  company?: string;
  location?: string;
  role?: string;
  phone?: string;
  needs?: string;
};

function isValidEmail(s: string | undefined): s is string {
  if (!s) return false;
  // very light validation; Resend는 자체적으로 더 엄격 체크함
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

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

    // replyTo는 유효한 이메일만 넣기 (Resend 422 방지)
    const replyTo = isValidEmail(body.email) ? body.email : undefined;

    await resend.emails.send({
      from: `Support Match <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: process.env.TO_EMAIL!, // Vercel 환경변수 설정 필요
      replyTo,                   // undefined면 필드 자체가 빠짐
      subject: "New support request",
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    console.error("[/api/request] send failed:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}