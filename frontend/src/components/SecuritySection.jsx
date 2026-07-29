import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SecuritySection() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordUpdate = () => {
    if (currentPassword !== currentUser.password) {
      showToast("Current password is incorrect ❌");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    if (newPassword === currentUser.password) {
      showToast("New password must be different");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    updateProfile({ password: newPassword });

    showToast("Password updated successfully 🔐");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Security</h2>

      {/* CURRENT PASSWORD */}
      <div className="mb-4 relative">
        <label className="block text-sm mb-1">Current Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 pr-8 outline-none focus:border-black"
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="mb-4 relative">
        <label className="block text-sm mb-1">New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 pr-8 outline-none focus:border-black"
        />
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="mb-6 relative">
        <label className="block text-sm mb-1">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 pr-8 outline-none focus:border-black"
        />
      </div>

      {/* TOGGLE */}
      <div className="flex justify-between">
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </button>

        <button
          onClick={handlePasswordUpdate}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
