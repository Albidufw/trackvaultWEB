"use client";

import { useEffect, useState } from "react";

type Purchase = {
  id: number;
  amount: number | string;
  createdAt: string;
  track: {
    title: string;
  };
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/purchases");
        const data = await res.json();

        if (Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
        } else {
          console.warn("Invalid purchases data", data.purchases);
          setPurchases([]);
        }
      } catch (err) {
        console.error("Failed to fetch purchases", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Purchases</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading purchases...</p>
      ) : purchases.length === 0 ? (
        <p className="text-center text-gray-400">No purchases found.</p>
      ) : (
        <ul className="space-y-4">
          {purchases.map((purchase) => (
            <li
              key={purchase.id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
            >
              <strong>{purchase.track.title}</strong> – $
              {Number(purchase.amount).toFixed(2)} <br />
              <small className="text-zinc-400">
                Purchased on{" "}
                {new Date(purchase.createdAt).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
