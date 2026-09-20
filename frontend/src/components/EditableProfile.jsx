import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadProfilePic, updateProfileInfo, getUserProfile } from "../services/api";
import defaultAvatar from "../assets/default-avatar.jpg";

export default function EditableProfile({ setToast }) {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  // Sync latest profile from MongoDB on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const { data } = await getUserProfile();
        if (data) {
          updateProfile(data);
          if (data.name) setName(data.name);
          if (data.phone) setPhone(data.phone);
        }
      } catch (err) {
        console.warn("Could not sync latest profile from server:", err.message);
      }
    };

    if (currentUser?.token) {
      fetchLatestProfile();
    }
  }, [currentUser?.token]);

  // Display hierarchy: local file preview > MongoDB profilePic > legacy image > default avatar
  const currentAvatar =
    preview || currentUser?.profilePic || currentUser?.image || defaultAvatar;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (setToast) {
        setToast({ show: true, message: "Image size must be less than 5MB" });
        setTimeout(() => setToast({ show: false, message: "" }), 2500);
      }
      return;
    }

    // 1. Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // 2. Upload to backend (MongoDB / Cloudinary)
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await uploadProfilePic(formData);

      // data contains updated user with new profilePic in MongoDB
      updateProfile(data);
      setPreview(null); // Clear temporary preview and use permanent URL

      if (setToast) {
        setToast({
          show: true,
          message: "Profile photo saved to MongoDB! 📸",
        });
        setTimeout(() => setToast({ show: false, message: "" }), 2500);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const message =
        err.response?.data?.message || "Failed to upload photo. Please try again.";
      if (setToast) {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await updateProfileInfo({ name, phone });
      updateProfile(data);

      if (setToast) {
        setToast({
          show: true,
          message: "Profile updated successfully 🎉",
        });
        setTimeout(() => {
          setToast({ show: false, message: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      const message =
        err.response?.data?.message || "Failed to update profile info.";
      if (setToast) {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: "" }), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Profile Info</h2>

      {/* PROFILE IMAGE WITH + BUTTON AT BOTTOM RIGHT */}
      <div className="relative w-28 h-28 mb-6">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm flex items-center justify-center">
          <img
            src={currentAvatar}
            alt="profile"
            className="w-full h-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-medium">
              Uploading...
            </div>
          )}
        </div>

        {/* Plus (+) Button */}
        <label
          className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-800 hover:scale-105 transition border-2 border-white ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
          title="Change Photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* NAME */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:border-black"
        />
      </div>

      {/* EMAIL (READONLY) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          type="email"
          value={currentUser?.email || ""}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* PHONE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
        <input
          type="text"
          placeholder="e.g. +91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:border-black"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
