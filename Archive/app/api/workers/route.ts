// app/api/workers/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED = [
  "Sydney", "Melbourne", "Brisbane", "Adelaide", "Perth",
  "Canberra", "Hobart", "Darwin",
  "Gold Coast", "Sunshine Coast", "Newcastle", "Wollongong", "Geelong"
];

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\s+/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());

function cleanRegion(raw: unknown): string {
  if (raw == null) return "";
  let s = String(raw);
  s = s.split(/[,/|-]/)[0];
  s = titleCase(s);
  if (/^nsw$/i.test(s)) return "Sydney";
  if (/^vic$/i.test(s)) return "Melbourne";
  if (/^qld$/i.test(s)) return "Brisbane";
  if (/^sa$/i.test(s))  return "Adelaide";
  if (/^wa$/i.test(s))  return "Perth";
  if (/^act$/i.test(s)) return "Canberra";
  if (/^tas$/i.test(s)) return "Hobart";
  if (/^nt$/i.test(s))  return "Darwin";
  return ALLOWED.includes(s) ? s : "";
}

type Row = {
  name?: string;
  region?: string;
  is_australian?: string | boolean | number;
  experience_years?: string | number;
  qualification?: string;
  previous_role?: string;
  previous_work_place?: string;
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "support_workers_clean.csv");
    const csv = await fs.readFile(filePath, "utf8");

    const parsed = Papa.parse<Row>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.replace(/^\uFEFF/, "").trim(),
    });

    let id = 0;
    const rows = (parsed.data as Row[])
      .map((r) => {
        const name = (r.name ?? "").trim();
        const region = cleanRegion(r.region);
        const isAu = /^(true|yes|y|1)$/i.test(String(r.is_australian ?? ""));
        const exp = Number(r.experience_years ?? 0) || 0;

        return {
          id: String(++id),
          name,
          region,
          is_australian: isAu,
          experience_years: exp,
          qualification: r.qualification ?? "",
          previous_role: r.previous_role ?? "",
          previous_work_place: r.previous_work_place ?? "",
          name_lc: name.toLowerCase(),
        };
      })
      .filter((x) => x.region);

    rows.sort((a, b) => b.experience_years - a.experience_years);

    return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}