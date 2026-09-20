import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../services/api";

export default function AddressSection() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState(currentUser?.addresses || []);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Fetch addresses from MongoDB on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const { data } = await getAddresses();
        setAddresses(data);
        updateProfile({ addresses: data });
      } catch (err) {
        console.error("Failed to load addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchAddresses();
    }
  }, [currentUser?.token]);

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSaveAddress = async (e) => {
    e?.preventDefault();

    if (!street.trim() || !city.trim() || !country.trim()) {
      showToast("Please fill required fields (Street, City, Country)");
      return;
    }

    try {
      setSubmitting(true);
      const addressData = {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        country: country.trim(),
      };

      if (editingId) {
        // UPDATE in MongoDB
        const { data } = await updateAddress(editingId, addressData);
        setAddresses(data);
        updateProfile({ addresses: data });
        showToast("Address updated successfully ✏");
      } else {
        // ADD in MongoDB
        const { data } = await addAddress(addressData);
        setAddresses(data);
        updateProfile({ addresses: data });
        showToast("Address added successfully 🏠");
      }

      resetForm();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to save address. Please try again.";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (addr) => {
    setStreet(addr.street || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setZip(addr.zip || "");
    setCountry(addr.country || "");
    setEditingId(addr._id || addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const { data } = await deleteAddress(id);
      setAddresses(data);
      updateProfile({ addresses: data });
      showToast("Address removed");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete address. Please try again.";
      showToast(message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Addresses</h2>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="mb-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        {showForm ? "Cancel" : "Add New Address"}
      </button>

      {showForm && (
        <form onSubmit={handleSaveAddress} className="border p-4 rounded mb-6 space-y-4 bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800">
            {editingId ? "Edit Address" : "New Address"}
          </h3>
          <input
            type="text"
            placeholder="Street *"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
          <input
            type="text"
            placeholder="City *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
          <input
            type="text"
            placeholder="State / Province"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
          />
          <input
            type="text"
            placeholder="ZIP / Postal Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
          />
          <input
            type="text"
            placeholder="Country *"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Address"
                : "Save Address"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading addresses...</p>
      ) : addresses && addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => {
            const addressId = addr._id || addr.id;
            return (
              <div
                key={addressId}
                className="border p-4 rounded flex justify-between items-start hover:shadow-sm transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{addr.street}</p>
                  <p className="text-gray-600">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                  </p>
                  <p className="text-gray-600">
                    {addr.zip ? `${addr.zip}, ` : ""}
                    {addr.country}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(addressId)}
                    className="text-red-500 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No addresses saved yet. Click above to add one.</p>
      )}
    </div>
  );
}
