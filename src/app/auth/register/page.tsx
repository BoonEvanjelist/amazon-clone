"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      dispatch(setCredentials({ user: { id: data.user.id, ...data.user }, token: data.token }));
      toast.success("Welcome to ShopSphere! 🎉");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
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
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/60 text-sm mb-8">Join millions of happy shoppers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 text-sm"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
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
              className="w-full bg-brand-400 hover:bg-brand-500 disabled:opacity-60 text-navy-950 font-bold py-4 rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Sign In
            </Link>
          </p>

          <p className="text-center text-white/30 text-xs mt-4">
            By creating an account, you agree to our{" "}
            <Link href="#" className="underline">Terms</Link> and{" "}
            <Link href="#" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
