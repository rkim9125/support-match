import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";         // Vercel 서버런타임 명시
export const dynamic = "force-dynamic";  // 캐싱 방지(폼 POST는 매번 처리)

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Company: ${body.company || "-"}`,
      `Location: ${body.location || "-"}`,
      `Role: ${body.role || "-"}`,
      `Phone: ${body.phone || "-"}`,
      "",
      "Needs:",
      body.needs || "-",
    ].join("\n");

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.TO_EMAIL!,                 // 환경변수 필요
      replyTo: body.email,                       // ← 여기!
      subject: "New support request",
      text,
    });

    return NextResponse.json({ ok: true, id: result.id ?? null });
  } catch (e) {
    console.error("request API error", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}