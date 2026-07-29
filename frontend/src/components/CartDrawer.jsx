import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import bin from "../assets/icons/bin.svg";


export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty
  } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[350px] md:w-[400px] bg-white z-50 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">

          <h2 className="font-semibold text-2xl">
            Your Cart
          </h2>

          <button
            onClick={onClose}
            className="text-3xl font-bold"
          >
            ×
          </button>

        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Your cart is empty
            </p>
          )}

          {cart.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 border-b pb-4 mb-4"
            >
              {/* Image */}
              <img
                src={item.image}
                className="w-16 h-20 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Size: {item.size}
                </p>
                <p className="font-semibold">₹{item.price}</p>

                {/* Quantity */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(index)}
                    className="px-2 border"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => increaseQty(index)}
                    className="px-2 border"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => { removeFromCart(index) }}
                className="text-red-500 text-sm"
              >
                <img src={bin} alt="bin" className="w-6 h-6" />
              </button>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="border-t p-4 mt-auto">

          <div className="flex justify-between mb-3 font-medium">

            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Link to="/checkout" onClick={onClose}>
            <button className="w-full bg-dark text-white py-3 rounded hover:bg-primary transition">

              PROCEED TO CHECKOUT

            </button>
          </Link>

        </div>

      </div>
    </>
  );
}
