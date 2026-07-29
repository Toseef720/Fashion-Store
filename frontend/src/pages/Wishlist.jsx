import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Wishlist({ cart, setCart }) {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const wishlistProducts = products.filter((p) =>
    currentUser.wishlist?.includes(p.id)
  );

  const removeFromWishlist = (id) => {
    const updatedWishlist = currentUser.wishlist.filter(
      (item) => item !== id
    );

    updateProfile({ wishlist: updatedWishlist });
    showToast("Removed from wishlist");
  };

  const moveToCart = (product) => {
    addToCart(product); // default size M, qty 1

    const updatedWishlist = currentUser.wishlist.filter(
      id => id !== product.id
    );

    updateProfile({ wishlist: updatedWishlist });
    showToast("Moved to cart 🛒");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">
        My Wishlist
      </h2>

      {wishlistProducts.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-lg mb-4">
            ❤️ Your wishlist is empty
          </p>
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative">

              <ProductCard item={product} />

              {/* Wishlist Actions */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => moveToCart(product)}
                  className="bg-black text-white px-3 py-1 text-sm rounded"
                >
                  Move to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}