"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TEST_PACKAGES, LAB_CONTACT, getPriceForTest } from "@/data/testsData";
import { BookingFormData, BookingPassData } from "@/types/booking";
import { generateBookingCardCanvas } from "./CanvasPassGenerator";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTestName?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  defaultTestName,
}: BookingModalProps) {
  const getTodayISO = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [step, setStep] = useState<"form" | "card">("form");
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    mobile: "",
    testType: defaultTestName || TEST_PACKAGES[0]?.name || "Complete Blood Count (CBC)",
    prefDate: getTodayISO(),
    timeSlot: "Morning (6:00 AM – 9:00 AM)",
    address: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cardImageSrc, setCardImageSrc] = useState<string>("");
  const [passData, setPassData] = useState<BookingPassData | null>(null);
  const [lastCanvas, setLastCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Lock body scroll when modal is open and synchronize defaults
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData((prev) => ({
        ...prev,
        testType: defaultTestName || prev.testType || TEST_PACKAGES[0]?.name || "Complete Blood Count (CBC)",
        prefDate: prev.prefDate || getTodayISO(),
        timeSlot: prev.timeSlot || "Morning (6:00 AM – 9:00 AM)",
      }));
      setSubmitError("");
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setStep("form");
        setErrors({});
        setSubmitError("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultTestName]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter patient's full name (at least 2 letters).";
    }

    // Clean mobile number to 10 digits
    const cleanedMobile = formData.mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      errs.mobile = "Please enter a valid 10-digit mobile number (e.g. 9876543210).";
    }

    if (!formData.testType) {
      errs.testType = "Please select a test or package.";
    }
    if (!formData.prefDate) {
      errs.prefDate = "Please pick a preferred date.";
    }
    if (!formData.timeSlot) {
      errs.timeSlot = "Please choose a preferred time slot.";
    }
    if (!formData.address.trim() || formData.address.trim().length < 4) {
      errs.address = "Please enter complete home collection address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInitials = (name: string): string => {
    if (!name) return "PT";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "PT";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (isoStr: string): string => {
    if (!isoStr) return "Today";
    try {
      const parts = isoStr.includes("-") ? isoStr.split("-") : isoStr.split("/");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          const y = parts[0];
          const m = months[parseInt(parts[1], 10) - 1] || parts[1];
          const d = parseInt(parts[2], 10);
          return `${d} ${m} ${y}`;
        } else {
          // DD-MM-YYYY
          const d = parseInt(parts[0], 10);
          const m = months[parseInt(parts[1], 10) - 1] || parts[1];
          const y = parts[2];
          return `${d} ${m} ${y}`;
        }
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  };

  const openWhatsAppBooking = (pass: BookingPassData) => {
    const msg = `*KARIM PATH LAB — HOME SAMPLE COLLECTION BOOKING*
🎫 *Pass Ref:* ${pass.refCode}
👤 *Patient Name:* ${pass.name}
📱 *Mobile:* ${pass.mobile}
🔬 *Test Package:* ${pass.test}
📅 *Preferred Date:* ${pass.date} (${pass.slot})
📍 *Doorstep Address:* ${pass.address}
💰 *Total Payable:* ₹${pass.price} (Saved ₹${pass.originalPrice - pass.price} · FLAT 20% OFF)

_Hello Saba ji, please confirm my home blood test booking._`;

    const waUrl = `https://wa.me/${LAB_CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const handleFormSubmit = async (mode: "whatsapp" | "pass") => {
    setSubmitError("");
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const refCode = `#KPL-${Math.floor(100000 + Math.random() * 900000)}`;
      const priceObj = getPriceForTest(formData.testType);
      const prettyDate = formatDate(formData.prefDate);
      const cleanedMobile = formData.mobile.replace(/\D/g, "").slice(-10);

      const bookingPass: BookingPassData = {
        refCode,
        name: formData.fullName.trim(),
        initials: getInitials(formData.fullName),
        mobile: cleanedMobile,
        test: formData.testType,
        date: prettyDate,
        slot: formData.timeSlot,
        address: formData.address.trim(),
        price: priceObj.price,
        originalPrice: priceObj.original,
      };

      setPassData(bookingPass);

      // Persist lead to HubSpot CRM in background
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refCode,
          fullName: bookingPass.name,
          mobile: bookingPass.mobile,
          testType: bookingPass.test,
          prefDate: bookingPass.date,
          timeSlot: bookingPass.slot,
          address: bookingPass.address,
          price: bookingPass.price,
          originalPrice: bookingPass.originalPrice,
        }),
      }).catch((err) => {
        console.warn("Could not dispatch lead to HubSpot API:", err);
      });

      // Preload official logo image with safe fallback
      const logoImg = await new Promise<HTMLImageElement | null>((resolve) => {
        if (typeof window === "undefined") return resolve(null);
        try {
          const img = new Image();
          img.src = "/images/karim-logo.png";
          if (img.complete) return resolve(img);
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          setTimeout(() => resolve(null), 350);
        } catch {
          resolve(null);
        }
      });

      // Generate canvas pass card
      const canvas = generateBookingCardCanvas(bookingPass, logoImg);
      setLastCanvas(canvas);
      const dataUrl = canvas.toDataURL("image/png");
      setCardImageSrc(dataUrl);

      // Auto-download pass immediately
      const fileName = `karim-path-lab-pass-${bookingPass.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
      try {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (dlErr) {
        console.warn("Auto-download triggered warning:", dlErr);
      }

      // If WhatsApp mode requested, open chat directly
      if (mode === "whatsapp") {
        openWhatsAppBooking(bookingPass);
      }

      setStep("card");
    } catch (err: any) {
      console.error("Booking generation error:", err);
      setSubmitError("Could not generate pass card. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualDownload = () => {
    if (!cardImageSrc || !passData) return;
    const fileName = `karim-path-lab-pass-${passData.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    const link = document.createElement("a");
    link.href = cardImageSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col z-10 my-auto"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <span>
                    {step === "form" ? "Book Home Visit & Generate Pass" : "Official Diagnostic Pass"}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    20% OFF
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {step === "form"
                    ? "Fill patient details · Choose WhatsApp booking or direct instant pass download"
                    : "Booking confirmed! Your official pass has been generated and downloaded."}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {submitError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {step === "form" ? (
                <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("whatsapp"); }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Patient Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar"
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 ${
                            errors.fullName ? "border-rose-500" : "border-slate-200"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-rose-500 mt-1 font-bold">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter 10-Digit Mobile"
                          className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 ${
                            errors.mobile ? "border-rose-500" : "border-slate-200"
                          }`}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-xs text-rose-500 mt-1 font-bold">{errors.mobile}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="testType"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      Select Test / Package *
                    </label>
                    <div className="relative">
                      <select
                        id="testType"
                        name="testType"
                        value={formData.testType}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-medium appearance-none pr-10 ${
                          errors.testType ? "border-rose-500" : "border-slate-200"
                        }`}
                      >
                        {TEST_PACKAGES.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name} — ₹{t.price} (20% OFF · Save ₹{t.originalPrice - t.price})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        ▼
                      </div>
                    </div>
                    {errors.testType && (
                      <p className="text-xs text-rose-500 mt-1 font-bold">{errors.testType}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="prefDate"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          id="prefDate"
                          name="prefDate"
                          value={formData.prefDate}
                          onChange={handleChange}
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium ${
                            errors.prefDate ? "border-rose-500" : "border-slate-200"
                          }`}
                        />
                      </div>
                      {errors.prefDate && (
                        <p className="text-xs text-rose-500 mt-1 font-bold">{errors.prefDate}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="timeSlot"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Time Slot *
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          id="timeSlot"
                          name="timeSlot"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 font-medium appearance-none ${
                            errors.timeSlot ? "border-rose-500" : "border-slate-200"
                          }`}
                        >
                          <option value="Morning (6:00 AM – 9:00 AM)">Morning (6:00 AM – 9:00 AM)</option>
                          <option value="Forenoon (9:00 AM – 12:00 PM)">Forenoon (9:00 AM – 12:00 PM)</option>
                          <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                          <option value="Evening (4:00 PM – 7:00 PM)">Evening (4:00 PM – 7:00 PM)</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          ▼
                        </div>
                      </div>
                      {errors.timeSlot && (
                        <p className="text-xs text-rose-500 mt-1 font-bold">{errors.timeSlot}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      Full Address &amp; Landmark (Patna) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Flat No., Street, Landmark, Area (e.g. Kankarbagh, Boring Road, Rajendra Nagar, etc.)"
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium resize-none ${
                          errors.address ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-xs text-rose-500 mt-1 font-bold">{errors.address}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>FLAT 20% Discount auto-applied to your test fee &amp; digital pass.</span>
                  </div>

                  {/* Two Booking Management Options */}
                  <div className="pt-2 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: WhatsApp Booking */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleFormSubmit("whatsapp")}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-display font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/15 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <MessageCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span>Book via WhatsApp</span>
                      </button>

                      {/* Option 2: Direct Pass Download */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleFormSubmit("pass")}
                        className="btn-primary w-full active:scale-[0.99] text-white font-display font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 shrink-0" />
                        )}
                        <span>Generate &amp; Download Pass</span>
                      </button>
                    </div>

                    <p className="text-center text-[11px] text-slate-500 font-medium">
                      💡 Choose your preferred booking mode · Both options auto-download your official pass.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-dot"></span>
                      <span className="font-bold text-emerald-950">
                        ✅ Booking Confirmed &amp; Pass Auto-Downloaded!
                      </span>
                    </div>
                    {passData && (
                      <span className="font-mono font-bold bg-white text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm">
                        {passData.refCode}
                      </span>
                    )}
                  </div>

                  {/* Card Preview Image */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-white p-2">
                    {cardImageSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={cardImageSrc}
                        alt="Karim Path Lab Official Digital Booking Pass"
                        className="w-full h-auto block rounded-xl"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                        Generating card...
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Download + WhatsApp */}
                  <div className="space-y-2.5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Download Pass Again */}
                      <button
                        type="button"
                        onClick={handleManualDownload}
                        className="btn-primary w-full text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-display font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>Download Pass (PNG)</span>
                      </button>

                      {/* WhatsApp Confirmation / Send Details */}
                      {passData && (
                        <button
                          type="button"
                          onClick={() => openWhatsAppBooking(passData)}
                          className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-display font-bold shadow-lg shadow-emerald-500/15 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>Send on WhatsApp</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full btn-secondary rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-display font-bold text-center cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Done / Close</span>
                    </button>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>← Book Another Visit / Edit Details</span>
                    </button>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Auto-downloaded · Pass Verified
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
