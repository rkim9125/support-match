// app/finder/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

/** ---------- Small UI helpers ---------- */
type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};
const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const Tag: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
    {children}
  </span>
);

/** ---------- Data types ---------- */
type Candidate = {
  id: string;
  name: string;
  region: string;
  is_australian: boolean;
  experience_years: number;
  qualification: string;
  previous_role: string;
  previous_work_place: string;
  name_lc: string;
};

export default function FinderPage() {
  /** ---------- state ---------- */
  const [data, setData] = React.useState<Candidate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // filters
  const [region, setRegion] = React.useState<"All" | string>("All");
  const [isAu, setIsAu] = React.useState<"Any" | "Yes" | "No">("Any");
  const [minExp, setMinExp] = React.useState<number>(0);
  const [qInput, setQInput] = React.useState<string>("");

  // debounced query
  const [q, setQ] = React.useState<string>("");
  React.useEffect(() => {
    const h = setTimeout(() => setQ(qInput.trim().toLowerCase()), 250);
    return () => clearTimeout(h);
  }, [qInput]);

  /** ---------- fetch ---------- */
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch("/api/workers")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load"))))
      .then((rows: Candidate[]) => {
        if (!alive) return;
        setData(rows);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : "Error";
        setError(msg);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  /** ---------- derived ---------- */
  const regions = React.useMemo(() => {
    const set = new Set<string>();
    for (const c of data) set.add(c.region);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [data]);

  const filtered = React.useMemo(() => {
    return data.filter((c) => {
      if (region !== "All" && c.region !== region) return false;
      if (isAu !== "Any" && c.is_australian !== (isAu === "Yes")) return false;
      if (c.experience_years < minExp) return false;
      if (q && !c.name_lc.includes(q)) return false;
      return true;
    });
  }, [data, region, isAu, minExp, q]);

  // pagination
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  React.useEffect(() => setPage(1), [region, isAu, minExp, q]);

  const paged = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  /** ---------- render ---------- */
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Container className="py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Find your perfect support worker
        </h1>

        {loading && <p className="mt-4 text-slate-600">Loading candidates…</p>}
        {error && <p className="mt-4 text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-1">
                <label className="text-sm font-medium">Region</label>
                <select
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium">Australian (citizen/PR)</label>
                <select
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  value={isAu}
                  onChange={(e) => setIsAu(e.target.value as "Any" | "Yes" | "No")}
                >
                  <option>Any</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium">Min experience (years)</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  placeholder="e.g. Arshdeep"
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                />
              </div>
            </div>

            {/* Count */}
            <div className="mt-4 text-sm text-slate-600">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
            </div>

            {/* Cards */}
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((c) => (
                <div key={c.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{c.name}</h3>
                      <p className="text-sm text-slate-600">{c.previous_role || "—"}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {c.experience_years}y exp
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" /> {c.region}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Tag>{c.is_australian ? "Australian" : "Non-Australian"}</Tag>
                    {c.previous_work_place && <Tag>{c.previous_work_place}</Tag>}
                  </div>
                  {c.qualification && (
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-semibold">Qualification:</span> {c.qualification}
                    </p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <Link
                      href="/#request"
                      className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Request intro
                    </Link>
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border px-3 py-1 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </Container>
    </main>
  );
}