"use client";

import React, { useEffect, useState } from "react";
import LayoutComponents from "../layoutComponents";
import { useGeneralApiCall } from "@/services/useGeneralApiCall";
import { showToast } from "../../apiConfig/notification";

const RestaurantPage = () => {
  const { getApi, postApi } = useGeneralApiCall();

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<any[]>([]);
  const [preparedOrders, setPreparedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<any>(false);

  // ✅ Fetch Pending Orders
  const fetchPendingOrders = async () => {
    try {
      const res: any = await getApi("/orders/pending/");
      setPendingOrders(res);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // ✅ Fetch Prepared Orders
  const fetchPreparedOrders = async () => {
    try {
      const res: any = await getApi("/orders/accept/");
      setPreparedOrders(res);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // ✅ Fetch Accepted Orders (optional API not provided, so filter locally)
  const filterAcceptedOrders = () => {
    const accepted = pendingOrders.filter((order: any) => order.status === "ACCEPTED");
    setAcceptedOrders(accepted);
  };

  useEffect(() => {
    fetchPendingOrders();
    fetchPreparedOrders();
  }, []);

  useEffect(() => {
    filterAcceptedOrders();
  }, [pendingOrders]);

  // ✅ Handle Accept Order
  const handleAccept = async (id: any) => {
    setLoading(true);
    try {
      await postApi("/restaurants/order-action/", {
        order_id: id,
        action: "accept",
      });

      showToast({ type: "success", message: "Order Accepted ✅" });
      fetchPendingOrders();
      fetchPreparedOrders();
    } catch (err: any) {
      showToast({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  // ✅ Handle Mark Prepared
  const handlePrepared = async (id: any) => {
    setLoading(true);
    try {
      await postApi("/restaurants/order-action/", {
        order_id: id,
        action: "prepare",
      });

      showToast({ type: "success", message: "Order Prepared ✅" });
      fetchPendingOrders();
      fetchPreparedOrders();
    } catch (err: any) {
      showToast({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-5 min-h-screen pb-32">
      <h1 className="text-2xl font-bold text-red-600">
        🍽️ Restaurant Dashboard
      </h1>

      {/* Pending Orders */}
      <div className="bg-white rounded-xl shadow-md p-4 border">
        <h2 className="text-lg font-semibold text-orange-600 mb-2">
          🕓 Pending Orders (Accept Them)
        </h2>

        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">No pending orders</p>
        ) : (
          <ul className="space-y-3">
  {pendingOrders
    .filter((o: any) => o.status === "PENDING")
    .map((order: any) => (
      <li
        key={order.id}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        {/* Left Side: Order details */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            Order #{order.id} —{" "}
            <span className="font-normal text-gray-700">
              {order.customer?.username}
            </span>
          </p>

          <p className="text-gray-600">
            Restaurant:{" "}
            <span className="font-medium text-gray-900">
              {order.restaurant?.name}
            </span>
          </p>

          {/* Items */}
          <div className="mt-1 space-y-1">
            {order?.items?.map((item: any, i: number) => (
              <p
                key={i}
                className="text-sm text-gray-700 pl-3 border-l-4 border-gray-300"
              >
                🍲 {item?.name}
              </p>
            ))}
          </div>
        </div>

        {/* Accept Button */}
        <button
          disabled={loading}
          onClick={() => handleAccept(order.id)}
          className="
            px-4 py-2 rounded-lg font-medium text-white
            bg-blue-600 hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed 
            transition-all
          "
        >
          Accept Order
        </button>
      </li>
    ))}
</ul>

        )}
      </div>

     

      {/* Prepared Orders */}
      <div className="bg-white rounded-xl shadow-md p-4 border">
        <h2 className="text-lg font-semibold text-green-700 mb-2">
          🎉 Accept Orders (Ready for Driver)
        </h2>

        {preparedOrders.length === 0 ? (
          <p className="text-gray-500">No Accept orders</p>
        ) : (
          <ul className="space-y-3">
            {preparedOrders.map((order: any) => (
              <li
  key={order.id}
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all"
>
  {/* Order Info */}
  <div className="space-y-2">
    <p className="font-semibold text-gray-800 text-lg">
      Order #{order.id} —{" "}
      <span className="font-normal text-gray-700">
        {order.customer?.username}
      </span>
    </p>

    <p className="text-gray-600">
      Restaurant:{" "}
      <span className="font-medium text-gray-800">
        {order.restaurant?.name}
      </span>
    </p>

    {/* Item List */}
    <div className="mt-1 space-y-1">
      {order?.items?.map((item: any, i: number) => (
        <p
          key={i}
          className="text-sm text-gray-700 pl-3 border-l-4 border-gray-300"
        >
          🍽️ {item?.name}
        </p>
      ))}
    </div>
  </div>

  {/* Prepare Button */}
  <button
    disabled={loading}
    onClick={() => handlePrepared(order.id)}
    className="
      px-4 py-2 rounded-lg font-medium text-white
      bg-blue-600 hover:bg-blue-700 
      disabled:bg-gray-400 disabled:cursor-not-allowed
      transition-all
    "
  >
    Prepare Order
  </button>
</li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LayoutComponents(RestaurantPage);
