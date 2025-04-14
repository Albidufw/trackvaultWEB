'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UploadButton } from '@/utils/uploadthingClient';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const finalGenre = customGenre || genre;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const isValid = title && price && finalGenre && audioUrl;

  const handleSubmit = async () => {
    if (!isValid) {
      alert('Please fill in all required fields.');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: numericPrice,
          genre: finalGenre,
          fileUrl: audioUrl,
          imageUrl: imageUrl || '/default-track.jpg',
        }),
      });

      const data = await res.json();
      console.log('Track saved response:', data);

      if (!res.ok) {
        alert(`Failed to save track: ${data?.error || 'Unknown error'}`);
      } else {
        router.push('/store');
      }
    } catch (err) {
      console.error('Track upload error:', err);
      alert('Something went wrong during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h1 className="text-xl font-semibold mb-4">Please log in to upload a track.</h1>
          <p className="text-zinc-600">You must be signed in to upload music to the store.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Upload a Track</h1>

        <input
          type="text"
          placeholder="Track Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-zinc-300 rounded px-4 py-2 text-sm text-black"
        />

        <input
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-zinc-300 rounded px-4 py-2 text-sm text-black"
        />

        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm mb-2 text-black"
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
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm text-black"
          />
        </div>

        {/* Upload Audio */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Upload Track File (Audio)
          </label>
          <UploadButton
            endpoint="audioUploader"
            input={{ title, price: numericPrice, genre: finalGenre }}
            onClientUploadComplete={(res) => {
              console.log('Audio uploaded:', res);
              const url = res?.[0]?.ufsUrl;
              if (!url) return alert('Audio upload failed: no URL returned');
              setAudioUrl(url);
            }}
            onUploadError={(err) => {
              console.error('Audio upload error:', err);
              alert('Audio upload failed.');
            }}
            appearance={{
              button: 'bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition text-sm',
              container: 'w-full mt-2 text-black',
            }}
          />
        </div>

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Upload Album Cover (Image)
          </label>
          <UploadButton
            endpoint="imageUploader"
            input={{ title, price: numericPrice, genre: finalGenre }}
            onClientUploadComplete={(res) => {
              console.log('Image uploaded:', res);
              const url = res?.[0]?.ufsUrl;
              if (!url) return alert('Image upload failed: no URL returned');
              setImageUrl(url);
            }}
            onUploadError={(err) => {
              console.error('Image upload error:', err);
              alert('Image upload failed.');
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
          className={`w-full text-white py-2 rounded text-sm font-medium transition ${
            !isValid || uploading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Saving...' : 'Save Track'}
        </button>
      </div>
    </div>
  );
}
