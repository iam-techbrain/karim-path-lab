"use client";

import React from "react";
import Image from "next/image";
import { Phone, CalendarCheck } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

interface NavbarProps {
  onOpenBooking: (testName?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/images/karim-logo.png"
                alt="Karim Path Lab Official Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
          </div>
          <div className="leading-tight">
            <h1 className="font-display font-bold text-base md:text-lg tracking-tight text-slate-900">
              KARIM <span className="text-gradient">PATH LAB</span>
            </h1>
            <p className="text-[9.5px] font-bold tracking-[0.22em] text-emerald-700 uppercase">
              Diagnostic Pathology Lab · Patna
            </p>
          </div>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#tests" className="hover:text-emerald-700 transition-colors">
            Lab Tests &amp; Packages
          </a>
          <a href="#network" className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hospitals &amp; Labs</span>
          </a>
          <a href="#how" className="hover:text-emerald-700 transition-colors">
            How it Works
          </a>
          <a href="#phlebotomist" className="hover:text-emerald-700 transition-colors">
            Our Technician
          </a>
          <a href="#reviews" className="hover:text-emerald-700 transition-colors">
            Reviews
          </a>
          <a href="#contact" className="hover:text-emerald-700 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${LAB_CONTACT.phoneRaw}`}
            className="hidden sm:flex btn-secondary rounded-xl px-4 py-2.5 text-xs font-semibold items-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Lab</span>
          </a>
          <button
            onClick={() => onOpenBooking()}
            className="btn-primary text-white text-xs font-display font-semibold rounded-xl px-5 py-2.5 flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Visit</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              20% OFF
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
