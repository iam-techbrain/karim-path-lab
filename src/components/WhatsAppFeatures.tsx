import React from "react";
import Image from "next/image";
import { MessageCircle, ShieldCheck, Zap, QrCode, Lock } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

export default function WhatsAppFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 rounded-3xl p-8 sm:p-12 text-slate-900 shadow-md border border-emerald-200/80 relative overflow-hidden">
        {/* Ambient lighting dots */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-mono font-bold border border-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-dot"></span>
              <span>100% SECURE &amp; SEAMLESS SYSTEM</span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-4xl leading-tight text-slate-900">
              Manage Bookings &amp; Digital Reports,
              <br />
              <span className="text-gradient">Integrated Directly with WhatsApp</span>
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed font-medium max-w-xl">
              No login hassle or complex apps required! Everything from generating your official digital pass to
              receiving NABL-certified PDF reports happens securely on your phone.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-slate-900">Digital Pass Generator</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Generates an official diagnostic card with unique barcode reference code &amp; 20% discount in 1 click.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 text-teal-600" />
                  <h4 className="text-slate-900">WhatsApp Report Delivery</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Verified PDF test reports sent straight to your WhatsApp within 6 to 12 hours.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-slate-900">End-to-End Privacy</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Your medical data &amp; phone details stay 100% private, confidential and password-protected.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-slate-900">Instant Technician Sync</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Direct live connection with Phlebotomist Saba Hussain for doorstep sample collection.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
            {/* Embedded Microscope Research Image */}
            <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
              <Image
                src="/images/herney-microscope.jpg"
                alt="Advanced Clinical Microscopy Analysis"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3 text-left">
                <p className="text-[11px] font-mono text-emerald-300 font-bold drop-shadow">
                  HIGH-PRECISION PATHOLOGY
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg text-slate-900">Have a Quick Question?</h4>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Send a quick WhatsApp inquiry message to Saba Hussain for immediate assistance.
              </p>
            </div>

            <a
              href={`https://wa.me/${LAB_CONTACT.phoneRaw}?text=${encodeURIComponent(
                "Hi Saba, I would like to inquire about lab tests and home sample collection."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary text-white font-display font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Quick WhatsApp Inquiry</span>
            </a>

            <p className="text-[10px] font-mono text-emerald-700 font-bold">
              ⚡ Average Response Time: &lt; 5 mins
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
