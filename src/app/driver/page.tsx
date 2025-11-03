"use client";

import React, { useState, useEffect } from "react";
import LayoutComponents from "../layoutComponents";
import { useGeneralApiCall } from "@/services/useGeneralApiCall";
import { showToast } from "../../apiConfig/notification";

const DriverPage = () => {
  const [preparedOrders, setPreparedOrders] = useState<any[]>([]);
  const [pickedOrders, setPickedOrders] = useState<any[]>([]);

  const { getApi, postApi } = useGeneralApiCall();

  // ✅ Fetch Prepared Orders
  const fetchPreparedOrders = async () => {
    try {
      const res: any = await getApi("/orders/prepared/");
      setPreparedOrders(res);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // ✅ Fetch Picked Up Orders
  const fetchPickedOrders = async () => {
    try {
      const res: any = await getApi("/orders/picked/");
      setPickedOrders(res);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchPreparedOrders();
    fetchPickedOrders();
  }, []);

  // ✅ DRIVER ACTION (Pickup / Deliver)
  const handleDriverAction = async (orderId: number, action: "pickup" | "deliver") => {
    try {
      await postApi("/delivery/action/", {
        order_id: orderId,
        action,
      });

      showToast({type:"success", message:"driver picked up the order"})

      // 🔄 Refresh list after action
      fetchPreparedOrders();
      fetchPickedOrders();
    } catch (err: any) {
      showToast({type:"error", message:err.message});
    }
  };

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-2xl font-bold text-blue-600">🚚 Driver Panel</h1>

      {/* ✅ Prepared Orders */}
      <section className="bg-white shadow p-4 rounded-xl border">
        <h2 className="font-bold text-green-600 mb-2">✅ Prepared Orders</h2>

        {preparedOrders.length === 0 ? (
          <p className="text-gray-500">No Prepared Orders</p>
        ) : (
          preparedOrders.map(order => (
            <div key={order.id} className="bg-gray-100 p-3 rounded-lg mb-3">
              <div className="flex justify-between">
                <h3>Customer name : {order.customer.username}</h3>
                   <h3>restaurant name : {order.restaurant.name}</h3>
                      
                        <div>
                          {order?.items?.map((item:any)=><p>Item Name : {item?.name}</p>)}
                        </div>

                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleDriverAction(order.id, "pickup")}
                >
                  Pick Up
                </button>
              </div>

              
            </div>
          ))
        )}
      </section>

      {/* ✅ Picked Orders */}
      <section className="bg-white shadow p-4 rounded-xl border">
        <h2 className="font-bold text-orange-600 mb-2">🚴 Picked Orders</h2>

        {pickedOrders.length === 0 ? (
          <p className="text-gray-500">No Picked Orders</p>
        ) : (
          pickedOrders.map(order => (
            <div key={order.id} className="bg-yellow-100 p-3 rounded-lg mb-3">
              <div className="flex justify-between">
                <h3>Customer name : {order.customer.username}</h3>
                   <h3>restaurant name : {order.restaurant.name}</h3>
                      
                        <div>
                          {order?.items?.map((item:any)=><p>Item Name : {item?.name}</p>)}
                        </div>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleDriverAction(order.id, "deliver")}
                >
                  Deliver
                </button>
              </div>

             
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default LayoutComponents(DriverPage);