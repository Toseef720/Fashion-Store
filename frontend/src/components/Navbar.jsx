import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";


import wishlist from "../assets/icons/wishlist.svg";
import cartIcon from "../assets/icons/cart.svg";
import search from "../assets/icons/search.svg";
import user from "../assets/icons/user.svg";
import menu from "../assets/icons/menu.svg";



export default function Navbar({ setCartOpen }) {

  const [showMenu, setShowMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { currentUser, logout } = useContext(AuthContext);
  const wishlistCount = currentUser?.wishlist?.length || 0;
  const location = useLocation();
  const { showToast } = useToast();
  const { cart } = useCart();


  const menuRef = useRef();

  /* Detect Screen Size */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Close Profile Dropdown */
  useEffect(() => {

    const handleClick = (e) => {
      if (menuRef.current &&
        !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };

  }, []);

  useEffect(() => {
    setShowMenu(false);
  }, [location]);


  const handleLogout = () => {
    logout();
    showToast("Logged Out Successfully 👋")
  };



  /* Search Component */
  const SearchBar = () => (
    <div className="
      flex-1
      max-w-full
      md:max-w-[450px]
      lg:max-w-[600px]
      xl:max-w-[750px]
      mx-auto
      flex
      items-center
      bg-secondary
      rounded-full
      px-3
      h-9
      md:h-10
    ">

      <input
        type="text"
        placeholder="What's on your mind today ?"
        className="bg-transparent outline-none w-full text-lg md:text-base h-full"
      />

      <img
        src={search}
        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
        alt="search"
      />

    </div>
  );



  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-8xl mx-auto py-3 px-3">

          {/* ================= TOP ROW ================= */}
          <div className="flex items-center justify-between gap-3">

            {/* Logo */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary whitespace-nowrap">
              <Link to="/">MENDHAR EXCLUSIVES</Link>
            </h1>


            {/* Desktop Search */}
            {!isMobile && <SearchBar />}


            {/* Right Side */}
            <div className="flex items-center gap-4">

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-6">

                <Link to="/wishlist" className="relative">
                  <img src={wishlist} className="w-6 h-6 cursor-pointer" />

                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2
                      bg-red-500 text-white text-[10px]
                        min-w-[16px] h-[16px]
                        rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>


                {/* Cart */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative"
                >
                  <img src={cartIcon} className="w-6 h-6" />

                  {cart.length > 0 && (
                    <span
                      className="absolute -top-2 -right-2
                      bg-red-500 text-white text-[10px]
                      min-w-[16px] h-[16px]
                      rounded-full flex items-center justify-center"
                    >
                      {cart.length}
                    </span>
                  )}
                </button>


                {/* Profile / Login */}
                <div
                  className="relative flex items-center"
                  ref={menuRef}
                >

                  {currentUser ? (
                    <>
                      {/* Profile Icon */}
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="relative"
                      >
                        <img src={user} className="w-6 h-6 block" />

                        {/* Green Online Dot */}
                        <span className="
                          absolute -bottom-1 -right-1
                          w-3 h-3
                          bg-green-500
                          border-2 border-white
                          rounded-full
                        " />
                      </button>

                      {showMenu && (
                        <div className="absolute right-0 top-6 w-40 bg-white border rounded shadow-md overflow-hidden">

                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            Profile
                          </Link>

                          <Link
                            to="/orders"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            My Orders
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="block w-full text-left text-red-500 px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            Logout
                          </button>

                        </div>
                      )}
                    </>
                  ) : (
                    /* If NOT logged in → direct login */
                    <Link to="/login">
                      <img src={user} className="w-6 h-6 block cursor-pointer" />
                    </Link>
                  )}

                </div>


              </div>


              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileNav(true)}
                className="md:hidden"
              >
                <img src={menu} className="w-8 h-8" />
              </button>

            </div>

          </div>


          {/* ================= MOBILE SEARCH ================= */}
          {isMobile && (
            <div className="mt-3">
              <SearchBar />
            </div>
          )}

        </div>


        {/* ================= DESKTOP CATEGORIES ================= */}
        <div className="hidden md:flex justify-center gap-32 py-3 bg-secondary text-lg font-medium">

          <Link to="/category/men"><button className="hover:text-primary">MEN</button></Link>
          <Link to="/category/women"><button className="hover:text-primary">WOMEN</button></Link>
          <Link to="/category/kids"><button className="hover:text-primary">KIDS</button></Link>

        </div>

      </header>



      {/* ================= MOBILE OVERLAY ================= */}
      {mobileNav && (
        <div
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}



      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`
        fixed top-0 right-0 h-full w-[260px]
        bg-white z-50 shadow
        transform transition-transform duration-300
        ${mobileNav ? "translate-x-0" : "translate-x-full"}
        `}
      >

        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b">

          <h2 className="font-semibold text-lg">Menu</h2>

          <button
            onClick={() => setMobileNav(false)}
            className="text-2xl"
          >
            ✕
          </button>

        </div>


        {/* Drawer Links */}
        <div className="flex flex-col p-4 gap-4 text-base">

          <Link to="/profile" onClick={() => setMobileNav(false)}>Profile</Link>
          <Link to="/" onClick={() => setMobileNav(false)}>Home</Link>
          <Link to="/category/men" onClick={() => setMobileNav(false)}>Men</Link>
          <Link to="/category/women" onClick={() => setMobileNav(false)}>Women</Link>
          <Link to="/category/kids" onClick={() => setMobileNav(false)}>Kids</Link>
          <Link to="/cart" onClick={() => setMobileNav(false)}>Cart</Link>
          <Link to="/wishlist" onClick={() => setMobileNav(false)}>Wishlist</Link>
          <Link to="/orders" onClick={() => setMobileNav(false)}>My Orders</Link>
          {!currentUser && <Link to="/login" onClick={() => setMobileNav(false)}>Login</Link>}
          {currentUser && <button onClick={handleLogout} className="text-red-500 text-start">Logout</button>}

        </div>

      </div>

    </>
  );
}
