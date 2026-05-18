import Link from "next/link";
import { Truck, Shield, RefreshCw, Headphones, Globe, ExternalLink } from "lucide-react";

const footerLinks = {
  "Get to Know Us": [
    { label: "About ShopSphere", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press Releases", href: "/press" },
    { label: "Investor Relations", href: "/investors" },
  ],
  "Make Money With Us": [
    { label: "Sell on ShopSphere", href: "/sell" },
    { label: "Become an Affiliate", href: "/affiliate" },
    { label: "Advertise Your Products", href: "/advertise" },
  ],
  "Let Us Help You": [
    { label: "Your Account", href: "/account" },
    { label: "Your Orders", href: "/account/orders" },
    { label: "Shipping Rates", href: "/shipping" },
    { label: "Returns & Replacements", href: "/returns" },
    { label: "Help Center", href: "/help" },
  ],
  "Payment Methods": [
    { label: "Credit/Debit Cards", href: "#" },
    { label: "Net Banking", href: "#" },
    { label: "UPI", href: "#" },
    { label: "EMI Options", href: "#" },
    { label: "Gift Cards", href: "#" },
  ],
};

const perks = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over ₹499" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Customer support" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* Perks Bar */}
      <div className="border-b border-white/10">
        <div className="section py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-400/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="section py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-sm mb-4 text-white">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
                <span className="text-navy-950 font-black text-xs">S</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Shop<span className="text-brand-400">Sphere</span>
              </span>
            </Link>

            {/* Social */}
            <div className="flex items-center gap-3">
              {["f", "𝕏", "in", "▶"].map((label, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-400/20 hover:text-brand-400 flex items-center justify-center text-gray-400 transition-all text-sm font-bold"
                >
                  {label}
                </Link>
              ))}
            </div>


            {/* Copyright */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-gray-300 flex items-center gap-1">
                <Globe size={12} /> India
              </Link>
              <span>© {new Date().getFullYear()} ShopSphere, Inc.</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-500">
            {["Privacy Policy", "Terms of Service", "Cookies", "Do Not Sell My Info"].map((item) => (
              <Link key={item} href="#" className="hover:text-gray-300 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
