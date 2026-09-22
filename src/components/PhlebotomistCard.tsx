import React from "react";
import Image from "next/image";
import { Phone, Mail, Award, ShieldCheck, MapPin } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

export default function PhlebotomistCard() {
  return (
    <section id="phlebotomist" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <div className="bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/90 rounded-3xl p-6 sm:p-10 text-slate-900 shadow-md border border-emerald-200">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Left Info */}
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-mono font-bold border border-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>CERTIFIED LAB TECHNICIAN</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {LAB_CONTACT.phlebotomist}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-medium">
              Experienced clinical phlebotomist across Patna. Saba ensures gentle, painless blood sample collection
              using pre-sealed sterile vacuum tubes and temperature-monitored sample boxes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-emerald-700 text-[10px] font-bold">ROLE</p>
                <p className="font-bold text-slate-900 mt-0.5">Lab Phlebotomist</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-emerald-700 text-[10px] font-bold">SAFETY PROTOCOL</p>
                <p className="font-bold text-emerald-700 mt-0.5">100% Single-Use Kit</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                <p className="text-emerald-700 text-[10px] font-bold">COVERAGE AREA</p>
                <p className="font-bold text-slate-900 mt-0.5">Entire Patna City</p>
              </div>
            </div>
          </div>

          {/* Phlebotomist Action Photo Card */}
          <div className="md:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-3">
            <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md group">
              <Image
                src="/images/shameersrk-blood-test.jpg"
                alt="Phlebotomist Saba Hussain Doorstep Sample Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-sm">
                  Verified Active Phlebotomist
                </span>
              </div>
            </div>

            <p className="text-xs font-mono text-emerald-800 uppercase font-bold">Direct Communication</p>
            <a
              href={`tel:${LAB_CONTACT.phoneRaw}`}
              className="flex items-center gap-3 p-3 bg-emerald-50/80 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-800 font-bold">PHONE</p>
                <p className="text-sm font-bold text-slate-900">{LAB_CONTACT.phone}</p>
              </div>
            </a>

            <a
              href={`mailto:${LAB_CONTACT.email}`}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-teal-800 font-bold">EMAIL</p>
                <p className="text-xs font-bold text-slate-900 truncate">{LAB_CONTACT.email}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
