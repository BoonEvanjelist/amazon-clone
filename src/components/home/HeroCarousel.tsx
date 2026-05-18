"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    headline: "The Biggest Tech Sale of the Year",
    subline: "Up to 60% off on Electronics",
    cta: "Shop Electronics",
    ctaHref: "/products?category=Electronics",
    bg: "from-navy-950 via-blue-900 to-blue-800",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
    badge: "FLASH DEAL",
  },
  {
    id: 2,
    headline: "Fashion That Defines You",
    subline: "New arrivals from top brands — explore thousands of styles",
    cta: "Explore Fashion",
    ctaHref: "/products?category=Fashion",
    bg: "from-purple-950 via-purple-900 to-indigo-900",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
    badge: "NEW ARRIVALS",
  },
  {
    id: 3,
    headline: "Transform Your Home",
    subline: "Premium appliances & home décor at unbeatable prices",
    cta: "Shop Home",
    ctaHref: "/products?category=Home",
    bg: "from-emerald-950 via-teal-900 to-cyan-900",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
    badge: "BESTSELLERS",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className={`relative h-[480px] md:h-[560px] bg-gradient-to-r ${slide.bg} overflow-hidden transition-all duration-700`}>
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src={slide.image}
          alt={slide.headline}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative section h-full flex items-center">
        <div className="max-w-2xl animate-fade-in" key={current}>
          {/* Badge */}
          <span className="inline-block bg-brand-400 text-navy-950 text-xs font-black px-3 py-1.5 rounded-full mb-4 tracking-widest">
            {slide.badge}
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 text-balance">
            {slide.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
            {slide.subline}
          </p>
          <Link
            href={slide.ctaHref}
            className="inline-flex items-center gap-2 bg-brand-400 hover:bg-brand-500 text-navy-950 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-brand-400" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
