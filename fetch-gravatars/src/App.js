import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function App() {
  // State variables for each input
  const [email, setEmail] = useState('');
  const [grav_size, setNumber] = useState('');
  const [images, setImages] = useState([]); // State for images

  // Generator options
  const generators = ["identicon", "monsterid", "wavatar", "retro", "robohash"];

  // Generate Gravatar URLs based on email and size
  const generateGravatarURL = () => {
    if (!email || !grav_size) return;

    // Use MD5 hash for Gravatar URLs (for simplicity, using a fixed example hash)
    const hash = CryptoJS.SHA256( email );
    const size = grav_size || 100;
    
    generators.forEach(function (gen, index) {
      const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${gen}`;
      setImages((prevImages) => [...prevImages, url]); // Add new URL to the images list
    });
  };

  // Clear all images
  const clearImages = () => {
    setImages([]);
  };
  

  return (
    <div className="flex flex-col items-center space-y-4 p-4 max-w-md mx-auto mt-10">
      <div className="text-center bg-blue-500 text-white p-6">
        <h1 className="text-4xl font-bold">Preview my Gravatars!</h1>
      </div>

      <h2 className="text-2xl font-semibold">Enter your details</h2>

      {/* Email Input */}
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      {/* Integer Input */}
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Gravatar size
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={grav_size}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter size"
        />
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={generateGravatarURL}
        >
          Fetch Gravatar(s)
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={clearImages}
        >
          Clear Previews
        </button>
      </div>

      {/* Image Preview Section */}
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold">Gravatar Previews</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Gravatar ${index + 1}`}
              className="w-24 h-24 rounded-full border"
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
