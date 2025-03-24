"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  fileUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (track: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const addToCart = (track: CartItem) => {
    setCart((prev) => [...prev, { ...track, price: Number(track.price) }]);
    setSidebarOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isSidebarOpen, toggleSidebar }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
