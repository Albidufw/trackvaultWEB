'use client';

import { useEffect, useState } from 'react';
import { Search, Music } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Track {
  id: number;
  title: string;
  fileUrl: string;
  price: number;
  imageUrl?: string;
  genre?: string;
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filtered, setFiltered] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [showLimitMsg, setShowLimitMsg] = useState<{ [key: number]: boolean }>({});

  const { addToCart } = useCart();

  const handleAddToCart = (track: Track) => {
    addToCart(track);
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/tracks');
        const data = await res.json();
        setTracks(data.tracks);
        setFiltered(data.tracks);
      } catch (err) {
        console.error('Failed to fetch tracks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    let filteredTracks = tracks;

    if (search) {
      const q = search.toLowerCase();
      filteredTracks = filteredTracks.filter((t) =>
        t.title.toLowerCase().includes(q)
      );
    }

    if (genre) {
      filteredTracks = filteredTracks.filter((t) => t.genre === genre);
    }

    setFiltered(filteredTracks);
  }, [search, genre, tracks]);

  const uniqueGenres = Array.from(new Set(tracks.map((t) => t.genre).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-100 p-6 border-r border-zinc-200">
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracks..."
            className="w-full border border-zinc-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400" />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Genres</h3>
          <select
            onChange={(e) => setGenre(e.target.value || null)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Genres</option>
            {uniqueGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Music className="text-zinc-800" /> TrackVault Store
        </h1>

        {loading ? (
          <p className="text-zinc-400">Loading tracks...</p>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-400">No tracks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((track) => (
              <div
                key={track.id}
                className="relative h-96 w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
              >
                {/* Background image */}
                <img
                  src={track.imageUrl || '/default-track.jpg'}
                  alt={track.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

                {/* Foreground Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                  <div>
                    <h3 className="text-lg font-bold truncate">{track.title}</h3>
                    <p className="text-sm text-gray-200 mb-1">${Number(track.price).toFixed(2)}</p>
                    {track.genre && (
                      <span className="inline-block bg-white/20 text-xs px-2 py-1 rounded">
                        {track.genre}
                      </span>
                    )}
                  </div>

                  <div>
                    <audio
                      controls
                      controlsList="nodownload noplaybackrate"
                      src={track.fileUrl}
                      className="w-full mb-2 bg-white/10 rounded"
                      onLoadedMetadata={(e) => {
                        const audio = e.currentTarget;
                        const previewLimit = 30;
                        let interval: NodeJS.Timeout;

                        audio.onplay = () => {
                          interval = setInterval(() => {
                            if (audio.currentTime >= previewLimit) {
                              audio.pause();
                              clearInterval(interval);
                              setShowLimitMsg((prev) => ({
                                ...prev,
                                [track.id]: true,
                              }));
                            }
                          }, 1000);
                        };

                        audio.onpause = () => clearInterval(interval);
                        audio.onended = () => clearInterval(interval);
                      }}
                    />
                    {showLimitMsg[track.id] && (
                      <p className="text-xs text-red-300 mb-2">
                        Login & purchase to hear the full track!
                      </p>
                    )}
                    <button
                      onClick={() => handleAddToCart(track)}
                      className="bg-white text-black w-full py-2 rounded hover:bg-gray-200 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
