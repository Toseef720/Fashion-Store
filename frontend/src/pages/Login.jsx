import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";


import eyeOpen from "../assets/icons/eye-open.svg";
import eyeClose from "../assets/icons/eye-close.svg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const res = login(email, password);

    if (!res.success) {
      setError(res.message);
      showToast(res.message);
      return;
    }

    showToast("Login successful 🎉");
    setTimeout(()=>{
      navigate("/");
    }, 2000) 
  };


  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT IMAGE */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1483985988355-763728e1935b')",
        }}
      />

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">

          <h2 className="text-2xl font-semibold text-center">LOGIN</h2>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

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

            {/* IMAGE TOGGLE */}
            <img
              src={showPassword ? eyeClose : eyeOpen}
              alt="toggle"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 w-5 h-5 cursor-pointer"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            CONTINUE
          </button>

          {/* SIGN UP LINK */}
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
