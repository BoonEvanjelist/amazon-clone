"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      dispatch(setCredentials({ user: { id: data.user.id, ...data.user }, token: data.token }));
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "admin") => {
    const credentials = {
      user: { email: "demo@shopsphere.com", password: "demo123456" },
      admin: { email: "admin@shopsphere.com", password: "admin123456" },
    };
    setForm(credentials[role]);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials[role]),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      dispatch(setCredentials({ user: { id: data.user.id, ...data.user }, token: data.token }));
      toast.success(`Logged in as ${role}!`);
      router.push(role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center">
            <span className="text-navy-950 font-black text-lg">S</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Shop<span className="text-brand-400">Sphere</span>
          </span>
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60 text-sm mb-8">Sign in to your ShopSphere account</p>

          {/* Demo buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleDemoLogin("user")}
              disabled={loading}
              className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all"
            >
              👤 Demo User
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              disabled={loading}
              className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all"
            >
              🛡️ Demo Admin
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 text-sm"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-400 hover:bg-brand-500 disabled:opacity-60 text-navy-950 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
