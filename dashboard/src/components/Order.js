import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

const Orders = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3002/allOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="orders" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <p>{t("loadingOrders")}</p>
      </div>
    );
  }

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>{t("noOrders")}</p>
          <Link to={"/"} className="btn">
            {t("getStarted")}
          </Link>
        </div>
      ) : (
        <div className="order-table">
          <h3 className="title">{t("ordersTitle")} ({orders.length})</h3>
          <table>
            <thead>
              <tr>
                <th>{t("type")}</th>
                <th>{t("instrument")}</th>
                <th>{t("qty")}</th>
                <th>{t("price")}</th>
                <th>{t("time")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const formattedTime = new Date(order.createdAt).toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  day: 'numeric',
                  month: 'short',
                });
                
                const badgeStyle = order.mode === "BUY" 
                  ? { background: "rgb(222, 243, 224)", color: "rgb(76, 175, 80)", width: "60px", padding: "2px 0", borderRadius: "3px", fontWeight: "bold" }
                  : { width: "60px", padding: "2px 0", borderRadius: "3px", fontWeight: "bold" };

                return (
                  <tr key={order._id || index}>
                    <td>
                      <p style={badgeStyle}>{order.mode}</p>
                    </td>
                    <td style={{ fontWeight: 500 }}>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>₹{order.price.toFixed(2)}</td>
                    <td>{formattedTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;