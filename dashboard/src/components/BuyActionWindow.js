import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3002/newOrder",
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: "BUY",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        generalContext.closeBuyWindow();
      })
      .catch((err) => {
        console.error("Order failed:", err);
        generalContext.closeBuyWindow();
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>{t("qty")}</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>{t("price")}</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>{t("marginRequired")} ₹{(stockQuantity * (stockPrice || 140.65)).toFixed(2)}</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            {t("buy")}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;