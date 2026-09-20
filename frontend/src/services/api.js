import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach Authorization header if user token exists in localStorage
API.interceptors.request.use((config) => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
  }
  return config;
});

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export const loginUser = (email, password) =>
  API.post("/api/users/login", { email, password });

export const registerUser = (name, email, password) =>
  API.post("/api/users/register", { name, email, password });

// ─── Address Endpoints ────────────────────────────────────────────────────────

export const getAddresses = () => API.get("/api/users/addresses");

export const addAddress = (addressData) =>
  API.post("/api/users/addresses", addressData);

export const updateAddress = (id, addressData) =>
  API.put(`/api/users/addresses/${id}`, addressData);

export const deleteAddress = (id) =>
  API.delete(`/api/users/addresses/${id}`);

// ─── Profile Endpoints ────────────────────────────────────────────────────────

export const getUserProfile = () => API.get("/api/users/profile");

export const uploadProfilePic = (formData) =>
  API.put("/api/users/profile-pic", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProfileInfo = (profileData) =>
  API.put("/api/users/profile", profileData);

export default API;