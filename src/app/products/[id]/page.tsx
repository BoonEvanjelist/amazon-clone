"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, Zap, Minus, Plus, ShoppingCart, Heart, Share2, ChevronRight, Truck, Shield, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, openCart } from "@/store/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/wishlistSlice";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = any;

function StarRating({ rating, numReviews, size = 16 }: { rating: number; numReviews: number; size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.floor(rating)
                ? "fill-brand-400 text-brand-400"
                : star - 0.5 <= rating
                ? "fill-brand-400/50 text-brand-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-brand-600 text-sm font-medium hover:underline cursor-pointer">
        {numReviews.toLocaleString()} ratings
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(id));

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch {
        toast.error("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    dispatch(addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity,
      stock: product.stock,
      slug: product.slug,
    }));
    dispatch(openCart());
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart!`, { icon: "🛒" });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="section py-24 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500 mt-2 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <div className="section py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-navy-700">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-navy-700">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-navy-700">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main image with zoom */}
          <div
            className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square cursor-zoom-in"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                zoomed ? "scale-125" : "scale-100"
              )}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-xl">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                    i === selectedImage
                      ? "border-navy-700 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-blue-600">{product.brand}</span>
              {product.isPrime && (
                <span className="badge-prime"><Zap size={10} /> Prime</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <StarRating rating={product.rating} numReviews={product.numReviews} size={18} />

          {/* Price */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                    <span className="text-green-600 font-bold text-sm">Save {formatPrice(product.originalPrice - product.price)}</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on orders above ₹499.</p>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-3 text-sm">
            <Truck size={16} className="text-green-600 shrink-0" />
            <span>
              <span className="font-semibold text-green-700">FREE delivery</span>
              {product.isPrime && " with Prime"}
              {" "}by <span className="font-semibold">Tomorrow</span>
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock === 0 ? (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            ) : product.stock < 10 ? (
              <span className="text-orange-600 font-semibold">
                Only {product.stock} left in stock — order soon
              </span>
            ) : (
              <span className="text-green-600 font-semibold">In Stock</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About this item</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Buy Box — sticky */}
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4 sticky top-24">
            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full py-4 text-base disabled:opacity-50"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-secondary w-full py-4 text-base disabled:opacity-50"
            >
              Buy Now
            </button>

            {/* Secondary actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  dispatch(toggleWishlist(product._id));
                  toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  isWishlisted
                    ? "border-red-200 text-red-600 bg-red-50"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <Heart size={16} className={isWishlisted ? "fill-red-500" : ""} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all"
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Trust signals */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield size={13} className="text-green-500" /> Secure transaction
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw size={13} className="text-blue-500" /> 30-day easy returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="mt-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {product.reviews.slice(0, 5).map((review: any, i: number) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                    <StarRating rating={review.rating} numReviews={0} size={12} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
