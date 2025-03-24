"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            trackId: item.id,
            title: item.title,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to redirect to checkout.");
        console.error("Stripe response error:", data);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-white text-zinc-900">
      <h1 className="text-3xl font-bold mb-8">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-zinc-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border border-zinc-200 rounded-lg p-4 shadow-sm"
            >
              <img
                src={item.imageUrl || "/default-track.jpg"}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-zinc-500">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6 space-y-2">
            <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={clearCart}
                className="text-sm text-zinc-500 hover:underline"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-black text-white px-6 py-2 rounded hover:bg-zinc-800 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Redirecting..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
