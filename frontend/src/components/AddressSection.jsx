import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AddressSection() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSaveAddress = () => {
    if (!street || !city || !country) {
      showToast("Please fill required fields");
      return;
    }

    let updatedAddresses = [];

    if (editingId) {
      // UPDATE
      updatedAddresses = currentUser.addresses.map((addr) =>
        addr.id === editingId
          ? { id: editingId, street, city, state, zip, country }
          : addr
      );

      showToast("Address updated successfully ✏");
    } else {
      // ADD
      const newAddress = {
        id: Date.now(),
        street,
        city,
        state,
        zip,
        country
      };

      updatedAddresses = [
        ...(currentUser.addresses || []),
        newAddress
      ];

      showToast("Address added successfully 🏠");
    }

    updateProfile({ addresses: updatedAddresses });
    resetForm();
  };

  const handleEdit = (addr) => {
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.zip);
    setCountry(addr.country);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updatedAddresses = currentUser.addresses.filter(
      (addr) => addr.id !== id
    );

    updateProfile({ addresses: updatedAddresses });
    showToast("Address removed");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Addresses</h2>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="mb-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {showForm ? "Cancel" : "Add New Address"}
      </button>

      {showForm && (
        <div className="border p-4 rounded mb-6 space-y-4">
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <button
            onClick={handleSaveAddress}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Update Address" : "Save Address"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {currentUser.addresses &&
          currentUser.addresses.map((addr) => (
            <div
              key={addr.id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>{addr.zip}, {addr.country}</p>
              </div>

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
