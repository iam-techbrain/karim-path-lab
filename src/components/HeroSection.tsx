"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2, Clock, BadgePercent, ArrowRight, MessageCircle, PlusCircle } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [logoUrl, setLogoUrl] = useState<string>("/images/karim-logo.png");

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      })
      .catch((err) => console.log("Hero logo sync notice:", err));
  }, []);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-12 md:pb-18">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-6"
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.12] tracking-tight">
            NABL-Standard Testing,
            <br />
            <span className="text-gradient">Right at Your Home.</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
            Zero lab queues. Certified phlebotomist Saba Hussain arrives at your home in Patna with 100% sterile vacuum
            tubes and sends verified PDF reports directly to your WhatsApp.
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Zero Home Fee</p>
                <p className="text-[10px] text-slate-500 font-semibold">Free collection</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Fast Reports</p>
                <p className="text-[10px] text-slate-500 font-semibold">In 6 to 12 Hours</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <BadgePercent className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">FLAT 20% OFF</p>
                <p className="text-[10px] text-slate-500 font-semibold">All packages</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onOpenBooking}
              className="btn-primary text-white font-display font-bold text-sm rounded-xl px-7 py-4 flex items-center gap-2.5 shadow-lg cursor-pointer"
            >
              <span>Book Visit &amp; Generate Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${LAB_CONTACT.phoneRaw}?text=${encodeURIComponent(
                "Hi Saba, I would like to inquire about lab tests and home sample collection."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary font-display font-semibold text-sm rounded-xl px-6 py-4 flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </motion.div>

        {/* Right Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-3xl opacity-50 blur-xl -z-10"></div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl relative overflow-hidden space-y-4">
            {/* Real Lab Room Image Header */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
              <Image
                src="/images/lab-room.jpg"
                alt="Karim Path Lab Diagnostic Pathology Patna"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-bold backdrop-blur-sm border border-emerald-400/40">
                  ● NABL-Grade Central Lab · Patna
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-sm">
                  100% Verified
                </span>
              </div>

              <div className="absolute bottom-3 left-3.5 right-3.5 text-white z-10">
                <p className="font-display font-bold text-sm leading-tight text-white drop-shadow">
                  State-of-the-Art Diagnostics
                </p>
                <p className="text-[11px] text-emerald-200 font-medium drop-shadow">
                  Automated Biochemistry &amp; Pathology Analyzers
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <p className="text-[10px] font-mono text-emerald-700 font-bold tracking-widest uppercase">
                  INSTANT DIGITAL PASS
                </p>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Official Diagnostic Card
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-mono font-bold border border-emerald-200">
                ● 20% OFF Applied
              </span>
            </div>

            {/* Sample Card Graphic */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 rounded-2xl p-4 border border-emerald-200/90 space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300 shadow-sm shrink-0">
                    <Image
                      src={logoUrl || "/images/karim-logo.png"}
                      alt="Karim Path Lab"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-sm text-emerald-950 tracking-tight leading-none">
                      KARIM PATH LAB
                    </p>
                    <p className="text-[9px] font-mono text-emerald-700 font-bold tracking-wider mt-0.5">
                      PATNA DIAGNOSTIC PASS
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-100/80 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                    📅 TODAY
                  </span>
                  <span className="bg-rose-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                    20% OFF
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-emerald-700 font-mono font-bold">PATIENT NAME</p>
                  <p className="text-xs font-extrabold text-slate-900">Ritik Verma</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-emerald-700 font-mono font-bold">REF CODE</p>
                  <p className="text-xs font-mono font-extrabold text-emerald-800">#KPL-2026-892</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-slate-500 font-semibold">Test:</span>{" "}
                  <span className="font-bold text-slate-900">Full Body Checkup</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Slot:</span>{" "}
                  <span className="font-bold text-slate-900">Morning (6-9 AM)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full btn-primary text-white rounded-xl py-3 text-xs font-display font-bold flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Click Here to Generate Booking Card</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
