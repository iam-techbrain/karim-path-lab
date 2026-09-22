"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Building2,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import { ConnectedHospital, PartnerLab } from "@/types/booking";
import { INITIAL_HOSPITALS, INITIAL_PARTNER_LABS } from "@/data/networkData";

interface PartnerNetworkSectionProps {
  onOpenBooking: (testName?: string) => void;
}

export default function PartnerNetworkSection({ onOpenBooking }: PartnerNetworkSectionProps) {
  const [activeTab, setActiveTab] = useState<"labs" | "hospitals" | "howItWorks">("labs");
  const [hospitals, setHospitals] = useState<ConnectedHospital[]>([]);
  const [labs, setLabs] = useState<PartnerLab[]>([]);

  // Sync directly from database API
  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.hospitals && data.hospitals.length > 0) {
          setHospitals(data.hospitals);
        } else {
          setHospitals(INITIAL_HOSPITALS);
        }
        if (data.labs && data.labs.length > 0) {
          setLabs(data.labs);
        } else {
          setLabs(INITIAL_PARTNER_LABS);
        }
      })
      .catch((err) => {
        console.log("Live network data load fallback:", err);
        setHospitals(INITIAL_HOSPITALS);
        setLabs(INITIAL_PARTNER_LABS);
      });
  }, []);

  return (
    <section id="network" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      {/* Top Banner Card with Rich Gradient */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-10 border border-emerald-500/30 shadow-2xl text-white">
        {/* Glow decoration */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>100% PATIENT CHOICE &amp; DOCTOR NETWORK</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                Connected with Leading Doctors, Multi-Specialty Hospitals &amp; Certified Pathology Labs
              </h2>

              {/* Core English Value Proposition Requested by User */}
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                We are connected with a wide network of Patna&apos;s leading specialist doctors,
                multi-specialty hospitals, and top certified diagnostic laboratories.
                <strong className="text-emerald-300 ml-1">
                  You have 100% freedom to choose where your tests are processed.
                </strong>{" "}
                Whether your doctor prescribes a specific diagnostic lab or you prefer a premier national
                chain (such as Dr. Lal PathLabs, Thyrocare, Agilus, or hospital reference labs), Karim Path Lab
                collects your diagnostic sample at your doorstep and delivers certified reports from the exact
                laboratory or hospital you trust most.
              </p>

              {/* Key Trust Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-200 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your Choice of Lab</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-200 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>50+ Doctor Tie-ups</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-200 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fast WhatsApp Reports</span>
                </div>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <p className="font-display font-black text-2xl text-emerald-400">{labs.length}+</p>
                <p className="text-xs font-semibold text-white mt-1">Certified Labs</p>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">NABL / CAP Standard</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <p className="font-display font-black text-2xl text-emerald-400">{hospitals.length}+</p>
                <p className="text-xs font-semibold text-white mt-1">Patna Hospitals</p>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">NABH &amp; Multi-Specialty</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <p className="font-display font-black text-2xl text-emerald-400">50+</p>
                <p className="text-xs font-semibold text-white mt-1">Top Doctors</p>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">Consultant Network</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <p className="font-display font-black text-2xl text-emerald-400">100%</p>
                <p className="text-xs font-semibold text-white mt-1">Doctor-Verified</p>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">Accurate Pathology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("labs")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "labs"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Partner Diagnostic Labs ({labs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("hospitals")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "hospitals"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Connected Hospitals ({hospitals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("howItWorks")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "howItWorks"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>How Patient Choice Works</span>
            </button>
          </div>

          <button
            onClick={() => onOpenBooking()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <span>Book with Your Preferred Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: PARTNER LABS */}
        {activeTab === "labs" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                        {lab.name}
                      </h4>
                      <p className="text-xs font-mono text-emerald-700 font-semibold mt-0.5">
                        {lab.category}
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                      {lab.badge || "NABL"}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {lab.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Report in: <strong className="text-slate-800">{lab.turnaroundTime}</strong></span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {lab.accreditation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CONNECTED HOSPITALS */}
        {activeTab === "hospitals" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-lg group-hover:text-teal-700 transition-colors">
                        {hospital.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        📍 {hospital.location}
                      </p>
                    </div>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                      {hospital.badge || "Partner"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-teal-700 mb-3">
                    {hospital.type}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hospital.specialities?.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Specialist Network:</span>
                  </div>
                  <strong className="text-slate-800">{hospital.doctorNetworkCount || 20}+ Doctors</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: HOW IT WORKS EXPLAINER */}
        {activeTab === "howItWorks" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="max-w-3xl mb-8">
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                How Karim Path Lab Gives You 100% Diagnostic Independence
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Most labs force you to accept their in-house testing. At Karim Path Lab, we work for
                <strong> you and your doctor</strong>. Here is how our doorstep partner model works:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="font-display font-bold text-slate-900 text-base">
                  Book Doorstep Sample Collection
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Schedule your test online or over WhatsApp. Our certified phlebotomist Saba Hussain
                  visits your home in Patna with sterile single-use vacuum tubes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="font-display font-bold text-slate-900 text-base">
                  Choose Your Trusted Lab / Hospital
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Tell us which lab or hospital your doctor advised—Dr. Lal PathLabs, Thyrocare, Agilus, or
                  local reference centers. We route your sample directly to your chosen partner.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="font-display font-bold text-slate-900 text-base">
                  Get Certified Report on WhatsApp
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Receive the 100% authentic, QR-code verified pathology PDF report directly on WhatsApp
                  and SMS within 6 to 12 hours, signed by certified MD Pathologists.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-mono text-slate-500">
                ⭐ Zero extra home collection charge across Patna city.
              </p>
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md transition-all cursor-pointer"
              >
                Schedule Home Collection Now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
