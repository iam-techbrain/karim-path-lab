import React from "react";
import { Phone, Mail, AlertCircle, MessageCircle } from "lucide-react";
import { LAB_CONTACT } from "@/data/testsData";

export default function ContactSection() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {LAB_CONTACT.name}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Registered diagnostic service headquartered in Patna, Bihar. Providing doorstep sample pick-up across all
              major Patna pin codes.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${LAB_CONTACT.phoneRaw}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900">{LAB_CONTACT.phone}</span>
                </a>

                <a
                  href={`mailto:${LAB_CONTACT.email}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors truncate"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 truncate">{LAB_CONTACT.email}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-6 text-slate-900 border border-emerald-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl border border-emerald-300">
              <AlertCircle className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-display font-bold text-xl text-slate-900">
              Need Urgent Sample Collection?
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto font-medium">
              If you need urgent fever, dengue or blood sugar testing today in Patna, tap below to contact Saba Hussain
              immediately.
            </p>
            <a
              href={`https://wa.me/${LAB_CONTACT.phoneRaw}?text=${encodeURIComponent(
                "Urgent Sample Collection Required in Patna"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex btn-primary text-white font-display font-bold text-xs px-6 py-3.5 rounded-xl items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Contact Saba on WhatsApp Now</span>
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
