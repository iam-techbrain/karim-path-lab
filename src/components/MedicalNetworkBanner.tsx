import React from "react";
import { Stethoscope } from "lucide-react";

export default function MedicalNetworkBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-56 h-56 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-mono font-bold border border-emerald-400/30">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
              <span>TOP DOCTOR &amp; HOSPITAL NETWORK</span>
            </div>
            <h3 className="font-display font-extrabold text-xl sm:text-3xl text-white leading-tight">
              Connected with Leading Doctors, Multi-Specialty Hospitals &amp; Certified Labs
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
              Karim Path Lab directly connects you with Patna&apos;s leading specialist doctors, top multi-specialty
              hospitals, and NABL-certified super diagnostic centers. Our digital platform ensures you receive{" "}
              <strong className="text-white">100% accurate, doctor-verified diagnostic reports</strong>—delivered
              straight to your home.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <p className="font-display font-extrabold text-xl text-emerald-400">Top Doctors</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">Verified Network</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <p className="font-display font-extrabold text-xl text-emerald-400">100%</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">Accurate Reports</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <p className="font-display font-extrabold text-xl text-emerald-400">Leading</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">Patna Hospitals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <p className="font-display font-extrabold text-xl text-emerald-400">Direct PDF</p>
              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">WhatsApp Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
