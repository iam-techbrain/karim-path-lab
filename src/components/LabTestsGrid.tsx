"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Activity, FlaskConical, TestTube2, Dna, HeartPulse, Thermometer, Award, ArrowRight, ShieldCheck } from "lucide-react";
import { TEST_PACKAGES } from "@/data/testsData";

interface LabTestsGridProps {
  onOpenBooking: (testName?: string) => void;
}

export default function LabTestsGrid({ onOpenBooking }: LabTestsGridProps) {
  const getTestIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return <Activity className="w-6 h-6 text-emerald-600" />;
      case "FlaskConical":
        return <FlaskConical className="w-6 h-6 text-teal-600" />;
      case "TestTube2":
        return <TestTube2 className="w-6 h-6 text-amber-600" />;
      case "Dna":
        return <Dna className="w-6 h-6 text-sky-600" />;
      case "HeartPulse":
        return <HeartPulse className="w-6 h-6 text-indigo-600" />;
      case "Thermometer":
        return <Thermometer className="w-6 h-6 text-rose-600" />;
      default:
        return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  const [testList, setTestList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setTestList(data.services);
        } else {
          setTestList(TEST_PACKAGES);
        }
      })
      .catch((err) => {
        console.log("Live services sync fallback:", err);
        setTestList(TEST_PACKAGES);
      })
      .finally(() => setLoading(false));
  }, []);

  const regularTests = testList.filter((t) => !t.featured);
  const featuredPackage = testList.find((t) => t.featured);

  return (
    <section id="tests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="font-mono text-xs text-emerald-700 uppercase font-bold tracking-wider">
            LAB DIAGNOSTICS
          </p>
          <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 mt-1">
            Popular Tests &amp; Packages
          </h3>
        </div>
        <p className="text-slate-500 text-sm max-w-xs font-medium">
          All tests include doorstep sample pick-up across Patna with certified NABL reports.
        </p>
      </div>

      {/* Sterile Sample Collection Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-slate-200 shadow-sm h-48 sm:h-56 group">
        <Image
          src="/images/sample-test.jpg"
          alt="Sterile Pathology Sample Collection Vials"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>100% STERILE VACUUM COLLECTION</span>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
              Precise Pathology Results Powered by Automation
            </h4>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              Every diagnostic sample is analyzed on fully automated NABL-calibrated analyzers for maximum accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularTests.map((test) => {
          const saved = test.originalPrice - test.price;
          return (
            <motion.div
              key={test.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm">
                    {getTestIcon(test.icon)}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                    {test.badge || "20% OFF"}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-slate-900">{test.name}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{test.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline gap-2">
                  <span className="font-display font-bold text-xl text-emerald-800">
                    ₹{test.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-semibold">
                    ₹{test.originalPrice}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold ml-auto">
                    Save ₹{saved}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onOpenBooking(test.name)}
                className="mt-6 w-full btn-secondary rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book {test.name.split(" ")[0]} Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}

        {/* Featured Full Body Health Checkup Package Card */}
        {featuredPackage && (
          <div
            id="packages"
            className="glass-card rounded-2xl p-6 flex flex-col justify-between border-2 border-emerald-500 shadow-md scroll-mt-24 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70"
          >
            <div className="grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold">
                    {featuredPackage.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-mono text-xs font-bold">
                    20% OFF
                  </span>
                </div>
                <h4 className="font-display font-extrabold text-xl text-slate-900">
                  {featuredPackage.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {featuredPackage.description}
                </p>
              </div>

              <div className="md:col-span-4 text-left md:text-right space-y-3">
                <div>
                  <span className="text-xs text-slate-400 line-through font-semibold block">
                    MRP ₹{featuredPackage.originalPrice}
                  </span>
                  <span className="font-display font-extrabold text-3xl text-emerald-800">
                    ₹{featuredPackage.price}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-bold block">
                    Flat 20% Discount Applied
                  </span>
                </div>
                <button
                  onClick={() => onOpenBooking(featuredPackage.name)}
                  className="w-full btn-primary text-white rounded-xl py-3 text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Full Body Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
