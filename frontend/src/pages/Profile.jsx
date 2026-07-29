import { useState } from "react";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import EditableProfile from "../components/EditableProfile";
import SecuritySection from "../components/SecuritySection";
import AddressSection from "../components/AddressSection";
import Orders from "../components/Orders";


export default function Profile({setToast}) {
  const { currentUser, updateProfile } = useAuth();


  const [activeTab, setActiveTab] = useState("profile");

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please login to view profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex gap-6">

        {/* ===== SIDEBAR ===== */}
        <div className="w-64 bg-white rounded shadow p-4 space-y-4">

          <button
            onClick={() => setActiveTab("profile")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Profile Info
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "security" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Security
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "address" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Address
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "orders" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            Orders
          </button>

        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 bg-white rounded shadow p-6">
          {/*Editable Profile*/}
          {activeTab === "profile" && (
            <EditableProfile  setToast={setToast}/>
          )}

          {activeTab === "security" && (
            <div>
              {/* Password change in profile */}
              <SecuritySection />
            </div>
          )}

          {activeTab === "address" && (
            <div>
              {/* Add Addresses in profile */}
              <AddressSection />
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <Orders />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
