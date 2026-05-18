"use client";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectWishlist } from "@/store/wishlistSlice";
import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = any;

export default function WishlistPage() {
  const wishlistIds = useAppSelector(selectWishlist);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wishlistIds.length === 0) { setProducts([]); return; }
    setLoading(true);
    // Fetch all products that are wishlisted
    Promise.all(
      wishlistIds.map((id) =>
        fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => d.product)
      )
    )
      .then((ps) => setProducts(ps.filter(Boolean)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  return (
    <div className="section py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart size={24} className="text-red-500" /> Wishlist
        {wishlistIds.length > 0 && (
          <span className="text-sm font-normal text-gray-500">({wishlistIds.length} items)</span>
        )}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-8 w-full rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlistIds.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love and buy them later</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
