"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowLeft, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin@karim2024");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      // Save token to localStorage as client backup
      if (typeof window !== "undefined") {
        localStorage.setItem("kpl_admin_auth", "true");
      }

      router.push("/admin");
    } catch (err: any) {
      setErrorMessage("Network error or server unreachable");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 hover:text-emerald-100 transition-colors bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Karim Path Lab Home</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 mb-4 flex items-center justify-center">
            <Image
              src="/images/karim-logo.png"
              alt="Karim Path Lab Logo"
              width={56}
              height={56}
              className="rounded-xl object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURE MANAGEMENT PORTAL</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Karim Path Lab Admin
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage services, connected hospitals &amp; partner labs
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Default Admin Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1 text-slate-300">
            <div>User: <span className="text-emerald-400 font-bold">admin</span></div>
            <div>Pass: <span className="text-emerald-400 font-bold">admin@karim2024</span></div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-700/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-[11px] mt-6">
          Protected Area · Authorized Staff &amp; Doctors Only
        </p>
      </div>
    </div>
  );
}
