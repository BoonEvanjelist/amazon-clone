"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, MapPin, ChevronDown,
  User, Package, Heart, LogOut, Settings, Menu, X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartCount, toggleCart } from "@/store/cartSlice";
import { selectUser, logout } from "@/store/authSlice";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Electronics", "Fashion", "Home", "Kitchen", "Books",
  "Sports", "Beauty", "Toys", "Automotive", "Garden",
];

const SEARCH_CATEGORIES = ["All Categories", ...CATEGORIES];

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const user = useAppSelector(selectUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({ search: searchQuery.trim() });
    if (searchCategory !== "All Categories") params.set("category", searchCategory);
    router.push(`/products?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    toast.success("Logged out successfully");
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <>
      {/* Top Nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-950/95 backdrop-blur-md shadow-lg"
            : "bg-navy-950"
        }`}
      >
        <div className="section">
          <div className="flex items-center gap-3 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
                <span className="text-navy-950 font-black text-sm">S</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block tracking-tight">
                Shop<span className="text-brand-400">Sphere</span>
              </span>
            </Link>

            {/* Location */}
            <button className="hidden lg:flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-xs shrink-0 ml-2">
              <MapPin size={14} />
              <div className="text-left">
                <div className="text-[10px] text-gray-400">Deliver to</div>
                <div className="font-semibold text-white text-xs">India</div>
              </div>
            </button>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center bg-white rounded-xl overflow-hidden shadow-md max-w-3xl mx-2"
            >
              {/* Category dropdown */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-1 px-3 h-11 text-xs font-medium text-gray-600 border-r border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {searchCategory === "All Categories" ? "All" : searchCategory.slice(0, 8)}
                  <ChevronDown size={12} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[180px] py-2 mt-1">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSearchCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-navy-50 hover:text-navy-700 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2 text-sm outline-none text-gray-900 placeholder:text-gray-400 h-11"
              />

              <button
                type="submit"
                className="px-4 h-11 bg-brand-400 hover:bg-brand-500 transition-colors flex items-center"
              >
                <Search size={18} className="text-navy-950" />
              </button>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Heart size={20} />
              </Link>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs"
                >
                  <User size={18} />
                  <span className="hidden sm:block font-medium">
                    {user ? user.name.split(" ")[0] : "Sign In"}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package size={16} /> My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart size={16} /> Wishlist
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings size={16} /> Account Settings
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <Settings size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2">
                          <Link
                            href="/auth/login"
                            onClick={() => setShowUserMenu(false)}
                            className="btn-secondary w-full text-center text-sm py-2.5 block"
                          >
                            Sign In
                          </Link>
                        </div>
                        <p className="text-xs text-gray-500 text-center pb-2">
                          New customer?{" "}
                          <Link href="/auth/register" className="text-navy-700 font-medium hover:underline">
                            Start here
                          </Link>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative flex items-center gap-1.5 px-3 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-400 text-navy-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                <span className="hidden sm:block text-xs font-medium">Cart</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-nav: Categories */}
        <nav className="bg-navy-900/80 border-t border-white/10 hidden md:block">
          <div className="section">
            <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
              <Link
                href="/products"
                className="text-xs font-bold text-brand-400 hover:text-brand-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                🔥 All Deals
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile search */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 pb-4 pt-3">
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 text-sm outline-none"
              />
              <button type="submit" className="px-4 py-2.5 bg-brand-400">
                <Search size={18} className="text-navy-950" />
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
