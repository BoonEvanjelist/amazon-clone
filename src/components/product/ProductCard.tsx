"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, Zap, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { toggleWishlist, selectWishlist } from "@/store/wishlistSlice";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = any;

function formatPrice(p: number) {
  return "₹" + p.toLocaleString("en-IN");
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? "text-brand-400 fill-brand-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlist);
  const isWishlisted = wishlist.includes(product._id);
  const disc = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      stock: product.stock,
    }));
    toast.success("Added to cart!", { icon: "🛒" });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product._id));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  if (view === "list") {
    return (
      <Link
        href={`/products/${product._id}`}
        className="flex gap-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-lg hover:border-navy-100 dark:hover:border-gray-700 transition-all duration-300 group"
      >
        <div className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Image src={product.images?.[0] || ""} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="128px" />
          {disc > 0 && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">{disc}%</div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-navy-600 dark:text-brand-400 mb-1">{product.brand}</p>
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 text-sm">{product.title}</p>
          <div className="flex items-center gap-2 mb-3">
            <Stars rating={product.rating} />
            <span className="text-xs text-gray-400">({product.numReviews?.toLocaleString()})</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {disc > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
            {disc > 0 && <span className="text-xs font-bold text-green-600">Save {disc}%</span>}
          </div>
          {product.isPrime && <span className="badge-prime mr-2">⚡ Prime</span>}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={handleAddToCart} className="btn-primary py-2 px-4 text-xs">
            <ShoppingCart size={14} /> Add
          </button>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-xl border transition-all ${isWishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 text-gray-400"}`}
          >
            <Heart size={16} className={isWishlisted ? "fill-red-400" : ""} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product._id}`} className="product-card group block bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/60 hover:-translate-y-1 transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <Image
          src={product.images?.[0] || ""}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {disc > 0 && <div className="badge-sale">{disc}% OFF</div>}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="text-xs font-bold px-2 py-0.5 bg-orange-500 text-white rounded-lg">Only {product.stock} left</div>
          )}
        </div>

        {product.isPrime && (
          <div className="absolute top-3 right-3 badge-prime">
            <Zap size={10} /> Prime
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/10 transition-all duration-300" />

        {/* Action buttons (appear on hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-navy-950 text-white text-xs font-bold rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
          >
            <ShoppingCart size={13} /> Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transition-all ${
              isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart size={15} className={isWishlisted ? "fill-white" : ""} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); router.push(`/products/${product._id}`); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:bg-navy-50 hover:text-navy-700 shadow-lg transition-all"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-bold text-navy-600 dark:text-brand-400 mb-1 uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2.5 leading-snug">{product.title}</p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.numReviews?.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
          {disc > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="text-xs font-bold text-green-600">-{disc}%</span>
            </>
          )}
        </div>

        {product.stock <= 10 && product.stock > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-orange-600 font-semibold">Selling fast!</span>
              <span className="text-gray-400">{product.stock} left</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                style={{ width: `${Math.max(10, (product.stock / 50) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
