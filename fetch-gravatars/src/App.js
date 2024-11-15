import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import JSZip from 'jszip';

function App() {
  // State variables for each input
  const [email, setEmail] = useState('');
  const [grav_size, setNumber] = useState('');
  const [images, setImages] = useState([]); // State for images
  const [images_names, setImagesNames] = useState([]); // State for the name of the images
  const [selectedOptions, setSelectedOptions] = useState([]); // State to track selected options

  // Generator options
  const generators = ["identicon", "monsterid", "wavatar", "retro", "robohash"];

  // Modify email addresses to make them suitable as filenames
  function sanitizeEmailForFileName(email) {
    if (!email) return "untitled";
  
    // Remove or replace invalid characters for file names
    return email
      .toLowerCase() // Convert to lowercase for consistency
      .replace(/[^a-z0-9@.]/g, "_") // Replace invalid characters with underscores
      .replace(/@/g, "_at_") // Replace '@' with '_at_' for readability
      .replace(/\./g, "_dot_"); // Replace '.' with '_dot_' for readability
  }

  // Generate Gravatar URLs based on email and size
  const generateGravatarURL = () => {
    if (!email || !grav_size) return;

    // Use MD5 hash for Gravatar URLs (for simplicity, using a fixed example hash)
    const hash = CryptoJS.SHA256( email );
    const size = grav_size || 100;
    
    selectedOptions.forEach(function (gen, index) {
      const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${gen}`;
      const imgname = `${sanitizeEmailForFileName(email)}_${gen}`;

      setImages((prevImages) => [...prevImages, url]); // Add new URL to the images list
      setImagesNames((prevImagesNames) => [...prevImagesNames, imgname]); // Add new image name to the list
    });
  };

  // Clear all images
  const clearImages = () => {
    setImages([]);
    setImagesNames([]);
  };
  
  // Save images to a ZIP file
  const saveImages = async () => {
    if (images.length === 0) {
      alert("No images to save!");
      return;
    }

    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]); // Fetch the image
      const blob = await response.blob(); // Convert response to Blob
      zip.file(`${images_names[i]}.jpg`, blob); // Add image to the ZIP
    }

    const content = await zip.generateAsync({ type: "blob" }); // Generate ZIP file
    const url = URL.createObjectURL(content);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeEmailForFileName(email)}_gravatars.zip`; // File name for the ZIP
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up memory
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        // If the option is already selected, remove it
        const updated = prevSelected.filter((item) => item !== option);
        return updated.length > 0 ? updated : prevSelected; // Ensure at least one remains
      } else {
        // Otherwise, add the option
        return [...prevSelected, option];
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 max-w-md mx-auto mt-10 bg-gray-100">
      <div className="text-center bg-blue-500 text-white p-6">
        <h1 className="text-4xl font-bold">Preview Gravatars!</h1>
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

      {/* Render the checkboxes */}
      <div className="space-y-2">
        <h4 className="text-2xl font-semibold">Select generators</h4>
        {generators.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-400"
            />
            <label htmlFor={option} className="ml-2 text-gray-700">
              {option}
            </label>
          </div>
        ))}
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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={saveImages}
        >
          Save Images
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
