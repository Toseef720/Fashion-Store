import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import wishlist from "../assets/icons/wishlist.svg";
import bin from "../assets/icons/bin.svg";

export default function Cart() {

 const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">

        <h2 className="text-2xl font-semibold mb-3">
          Your Cart is Empty
        </h2>

        <Link
          to="/"
          className="text-primary underline"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">

      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        My Cart
      </h2>

      {/* Items */}
      <div className="space-y-4 flex-1 overflow-y-auto">

        {cart.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 border p-3 rounded"
          >

            {/* Image */}
            <img
              src={item.image}
              className="w-20 h-24 object-cover rounded"
            />

            {/* Info */}
            <div className="flex-1">

              <h3 className="font-medium">
                {item.name}
              </h3>

              <p className="text-sm text-gray-500">
                Size: {item.size}
              </p>

              <p className="font-semibold">
                ₹{item.price}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2 mt-2">

                <button
                  onClick={() => {decreaseQty(index)}}
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => {increaseQty(index);}}
                  className="px-2 border"
                >
                  +
                </button>

              </div>

            </div>

            {/* Actions */}
          <div className="flex flex-col gap-3 text-xl items-center justify-center">
            {/* Wishlist (Demo) */}
            <button onClick={() => alert("Added to wishlist")}>
                <img src={wishlist} alt="remove" className="w-5 h-5" />
            </button>
            
            {/* Remove */}
            <button onClick={() => {removeFromCart(index)}}
              className="text-red-500">
              <img src={bin} alt="remove" className="w-6 h-6" />
            </button>
            </div>

          </div>

        ))}

      </div>


      {/* Summary */}
      <div className="border-t mt-auto pt-4 bg-white sticky bottom-0">

        <div className="flex justify-between font-semibold mb-4">

          <span>Total</span>
          <span>₹{total}</span>

        </div>

        <Link
          to="/checkout"
          className="block text-center bg-black text-white py-3 rounded"
        >
          PROCEED TO CHECKOUT
        </Link>

      </div>

    </div>
  );
}
