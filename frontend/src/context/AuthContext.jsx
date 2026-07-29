import { createContext, useState, useEffect, useContext } from "react";
import usersData from "../data/users";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  // Load users from localStorage OR fallback to usersData
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : usersData;
  });

  // Load current user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist users database
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Persist logged-in user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email);

    if (exists) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone: "",
      image: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      },
      orders: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const login = (email, password) => {
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // 🔥 NEW: Update Profile
  const updateProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };

    const updatedUsers = users.map(u =>
      u.id === currentUser.id ? updatedUser : u
    );

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
