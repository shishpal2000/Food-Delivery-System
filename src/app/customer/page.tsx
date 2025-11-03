"use client";

import LayoutComponents from "../layoutComponents";
import React, { useEffect, useState } from "react";
import { showToast } from "../../apiConfig/notification";
import { useGeneralApiCall } from "@/services/useGeneralApiCall";

const CustomerOrderUI = () => {
  const [activeTab, setActiveTab] = useState<any>("restaurant");

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantId, setRestaurantId] = useState<any>(null);
  const [restaurantItems, setRestaurantItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const { getApi, postApi } = useGeneralApiCall();

  const fetchRestaurants = async () => {
    try {
      const res: any = await getApi("/restaurants/");
      setRestaurants(res);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const fetchRestaurantItems = async () => {
    if (!restaurantId) return;
    try {
      const res: any = await getApi(`/restaurants/items/${restaurantId}/`);
      setRestaurantItems(res);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res: any = await getApi("/orders/orders/");
      setOrders(res);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchRestaurantItems();
  }, [restaurantId]);

  const addToCart = (item: any) => {
    if (cart.length > 0 && restaurantId !== cart[0].restaurant_id) {
      showToast({
        type: "error",
        message: "You can order from only one restaurant at a time!",
      });
      return;
    }
    setCart([...cart, { ...item, restaurant_id: restaurantId }]);
    showToast({ type: "success", message: "Added to cart" });
  };

  const cancelCartItem = (id: any) =>
    setCart(cart.filter((c: any) => c.id !== id));

  const placeOrder = async () => {
    if (!cart.length || !restaurantId) return;

    const payload = {
      restaurant_id: restaurantId,
      item_ids: cart.map((i: any) => i.id),
      total_amount: cart.reduce((sum: any, i: any) => sum + Number(i.price), 0),
    };

    try {
      await postApi("/orders/place/", payload);
      showToast({ type: "success", message: "Order placed successfully" });
      setCart([]);
      fetchOrders();
    } catch (error: any) {
      showToast({ type: "error", message: error.message });
    }
  };

  const cancelOrder = async (id: any, status: any) => {
    if (status !== "PENDING") {
      showToast({
        type: "error",
        message: "Only PENDING orders can be cancelled",
      });
      return;
    }

    try {
      await postApi(`/orders/${id}/cancel/`, {
  status: "CANCELLED"
});
      showToast({ type: "success", message: "Order cancelled" });
      fetchOrders();
    } catch (err: any) {
      showToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="p-6 pb-32">
      <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
        🍔 Customer Portal
      </h1>

      <div className="flex justify-center mb-6 space-x-2">
        {[
          { id: "restaurant", label: "Restaurants" },
          { id: "pending", label: "My Orders" },
          { id: "cart", label: "Cart" },
        ].map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "restaurant" && (
        <>
          {!restaurantId ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {restaurants.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => setRestaurantId(r.id)}
                  className="p-4 bg-indigo-100 rounded-xl cursor-pointer shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-indigo-700">{r.name}</h3>
                  <p>{r.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => setRestaurantId(null)}
                className="mb-4 bg-gray-300 px-4 py-1 rounded"
              >
                ← Back to Restaurants
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {restaurantItems.map((item: any) => (
                  <div key={item.id} className="bg-green-100 p-4 rounded-xl shadow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹ {item.price}</p>

                    <button
                      onClick={() => addToCart(item)}
                      className="mt-3 px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {activeTab === "pending" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-3">My Orders</h2>

          {orders.map((o: any) => (
        <div 
  key={o.id} 
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 border-b bg-white rounded-md shadow-sm"
>
  {/* Restaurant */}
  <div>
    <h3 className="font-semibold text-gray-800 text-lg">
      Restaurant: <span className="font-normal">{o.restaurant.name}</span>
    </h3>

    {/* Items */}
    <div className="mt-1 text-sm text-gray-600">
      {o?.items?.map((item: any, i:number) => (
        <p key={i} className="border-l-4 border-gray-300 pl-2 my-1">
          Item: {item?.name}
        </p>
      ))}
    </div>
  </div>

  {/* Status */}
  <span
    className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md
      ${
        o.status === "PENDING" ? "bg-orange-100 text-orange-700" :
        o.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
        o.status === "PREPARED" ? "bg-green-100 text-green-700" :
        o.status === "DELIVERED" ? "bg-purple-100 text-purple-700" :
        "bg-red-100 text-red-700"
      }
    `}
  >
    {o.status}
  </span>

  {/* Cancel Button */}
  <button
    disabled={o.status !== "PENDING"}
    onClick={() => cancelOrder(o.id, o.status)}
    className="
      px-4 py-2 rounded-xl 
      text-white font-medium 
      bg-red-500 hover:bg-red-600 
      disabled:bg-gray-400 disabled:cursor-not-allowed 
      transition-all cursor-pointer
    "
  >
    Cancel
  </button>
</div>

          ))}
        </div>
      )}

      {activeTab === "cart" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">Cart</h2>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((c: any) => (
              <div key={c.id} className="flex justify-between py-2 border-b">
                <span>{c.name}</span>
                <button
                  onClick={() => cancelCartItem(c.id)}
                  className="text-red-500 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))
          )}

          <button
            onClick={placeOrder}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg w-full hover:bg-purple-700"
          >
            ✅ Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default LayoutComponents(CustomerOrderUI);
