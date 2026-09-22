"use client";

import React from "react";
import { Gift, ArrowRight } from "lucide-react";

interface PromoBannerProps {
  onOpenBooking: () => void;
}

export default function PromoBanner({ onOpenBooking }: PromoBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="relative rounded-3xl overflow-hidden shadow-sm bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 p-6 sm:p-8 border border-emerald-200">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/60 text-xs font-mono font-bold mb-1 text-emerald-900 border border-emerald-300">
                <span>SPECIAL PATNA OFFER</span>
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                FLAT 20% OFF ON ALL LAB PACKAGES
              </h3>
              <p className="text-slate-600 text-sm mt-0.5 font-medium">
                Discount is calculated and displayed on your booking pass automatically.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="btn-primary text-white font-display font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Book &amp; Claim 20% OFF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
