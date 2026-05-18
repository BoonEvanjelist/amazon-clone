import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Use Inter as fallback display font (builds offline too)
const jakarta = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopSphere — Shop Everything, Everywhere",
    template: "%s | ShopSphere",
  },
  description:
    "ShopSphere is your one-stop destination for electronics, fashion, home goods, and more — with fast delivery and the best prices guaranteed.",
  keywords: ["shopping", "ecommerce", "deals", "electronics", "fashion"],
  openGraph: {
    type: "website",
    siteName: "ShopSphere",
    title: "ShopSphere — Shop Everything, Everywhere",
    description: "Your modern, premium e-commerce destination.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReduxProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                },
                success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
