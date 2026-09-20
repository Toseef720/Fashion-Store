import { createContext, useState, useContext } from "react";
import { loginUser as apiLogin, registerUser as apiRegister } from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  // Load current user (with token) from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const { data } = await apiRegister(name, email, password);
      // data = { _id, name, email, isAdmin, token }
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await apiLogin(email, password);
      // data = { _id, name, email, isAdmin, token }
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // ─── Update Profile (local state only – extend later if you add API) ─────────
  const updateProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
