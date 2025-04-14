'use client';

import { useState } from 'react';
import { UploadButton } from '@/utils/uploadthingClient';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const finalGenre = customGenre || genre;
  const isValid = title && price && finalGenre && audioUrl;

  const handleSubmit = async () => {
    if (!isValid) return alert('Missing fields');

    setUploading(true);

    const res = await fetch('/api/tracks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        price: parseFloat(price),
        genre: finalGenre,
        fileUrl: audioUrl,
        imageUrl: imageUrl || '/default-track.jpg',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setUploading(false);

    if (res.ok) {
      router.push('/tracks');
    } else {
      alert('Failed to save track.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Upload a Track</h1>

        <input
          type="text"
          placeholder="Track Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-zinc-300 rounded px-4 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-zinc-300 rounded px-4 py-2 text-sm"
        />

        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm mb-2"
          >
            <option value="">-- Choose genre --</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="ambient">Ambient</option>
            <option value="electronic">Electronic</option>
            <option value="hip-hop">Hip-hop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="experimental">Experimental</option>
          </select>

          <input
            type="text"
            placeholder="Or enter custom genre"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Upload track */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Upload Track File (Audio)</label>
          <UploadButton
            endpoint="audioUploader"
            input={{ title, price: Number(price), genre: finalGenre }}
            onClientUploadComplete={(res) => {
              console.log("Audio uploaded", res);
              if (res && res.length > 0) {
                setAudioUrl(res[0].url);
              }
            }}
            onUploadError={(err) => {
              console.error("Audio upload error:", err);
            }}
            appearance={{
              button: 'bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition text-sm',
              container: 'w-full mt-2 text-black',
            }}
          />
        </div>

        {/* Upload image */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Upload Album Cover (Image)</label>
          <UploadButton
            endpoint="imageUploader"
            input={{ title, price: Number(price), genre: finalGenre }}
            onClientUploadComplete={(res) => {
              console.log("Image uploaded", res);
              if (res && res.length > 0) {
                setImageUrl(res[0].url);
              }
            }}
            onUploadError={(err) => {
              console.error("Image upload error:", err);
            }}
            appearance={{
              button: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm',
              container: 'w-full mt-2 text-black',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
        >
          {uploading ? 'Saving...' : 'Save Track'}
        </button>
      </div>
    </div>
  );
}
