"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartTotal, clearCart } from "@/store/cartSlice";
import { selectUser, selectToken } from "@/store/authSlice";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STEPS = ["Shipping", "Payment", "Review"];

interface ShippingForm {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

const INDIA_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Goa", "Gujarat",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);

  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "Maharashtra",
    zip: "",
    country: "India",
    phone: "",
  });

  const shippingCost = total >= 499 ? 0 : 49;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shippingCost + tax;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center section py-24 text-center">
        <div>
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h1>
          <p className="text-gray-500 mb-6">Please sign in to complete your purchase</p>
          <Link href="/auth/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center section py-24 text-center">
        <div>
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some items before checking out</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center section py-24 text-center">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-2">
            Thank you for shopping with ShopSphere.
          </p>
          {orderId && (
            <p className="text-sm text-gray-400 mb-8">
              Order ID: <span className="font-mono font-semibold text-gray-700">{orderId}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link href="/account/orders" className="btn-primary">View Orders</Link>
            <Link href="/" className="btn-ghost">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.street || !shipping.city || !shipping.zip || !shipping.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // For demo: skip real Stripe payment, just create order directly
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.id,
            title: i.title,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice: total,
          shippingPrice: shippingCost,
          taxPrice: tax,
          totalPrice: grandTotal,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      dispatch(clearCart());
      setOrderId(orderData.order._id);
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section py-8 pb-16">
      {/* Back */}
      <button
        onClick={() => step > 0 ? setStep(step - 1) : router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {step > 0 ? "Back" : "Back to Cart"}
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < step
                ? "bg-green-500 text-white"
                : i === step
                ? "bg-navy-800 text-white"
                : "bg-gray-100 text-gray-400"
            }`}>
              {i < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px w-12 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">

          {/* STEP 0: Shipping */}
          {step === 0 && (
            <form onSubmit={handleShippingSubmit}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Truck size={20} className="text-navy-700" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                    <input
                      className="input"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address *</label>
                    <input
                      className="input"
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      placeholder="House no., Building, Street, Area"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                    <input
                      className="input"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                    <select
                      className="input"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    >
                      {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code *</label>
                    <input
                      className="input"
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                      pattern="[0-9]{6}"
                      placeholder="6-digit PIN"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                    <input
                      className="input"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-4">
                Continue to Payment
              </button>
            </form>
          )}

          {/* STEP 1: Payment */}
          {step === 1 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-navy-700" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Rupay" },
                    { id: "upi", label: "UPI", icon: "📱", desc: "GPay, PhonePe, Paytm" },
                    { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when delivered" },
                  ].map(({ id, label, icon, desc }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === id
                          ? "border-navy-700 bg-navy-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id as "card" | "upi" | "cod")}
                        className="accent-navy-700"
                      />
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Card fields (demo) */}
                {paymentMethod === "card" && (
                  <div className="mt-5 space-y-3 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">Card details (demo — no real charge)</p>
                    <input className="input" placeholder="Card Number: 4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input" placeholder="MM/YY" />
                      <input className="input" placeholder="CVV" />
                    </div>
                    <input className="input" placeholder="Cardholder Name" />
                  </div>
                )}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full py-4">
                Review Order
              </button>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Review</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">Delivering to:</p>
                  <p className="text-gray-600">{shipping.fullName}</p>
                  <p className="text-gray-600">{shipping.street}, {shipping.city}</p>
                  <p className="text-gray-600">{shipping.state} - {shipping.zip}</p>
                  <p className="text-gray-600">📞 {shipping.phone}</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-4 text-base"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <><Shield size={18} /> Place Order — {formatPrice(grandTotal)}</>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          )}
        </div>

        {/* Right: Order Summary (sticky) */}
        <aside>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>

            {/* Items preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide mb-5 pb-3 border-b border-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-black text-base text-gray-900 pt-3 border-t border-gray-100">
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield size={14} className="text-green-500" /> 100% Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck size={14} className="text-blue-500" /> Estimated delivery: 2-5 days
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
