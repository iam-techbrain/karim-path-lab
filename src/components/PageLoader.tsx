"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PageLoaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  logoUrl?: string;
  theme?: "emerald" | "blue";
  fullScreen?: boolean;
}

export default function PageLoader({
  title = "KARIM PATH LAB",
  subtitle = "Doorstep Pathology & Diagnostics · Patna",
  badge = "PATNA'S TRUSTED LAB",
  logoUrl = "/images/karim-logo.png",
  theme = "emerald",
  fullScreen = true,
}: PageLoaderProps) {
  const [currentLogo, setCurrentLogo] = useState<string>(logoUrl);

  // Sync latest live logo if available
  useEffect(() => {
    if (logoUrl && logoUrl !== "/images/karim-logo.png") {
      setCurrentLogo(logoUrl);
      return;
    }
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.logoUrl) setCurrentLogo(data.logoUrl);
      })
      .catch(() => {});
  }, [logoUrl]);

  const isBlue = theme === "blue";

  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[360px]"
      } bg-[#F4F7FB]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-500`}
    >
      {/* Background Soft Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-25 ${
            isBlue ? "bg-blue-400" : "bg-emerald-400"
          } animate-pulse`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl opacity-20 ${
            isBlue ? "bg-indigo-400" : "bg-teal-300"
          }`}
        />
      </div>

      {/* Main Glass Card Container */}
      <div className="relative bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-300/40 flex flex-col items-center max-w-sm w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Top Badge */}
        {badge && (
          <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10.5px] font-mono font-bold tracking-wider text-slate-600 uppercase">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBlue ? "bg-blue-600" : "bg-emerald-600"
              } animate-ping`}
            />
            <span>{badge}</span>
          </div>
        )}

        {/* Center Logo with Dual Animated Rings */}
        <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
          {/* Outer Rotating Gradient Ring */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${
              isBlue
                ? "from-blue-600 via-indigo-500 to-cyan-400"
                : "from-emerald-600 via-teal-500 to-lime-400"
            } animate-spin p-[2.5px] shadow-lg ${
              isBlue ? "shadow-blue-500/20" : "shadow-emerald-500/20"
            }`}
            style={{ animationDuration: "2.4s" }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </div>

          {/* Secondary Reverse Counter-Spin Ring */}
          <div
            className={`absolute inset-1.5 rounded-full border-2 border-dashed ${
              isBlue ? "border-blue-300/80" : "border-emerald-300/80"
            } animate-spin`}
            style={{ animationDuration: "5s", animationDirection: "reverse" }}
          />

          {/* Inner Logo Image Holder with Pulse Effect */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white p-1.5 shadow-md flex items-center justify-center group">
            <Image
              src={currentLogo || "/images/karim-logo.png"}
              alt="Karim Path Lab Official Logo"
              width={76}
              height={76}
              className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-1.5 mb-6 text-center">
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p
            className={`text-xs font-semibold ${
              isBlue ? "text-blue-700" : "text-emerald-700"
            } tracking-wide`}
          >
            {subtitle}
          </p>
        </div>

        {/* Smooth Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div
            className={`absolute inset-y-0 w-24 rounded-full bg-gradient-to-r ${
              isBlue
                ? "from-blue-600 to-cyan-500"
                : "from-emerald-600 to-teal-400"
            } animate-[indeterminate_1.4s_infinite_ease-in-out]`}
          />
        </div>

        {/* Subtle Live Status Footer */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isBlue ? "bg-blue-500" : "bg-emerald-500"
            } animate-pulse`}
          />
          <span>Connecting to diagnostic network...</span>
        </div>
      </div>
    </div>
  );
}
