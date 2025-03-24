'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleUpload = async () => {
    const finalGenre = customGenre || genre;

    if (!file || !title || !price || !finalGenre) {
      alert('Please fill out all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('genre', finalGenre);
    formData.append('file', file);
    if (image) formData.append('image', image);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Track uploaded successfully!');
      setTitle('');
      setPrice('');
      setGenre('');
      setCustomGenre('');
      setFile(null);
      setImage(null);
    } else {
      alert('Upload failed.');
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

        {/* Genre Dropdown */}
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

        {/* Track File Input */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">Track File</label>
          <label className="cursor-pointer inline-block bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700 transition text-sm">
            Choose File
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {file && <p className="text-xs text-zinc-600 mt-1">{file.name}</p>}
        </div>

        {/* Cover Image Input */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">Cover Image (optional)</label>
          <label className="cursor-pointer inline-block bg-zinc-200 text-zinc-800 px-4 py-2 rounded hover:bg-zinc-300 transition text-sm">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {image && <p className="text-xs text-zinc-600 mt-1">{image.name}</p>}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
