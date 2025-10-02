"use client";

import Link from "next/link";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  BadgeCheck,
  Phone,
  Mail,
  Shield,
  Clock,
  Search,
  Star,
  MessageSquare,
  Users,
  MapPin,
  HeartHandshake,
  Languages,
} from "lucide-react";

// -----------------------------
// Helper UI
// -----------------------------
const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
    {children}
  </span>
);

const PrimaryButton = ({ children, icon: Icon = ArrowRight, href = "#request", className = "", onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${className}`}
  >
    {children}
    <Icon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
  </a>
);

const GhostButton = ({ children, icon: Icon, href = "#", className = "" }) => (
  <a
    href={href}
    className={`inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/10 ${className}`}
  >
    {Icon && <Icon className="h-5 w-5" />} {children}
  </a>
);

const SubmitButton = ({ children, className="" }) => (
  <button
    type="submit"
    className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${className}`}
  >
    {children}
    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const SectionTitle = ({ eyebrow, title, subtitle, center = false }) => (
  <div className={`mb-10 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-pink-300/40 bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-700">
        {eyebrow}
      </div>
    )}
    <h2 className={`text-3xl font-bold text-slate-900 sm:text-4xl ${center ? "mx-auto max-w-3xl" : ""}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-3 text-slate-600 ${center ? "mx-auto max-w-3xl" : ""}`}>{subtitle}</p>
    )}
  </div>
);

const Tag = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
    {children}
  </span>
);

// -----------------------------
// Data
// -----------------------------
const FEATURES = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Smart Matching",
    desc: "Match by age range, gender, skills, interests, hobbies, location, and languages in minutes.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "10,000+ Workers",
    desc: "Australia‑wide network of vetted support workers ready for community access, skill‑building, and more.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: "Verified & Compliant",
    desc: "WWCC, NDIS Worker Screening, Police Checks and references recorded and tracked.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Fast Turnaround",
    desc: "Shortlist in 24–72 hours for most requests. Meet‑and‑greet is always free.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "NDIS‑Aligned",
    desc: "Fees follow the NDIS Price Guide. Transparent, no lock‑in contracts.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Human Support",
    desc: "Real coordinators to help refine preferences and manage ongoing rosters.",
  },
];

const WORKERS = [
  {
    name: "Hugh P.",
    role: "Community Access & Mentoring",
    rating: 4.9,
    location: "Sydney • Inner West",
    tags: ["Gaming", "Basketball", "Cooking", "Autism Experience"],
    languages: ["English"],
    skills: ["Social Skills", "Transport", "Homework Support"],
  },
  {
    name: "Sarah A.",
    role: "Personal Care & Skills‑Building",
    rating: 4.8,
    location: "Brisbane • Northside",
    tags: ["Art", "Pets", "Swimming"],
    languages: ["English", "Spanish"],
    skills: ["Personal Care", "Meal Prep", "Community Access"],
  },
  {
    name: "Renee B.",
    role: "Active Support & Community Access",
    rating: 4.7,
    location: "Melbourne • East",
    tags: ["Hiking", "Board Games", "Photography"],
    languages: ["English", "Auslan (basic)"],
    skills: ["Travel Training", "Goal Setting", "Routine Building"],
  },
];

const FAQS = [
  {
    q: "How does Support Match work?",
    a: "Tell us what you’re after—duties, hours, location, preferences—and our matching engine plus human team shortlist the best‑fit workers. You can review profiles, organise a free meet & greet, and only proceed if it’s a great fit.",
  },
  {
    q: "Is there a fee to post a request?",
    a: "No. Posting and shortlisting are free. If you choose to proceed, services are billed in line with the NDIS Price Guide.",
  },
  {
    q: "Do you verify workers?",
    a: "Yes. We record Worker Screening, WWCC, Police Checks, First Aid/CPR and references, and monitor expiries.",
  },
  {
    q: "Can families use Support Match?",
    a: "Absolutely. Participants, families and support coordinators can all submit requests and manage preferences.",
  },
];

// -----------------------------
// Main Site
// -----------------------------
export default function SupportMatchSite() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    location: "",
    role: "Support Coordinator",
    needs: "",
    phone: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // name, email, company, location, role, needs, phone
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
      } else {
        alert("send fail: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      alert("send error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-900">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Container className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Support <GradientText>Match</GradientText>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#coordinators" className="hover:text-slate-900">For coordinators</a>
            <a href="#workers" className="hover:text-slate-900">For workers</a>
            <a href="#faq" className="hover:text-slate-900">FAQs</a>
          </nav>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <GhostButton href="tel:1300543123" icon={Phone}>
              1300 543 123
            </GhostButton>
            <PrimaryButton href="#request" />
          </div>
        </Container>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.25),transparent_40%)]" />

        <Container className="relative grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Find the right <GradientText>NDIS support worker</GradientText> — fast.
            </motion.h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Support Match connects participants, families and coordinators to vetted workers who match your needs and personality. Post your request, review profiles, and book a free meet & greet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton>Post a request</PrimaryButton>
              <Link href="/#request" className="inline-flex items-center gap-2 font-semibold text-pink-600 hover:text-pink-700">
                Book a quick demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-pink-600" /> Free meet & greet</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-pink-600" /> NDIS price guide aligned</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-pink-600" /> No lock‑in</div>
            </div>
          </div>

          {/* Quick request card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-pink-600/10 p-2 text-pink-600"><Mail className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold">Quick request</h3>
            </div>
            {!submitted ? (
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                <div className="grid gap-1">
                  <label htmlFor="name" className="text-sm font-medium">Your name</label>
                  <input id="name" name="name" onChange={onChange} value={form.name} required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input id="email" name="email" type="email" onChange={onChange} value={form.email} required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="company" className="text-sm font-medium">Company (optional)</label>
                  <input id="company" name="company" onChange={onChange} value={form.company} className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <label htmlFor="location" className="text-sm font-medium">Location</label>
                    <input id="location" name="location" placeholder="e.g. Sydney, NSW" onChange={onChange} value={form.location} required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="role" className="text-sm font-medium">I am a…</label>
                    <select id="role" name="role" onChange={onChange} value={form.role} className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none">
                      <option>Support Coordinator</option>
                      <option>Participant / Family</option>
                      <option>Support Worker</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-1">
                  <label htmlFor="needs" className="text-sm font-medium">What supports are you looking for?</label>
                  <textarea id="needs" name="needs" rows={4} placeholder="e.g. young male worker for weekends; interests in gaming & basketball; has licence & car; sessions Sat/Sun 10am–2pm" onChange={onChange} value={form.needs} className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
                <SubmitButton className="justify-center">{sending ? "Sending..." : "Submit request"}</SubmitButton>
                <p className="text-center text-xs text-slate-500">By submitting, you agree to be contacted about your request. No obligations, ever.</p>
              </form>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-green-500/10 text-green-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold">Request received</h4>
                <p className="mt-2 text-slate-600">Thanks {form.name || "there"}! We’ll review your preferences and reach out shortly.</p>
                <div className="mt-4">
                  <GhostButton href="tel:1300543123" icon={Phone}>Or call 1300 543 123</GhostButton>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Capabilities"
            title={<>
              Everything you need to <GradientText>match with confidence</GradientText>
            </>}
            subtitle="Flexible matching across preferences, compliance tracking, and human support when you need it."
            center
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-pink-600/10 p-3 text-pink-600 group-hover:bg-pink-600/20">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="border-y border-slate-200 bg-slate-50 py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Process"
            title={<>
              Simple, transparent <GradientText>matching flow</GradientText>
            </>}
            subtitle="We mix smart tech with human judgement to get you a great fit—quickly."
            center
          />

          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {["Tell us your preferences", "Review curated profiles", "Free meet & greet"]?.map((step, idx) => (
              <li key={step} className="relative rounded-3xl border border-slate-200 bg-white p-6">
                <div className="absolute -top-3 left-6 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30">
                  {idx + 1}
                </div>
                <h4 className="mt-6 text-lg font-bold">{step}</h4>
                <p className="mt-2 text-sm text-slate-600">
                  {idx === 0 && "Age range, gender, skills, interests, availability, language, personality and more."}
                  {idx === 1 && "Shortlisted workers include compliance, experience and relevant interests to help rapport."}
                  {idx === 2 && "Only proceed if it feels right. We’ll help set up rosters and ongoing support if you wish."}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- COORDINATORS ---------------- */}
      <section id="coordinators" className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <SectionTitle
                eyebrow="For Support Coordinators"
                title={<>
                  Faster placements, <GradientText>happier participants</GradientText>
                </>}
                subtitle="Reduce back‑and‑forth and place with confidence. Keep families in the loop with clean, shareable profiles."
              />
              <ul className="space-y-3 text-slate-700">
                {[
                  "Preference‑based matching across interests, skills, and language",
                  "View compliance at a glance (WWCC, Screening, First Aid)",
                  "Availability & travel radius baked in",
                  "Free meet & greet; no lock‑ins",
                  "We invoice in line with the NDIS Price Guide",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 text-pink-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-pink-200/60 to-purple-200/60 blur-2xl" />
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h4 className="text-lg font-bold">Sample profile</h4>
                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold">Hugh P.</p>
                      <p className="text-sm text-slate-600">Community Access & Mentoring</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500"><Star className="h-4 w-4" /><span className="text-sm font-medium">4.9</span></div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5" /> Sydney • Inner West
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Gaming", "Basketball", "Autism Experience", "Homework Support"].map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <PrimaryButton className="!px-4 !py-2 text-sm" href="#request">Request intro</PrimaryButton>
                    <GhostButton className="!px-4 !py-2 text-sm" href="#">View full profile</GhostButton>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">Profiles are anonymised for privacy until a meet & greet is confirmed.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- WORKERS GRID ---------------- */}
      <section id="workers" className="border-y border-slate-200 bg-slate-50 py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Discover talent"
            title={<>
              Meet some of our <GradientText>support workers</GradientText>
            </>}
            subtitle="We highlight interests and lived experience so participants can connect on day one."
            center
          />
          <div className="mb-6 flex justify-center">
            <a
              href="/finder"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110"
            >
              Find your perfect support worker
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORKERS.map((w) => (
              <div key={w.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{w.name}</h3>
                    <p className="text-sm text-slate-600">{w.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500"><Star className="h-4 w-4" /><span className="text-sm font-medium">{w.rating}</span></div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" />{w.location}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {w.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <Languages className="h-4 w-4" /> {w.languages.join(", ")}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {w.skills.map((s) => (
                    <span key={s} className="rounded-xl border border-slate-200 px-3 py-1 text-xs">{s}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <PrimaryButton className="!px-4 !py-2 text-sm" href="#request">Request intro</PrimaryButton>
                  <GhostButton className="!px-4 !py-2 text-sm" href="#">Save</GhostButton>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Testimonials"
            title={<>
              Coordinators & families <GradientText>love the fit</GradientText>
            </>}
            subtitle="Real feedback from real placements."
            center
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Support Match found us a worker who shares our son’s love of gaming and basketball. Rapport was instant.",
                name: "Rebecca V.",
                role: "Parent, Brisbane",
              },
              {
                quote:
                  "The profiles are clear and compliance is easy to verify. Placements are faster and more reliable.",
                name: "Monique P.",
                role: "Support Coordinator, Sydney",
              },
              {
                quote:
                  "Great experience. Transparent rates and an easy meet‑and‑greet process.",
                name: "Harri S.",
                role: "Participant, Melbourne",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-700">“{t.quote}”</p>
                <div className="mt-4 text-sm font-semibold">{t.name}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Help centre"
            title={<>
              Frequently asked <GradientText>questions</GradientText>
            </>}
            center
          />

          <div className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group p-6 open:bg-slate-50" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                  <span>{f.q}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 rotate-90 transition group-open:-rotate-90" />
                </summary>
                <p className="mt-3 text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- CONTACT / REQUEST ---------------- */}
      <section id="request" className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.18),transparent_40%),radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.18),transparent_40%)]" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-3xl font-bold">Ready to find a great match?</h3>
            <p className="mt-3 text-slate-600">Post a request or book a 10‑minute walkthrough. No obligations.</p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
              <div className="grid gap-1">
                <label htmlFor="name2" className="text-sm font-medium">Your name</label>
                <input id="name2" name="name" onChange={onChange} value={form.name} required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
              </div>
              <div className="grid gap-1">
                <label htmlFor="email2" className="text-sm font-medium">Email</label>
                <input id="email2" name="email" type="email" onChange={onChange} value={form.email} required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label htmlFor="company2" className="text-sm font-medium">Company (optional)</label>
                  <input id="company2" name="company" onChange={onChange} value={form.company} className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="location2" className="text-sm font-medium">Location</label>
                  <input id="location2" name="location" onChange={onChange} value={form.location} placeholder="Suburb, State" required className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label htmlFor="role2" className="text-sm font-medium">I am a…</label>
                  <select id="role2" name="role" onChange={onChange} value={form.role} className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none">
                    <option>Support Coordinator</option>
                    <option>Participant / Family</option>
                    <option>Support Worker</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label>
                  <input id="phone" name="phone" placeholder="1300 543 123" className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="needs2" className="text-sm font-medium">Supports needed</label>
                <textarea id="needs2" name="needs" rows={5} onChange={onChange} value={form.needs} placeholder="Tell us about duties, preferences, days/times, and any important notes." className="rounded-xl border border-slate-300 px-3 py-2 focus:border-pink-500 focus:outline-none" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* after  */}  <SubmitButton className="!px-6 !py-3">{sending ? "Sending..." : "Send request"}</SubmitButton>
                <GhostButton href="tel:1300543123" icon={Phone}>Call 1300 543 123</GhostButton>
              </div>
              <p className="text-xs text-slate-500">By contacting us you consent to communications about your enquiry. We follow the NDIS Price Guide and your privacy matters to us.</p>
            </form>
          </div>
        </Container>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-slate-200 bg-white py-12 text-sm">
        <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div className="text-lg font-extrabold">Support <GradientText>Match</GradientText></div>
            </div>
            <p className="mt-3 max-w-xs text-slate-600">We connect NDIS participants and families with vetted support workers who fit their goals and interests.</p>
          </div>
          <div>
            <h5 className="font-semibold">Explore</h5>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><a className="hover:text-slate-900" href="#features">Features</a></li>
              <li><a className="hover:text-slate-900" href="#how">How it works</a></li>
              <li><a className="hover:text-slate-900" href="#coordinators">For coordinators</a></li>
              <li><a className="hover:text-slate-900" href="#workers">For workers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Company</h5>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><a className="hover:text-slate-900" href="#faq">FAQs</a></li>
              <li><a className="hover:text-slate-900" href="#request">Contact</a></li>
              <li><a className="hover:text-slate-900" href="#">Privacy</a></li>
              <li><a className="hover:text-slate-900" href="#">Terms</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Get in touch</h5>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 1300 543 123</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@supportmatch.au</li>
            </ul>
          </div>
        </Container>
        <Container className="mt-8 border-t border-slate-200 pt-6 text-slate-500">
          <p>© {new Date().getFullYear()} Support Match. Not affiliated with the NDIS. Pricing aligns with the NDIS Price Guide.</p>
        </Container>
      </footer>
    </div>
  );
}
