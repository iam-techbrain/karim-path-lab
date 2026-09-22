"use client";

import React from "react";

interface MobileStickyBarProps {
  onOpenBooking: () => void;
}

export default function MobileStickyBar({ onOpenBooking }: MobileStickyBarProps) {
  return (
    <>
      <div className="fixed bottom-4 inset-x-4 z-30 md:hidden max-w-sm mx-auto">
        <button
          onClick={onOpenBooking}
          className="w-full btn-primary text-white font-display font-bold text-xs rounded-2xl py-3.5 px-5 flex items-center justify-between shadow-2xl cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot"></span>
            <span>Book Doorstep Test</span>
          </div>
          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            20% OFF
          </span>
        </button>
      </div>
      <div className="h-16 md:hidden"></div>
    </>
  );
}
