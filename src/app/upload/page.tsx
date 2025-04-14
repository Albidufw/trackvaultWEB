'use client';

import { useState } from 'react';
import { UploadButton } from "@/app/api/uploadthing/core";
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter();

  const finalGenre = customGenre || genre;

  const isValid = title && price && finalGenre;

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

        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">Upload Track & Cover</label>

          <UploadButton
            endpoint="trackUploader"
            onClientUploadComplete={(res) => {
              console.log('Upload complete!', res);
              setUploadComplete(true);
              setTitle('');
              setPrice('');
              setGenre('');
              setCustomGenre('');
              router.push('/tracks');
            }}
            onUploadError={(error: Error) => {
              console.error('Upload error:', error);
              alert('Upload failed!');
            }}
            appearance={{
              button:
                'bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition text-sm',
              container: 'w-full mt-2',
            }}
          />
        </div>

        {uploadComplete && (
          <p className="text-green-600 text-sm text-center">
            Your track has been uploaded!
          </p>
        )}
      </div>
    </div>
  );
}
