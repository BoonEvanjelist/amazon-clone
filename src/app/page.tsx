import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Star, TrendingUp, Gift, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "ShopSphere — Shop Everything, Everywhere",
  description: "Discover 55+ premium products across Electronics, Fashion, Home, Kitchen & more at unbeatable prices.",
};

const CATEGORIES = [
  { name: "Electronics",  icon: "💻", gradient: "from-blue-500 to-indigo-600",   bg: "bg-blue-50",   text: "text-blue-700"   },
  { name: "Fashion",      icon: "👗", gradient: "from-pink-500 to-rose-600",     bg: "bg-pink-50",   text: "text-pink-700"   },
  { name: "Home",         icon: "🏠", gradient: "from-orange-400 to-amber-500",  bg: "bg-orange-50", text: "text-orange-700" },
  { name: "Kitchen",      icon: "🍳", gradient: "from-red-400 to-orange-500",    bg: "bg-red-50",    text: "text-red-700"    },
  { name: "Sports",       icon: "⚽", gradient: "from-green-500 to-emerald-600", bg: "bg-green-50",  text: "text-green-700"  },
  { name: "Beauty",       icon: "💄", gradient: "from-purple-500 to-pink-600",   bg: "bg-purple-50", text: "text-purple-700" },
  { name: "Books",        icon: "📚", gradient: "from-yellow-500 to-amber-600",  bg: "bg-yellow-50", text: "text-yellow-700" },
  { name: "Toys",         icon: "🧸", gradient: "from-indigo-500 to-violet-600", bg: "bg-indigo-50", text: "text-indigo-700" },
];

const HERO_SLIDES = [
  {
    tag: "🔥 Limited Time",
    headline: "MacBook Air M2",
    sub: "The most capable MacBook ever — now ₹22,000 off",
    cta: "Shop Electronics",
    href: "/products?category=Electronics",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700",
    gradient: "from-[#0f0e2a] via-[#1e1b4b] to-[#4338ca]",
    accent: "#fbbf24",
  },
  {
    tag: "⚡ Flash Sale",
    headline: "Up to 70% Off Fashion",
    sub: "Nike, Adidas, Ray-Ban & more — today only",
    cta: "Shop Fashion",
    href: "/products?category=Fashion",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    gradient: "from-[#7c2d12] via-[#c2410c] to-[#ea580c]",
    accent: "#fbbf24",
  },
  {
    tag: "🌿 New Arrivals",
    headline: "Transform Your Kitchen",
    sub: "KitchenAid, Ninja, Nespresso — chef-grade tools",
    cta: "Shop Kitchen",
    href: "/products?category=Kitchen",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700",
    gradient: "from-[#134e4a] via-[#0f766e] to-[#0d9488]",
    accent: "#fbbf24",
  },
];

const PERKS = [
  { icon: Truck,       label: "Free Delivery",   desc: "Orders over ₹499",     color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: ShieldCheck, label: "Secure Payment",  desc: "100% protected",        color: "text-green-600",  bg: "bg-green-50"  },
  { icon: RefreshCw,   label: "Easy Returns",    desc: "30-day hassle-free",    color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Star,        label: "Top Rated",       desc: "4.5★+ products",        color: "text-amber-600",  bg: "bg-amber-50"  },
];

function formatPrice(p: number) {
  return "₹" + p.toLocaleString("en-IN");
}

function PriceTag({ price, original }: { price: number; original?: number }) {
  const disc = original && original > price ? Math.round(((original - price) / original) * 100) : 0;
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(price)}</span>
      {disc > 0 && (
        <>
          <span className="text-xs text-gray-400 line-through">{formatPrice(original!)}</span>
          <span className="text-xs font-bold text-green-600">-{disc}%</span>
        </>
      )}
    </div>
  );
}

export default async function HomePage() {
  // Get featured products from mock (always available)
  const featured = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  const trending = MOCK_PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 12);

  return (
    <div className="min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-br ${HERO_SLIDES[0].gradient} min-h-[520px] md:min-h-[580px] flex items-center`}
        >
          {/* BG blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-400/10 blur-3xl" />
          </div>

          <div className="section relative z-10 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-in">
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-300 text-xs font-bold tracking-wider uppercase">
                {HERO_SLIDES[0].tag}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight font-display">
                {HERO_SLIDES[0].headline}
              </h1>
              <p className="text-white/70 text-lg mb-8">{HERO_SLIDES[0].sub}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={HERO_SLIDES[0].href} className="btn-primary text-base px-8 py-4 animate-pulse-glow">
                  {HERO_SLIDES[0].cta} <ArrowRight size={18} />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all">
                  All Deals
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-400" /> Secure checkout</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-brand-400" /> Free delivery ₹499+</span>
              </div>
            </div>

            {/* Product image */}
            <div className="hidden md:flex justify-center animate-float">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-3xl bg-white/10 blur-xl" />
                <Image
                  src={HERO_SLIDES[0].img}
                  alt="Hero product"
                  fill
                  className="object-contain drop-shadow-2xl rounded-3xl"
                  sizes="288px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero mini cards */}
        <div className="section -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HERO_SLIDES.slice(0, 4).map((slide, i) => (
              <Link
                key={i}
                href={slide.href}
                className={`rounded-2xl bg-gradient-to-br ${slide.gradient} p-4 flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all group`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  {["💻", "👟", "🍳", "⚡"][i]}
                </div>
                <div>
                  <p className="text-white font-bold text-xs">{["Electronics", "Fashion", "Kitchen", "Flash Sale"][i]}</p>
                  <p className="text-white/60 text-xs">{["Up to 40% off", "Up to 70% off", "Chef picks", "Today only"][i]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PERKS BAR ─── */}
      <section className="section py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PERKS.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`flex items-center gap-3 ${bg} dark:bg-gray-800/60 rounded-2xl px-5 py-4`}>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="section py-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black section-gradient-title">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">8 departments, 55+ products</p>
          </div>
          <Link href="/products" className="btn-ghost text-sm">
            All Categories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(({ name, icon, bg, text }) => (
            <Link
              key={name}
              href={`/products?category=${encodeURIComponent(name)}`}
              className={`cat-pill ${bg}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">
                {icon}
              </div>
              <span className={`text-xs font-bold ${text} dark:text-gray-200`}>{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold mb-2">
                <Zap size={12} /> Featured
              </span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display">Handpicked for You</h2>
            </div>
            <Link href="/products?sort=rating&order=desc" className="btn-outline hidden sm:inline-flex">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((product) => {
              const disc = product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              return (
                <Link key={product._id} href={`/products/${product._id}`} className="product-card group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {disc > 0 && (
                      <div className="absolute top-3 left-3 badge-sale">{disc}% OFF</div>
                    )}
                    {product.isPrime && (
                      <div className="absolute top-3 right-3 badge-prime">⚡ Prime</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-navy-600 dark:text-brand-400 mb-1">{product.brand}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 leading-snug">{product.title}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {"★★★★★".split("").map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? "text-brand-400" : "text-gray-200"}`}>★</span>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">({product.numReviews.toLocaleString()})</span>
                    </div>
                    <PriceTag price={product.price} original={product.originalPrice} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BANNER ─── */}
      <section className="section py-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
          </div>
          <div className="relative z-10 p-10 md:p-16 text-center">
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold">
              🎉 YEAR-END SALE
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 font-display">
              Up to <span className="text-brand-400">70% Off</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Limited time deals across all 8 categories. Don&apos;t miss out.
            </p>
            <Link href="/products" className="btn-primary text-base px-10 py-4 animate-pulse-glow">
              Shop All Deals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRENDING ─── */}
      <section className="section py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-2">
              <TrendingUp size={12} /> Trending
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display">Trending Now</h2>
          </div>
          <Link href="/products" className="btn-ghost hidden sm:inline-flex text-sm">
            See All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {trending.slice(0, 12).map((product) => {
            const disc = product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <Link key={product._id} href={`/products/${product._id}`} className="group">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-800">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {disc > 0 && (
                      <div className="absolute top-2 left-2 text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md">{disc}%</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.brand}</p>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mt-0.5">{product.title}</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white mt-1.5">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── GIFT BANNER ─── */}
      <section className="section pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🎁", title: "Gift Cards", desc: "Perfect for every occasion", href: "#", color: "from-purple-600 to-pink-600" },
            { icon: "📦", title: "Subscribe & Save", desc: "Up to 15% off on auto-delivery", href: "#", color: "from-blue-600 to-cyan-600" },
            { icon: "⚡", title: "Prime Deals", desc: "Exclusive offers for members", href: "/products?isPrime=true", color: "from-amber-500 to-orange-600" },
          ].map(({ icon, title, desc, href, color }) => (
            <Link
              key={title}
              href={href}
              className={`rounded-3xl bg-gradient-to-br ${color} p-8 flex items-center gap-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group`}
            >
              <span className="text-5xl animate-float">{icon}</span>
              <div>
                <p className="text-white font-black text-xl font-display">{title}</p>
                <p className="text-white/70 text-sm mt-0.5">{desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-white/80 text-xs font-semibold group-hover:text-white transition-colors">
                  Learn more <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
