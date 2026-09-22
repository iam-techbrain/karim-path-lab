"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  Building2,
  FlaskConical,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Search,
} from "lucide-react";
import { TestPackage, ConnectedHospital, PartnerLab } from "@/types/booking";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "hospitals" | "labs">("services");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [services, setServices] = useState<TestPackage[]>([]);
  const [hospitals, setHospitals] = useState<ConnectedHospital[]>([]);
  const [labs, setLabs] = useState<PartnerLab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state for Add/Edit
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [modalType, setModalType] = useState<"service" | "hospital" | "lab">("service");

  // Form states
  const [serviceForm, setServiceForm] = useState<Partial<TestPackage>>({
    name: "",
    price: 400,
    originalPrice: 500,
    discountPercentage: 20,
    description: "",
    category: "Routine Pathology",
    badge: "20% OFF",
    icon: "Activity",
    featured: false,
  });

  const [hospitalForm, setHospitalForm] = useState<Partial<ConnectedHospital>>({
    name: "",
    location: "",
    type: "Multi-Specialty Hospital",
    specialities: ["Cardiology", "General Medicine"],
    doctorNetworkCount: 15,
    badge: "Connected Partner",
    isFeatured: true,
  });
  const [specialitiesInput, setSpecialitiesInput] = useState("");

  const [labForm, setLabForm] = useState<Partial<PartnerLab>>({
    name: "",
    accreditation: "NABL Certified",
    category: "Diagnostic Reference Lab",
    description: "",
    turnaroundTime: "6 – 12 Hours",
    badge: "Certified Partner",
    isFeatured: true,
  });

  // Check auth and load data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // Client-side quick check
        const isClientAuth = typeof window !== "undefined" && localStorage.getItem("kpl_admin_auth") === "true";
        const authRes = await fetch("/api/admin/auth");
        const authData = await authRes.json();

        if (!authData.authenticated && !isClientAuth) {
          router.push("/admin/login");
          return;
        }

        setAuthenticated(true);
        await fetchData();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (data.services) setServices(data.services);
      if (data.hospitals) setHospitals(data.hospitals);
      if (data.labs) setLabs(data.labs);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showToast("error", "Failed to load live data from server");
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (_) {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("kpl_admin_auth");
    }
    router.push("/admin/login");
  };

  // Open modal handlers
  const openAddModal = (type: "service" | "hospital" | "lab") => {
    setModalType(type);
    setModalMode("add");
    if (type === "service") {
      setServiceForm({
        name: "",
        price: 350,
        originalPrice: 450,
        discountPercentage: 20,
        description: "",
        category: "Routine Pathology",
        badge: "20% OFF",
        icon: "Activity",
        featured: false,
      });
    } else if (type === "hospital") {
      setHospitalForm({
        name: "",
        location: "Patna, Bihar",
        type: "Multi-Specialty Hospital",
        specialities: ["General Medicine", "Cardiology"],
        doctorNetworkCount: 20,
        badge: "NABH / Top Partner",
        isFeatured: true,
      });
      setSpecialitiesInput("General Medicine, Cardiology");
    } else if (type === "lab") {
      setLabForm({
        name: "",
        accreditation: "NABL & CAP Certified",
        category: "Reference Pathology Lab",
        description: "",
        turnaroundTime: "6 – 12 Hours",
        badge: "Certified Partner",
        isFeatured: true,
      });
    }
  };

  const openEditModal = (type: "service" | "hospital" | "lab", item: any) => {
    setModalType(type);
    setModalMode("edit");
    if (type === "service") {
      setServiceForm({ ...item });
    } else if (type === "hospital") {
      setHospitalForm({ ...item });
      setSpecialitiesInput(item.specialities ? item.specialities.join(", ") : "");
    } else if (type === "lab") {
      setLabForm({ ...item });
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let itemToSave: any = null;

      if (modalType === "service") {
        const id = serviceForm.id || `srv-${Date.now()}`;
        const disc = serviceForm.originalPrice && serviceForm.price
          ? Math.round(((serviceForm.originalPrice - serviceForm.price) / serviceForm.originalPrice) * 100)
          : 20;

        itemToSave = {
          ...serviceForm,
          id,
          discountPercentage: disc,
          badge: serviceForm.badge || `${disc}% OFF`,
        };
      } else if (modalType === "hospital") {
        const id = hospitalForm.id || `hosp-${Date.now()}`;
        const specs = specialitiesInput
          ? specialitiesInput.split(",").map((s) => s.trim()).filter(Boolean)
          : ["Multi-Specialty"];

        itemToSave = {
          ...hospitalForm,
          id,
          specialities: specs,
        };
      } else if (modalType === "lab") {
        const id = labForm.id || `lab-${Date.now()}`;
        itemToSave = {
          ...labForm,
          id,
        };
      }

      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          item: itemToSave,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      await fetchData();
      setModalMode(null);
      showToast("success", `${modalType.toUpperCase()} saved successfully and synced with live site!`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save");
    }
  };

  // Delete item
  const handleDelete = async (type: "service" | "hospital" | "lab", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = await fetch(`/api/admin/data?type=${type}&id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchData();
      showToast("success", `${type.toUpperCase()} removed successfully`);
    } catch (err: any) {
      showToast("error", err.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-xs text-slate-400">Loading Karim Path Lab Admin...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // Filter lists based on search
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLabs = labs.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.accreditation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/50 text-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-emerald-500/40 shadow-sm flex items-center justify-center">
              <Image
                src="/images/karim-logo.png"
                alt="Karim Path Lab"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight">
                KARIM PATH LAB <span className="text-emerald-400 font-mono text-xs ml-1 font-bold">ADMIN</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Management System · Patna Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-500/25 transition-all"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setActiveTab("services")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "services"
                ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 uppercase font-bold">Total Services &amp; Tests</span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="font-display font-black text-3xl text-white mt-2">{services.length}</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Available for Home Booking</p>
          </div>

          <div
            onClick={() => setActiveTab("hospitals")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "hospitals"
                ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 uppercase font-bold">Connected Hospitals</span>
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
            <p className="font-display font-black text-3xl text-white mt-2">{hospitals.length}</p>
            <p className="text-[11px] text-teal-400 font-medium mt-1">Leading Patna Hospital Network</p>
          </div>

          <div
            onClick={() => setActiveTab("labs")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "labs"
                ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 uppercase font-bold">Partner Diagnostic Labs</span>
              <FlaskConical className="w-5 h-5 text-sky-400" />
            </div>
            <p className="font-display font-black text-3xl text-white mt-2">{labs.length}</p>
            <p className="text-[11px] text-sky-400 font-medium mt-1">NABL &amp; Reference Labs Available</p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "services"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Services / Tests ({services.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("hospitals")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "hospitals"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Connected Hospitals ({hospitals.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("labs")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "labs"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Partner Labs ({labs.length})</span>
            </button>
          </div>

          {/* Search & Add New CTA */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              onClick={() => {
                if (activeTab === "services") openAddModal("service");
                else if (activeTab === "hospitals") openAddModal("hospital");
                else openAddModal("lab");
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                Add {activeTab === "services" ? "Service" : activeTab === "hospitals" ? "Hospital" : "Partner Lab"}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: SERVICES / TESTS LIST */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-lg text-white">
                All Diagnostic Services &amp; Packages
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Live on Homepage &amp; Booking Selector
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all group relative"
                >
                  {service.featured && (
                    <span className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
                      FEATURED PACKAGE
                    </span>
                  )}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold text-white text-base leading-snug">
                        {service.name}
                      </h3>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0">
                        {service.badge || "20% OFF"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-white font-display font-extrabold text-lg">
                          ₹{service.price}
                        </span>
                        <span className="text-slate-500 line-through text-xs">
                          ₹{service.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        Save ₹{service.originalPrice - service.price} ({service.discountPercentage}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal("service", service)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("service", service.id)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm font-mono">No services found.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONNECTED HOSPITALS */}
        {activeTab === "hospitals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Connected Hospitals in Patna
                </h2>
                <p className="text-xs text-slate-400">
                  Hospitals whose doctors and referral networks Karim Path Lab serves
                </p>
              </div>
              <span className="text-xs font-mono text-teal-400 font-bold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
                {hospitals.length} Hospitals Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-white text-base">
                          {hospital.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          📍 {hospital.location}
                        </p>
                      </div>
                      <span className="bg-teal-950 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded shrink-0">
                        {hospital.badge || "Partner Hospital"}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-emerald-400 mb-2">
                      {hospital.type}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hospital.specialities?.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                      <span>{hospital.doctorNetworkCount || 20}+ Doctors Tie-up</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal("hospital", hospital)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Hospital"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("hospital", hospital.id)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                        title="Delete Hospital"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHospitals.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm font-mono">No hospitals added yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PARTNER LABS */}
        {activeTab === "labs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Partner Pathology Labs
                </h2>
                <p className="text-xs text-slate-400">
                  Diagnostic centers where patients can choose to have their samples processed
                </p>
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold bg-sky-950/60 border border-sky-500/30 px-3 py-1 rounded-full">
                {labs.length} Certified Labs Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-white text-base">
                          {lab.name}
                        </h3>
                        <p className="text-xs text-sky-400 font-mono mt-0.5">
                          {lab.category}
                        </p>
                      </div>
                      <span className="bg-sky-950 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded shrink-0">
                        {lab.badge || "NABL Certified"}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed mb-4">
                      {lab.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-semibold">{lab.accreditation}</span> · Turnaround:{" "}
                      <span className="text-white font-medium">{lab.turnaroundTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal("lab", lab)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Lab"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("lab", lab.id)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                        title="Delete Lab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLabs.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm font-mono">No partner labs added yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DIALOG: ADD / EDIT */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                {modalType === "service" && <Activity className="w-5 h-5" />}
                {modalType === "hospital" && <Building2 className="w-5 h-5" />}
                {modalType === "lab" && <FlaskConical className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {modalMode === "add" ? "Add New" : "Edit"}{" "}
                  {modalType === "service" ? "Service / Test" : modalType === "hospital" ? "Connected Hospital" : "Partner Lab"}
                </h3>
                <p className="text-slate-400 text-xs font-mono">
                  Changes will update live across the entire website
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              {/* FORM: SERVICE */}
              {modalType === "service" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Service / Test Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="e.g. Vitamin D (25-OH) Test"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Discounted Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={serviceForm.price || ""}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                        placeholder="320"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Original Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={serviceForm.originalPrice || ""}
                        onChange={(e) => setServiceForm({ ...serviceForm, originalPrice: Number(e.target.value) })}
                        placeholder="400"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Description / Parameters Included
                    </label>
                    <textarea
                      rows={2}
                      value={serviceForm.description || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="e.g. Complete hormone assessment with 24 hr turnaround"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={serviceForm.badge || ""}
                        onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                        placeholder="e.g. 20% OFF or POPULAR"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceForm.featured || false}
                          onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* FORM: HOSPITAL */}
              {modalType === "hospital" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.name || ""}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      placeholder="e.g. Paras HMRI Hospital"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Location / Area in Patna *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.location || ""}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                      placeholder="e.g. Raja Bazar, Bailey Road, Patna"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Hospital Type
                      </label>
                      <input
                        type="text"
                        value={hospitalForm.type || ""}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, type: e.target.value })}
                        placeholder="Super Specialty Hospital"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Doctor Network Size
                      </label>
                      <input
                        type="number"
                        value={hospitalForm.doctorNetworkCount || 20}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, doctorNetworkCount: Number(e.target.value) })}
                        placeholder="35"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Departments / Specialities (comma separated)
                    </label>
                    <input
                      type="text"
                      value={specialitiesInput}
                      onChange={(e) => setSpecialitiesInput(e.target.value)}
                      placeholder="Cardiology, Oncology, Orthopedics, Neuro Sciences"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Accreditation / Badge
                    </label>
                    <input
                      type="text"
                      value={hospitalForm.badge || ""}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, badge: e.target.value })}
                      placeholder="e.g. NABH Accredited Partner"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>
                </>
              )}

              {/* FORM: PARTNER LAB */}
              {modalType === "lab" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Diagnostic Lab Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={labForm.name || ""}
                      onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                      placeholder="e.g. Dr. Lal PathLabs"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Accreditation *
                      </label>
                      <input
                        type="text"
                        required
                        value={labForm.accreditation || ""}
                        onChange={(e) => setLabForm({ ...labForm, accreditation: e.target.value })}
                        placeholder="NABL & CAP Certified"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Turnaround Time
                      </label>
                      <input
                        type="text"
                        value={labForm.turnaroundTime || ""}
                        onChange={(e) => setLabForm({ ...labForm, turnaroundTime: e.target.value })}
                        placeholder="6 – 12 Hours"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Lab Category
                    </label>
                    <input
                      type="text"
                      value={labForm.category || ""}
                      onChange={(e) => setLabForm({ ...labForm, category: e.target.value })}
                      placeholder="e.g. National Reference Laboratory"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Description &amp; Highlights
                    </label>
                    <textarea
                      rows={2}
                      value={labForm.description || ""}
                      onChange={(e) => setLabForm({ ...labForm, description: e.target.value })}
                      placeholder="Details regarding tests and processing technology"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={labForm.badge || ""}
                      onChange={(e) => setLabForm({ ...labForm, badge: e.target.value })}
                      placeholder="e.g. Doctor Trusted or Express"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans text-sm"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Website</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
