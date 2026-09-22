"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import {
  Home,
  LayoutDashboard,
  Activity,
  Building2,
  FlaskConical,
  Percent,
  Image as ImageIcon,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bell,
  Sliders,
  Tag,
  ArrowRight,
  Upload,
  RefreshCw,
  Eye,
  Check,
  TrendingDown,
  ShieldCheck,
  FileText,
  FolderPlus,
  Users,
  Radio,
  Clock,
  Sparkle,
  Phone,
  Stethoscope,
  Globe,
  Mail,
  Folder,
  Crown,
  MessageSquare,
  Layers,
  BarChart3,
  Link2,
  FileCheck,
  Database
} from "lucide-react";
import { TestPackage, ConnectedHospital, PartnerLab } from "@/types/booking";

export default function AdminDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active navigation tab
  const [activeNav, setActiveNav] = useState<
    "home" | "services" | "offers" | "logo" | "hospitals" | "labs"
  >("home");

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [services, setServices] = useState<TestPackage[]>([]);
  const [hospitals, setHospitals] = useState<ConnectedHospital[]>([]);
  const [labs, setLabs] = useState<PartnerLab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("/images/karim-logo.png");
  const [newLogoInput, setNewLogoInput] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [savingLogo, setSavingLogo] = useState(false);

  // Global Offer State
  const [globalOffer, setGlobalOffer] = useState({
    enabled: true,
    discountPercentage: 20,
    badgeText: "20% OFF",
    title: "FLAT 20% OFF ON ALL LAB PACKAGES",
  });
  const [offerDiscountInput, setOfferDiscountInput] = useState<number>(20);
  const [applyingOffer, setApplyingOffer] = useState(false);

  // Modal / Form state for Add/Edit
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [modalType, setModalType] = useState<"service" | "hospital" | "lab">("service");

  // Form states
  const [serviceForm, setServiceForm] = useState<Partial<TestPackage>>({
    name: "",
    price: 320,
    originalPrice: 400,
    discountPercentage: 20,
    description: "",
    category: "Routine Pathology",
    badge: "20% OFF",
    icon: "Activity",
    featured: false,
  });

  const [hospitalForm, setHospitalForm] = useState<Partial<ConnectedHospital>>({
    name: "",
    location: "Patna, Bihar",
    type: "Multi-Specialty Hospital",
    specialities: ["Cardiology", "General Medicine"],
    doctorNetworkCount: 20,
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
      if (data.logoUrl) {
        setLogoUrl(data.logoUrl);
        setNewLogoInput(data.logoUrl);
      }
      if (data.globalOffer) {
        setGlobalOffer(data.globalOffer);
        setOfferDiscountInput(data.globalOffer.discountPercentage || 20);
      }
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
    } catch (_) { }
    if (typeof window !== "undefined") {
      localStorage.removeItem("kpl_admin_auth");
    }
    router.push("/admin/login");
  };

  // Apply discount to all tests (Direct amount reduction)
  const handleApplyDiscount = async (percentage: number) => {
    setApplyingOffer(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply_discount",
          discountPercentage: percentage,
          globalOffer: {
            enabled: percentage > 0,
            discountPercentage: percentage,
            badgeText: percentage > 0 ? `${percentage}% OFF` : "Regular Price",
            title: percentage > 0 ? `FLAT ${percentage}% OFF ON ALL LAB PACKAGES` : "Standard Diagnostic Rates",
          },
        }),
      });

      if (!res.ok) throw new Error("Could not apply discount");
      await fetchData();
      showToast("success", `FLAT ${percentage}% OFF applied! All test amounts reduced.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to apply discount");
    } finally {
      setApplyingOffer(false);
    }
  };

  // Logo update handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "Image file too large. Please select an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoPreview(base64);
      setNewLogoInput(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    const targetUrl = logoPreview || newLogoInput || logoUrl;
    if (!targetUrl) {
      showToast("error", "Please provide a valid image file or URL.");
      return;
    }

    setSavingLogo(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "logo",
          logoUrl: targetUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to save logo");
      setLogoUrl(targetUrl);
      setLogoPreview("");
      showToast("success", "Logo updated successfully! Reflected across website and passes.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update logo");
    } finally {
      setSavingLogo(false);
    }
  };

  const handleResetLogo = async () => {
    const defaultLogo = "/images/karim-logo.png";
    setSavingLogo(true);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "logo",
          logoUrl: defaultLogo,
        }),
      });
      setLogoUrl(defaultLogo);
      setNewLogoInput(defaultLogo);
      setLogoPreview("");
      showToast("success", "Default official Karim Path Lab logo restored.");
    } catch (err: any) {
      showToast("error", "Failed to reset logo");
    } finally {
      setSavingLogo(false);
    }
  };

  const [syncingDb, setSyncingDb] = useState(false);

  const handleSyncToDatabase = async () => {
    setSyncingDb(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_to_supabase" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Supabase Database synchronized successfully! All tables up to date.");
      } else {
        showToast("error", "Database Sync: " + (data.syncStatus?.errors?.join("; ") || "Schema ready in supabase_schema.sql"));
      }
      await fetchData();
    } catch (err: any) {
      showToast("error", "Failed to sync with Supabase: " + err.message);
    } finally {
      setSyncingDb(false);
    }
  };

  // Open modal handlers
  const openAddModal = (type: "service" | "hospital" | "lab") => {
    setModalType(type);
    setModalMode("add");
    if (type === "service") {
      const orig = 500;
      const disc = globalOffer.discountPercentage || 20;
      const price = Math.round(orig * (1 - disc / 100));
      setServiceForm({
        name: "",
        originalPrice: orig,
        discountPercentage: disc,
        price: price,
        description: "",
        category: "Routine Pathology",
        badge: `${disc}% OFF`,
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

  // Form price calculation helper
  const handleOriginalPriceChange = (val: number) => {
    const disc = serviceForm.discountPercentage ?? 20;
    const calcPrice = Math.round(val * (1 - disc / 100));
    setServiceForm((prev) => ({
      ...prev,
      originalPrice: val,
      price: calcPrice,
      badge: `${disc}% OFF`,
    }));
  };

  const handleDiscountChange = (disc: number) => {
    const orig = serviceForm.originalPrice || 400;
    const calcPrice = Math.round(orig * (1 - disc / 100));
    setServiceForm((prev) => ({
      ...prev,
      discountPercentage: disc,
      price: calcPrice,
      badge: `${disc}% OFF`,
    }));
  };

  const handleFinalPriceChange = (price: number) => {
    const orig = serviceForm.originalPrice || price;
    const disc = orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    setServiceForm((prev) => ({
      ...prev,
      price,
      discountPercentage: disc,
      badge: disc > 0 ? `${disc}% OFF` : "Regular Price",
    }));
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let itemToSave: any = null;

      if (modalType === "service") {
        const id = serviceForm.id || `srv-${Date.now()}`;
        const orig = Number(serviceForm.originalPrice) || 400;
        const disc = Number(serviceForm.discountPercentage) ?? 20;
        const price = Number(serviceForm.price) ?? Math.round(orig * (1 - disc / 100));

        itemToSave = {
          ...serviceForm,
          id,
          originalPrice: orig,
          discountPercentage: disc,
          price: price,
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
      showToast("success", `${modalType.toUpperCase()} saved successfully!`);
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
      <PageLoader
        title="Karim Path Lab"
        subtitle="Control Center & Live Pricing Engine"
        badge="SaaS Admin Suite"
        theme="blue"
        logoUrl={logoUrl}
      />
    );
  }

  if (!authenticated) {
    return null;
  }

  // Filter items
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
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 flex font-sans antialiased">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium transition-all ${statusMessage.type === "success"
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* WHITE SIDEBAR (Matching reference image precisely) */}
      {/* ======================================================== */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 min-h-screen sticky top-0 z-30">
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-xs">
            <Image
              src={logoUrl || "/images/karim-logo.png"}
              alt="Logo"
              width={34}
              height={34}
              className="object-contain max-h-8 max-w-8"
              unoptimized
            />
          </div>
          <div className="leading-tight overflow-hidden">
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight truncate">
              Karim Path Lab
            </h2>
            <p className="text-[11px] text-blue-600 font-semibold tracking-tight">
              SaaS Admin Suite
            </p>
          </div>
        </div>

        {/* Quick Search Shortcut Bar (Exact match to screenshot) */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-400 hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Quick search</span>
            </div>
            <kbd className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-semibold shadow-2xs">
              CTRL+K
            </kbd>
          </div>
        </div>

        {/* Navigation Menus with exact category grouping matching screenshot */}
        <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto text-[13px]">
          {/* Main Home & Dashboards */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveNav("home")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${activeNav === "home"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveNav("services")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${activeNav === "services"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboards</span>
              <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {services.length}
              </span>
            </button>
          </div>

          {/* Group 4: Ad & Diagnostic Suite */}
          <div className="space-y-0.5 pt-1 border-t border-slate-100">
            <button
              onClick={() => setActiveNav("offers")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeNav === "offers"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-amber-500" />
                <span>20% Special Offer</span>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-amber-200">
                {globalOffer.discountPercentage}% OFF
              </span>
            </button>

            <button
              onClick={() => setActiveNav("logo")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeNav === "logo"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span>Logo &amp; Brand Icon</span>
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-50 font-bold px-1.5 py-0.5 rounded">
                Upload
              </span>
            </button>

            <button
              onClick={() => setActiveNav("hospitals")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeNav === "hospitals"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Hospitals Network</span>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">{hospitals.length}</span>
            </button>

            <button
              onClick={() => setActiveNav("labs")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeNav === "labs"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-slate-400" />
                <span>Partner Labs</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                NABL
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Menu */}
        <div className="p-3 border-t border-slate-100 space-y-1 text-xs">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span className="font-medium">What&apos;s new?</span>
            </div>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
              1
            </span>
          </div>

          <div
            onClick={() => setActiveNav("home")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Settings &amp; Help</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span className="font-medium">View Live Website</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">200 OK</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT CANVAS */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        {/* Top subtle purple strip matching screenshot */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shrink-0 w-full" />

        {/* Top bar header */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Welcome, Karime
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>20% Live Discount Synced</span>
            </div>

            <div
              onClick={() => setActiveNav("home")}
              className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              title="Team & Account"
            >
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="px-8 pb-12 max-w-6xl w-full space-y-6">
          {/* Card 1: Search for any website, keyword or report */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Search for any website, keyword or report
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any website, keyword or report"
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: HOME / DASHBOARD */}
          {/* ======================================================== */}
          {activeNav === "home" && (
            <div className="space-y-6">
              {/* Section 2: Recent activity (Exact match to screenshot) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Activity Card 1 */}
                  <div
                    onClick={() => setActiveNav("services")}
                    className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        Website performance
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        ikararestaurant.com
                      </p>
                    </div>
                  </div>

                  {/* Activity Card 2 */}
                  <div
                    onClick={() => setActiveNav("offers")}
                    className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3.5 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        Website performance
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        bigrahpurmdevelopers.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Your projects (Exact match to screenshot) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Your projects</h3>
                    <span className="text-xs text-slate-400 font-medium">View all projects (0/1)</span>
                  </div>
                  <button
                    onClick={() => openAddModal("service")}
                    className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                    title="Add Test / Service"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50/70 border border-blue-200/60 flex items-center justify-center shrink-0 text-blue-600">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                        mycompany.com
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>3 competitors</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Users className="w-3 h-3" />
                          <Globe className="w-3 h-3" />
                          <Mail className="w-3 h-3" />
                          <Sliders className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveNav("offers")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    Create project
                  </button>
                </div>
              </div>

              {/* Diagnostic Hub Quick Controls Banner */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                      <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">
                          Karim Path Lab Patna Diagnostic Engine
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          20% Discount Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {services.length} tests · {hospitals.length} hospitals · {labs.length} partner labs · Patna 803201
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleSyncToDatabase}
                      disabled={syncingDb}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                      title="Sync all services, hospitals, labs, and settings with Supabase"
                    >
                      <Database className={`w-3.5 h-3.5 ${syncingDb ? "animate-spin" : ""}`} />
                      <span>{syncingDb ? "Syncing..." : "Sync Database"}</span>
                    </button>

                    <button
                      onClick={() => openAddModal("service")}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Test</span>
                    </button>

                    <button
                      onClick={() => setActiveNav("offers")}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>Manage 20% Offer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveNav("services")}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Live Tests</span>
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{services.length}</p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">Available for Home Visit</p>
                </div>

                <div
                  onClick={() => setActiveNav("offers")}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Offer</span>
                    <Percent className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-extrabold text-amber-600 mt-2">
                    {globalOffer.enabled ? `${globalOffer.discountPercentage}% OFF` : "Disabled"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Amounts automatically reduced</p>
                </div>

                <div
                  onClick={() => setActiveNav("hospitals")}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Hospitals</span>
                    <Building2 className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{hospitals.length}</p>
                  <p className="text-[11px] text-teal-600 font-semibold mt-1">Connected Doctor Network</p>
                </div>

                <div
                  onClick={() => setActiveNav("labs")}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Partner Labs</span>
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{labs.length}</p>
                  <p className="text-[11px] text-purple-600 font-semibold mt-1">NABL Super Labs</p>
                </div>
              </div>

              {/* Quick Preview of Tests with Live Reduced Amount */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Current Tests &amp; Discounted Amounts</h3>
                    <p className="text-xs text-slate-500">Live prices shown to customers during booking</p>
                  </div>
                  <button
                    onClick={() => setActiveNav("services")}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View &amp; Edit All &rarr;
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {services.slice(0, 4).map((test) => {
                    const saved = (test.originalPrice || 400) - test.price;
                    return (
                      <div key={test.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/70">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{test.name}</p>
                          <p className="text-xs text-slate-500">{test.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                            <span className="text-sm font-extrabold text-emerald-700 font-mono">₹{test.price}</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                              {test.badge || "20% OFF"}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                            Customer saves ₹{saved}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SPECIAL 20% OFFER & DISCOUNT CONTROLLER */}
          {/* ======================================================== */}
          {activeNav === "offers" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono mb-2">
                      <Percent className="w-3.5 h-3.5" />
                      <span>PRICING &amp; OFFER CONTROLLER</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      20% Special Discount Offer Manager
                    </h2>
                    <p className="text-xs text-slate-600 max-w-2xl mt-1">
                      Yahan se aap 20% offer ko apply kar sakte hain. Isse sabhi tests ke final amounts automatically kam ho jaate hain aur booking pass / WhatsApp message par kam hua amount hi dikhta hai.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApplyDiscount(20)}
                      disabled={applyingOffer}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {applyingOffer ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>Apply 20% OFF to All Tests</span>
                    </button>
                  </div>
                </div>

                {/* Offer Preset Selector */}
                <div className="pt-6 space-y-4">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Choose Discount Percentage (Amount will reduce accordingly):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { percent: 20, label: "20% OFF", sub: "Recommended · Special Offer" },
                      { percent: 15, label: "15% OFF", sub: "Moderate Discount" },
                      { percent: 25, label: "25% OFF", sub: "Festival Offer" },
                      { percent: 30, label: "30% OFF", sub: "Super Saver" },
                      { percent: 0, label: "0% (Regular)", sub: "Reset to Standard MRP" },
                    ].map((item) => (
                      <button
                        key={item.percent}
                        onClick={() => {
                          setOfferDiscountInput(item.percent);
                          handleApplyDiscount(item.percent);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${globalOffer.discountPercentage === item.percent && globalOffer.enabled
                          ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-extrabold text-slate-900 font-mono">{item.label}</span>
                          {globalOffer.discountPercentage === item.percent && globalOffer.enabled && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Amount Impact Table */}
                <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Live Test Price Impact Summary ({globalOffer.discountPercentage}% Applied)
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Amount Kam Hokar Live Sync Hai
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Test / Package Name</th>
                          <th className="px-4 py-3 text-right">Original Amount</th>
                          <th className="px-4 py-3 text-right">Discount ({globalOffer.discountPercentage}%)</th>
                          <th className="px-4 py-3 text-right text-emerald-700">Final Reduced Amount</th>
                          <th className="px-4 py-3 text-center">Badge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {services.map((test) => {
                          const orig = test.originalPrice || 400;
                          const discountVal = orig - test.price;
                          return (
                            <tr key={test.id} className="hover:bg-slate-50/60">
                              <td className="px-4 py-3 font-bold text-slate-900">{test.name}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-400 line-through">₹{orig}</td>
                              <td className="px-4 py-3 text-right font-mono text-rose-600 font-bold">-₹{discountVal}</td>
                              <td className="px-4 py-3 text-right font-mono text-sm font-extrabold text-emerald-700">
                                ₹{test.price}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                                  {test.badge || `${globalOffer.discountPercentage}% OFF`}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LOGO & BRANDING ASSET MANAGER */}
          {/* ======================================================== */}
          {activeNav === "logo" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="pb-6 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold font-mono mb-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>BRAND IDENTITY &amp; LOGO</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Update Karim Path Lab Logo
                  </h2>
                  <p className="text-xs text-slate-600 max-w-xl mt-1">
                    Apna naya logo image upload karein ya URL enter karein. Save karne par yeh website header, footer, booking pass aur admin panel sabhi jagah turant update ho jayega.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6">
                  {/* Left: Preview Card */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Current &amp; Live Logo Preview
                    </h4>
                    <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col items-center justify-center text-center space-y-4 shadow-2xs">
                      <div className="relative w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2 flex items-center justify-center overflow-hidden">
                        <Image
                          src={logoPreview || newLogoInput || logoUrl}
                          alt="Logo Preview"
                          width={100}
                          height={100}
                          className="object-contain max-h-24 max-w-24"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Official Brand Logo</p>
                        <p className="text-xs text-slate-500">Rendered on official diagnostic passes &amp; WhatsApp</p>
                      </div>

                      {/* Mini Mockup of Navbar */}
                      <div className="w-full bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 p-0.5 flex items-center justify-center">
                            <Image
                              src={logoPreview || newLogoInput || logoUrl}
                              alt="Mock"
                              width={28}
                              height={28}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">KARIM PATH LAB</p>
                            <p className="text-[9px] text-emerald-700 font-semibold">PATNA DIAGNOSTICS</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          Website Navbar Look
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Upload & Form */}
                  <div className="space-y-6">
                    {/* File Upload Option */}
                    <div className="border border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/60 hover:bg-slate-50 transition-all text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Click to upload new logo image</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP or SVG (Recommended: 512x512)</p>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-4 py-2 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File from Computer</span>
                      </button>
                    </div>

                    {/* Or URL Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Or Enter Image URL:
                      </label>
                      <input
                        type="text"
                        value={newLogoInput}
                        onChange={(e) => {
                          setNewLogoInput(e.target.value);
                          setLogoPreview("");
                        }}
                        placeholder="https://example.com/logo.png or /images/karim-logo.png"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handleSaveLogo}
                        disabled={savingLogo}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {savingLogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save &amp; Apply Logo Now</span>
                      </button>

                      <button
                        onClick={handleResetLogo}
                        disabled={savingLogo}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SERVICES & LAB TESTS MANAGEMENT */}
          {/* ======================================================== */}
          {activeNav === "services" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Lab Tests &amp; Diagnostic Packages ({filteredServices.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prices are discounted by {globalOffer.discountPercentage}%. Changes sync immediately with the live site.
                    </p>
                  </div>

                  <button
                    onClick={() => openAddModal("service")}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Test Package</span>
                  </button>
                </div>

                {/* Table */}
                <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Test Name</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 text-right">Original MRP</th>
                          <th className="px-4 py-3 text-right text-emerald-700">Discounted Amount</th>
                          <th className="px-4 py-3 text-center">Badge</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredServices.map((service) => (
                          <tr key={service.id} className="hover:bg-slate-50/70">
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-slate-900 text-sm">{service.name}</span>
                              {service.featured && (
                                <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  ★ Featured
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">
                              {service.description}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-slate-400 line-through">
                              ₹{service.originalPrice}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-sm font-extrabold text-emerald-700">
                              ₹{service.price}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">
                                {service.badge || "20% OFF"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal("service", service)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors cursor-pointer"
                                  title="Edit Test"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete("service", service.id)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                                  title="Delete Test"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: HOSPITALS MANAGEMENT */}
          {/* ======================================================== */}
          {activeNav === "hospitals" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Connected Patna Hospitals ({filteredHospitals.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Doctor network and referral partner institutions
                    </p>
                  </div>

                  <button
                    onClick={() => openAddModal("hospital")}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Hospital Partner</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {filteredHospitals.map((hosp) => (
                    <div key={hosp.id} className="border border-slate-200 rounded-xl p-5 bg-white hover:border-blue-300 transition-all shadow-2xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {hosp.badge || "Connected Partner"}
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900 mt-2">{hosp.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{hosp.location} · {hosp.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal("hospital", hosp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete("hospital", hosp.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hosp.specialities?.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: PARTNER LABS MANAGEMENT */}
          {/* ======================================================== */}
          {activeNav === "labs" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Partner Diagnostic Labs ({filteredLabs.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      NABL &amp; CAP accredited reference pathology labs
                    </p>
                  </div>

                  <button
                    onClick={() => openAddModal("lab")}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Partner Lab</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {filteredLabs.map((lab) => (
                    <div key={lab.id} className="border border-slate-200 rounded-xl p-5 bg-white hover:border-purple-300 transition-all shadow-2xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {lab.accreditation}
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900 mt-2">{lab.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{lab.category} · Turnaround: {lab.turnaroundTime}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal("lab", lab)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete("lab", lab.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 font-medium">
                        {lab.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DIALOG WITH REAL-TIME 20% CALCULATOR */}
      {/* ======================================================== */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-base text-slate-900 capitalize">
                {modalMode} {modalType === "service" ? "Test / Package" : modalType}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {modalType === "service" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Test Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="e.g. Thyroid Profile (T3 T4 TSH)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Description / Parameters *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={serviceForm.description || ""}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="e.g. Complete hormone assessment for metabolism and thyroid disorders."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Real-time 20% Discount Calculator Row */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-blue-600" />
                        <span>Discount &amp; Amount Calculator</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                        Live Auto-Calculation
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Original MRP (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={serviceForm.originalPrice || 500}
                          onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                          className="w-full bg-white border border-blue-300 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Discount %
                        </label>
                        <input
                          type="number"
                          value={serviceForm.discountPercentage ?? 20}
                          onChange={(e) => handleDiscountChange(Number(e.target.value))}
                          className="w-full bg-white border border-blue-300 rounded-lg px-2.5 py-2 text-xs font-bold text-blue-700 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                          Reduced Amount (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={serviceForm.price || 400}
                          onChange={(e) => handleFinalPriceChange(Number(e.target.value))}
                          className="w-full bg-white border border-emerald-400 rounded-lg px-2.5 py-2 text-xs font-extrabold text-emerald-800 font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-blue-800 font-medium">
                      Original: ₹{serviceForm.originalPrice} &rarr;{" "}
                      <span className="font-bold text-emerald-700">
                        Final Amount Payable: ₹{serviceForm.price}
                      </span>{" "}
                      (Customer saves ₹{(serviceForm.originalPrice || 0) - (serviceForm.price || 0)})
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Offer Badge
                      </label>
                      <input
                        type="text"
                        value={serviceForm.badge || "20% OFF"}
                        onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                        placeholder="20% OFF"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="featuredCheck"
                        checked={serviceForm.featured || false}
                        onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Featured Package (Full Width Banner)
                      </label>
                    </div>
                  </div>
                </>
              )}

              {modalType === "hospital" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.name || ""}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      placeholder="e.g. Paras HMRI Hospital"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={hospitalForm.location || ""}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                        placeholder="e.g. Bailey Road, Patna"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Type / Category
                      </label>
                      <input
                        type="text"
                        value={hospitalForm.type || ""}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, type: e.target.value })}
                        placeholder="Multi-Specialty Hospital"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Specialities (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={specialitiesInput}
                      onChange={(e) => setSpecialitiesInput(e.target.value)}
                      placeholder="Cardiology, General Medicine, Oncology"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                    />
                  </div>
                </>
              )}

              {modalType === "lab" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Partner Lab Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={labForm.name || ""}
                      onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                      placeholder="e.g. Dr. Lal PathLabs"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Accreditation
                      </label>
                      <input
                        type="text"
                        value={labForm.accreditation || ""}
                        onChange={(e) => setLabForm({ ...labForm, accreditation: e.target.value })}
                        placeholder="NABL & CAP Certified"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Turnaround Time
                      </label>
                      <input
                        type="text"
                        value={labForm.turnaroundTime || ""}
                        onChange={(e) => setLabForm({ ...labForm, turnaroundTime: e.target.value })}
                        placeholder="6 – 12 Hours"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={labForm.description || ""}
                      onChange={(e) => setLabForm({ ...labForm, description: e.target.value })}
                      placeholder="State-of-the-art automated diagnostic analyzers."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                    />
                  </div>
                </>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
                >
                  Save &amp; Sync Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Support & Chat Widget matching screenshot bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setActiveNav("offers")}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform cursor-pointer"
          title="20% Offer Engine & Live Support"
        >
          <MessageSquare className="w-5 h-5 fill-white/20" />
        </button>
      </div>
    </div>
  );
}
