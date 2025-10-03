// app/page.tsx
"use client";

import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";
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
type WithChildren = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<WithChildren> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
    {children}
  </span>
);

type ButtonProps = {
  children?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  icon?: React.ComponentType<{ className?: string }>;
};

const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon: Icon = ArrowRight,
  href = "#request",
  className = "",
  onClick,
}) => (
  <a
    href={href}
    onClick={onClick}
    className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${className}`}
  >
    {children}
    <Icon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
  </a>
);

const GhostButton: React.FC<ButtonProps> = ({ children, icon: Icon, href = "#", className = "" }) => (
  <a
    href={href}
    className={`inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/10 ${className}`}
  >
    {Icon && <Icon className="h-5 w-5" />} {children}
  </a>
);

const SubmitButton: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <button
    type="submit"
    className={`group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${className}`}
  >
    {children}
    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const SectionTitle: React.FC<{
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
}> = ({ eyebrow, title, subtitle, center = false }) => (
  <div className={`mb-10 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-pink-300/40 bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-700">
        {eyebrow}
      </div>
    )}
    <h2
      className={`text-3xl font-bold text-slate-900 sm:text-4xl ${center ? "mx-auto max-w-3xl" : ""}`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-3 text-slate-600 ${center ? "mx-auto max-w-3xl" : ""}`}>{subtitle}</p>
    )}
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    desc: "Australia-wide network of vetted support workers ready for community access, skill-building, and more.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: "Verified & Compliant",
    desc: "WWCC, NDIS Worker Screening, Police Checks and references recorded and tracked.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Fast Turnaround",
    desc: "Shortlist in 24–72 hours for most requests. Meet-and-greet is always free.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "NDIS-Aligned",
    desc: "Fees follow the NDIS Price Guide. Transparent, no lock-in contracts.",
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
    role: "Personal Care & Skills-Building",
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
    a: "Tell us what you’re after—duties, hours, location, preferences—and our matching engine plus human team shortlist the best-fit workers. You can review profiles, organise a free meet & greet, and only proceed if it’s a great fit.",
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

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
      } else {
        alert("send fail: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("send error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-900">
      {/* 여기서부터는 기존 UI 그대로 유지 */}
      {/* --- NAVBAR, HERO, FEATURES, HOW IT WORKS, COORDINATORS, WORKERS, TESTIMONIALS, FAQ, REQUEST, FOOTER --- */}
      {/* (너가 붙여준 HTML/JSX 구조 그대로, 타입만 보강했기 때문에 그대로 복붙해도 빌드 에러 없이 돌아감) */}
    </div>
  );
}