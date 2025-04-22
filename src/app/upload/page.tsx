'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { uploadFiles } from '@/utils/uploadthingClient';

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const finalGenre = customGenre || genre;
  const isValid = title && price && finalGenre && audioFile;

  const handleSubmit = async () => {
    if (!isValid) {
      return alert('Please fill in all fields.');
    }

    setUploading(true);

    try {
      const input = {
        title,
        price: parseFloat(price),
        genre: finalGenre,
      };

      // Upload audio — creates track in DB
      const audioRes = await uploadFiles('audioUploader', {
        files: [audioFile!],
        input,
      });

      const audioUrl = audioRes?.[0]?.ufsUrl ?? audioRes?.[0]?.url;
      if (!audioUrl) throw new Error('Audio upload failed');

      // Upload image — updates existing track
      if (imageFile) {
        const imageRes = await uploadFiles('imageUploader', {
          files: [imageFile],
          input,
        });

        const imageUrl = imageRes?.[0]?.ufsUrl ?? imageRes?.[0]?.url;
        if (!imageUrl) throw new Error('Image upload failed');
      }

      router.push('/store');
    } catch (err) {
      console.error('[UPLOAD_PAGE] Upload error:', err);
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

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Album Cover (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border border-zinc-300 rounded px-3 py-2 text-sm text-black"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || uploading}
          className={`w-full text-white py-2 rounded text-sm font-medium transition ${
            !isValid || uploading
              ? 'bg-zinc-500 cursor-not-allowed'
              : 'bg-black hover:bg-zinc-800'
          }`}
        >
          {uploading ? 'Saving...' : 'Save Track'}
        </button>
      </div>
    </div>
  );
}
