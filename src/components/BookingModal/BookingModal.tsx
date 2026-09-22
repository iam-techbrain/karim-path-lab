"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, MapPin, User, Download, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
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
  const [step, setStep] = useState<"form" | "card">("form");
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    mobile: "",
    testType: "",
    prefDate: "",
    timeSlot: "",
    address: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cardImageSrc, setCardImageSrc] = useState<string>("");
  const [passData, setPassData] = useState<BookingPassData | null>(null);
  const [lastCanvas, setLastCanvas] = useState<HTMLCanvasElement | null>(null);

  const todayStr = useRef(new Date().toISOString().split("T")[0]).current;

  // Initialize or update default test
  useEffect(() => {
    if (defaultTestName) {
      setFormData((prev) => ({ ...prev, testType: defaultTestName }));
    }
  }, [defaultTestName]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset after closing
      setTimeout(() => {
        setStep("form");
        setErrors({});
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      errs.fullName = "Please enter patient's full name.";
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = "Please enter a valid 10-digit mobile number.";
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
    if (!formData.address.trim() || formData.address.trim().length < 5) {
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
    const [y, m, d] = isoStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(m, 10) - 1] || m;
    return `${d} ${monthName} ${y}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const refCode = `#KPL-${Math.floor(100000 + Math.random() * 900000)}`;
    const priceObj = getPriceForTest(formData.testType);
    const prettyDate = formatDate(formData.prefDate);

    const bookingPass: BookingPassData = {
      refCode,
      name: formData.fullName.trim(),
      initials: getInitials(formData.fullName),
      mobile: formData.mobile.trim(),
      test: formData.testType,
      date: prettyDate,
      slot: formData.timeSlot,
      address: formData.address.trim(),
      price: priceObj.price,
      originalPrice: priceObj.original,
    };

    setPassData(bookingPass);

    // Persist booking to Neon DB
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
      console.warn("Could not save booking to Neon DB:", err);
    });

    // Preload official logo image for canvas rendering
    let logoImg: HTMLImageElement | null = null;
    if (typeof window !== "undefined") {
      logoImg = new Image();
      logoImg.src = "/images/karim-logo.png";
      if (!logoImg.complete) {
        await new Promise((resolve) => {
          if (!logoImg) return resolve(null);
          logoImg.onload = () => resolve(null);
          logoImg.onerror = () => resolve(null);
        });
      }
    }

    // Generate canvas card with logo
    const canvas = generateBookingCardCanvas(bookingPass, logoImg);
    setLastCanvas(canvas);
    const dataUrl = canvas.toDataURL("image/png");
    setCardImageSrc(dataUrl);
    setStep("card");

    // Automatic download immediately on submit
    const fileName = `karim-path-lab-pass-${bookingPass.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 250);
  };

  const handleManualDownload = () => {
    if (!cardImageSrc || !passData) return;
    const fileName = `karim-path-lab-pass-${passData.name.replace(/\s+/g, "-").toLowerCase()}.png`;
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
                  <span>{step === "form" ? "Book Home Visit & Generate Pass" : "Official Diagnostic Pass"}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    20% OFF
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {step === "form"
                    ? "Fill patient details to create official booking pass"
                    : "Booking confirmed & saved to database. Your pass has been downloaded."}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto">
              {step === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Patient Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter Your Full Name"
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 ${errors.fullName ? "border-rose-500" : "border-slate-200"
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
                          placeholder="Enter Your Mobile Number"
                          className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 ${errors.mobile ? "border-rose-500" : "border-slate-200"
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
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-medium appearance-none pr-10 ${errors.testType ? "border-rose-500" : "border-slate-200"
                          }`}
                      >
                        <option value="" disabled>
                          Choose a test package
                        </option>
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
                          min={todayStr}
                          value={formData.prefDate}
                          onChange={handleChange}
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium ${errors.prefDate ? "border-rose-500" : "border-slate-200"
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
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 font-medium appearance-none ${errors.timeSlot ? "border-rose-500" : "border-slate-200"
                            }`}
                        >
                          <option value="" disabled>
                            Select time slot
                          </option>
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
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium resize-none ${errors.address ? "border-rose-500" : "border-slate-200"
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

                  <button
                    type="submit"
                    className="btn-primary w-full text-white font-display font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Book Slot &amp; Generate Digital Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-dot"></span>
                      <span className="font-bold text-emerald-950">
                        ✅ Booking Saved to Database &amp; Pass Auto-Downloaded!
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

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleManualDownload}
                      className="w-full btn-primary text-white rounded-xl py-3.5 sm:py-4 px-4 flex items-center justify-center gap-2.5 text-sm font-display font-extrabold shadow-lg shadow-emerald-600/25 cursor-pointer"
                    >
                      <Download className="w-5 h-5 shrink-0" />
                      <span>Click to Download Pass Again (PNG)</span>
                    </button>

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
                      <span>← Book Another Visit / New Test</span>
                    </button>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Auto-downloaded · Saved in Neon DB
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
