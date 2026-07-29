import { useEffect, useState } from "react";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">
          No Orders Yet
        </h2>
        <p className="text-gray-500">
          Start shopping to see your orders here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">
        My Orders
      </h2>

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border p-5 rounded shadow"
          >

            <div className="flex justify-between mb-3 text-sm text-gray-500">

              <span>Order ID: {order.id}</span>
              <span>{order.date}</span>

            </div>

            <div className="space-y-2">

              {order.items.map((item, i) => (

                <div
                  key={i}
                  className="flex justify-between text-sm"
                >

                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    ₹{item.price * item.qty}
                  </span>

                </div>

              ))}

            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-semibold">

              <span>Total</span>
              <span>₹{order.total}</span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
