import { useState } from "react";
import { useCart } from "../context/CartContext";


import bin from "../assets/icons/bin.svg";
import wishlist from "../assets/icons/wishlist.svg";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderDone, setOrderDone] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  if (orderDone) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">

        <h2 className="text-3xl font-semibold mb-4 text-green-600">
          🎉 Order Placed Successfully!
        </h2>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with us.
        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Step Header */}
      <div className="flex justify-center gap-6 mb-10 text-lg font-medium">

        <span className={step === 1 ? "text-black" : "text-gray-400"}>
          Bag
        </span>

        <span>—</span>

        <span className={step === 2 ? "text-black" : "text-gray-400"}>
          Address
        </span>

        <span>—</span>

        <span className={step === 3 ? "text-black" : "text-gray-400"}>
          Payment
        </span>

      </div>

      {/* Steps */}
      {step === 1 && (
        <BagStep
          total={total}
          next={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <AddressStep
          next={() => setStep(3)}
          back={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <PaymentStep
          total={total}
          back={() => setStep(2)}
          placeOrder={() => {
            const newOrder = {
              id: Date.now(),
              items: cart,
              total: total,
              date: new Date().toLocaleString(),
            };

            // Get old orders
            const oldOrders =
              JSON.parse(localStorage.getItem("orders")) || [];

            // Save new order
            localStorage.setItem(
              "orders",
              JSON.stringify([...oldOrders, newOrder])
            );

            setOrderDone(true);
            localStorage.removeItem("cart");
          }}
        />
      )}

    </div>
  );
}

function BagStep({ total, next }) {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="grid md:grid-cols-3 gap-8">

      {/* Items */}
      <div className="md:col-span-2 space-y-4">

        {cart.map((item, i) => (

          <div
            key={i}
            className="flex gap-4 border p-4 rounded items-center"
          >

            {/* Image */}
            <img
              src={item.image}
              className="w-24 h-28 object-cover rounded"
            />

            {/* Info */}
            <div className="flex-1 space-y-1">

              <h3 className="font-medium">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">
                Size: {item.size}
              </p>
              {/* Quantity */}
              <p className="text-sm text-gray-500">
                Qty: {item.qty}
              </p>

              <p className="font-semibold">
                ₹{item.price * item.qty}
              </p>

            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 text-xl items-center justify-center">

              {/* To add in Wishlist */}
              <button
                onClick={() => alert("Added to wishlist")}
              >
                <img src={wishlist} alt="remove" className="w-5 h-5" />
              </button>

              {/* Remove from cart */}
              <button
                onClick={() => removeFromCart(i)}
                className="text-red-500"
              >
                <img src={bin} alt="remove" className="w-6 h-6" />
              </button>

            </div>

          </div>

        ))}


      </div>

      {/* Summary */}
      <div className="border p-5 rounded shadow flex flex-col">

        <h2 className="font-semibold mb-4">
          Price Details
        </h2>

        <div className="flex justify-between mb-3">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={() => {
            if (cart.length === 0) {
              alert("Your cart is empty!");
              return;
            }
            next();
          }}
          className="w-full bg-black text-white py-3 rounded mt-auto"
        >
          CONTINUE
        </button>

      </div>

    </div>
  );
}

function AddressStep({ next, back }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  })

  return (
    <div className="max-w-xl mx-auto">

      <h2 className="text-xl font-semibold mb-4">
        Delivery Address
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          value={address.name}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="w-full border p-3 rounded"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />

        <input
          placeholder="Address"
          className="w-full border p-3 rounded"
          value={address.address}
          onChange={(e) => setAddress({ ...address, address: e.target.value })}
        />

        <input
          placeholder="City"
          className="w-full border p-3 rounded"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />

        <input
          placeholder="Pincode"
          className="w-full border p-3 rounded"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />

      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={back}
          className="w-1/2 border py-3 rounded"
        >
          BACK
        </button>

        <button
          onClick={() => {
            if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
              alert("Please fill all address details!");
              return;
            }
            next();
          }}
          className="w-1/2 bg-black text-white py-3 rounded"
        >
          CONTINUE
        </button>

      </div>

    </div>
  );
}

function PaymentStep({ total, back, placeOrder }) {

  return (
    <div className="max-w-xl mx-auto">

      <h2 className="text-xl font-semibold mb-4">
        Payment
      </h2>

      <div className="space-y-3 mb-6">

        <label className="flex items-center gap-2">
          <input type="radio" name="pay" defaultChecked />
          Cash On Delivery
        </label>

        <label className="flex items-center gap-2">
          <input type="radio" name="pay" />
          UPI / Card (Demo)
        </label>

      </div>

      <div className="border p-4 rounded mb-5">

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

      </div>

      <div className="flex gap-4">

        <button
          onClick={back}
          className="w-1/2 border py-3 rounded"
        >
          BACK
        </button>

        <button
          onClick={placeOrder}
          className="w-1/2 bg-green-600 text-white py-3 rounded"
        >
          PLACE ORDER
        </button>

      </div>

    </div>
  );
}
