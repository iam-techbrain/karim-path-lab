import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Click Book Visit",
      desc: "Open the quick booking modal dialog and enter patient details & location.",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      num: "02",
      title: "Get Digital Pass",
      desc: "Your digital booking pass generates instantly with 20% discount applied.",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      num: "03",
      title: "Technician Visit",
      desc: "Phlebotomist Saba Hussain arrives at your slot with 100% sterile vacuum tubes.",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      num: "04",
      title: "WhatsApp Report",
      desc: "Receive official NABL digital PDF reports directly on WhatsApp in 6-12 hours.",
      color: "bg-teal-100 text-teal-800",
    },
  ];

  return (
    <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div className="max-w-xl mb-8">
          <p className="font-mono text-xs text-emerald-700 uppercase font-bold tracking-wider">
            EASY 4-STEP PROCESS
          </p>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
            How Home Sample Collection Works
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-3">
              <div
                className={`w-10 h-10 rounded-xl font-mono font-bold flex items-center justify-center text-sm shadow-sm ${s.color}`}
              >
                {s.num}
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">{s.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
