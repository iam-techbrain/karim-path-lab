"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LAB_CONTACT } from "@/data/testsData";

interface FooterProps {
  onOpenBooking: (testName?: string) => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const [currentLogo, setCurrentLogo] = useState<string>("/images/karim-logo.png");

  useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.logoUrl) setCurrentLogo(data.logoUrl);
      })
      .catch((err) => console.log("Footer logo sync notice:", err));
  }, []);

  return (
    <footer className="bg-white text-slate-500 text-xs border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-200 shadow-sm shrink-0">
                <Image
                  src={currentLogo}
                  alt="Karim Path Lab Official Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>
              <div>
                <h5 className="font-display font-bold text-slate-900 text-base leading-tight">
                  KARIM <span className="text-gradient">PATH LAB</span>
                </h5>
                <p className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                  ESTD 2020 · Patna
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Doorstep diagnostic sample collection in Patna, Bihar. NABL accuracy standards.
            </p>
          </div>

          <div>
            <p className="font-mono text-slate-900 text-[11px] font-bold uppercase tracking-wider mb-3">
              Quick Navigation
            </p>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#tests" className="hover:text-emerald-700 transition-colors">
                  Lab Tests
                </a>
              </li>
              <li>
                <a href="#network" className="hover:text-emerald-700 transition-colors">
                  Hospitals &amp; Labs Network
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking()}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Book Home Collection
                </button>
              </li>
              <li>
                <a href="/admin" className="text-slate-400 hover:text-emerald-700 transition-colors text-[11px]">
                  🔒 Admin Portal
                </a>
              </li>
              <li>
                <a href="#phlebotomist" className="hover:text-emerald-700 transition-colors">
                  Lab Phlebotomist
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-emerald-700 transition-colors">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-700 transition-colors">
                  Contact Address
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-slate-900 text-[11px] font-bold uppercase tracking-wider mb-3">
              Available Tests
            </p>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => onOpenBooking("Complete Blood Count (CBC)")}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  CBC Blood Count
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking("Thyroid Profile (T3 T4 TSH)")}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Thyroid Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking("Dengue & Fever Panel")}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Dengue &amp; Fever
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking("Complete Health Checkup")}
                  className="hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Full Body Checkup
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-slate-900 text-[11px] font-bold uppercase tracking-wider mb-3">
              Direct Contact
            </p>
            <p className="text-slate-900 font-bold">{LAB_CONTACT.phone}</p>
            <p className="text-slate-600 mt-1 font-medium">{LAB_CONTACT.email}</p>
            <p className="text-slate-500 mt-2 font-medium">Jethuli, Patna - 803201, Bihar</p>
          </div>
        </div>

        {/* ECG Animated Line */}
        <div className="relative h-6 my-6 overflow-hidden">
          <svg width="100%" height="24" viewBox="0 0 500 24" preserveAspectRatio="none">
            <path
              className="pulse-line"
              d="M0,12 L180,12 L192,2 L204,22 L216,12 L380,12 L392,4 L404,20 L416,12 L500,12"
            />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] pt-4 border-t border-slate-100 text-slate-400">
          <p className="italic font-display text-slate-700 font-bold">
            &ldquo;Your Health, Our Priority – Delivered to Your Doorstep&rdquo;
          </p>
          <p className="font-mono font-bold">© KARIM PATH LAB · PATNA, BIHAR</p>
        </div>
      </div>
    </footer>
  );
}
