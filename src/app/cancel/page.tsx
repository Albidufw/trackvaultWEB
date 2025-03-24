// src/app/cancel/page.tsx
export default function CancelPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 px-4">
        <h1 className="text-3xl font-bold mb-4">❌ Payment Canceled</h1>
        <p className="text-lg text-zinc-600 mb-8">
          Your checkout was canceled. You can always try again.
        </p>
        <a
          href="/tracks"
          className="px-6 py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
        >
          Back to Store
        </a>
      </div>
    );
  }
  