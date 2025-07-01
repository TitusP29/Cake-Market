import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const [cakes, setCakes] = useState([]);
  const [bgColor, setBgColor] = useState("bg-white");
  const [filter, setFilter] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const storedCakes = JSON.parse(localStorage.getItem("cakes")) || [];
    const color = localStorage.getItem("cakeColor") || "bg-white";
    setCakes(storedCakes);
    setBgColor(color);
  }, []);

  const filteredCakes = cakes.filter(cake => cake.name.toLowerCase().includes(filter.toLowerCase()));

  const handleDownload = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Mock cake businesses data
  // Load real owner profile from localStorage if present
  const realOwner = JSON.parse(localStorage.getItem("ownerProfile"));
  const businesses = realOwner && realOwner.businessName
    ? [{
        name: realOwner.businessName,
        location: realOwner.location,
        owner: realOwner.ownerName,
        profile: realOwner.description,
        logo: realOwner.logo
      }]
    : [
        { name: "Sweet Treats Bakery", location: "Cape Town", owner: "Alice Smith", profile: "Alice is a master baker with 10 years of experience.", logo: null },
        { name: "Cake Heaven", location: "Johannesburg", owner: "Bob Johnson", profile: "Bob specializes in wedding cakes and custom designs.", logo: null },
        { name: "Pastry Palace", location: "Durban", owner: "Carol Lee", profile: "Carol brings French pastry expertise to Durban.", logo: null },
      ];

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showCakes, setShowCakes] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-700">Welcome to the Cake Store</h1>
        <button onClick={handleLogout} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Logout</button>
      </div>

      {/* Business selection flow */}
      {!selectedBusiness && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-pink-600">Cake Businesses</h2>
          <p className="mb-6">Number of businesses: <span className="font-semibold">{businesses.length}</span></p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                {b.logo ? (
                  <img src={b.logo} alt="Logo" className="w-20 h-20 object-cover rounded-full mb-3 border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 border">
                    <span className="text-3xl text-gray-400">🏢</span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-pink-700 mb-2">{b.name}</h3>
                <p className="mb-1"><span className="font-semibold">Location:</span> {b.location}</p>
                <p className="mb-2"><span className="font-semibold">Owner:</span> {b.owner}</p>
                <button
                  className="mt-auto bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                  onClick={() => setSelectedBusiness(b)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBusiness && !showCakes && (
        <div className="mb-8 bg-white rounded-xl shadow p-4 max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2 text-pink-600">Business Owner Profile</h2>
          {selectedBusiness.logo ? (
            <img src={selectedBusiness.logo} alt="Logo" className="w-24 h-24 object-cover rounded-full mb-3 border mx-auto" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 border mx-auto">
              <span className="text-4xl text-gray-400">🏢</span>
            </div>
          )}
          <p><span className="font-semibold">Business Name:</span> {selectedBusiness.name}</p>
          <p><span className="font-semibold">Location:</span> {selectedBusiness.location}</p>
          <p><span className="font-semibold">Owner:</span> {selectedBusiness.owner}</p>
          <p className="mb-4"><span className="font-semibold">Profile:</span> {selectedBusiness.profile}</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setShowCakes(true)}>
            Proceed to Cakes
          </button>
          <button className="ml-4 text-gray-500 underline" onClick={() => setSelectedBusiness(null)}>
            Back to Businesses
          </button>
        </div>
      )}

      {selectedBusiness && showCakes && (
        <div>
          <div className="mb-6">
            <button className="text-gray-500 underline mb-2" onClick={() => setShowCakes(false)}>
              &larr; Back to Owner Profile
            </button>
            <h2 className="text-xl font-bold mb-2 text-pink-600">Cakes from {selectedBusiness.name}</h2>
          </div>

          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search cakes by name..."
            className="mb-6 p-2 border rounded w-full max-w-md"
          />
          {previewImage && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-lg max-w-2xl w-full flex flex-col items-center">
                <img src={previewImage} alt="Cake preview" className="max-h-[70vh] w-auto mb-4" />
                <button onClick={() => setPreviewImage(null)} className="bg-pink-500 text-white px-4 py-2 rounded">Close</button>
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCakes.map((cake, idx) => {
              // Cake rating logic
              const ratings = JSON.parse(localStorage.getItem("cakeRatings") || "{}")
              const cakeIndex = cakes.findIndex(c => c.name === cake.name && c.price === cake.price);
              const rating = ratings[cakeIndex] || 0;
              const setRating = (newRating) => {
                const updated = { ...ratings, [cakeIndex]: newRating };
                localStorage.setItem("cakeRatings", JSON.stringify(updated));
                // force re-render
                setForceUpdate(f => f + 1);
              };
              return (
                <div
                  key={idx}
                  className={`${bgColor} p-4 rounded-xl shadow`}
                >
                  {cake.image && (
                    <>
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-40 object-contain mb-2 rounded bg-white cursor-pointer hover:shadow-lg"
                        onClick={() => setPreviewImage(cake.image)}
                        title="Click to enlarge"
                      />
                      <button
                        className="bg-purple-500 text-white px-2 py-1 rounded mb-2 mr-2"
                        onClick={() => handleDownload(cake.image, `${cake.name}-cake.jpg`)}
                      >
                        Download Image
                      </button>
                    </>
                  )}
                  {cake.video && (
                    <>
                      <video controls className="w-full h-40 object-contain mb-2 rounded bg-white">
                        <source src={cake.video} />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
                        onClick={() => handleDownload(cake.video, `${cake.name}-cake-video.mp4`)}
                      >
                        Download Video
                      </button>
                    </>
                  )}
                  <h3 className="text-lg font-bold">{cake.name}</h3>
                  <p className="text-gray-700">{cake.description}</p>
                  <p className="text-pink-600 font-semibold mt-2">R{cake.price}</p>
                  {/* Rating system */}
                  <div className="flex items-center mt-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <span className={star <= rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}>
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{rating > 0 ? `You rated this ${rating}/5` : "Not rated yet"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

