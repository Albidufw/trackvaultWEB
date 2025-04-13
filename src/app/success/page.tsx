'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 px-4">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-lg text-zinc-600 mb-8">
        Thank you for your purchase! Your track is now available in your account.
      </p>
      <Link
        href="/account"
        className="px-6 py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
      >
        Go to My Account
      </Link>
    </div>
  );
}
