import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function EditableProfile({setToast}) {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser.name || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [image, setImage] = useState(currentUser.image || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({
      name,
      phone,
      image
    });

    setToast({
      show: true,
      message: "Profile updated successfully 🎉",
    });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Profile Info</h2>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {image ? (
            <img
              src={image}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <label className="cursor-pointer bg-black text-white px-4 py-2 rounded text-sm">
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* NAME */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:border-black"
        />
      </div>

      {/* EMAIL (READONLY) */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={currentUser.email}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>

      {/* PHONE */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:border-black"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Save Changes
      </button>
    </div>
  );
}
