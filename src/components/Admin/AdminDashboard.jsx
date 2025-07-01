import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });
  const userKey = user ? user.username : "guest";

  const [cakes, setCakes] = useState([]);
  const [bgColor, setBgColor] = useState("bg-white");
  const [form, setForm] = useState({ name: "", price: "", description: "", image: null, video: null });

  useEffect(() => {
    // Load cakes for this user
    const storedCakes = JSON.parse(localStorage.getItem(`cakes_${userKey}`)) || [];
    const color = localStorage.getItem("cakeColor") || "bg-white";
    setCakes(storedCakes);
    setBgColor(color);
  }, [userKey]);

  const handleAddCake = () => {
  if (!form.name || !form.price) return;
  const newCakes = [...cakes, { ...form }];
  setCakes(newCakes);
  localStorage.setItem(`cakes_${userKey}`, JSON.stringify(newCakes));
  setForm({ name: "", price: "", description: "", image: null, video: null });
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, video: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setBgColor(selectedColor);
    localStorage.setItem("cakeColor", selectedColor);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Owner profile state
  // (user and userKey already declared at the top)

  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem(`ownerProfile_${userKey}`)) || {
      businessName: "",
      location: "",
      ownerName: "",
      description: "",
      logo: null
    };
  });
  const [editingProfile, setEditingProfile] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
  localStorage.setItem(`ownerProfile_${userKey}`, JSON.stringify(profile));
  setEditingProfile(false);
};

  // Calculate most popular cake(s)
  const ratings = JSON.parse(localStorage.getItem("cakeRatings") || "{}");
  let maxRating = 0;
  let popularCakes = [];
  cakes.forEach((cake, idx) => {
    const rating = ratings[idx] || 0;
    if (rating > maxRating) {
      maxRating = rating;
      popularCakes = [{ ...cake, rating }];
    } else if (rating === maxRating && rating > 0) {
      popularCakes.push({ ...cake, rating });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-pink-700 tracking-tight">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Logout</button>
      </div>

      {/* SECTION: Most Popular Cakes */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700 flex items-center">Most Popular Cake{popularCakes.length > 1 ? 's' : ''} <span className="ml-2">⭐</span></h2>
        {popularCakes.length > 0 ? (
          <div className="bg-yellow-50 rounded-xl shadow p-6 max-w-3xl mx-auto border border-yellow-200 flex flex-wrap gap-8 justify-center">
            {popularCakes.map((cake, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {cake.image && <img src={cake.image} alt={cake.name} className="w-24 h-24 object-contain rounded mb-2 bg-white border" />}
                <span className="font-bold text-lg text-pink-700">{cake.name}</span>
                <div className="flex items-center mt-1">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={star <= cake.rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</span>
                  ))}
                  <span className="ml-2 text-sm text-gray-700">{cake.rating}/5</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl shadow p-6 max-w-2xl mx-auto border border-yellow-200 text-center text-gray-500">No cakes have been rated yet.</div>
        )}
      </section>

      {/* SECTION: Owner Profile/Portfolio */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Business Owner Profile & Portfolio</h2>
        {editingProfile ? (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={profile.businessName}
              onChange={handleProfileChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={profile.location}
              onChange={handleProfileChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={profile.ownerName}
              onChange={handleProfileChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Profile / Portfolio Description"
              value={profile.description}
              onChange={handleProfileChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <label className="block mb-1 text-gray-600">Profile Picture / Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new window.FileReader();
                  reader.onloadend = () => {
                    setProfile(prev => ({ ...prev, logo: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full mb-2 p-2 border rounded"
            />
            {profile.logo && (
              <img src={profile.logo} alt="Profile/Logo Preview" className="w-24 h-24 object-cover rounded-full mb-2 border" />
            )}
            <button onClick={handleProfileSave} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button onClick={() => setEditingProfile(false)} className="text-gray-500 underline">Cancel</button>
          </>
        ) : (
          <>
            {profile.logo && (
              <img src={profile.logo} alt="Profile/Logo" className="w-24 h-24 object-cover rounded-full mb-3 border" />
            )}
            <p className="mb-1"><span className="font-semibold">Business Name:</span> {profile.businessName || <span className="italic text-gray-400">Not set</span>}</p>
            <p className="mb-1"><span className="font-semibold">Location:</span> {profile.location || <span className="italic text-gray-400">Not set</span>}</p>
            <p className="mb-1"><span className="font-semibold">Owner Name:</span> {profile.ownerName || <span className="italic text-gray-400">Not set</span>}</p>
            <p className="mb-2"><span className="font-semibold">Portfolio:</span> {profile.description || <span className="italic text-gray-400">No description</span>}</p>
            <button onClick={() => setEditingProfile(true)} className="bg-pink-500 text-white px-4 py-2 rounded">Edit Profile</button>
          </>
        )}
      </section>

      {/* SECTION: Card Customization & Add Cake */}
      <section className="mb-10">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">🎨 Customize Cake Card Color</h2>
            <select
              value={bgColor}
              onChange={handleColorChange}
              className="w-full border rounded p-2"
            >
              <option value="bg-white">White</option>
              <option value="bg-pink-100">Pink</option>
              <option value="bg-yellow-100">Yellow</option>
              <option value="bg-blue-100">Blue</option>
              <option value="bg-green-100">Green</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">🧁 Add New Cake</h2>
            <input
              type="text"
              placeholder="Cake Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <label className="block mb-1 text-gray-600">Upload a video (optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleAddCake}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Add Cake
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: Cake Listings */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-700">📦 Cake Listings</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cakes.map((cake, idx) => (
            <div key={idx}>
              <div className={`${bgColor} p-4 rounded-xl shadow`}>
                {cake.image && (
                  <img src={cake.image} alt={cake.name} className="w-full h-40 object-contain mb-2 rounded bg-white" />
                )}
                {cake.video && (
                  <video controls className="w-full h-40 object-cover mb-2 rounded">
                    <source src={cake.video} />
                    Your browser does not support the video tag.
                  </video>
                )}
                <h3 className="text-lg font-bold">{cake.name}</h3>
                <p className="text-gray-700">{cake.description}</p>
                <p className="text-pink-600 font-semibold mt-2">R{cake.price}</p>
                {/* Show rating visually, read-only */}
                <div className="flex items-center mt-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={star <= cake.rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}>
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{cake.rating > 0 ? `Rated ${cake.rating}/5` : "No ratings yet"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
