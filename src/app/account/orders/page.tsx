"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectToken } from "@/store/authSlice";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Order = any;

const STATUS_CONFIG = {
  processing: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-blue-600 bg-blue-50", label: "Shipped" },
  out_for_delivery: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

export default function OrdersPage() {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="section py-24 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign in to view your orders</h1>
        <Link href="/auth/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="section py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package size={24} /> Your Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="skeleton h-5 w-48 rounded mb-4" />
              <div className="flex gap-4">
                <div className="skeleton w-20 h-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => {
            const statusConfig = STATUS_CONFIG[order.deliveryStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.processing;
            const StatusIcon = statusConfig.icon;

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">ORDER PLACED</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">TOTAL</p>
                      <p className="font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">SHIP TO</p>
                      <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  <div className="text-xs">
                    <p className="text-gray-400">ORDER ID</p>
                    <p className="font-mono text-gray-600">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-3">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                      <StatusIcon size={13} /> {statusConfig.label}
                    </span>
                    {order.isPaid && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={13} /> Paid
                      </span>
                    )}
                  </div>

                  {order.items.map((item: Order["items"][0], idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <Link
                        href={`/products/${item.product}`}
                        className="text-xs text-blue-600 hover:underline whitespace-nowrap flex items-center gap-1"
                      >
                        Buy again <ChevronRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
