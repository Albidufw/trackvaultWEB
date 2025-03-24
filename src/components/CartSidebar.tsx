"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar() {
  const { cart, isSidebarOpen, toggleSidebar, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2);

  return (
    <>
      {/* Lightened Dimmed Background */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[22rem] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-zinc-900">🛒 Your Cart</h2>
          <button
            onClick={toggleSidebar}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            Close
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-sm text-zinc-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start mb-4 border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm text-zinc-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-zinc-700">Total:</span>
            <span className="text-sm font-bold text-zinc-900">${total}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleSidebar}
              className="flex-1 bg-zinc-200 text-zinc-800 py-2 rounded hover:bg-zinc-300 transition text-sm"
            >
              Continue Shopping
            </button>
            <Link
              href="/cart"
              className="flex-1 bg-black text-white py-2 rounded text-center hover:bg-zinc-800 transition text-sm"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
