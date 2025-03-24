"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-white px-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/retrodisc.jpg')` }}
    >
      {/* Optional dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Main content */}
      <div className="max-w-xl text-center space-y-6 relative z-10">
        <h1 className="text-5xl font-bold tracking-tight font-mono text-green-400 drop-shadow-lg">
          Welcome to <span className="text-white">TrackVault</span>
        </h1>

        <p className="text-zinc-300 text-lg font-mono">
          Upload. Share. Own the sound.
        </p>

        <Link
          href="/tracks"
          className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-md transition-all duration-200 shadow-md font-mono"
        >
          Browse Tracks →
        </Link>

        <p className="text-zinc-500 text-xs font-mono mt-4">
          Your world for beats, loops & audio
        </p>
      </div>
    </main>
  );
}
