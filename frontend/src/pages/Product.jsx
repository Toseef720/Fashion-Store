import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// Components
import products from "../data/products";
import Footer from "../components/Footer";

// Icons
import wishlistIcon from "../assets/icons/wishlist.svg";
import wishlistIconFilled from "../assets/icons/wishlistfilled.svg";

export default function Product() {
  const { showToast } = useToast();
  const { currentUser, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { id } = useParams();
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  // Find product
  const product = products.find(
    (item) => item.id === Number(id)
  );

  const isWishlisted = currentUser?.wishlist?.includes(product.id);

  // Add to cart 
  function add_to_cart() {
    addToCart(product, size);
    showToast("Added to cart 🛒");
  }



  if (!product) {
    return <p className="text-center mt-20">Product not found</p>;
  }

  const handleWishlistToggle = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    let updatedWishlist = [];

    if (isWishlisted) {
      updatedWishlist = currentUser.wishlist.filter(
        (id) => id !== product.id
      );
      showToast("Removed from wishlist");
    } else {
      updatedWishlist = [
        ...(currentUser.wishlist || []),
        product.id
      ];
      showToast("Added to wishlist ❤️");
    }

    updateProfile({ wishlist: updatedWishlist });
  };

  return (
    <>
      <section className="w-full px-6 md:px-16 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative bg-gray-100 flex items-center justify-center">

            <img
              src={product.images[0]}
              alt={product.name}
              className="max-h-[450px] w-full object-cover"
            />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute bottom-4 right-4 text-2xl bg-white rounded-full p-2 shadow hover:scale-110 transition"
            >
              {isWishlisted ? <img src={wishlistIconFilled} className="w-6 h-6" /> : <img src={wishlistIcon} className="w-6 h-6" />}
            </button>

          </div>

          {/* Info */}
          <div className="flex flex-col h-full">

            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              {product.name}
            </h1>

            <p className="text-gray-500 mb-4">
              MENDHAR EXCLUSIVES
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">

              <span className="text-2xl font-bold text-dark">
                ₹{product.prices[size]}
              </span>

              <span className="line-through text-gray-400">
                ₹{product.prices[size] + 500}
              </span>

              <span className="text-green-600 font-medium">
                35% off
              </span>

            </div>

            {/* Size */}
            <div className="mb-6">

              <p className="font-medium mb-2">Select Size</p>

              <div className="flex gap-3">

                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-10 h-10 border rounded
                    ${size === s
                        ? "border-primary text-primary border-2"
                        : "hover:border-primary"
                      }`}
                  >
                    {s}
                  </button>
                ))}

              </div>

            </div>

            {/* Quantity */}
            <div className="mb-6">

              <p className="font-medium mb-2">Quantity</p>

              <div className="flex items-center gap-2 mt-2">

                {/* Minus */}
                <button
                  onClick={() => {
                    if (qty > 1) setQty(qty - 1);
                  }}
                  className="px-2 border"
                >
                  -
                </button>

                {/* Value */}
                <span className="w-6 text-center font-medium">
                  {qty}
                </span>

                {/* Plus */}
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-2 border"
                >
                  +
                </button>

              </div>

            </div>
            
            {/* Add To Cart */}
            <button
              onClick={() => { add_to_cart() }}
              className="w-full bg-dark text-white py-3 rounded hover:bg-primary transition mt-auto"
            >
              ADD TO CART
            </button>
          </div>

        </div>

        {/* Description */}
        <div className="max-w-6xl mx-auto mt-14">

          <h2 className="text-xl font-semibold mb-3">
            Product Details
          </h2>

          <p className="text-gray-600 leading-relaxed">

            Premium quality fabric with modern design.
            Perfect for casual and formal occasions.
            Comfortable, durable, and stylish.

          </p>

        </div>

      </section>


      <Footer />
    </>
  );
}
