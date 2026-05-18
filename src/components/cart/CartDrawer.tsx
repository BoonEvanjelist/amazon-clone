"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartOpen,
  closeCart,
  removeItem,
  updateQuantity,
} from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectCartOpen);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeCart());
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);

  const shipping = total >= 499 ? 0 : 49;
  const tax = Math.round(total * 0.18);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-navy-800 dark:text-brand-400" />
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-navy-800 dark:bg-brand-400 dark:text-navy-950 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShoppingBag size={36} className="text-gray-300 dark:text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
              </div>
              <button onClick={() => dispatch(closeCart())} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3">
                <Link
                  href={`/products/${item.id}`}
                  onClick={() => dispatch(closeCart())}
                  className="shrink-0"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.id}`}
                    onClick={() => dispatch(closeCart())}
                    className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-navy-700 dark:hover:text-brand-400 line-clamp-2 leading-tight"
                  >
                    {item.title}
                  </Link>
                  <p className="text-base font-bold text-navy-900 dark:text-white mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity + Delete */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-0.5">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center disabled:opacity-40 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center disabled:opacity-40 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="w-8 h-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-5 space-y-4 bg-white dark:bg-gray-900">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span>
                <span>{formatPrice(total + shipping + tax)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-gray-500 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 rounded-xl px-3 py-2">
                Add {formatPrice(499 - total)} more for <span className="font-semibold text-amber-700 dark:text-amber-400">FREE shipping</span>
              </p>
            )}

            <Link
              href="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary w-full group"
            >
              Proceed to Checkout
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/cart"
              onClick={() => dispatch(closeCart())}
              className="btn-ghost w-full text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
