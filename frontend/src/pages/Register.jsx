import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import eyeOpen from "../assets/icons/eye-open.svg";
import eyeClose from "../assets/icons/eye-close.svg";

export default function Register({setToast}) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      showToast(res.message);
      return;
    }
    
    showToast("Registration successful 🎉");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT IMAGE */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d')",
        }}
      />

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">

          <h2 className="text-2xl font-semibold text-center">REGISTER</h2>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* FULL NAME */}
          <div className="relative group">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full border-b border-gray-400 bg-transparent py-2 outline-none focus:border-black"
            />
            <label className="absolute left-0 top-2 text-gray-500 transition-all 
              peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-4 peer-valid:text-sm
              group-hover:text-black">
              Full Name
            </label>
          </div>

          {/* EMAIL */}
          <div className="relative group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border-b border-gray-400 bg-transparent py-2 outline-none focus:border-black"
            />
            <label className="absolute left-0 top-2 text-gray-500 transition-all 
              peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-4 peer-valid:text-sm
              group-hover:text-black">
              Email
            </label>
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full border-b border-gray-400 bg-transparent py-2 pr-8 outline-none focus:border-black"
            />
            <label className="absolute left-0 top-2 text-gray-500 transition-all 
              peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-4 peer-valid:text-sm
              group-hover:text-black">
              Password
            </label>

            <img
              src={showPassword ? eyeClose : eyeOpen}
              alt="toggle"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 w-5 h-5 cursor-pointer"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer w-full border-b border-gray-400 bg-transparent py-2 pr-8 outline-none focus:border-black"
            />
            <label className="absolute left-0 top-2 text-gray-500 transition-all 
              peer-focus:-top-4 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-4 peer-valid:text-sm
              group-hover:text-black">
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
