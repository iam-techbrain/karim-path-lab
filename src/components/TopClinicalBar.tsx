import React from "react";
import { ShieldCheck, Phone } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

export default function TopClinicalBar() {
  return (
    <div className="w-full bg-emerald-50/90 text-emerald-950 border-b border-emerald-200/80 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-dot"></span>
            <span className="font-mono text-emerald-800 font-bold uppercase text-[11px] tracking-wider">
              Phlebotomist Active
            </span>
          </div>
          <span className="text-emerald-300">|</span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-900 font-medium">
            Patna, Bihar · Doorstep Home Sample Collection Available Today
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Sterile Vacuum Tubes
          </span>
          <a
            href={`tel:${LAB_CONTACT.phoneRaw}`}
            className="text-emerald-950 hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            {LAB_CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
