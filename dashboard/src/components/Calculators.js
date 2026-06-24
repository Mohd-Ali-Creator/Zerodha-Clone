import React, { useState, useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

const Calculators = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [activeTab, setActiveTab] = useState("brokerage");

  // State for Brokerage Calculator
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1050);
  const [qty, setQty] = useState(100);
  const [tradeType, setTradeType] = useState("delivery"); // delivery, intraday, futures, options

  // State for SIP Calculator
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // State for Lumpsum Calculator
  const [lumpsumAmt, setLumpsumAmt] = useState(50000);
  const [lumpsumReturn, setLumpsumReturn] = useState(12);
  const [lumpsumYears, setLumpsumYears] = useState(10);

  // State for Margin Calculator
  const [marginPrice, setMarginPrice] = useState(500);
  const [marginQty, setMarginQty] = useState(50);
  const [marginProduct, setMarginProduct] = useState("MIS"); // CNC, MIS

  // Calculations for Brokerage Calculator
  const calcBrokerage = () => {
    const buyVal = buyPrice * qty;
    const sellVal = sellPrice * qty;
    const turnover = buyVal + sellVal;

    let brokerage = 0;
    let stt = 0;
    let exchangeTx = 0;
    let sebiCharges = 0.0001 * turnover; // Rs. 10/crore -> 0.0001%
    let stampDuty = 0;

    if (tradeType === "delivery") {
      brokerage = 0;
      stt = 0.001 * turnover; // 0.1% on buy and sell
      exchangeTx = 0.0000345 * turnover; // 0.00345%
      stampDuty = 0.00015 * buyVal; // 0.015% on buy
    } else if (tradeType === "intraday") {
      brokerage = Math.min(0.0003 * buyVal, 20) + Math.min(0.0003 * sellVal, 20); // 0.03% or Rs. 20 (whichever is lower) per side
      stt = 0.00025 * sellVal; // 0.025% on sell side
      exchangeTx = 0.0000345 * turnover; // 0.00345%
      stampDuty = 0.00003 * buyVal; // 0.003% on buy
    } else if (tradeType === "futures") {
      brokerage = Math.min(0.0003 * buyVal, 20) + Math.min(0.0003 * sellVal, 20); // 0.03% or Rs. 20 per side
      stt = 0.000125 * sellVal; // 0.0125% on sell side
      exchangeTx = 0.000019 * turnover; // 0.0019%
      stampDuty = 0.00002 * buyVal; // 0.002% on buy
    } else if (tradeType === "options") {
      brokerage = 40; // Rs. 20 flat buy + Rs. 20 flat sell
      stt = 0.000625 * sellVal; // 0.0625% on sell side (of premium value)
      exchangeTx = 0.00053 * turnover; // 0.053% (of premium value)
      stampDuty = 0.00003 * buyVal; // 0.003% on buy
    }

    const gst = 0.18 * (brokerage + exchangeTx + sebiCharges);
    const totalCharges = brokerage + stt + exchangeTx + GST_SAFE(gst) + sebiCharges + stampDuty;
    const rawProfitLoss = (sellPrice - buyPrice) * qty;
    const netPL = rawProfitLoss - totalCharges;
    const breakevenPoints = totalCharges / qty;

    return {
      turnover,
      brokerage,
      stt,
      exchangeTx,
      gst,
      sebiCharges,
      stampDuty,
      totalCharges,
      netPL,
      breakevenPoints,
    };
  };

  // Safe GST calculation helper to prevent NaN
  const GST_SAFE = (val) => (isNaN(val) ? 0 : val);

  const formatCurrency = (val) => {
    return val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculations for SIP Calculator
  const calcSIP = () => {
    const P = sipMonthly;
    const i = sipReturn;
    const n = sipYears;

    const r = i / (12 * 100);
    const m = n * 12;

    const totalValue = P * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    const investedAmount = P * m;
    const estReturns = totalValue - investedAmount;

    return {
      investedAmount,
      estReturns,
      totalValue,
    };
  };

  // Calculations for Lumpsum Calculator
  const calcLumpsum = () => {
    const PV = lumpsumAmt;
    const i = lumpsumReturn;
    const n = lumpsumYears;

    const totalValue = PV * Math.pow(1 + i / 100, n);
    const investedAmount = PV;
    const estReturns = totalValue - investedAmount;

    return {
      investedAmount,
      estReturns,
      totalValue,
    };
  };

  // Calculations for Margin Calculator
  const calcMargin = () => {
    const orderValue = marginPrice * marginQty;
    const multiplier = marginProduct === "MIS" ? 5 : 1;
    const marginRequired = orderValue / multiplier;

    return {
      orderValue,
      marginRequired,
      leverageText: marginProduct === "MIS" ? "5x (20% Margin Required)" : "1x (100% Margin Required)",
    };
  };

  const {
    turnover,
    brokerage,
    stt,
    exchangeTx,
    gst,
    sebiCharges,
    stampDuty,
    totalCharges,
    netPL,
    breakevenPoints,
  } = calcBrokerage();

  const sipResult = calcSIP();
  const lumpsumResult = calcLumpsum();
  const marginResult = calcMargin();

  return (
    <div className="calc-container" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h3 style={{ margin: "0 0 20px 0", fontWeight: "600", fontSize: "1.6rem" }}>{t("calculators")}</h3>

      {/* Tabs */}
      <div className="tabs-header" style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        <button
          onClick={() => setActiveTab("brokerage")}
          className={`tab-btn ${activeTab === "brokerage" ? "active" : ""}`}
        >
          {t("brokerageCalc")}
        </button>
        <button
          onClick={() => setActiveTab("sip")}
          className={`tab-btn ${activeTab === "sip" ? "active" : ""}`}
        >
          {t("sipCalc")}
        </button>
        <button
          onClick={() => setActiveTab("lumpsum")}
          className={`tab-btn ${activeTab === "lumpsum" ? "active" : ""}`}
        >
          {t("lumpsumCalc")}
        </button>
        <button
          onClick={() => setActiveTab("margin")}
          className={`tab-btn ${activeTab === "margin" ? "active" : ""}`}
        >
          {t("marginCalc")}
        </button>
      </div>

      {/* Main Content */}
      <div className="calc-body" style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        
        {/* BROKERAGE CALCULATOR TAB */}
        {activeTab === "brokerage" && (
          <>
            {/* Inputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                <div style={{ marginBottom: "15px" }}>
                  <label className="input-label">{t("tradeType")}</label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", fontSize: "0.95rem" }}
                  >
                    <option value="delivery">{t("deliveryCNC")}</option>
                    <option value="intraday">{t("intradayMIS")}</option>
                    <option value="futures">Futures (Equity)</option>
                    <option value="options">Options (Equity)</option>
                  </select>
                </div>

                {/* Buy Price Slider & Sync */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("buyPrice")}</label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Sell Price Slider & Sync */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("sellPrice")}</label>
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Qty Slider & Sync */}
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("quantity")}</label>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5000"
                    step="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>
              </div>
            </div>

            {/* Outputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Profit & Loss Card */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: netPL >= 0 ? "#e8f5e9" : "#ffebee",
                  border: netPL >= 0 ? "1px solid #c8e6c9" : "1px solid #ffcdd2",
                  color: netPL >= 0 ? "#2e7d32" : "#c62828",
                  transition: "all 0.2s"
                }}
              >
                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", textTransform: "uppercase" }}>{t("netPL")}</h4>
                <div style={{ fontSize: "2.2rem", fontWeight: "700" }}>
                  ₹{formatCurrency(netPL)}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "8px", color: "#555" }}>
                  {t("breakevenPoints")}: <strong style={{ color: "#333" }}>{formatCurrency(breakevenPoints)}</strong> pts
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                <h4 style={{ margin: "0 0 15px 0", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>{t("totalCharges")}</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <tbody>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("turnover")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(turnover)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("brokerage")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(brokerage)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("stt")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(stt)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("exchangeTx")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(exchangeTx)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("gst")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(gst)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("sebiCharges")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(sebiCharges)}</td>
                    </tr>
                    <tr className="table-row">
                      <td style={{ padding: "8px 0" }}>{t("stampDuty")}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>₹{formatCurrency(stampDuty)}</td>
                    </tr>
                    <tr style={{ borderTop: "2px solid #eee", fontSize: "1rem" }}>
                      <td style={{ padding: "12px 0 0 0", fontWeight: "700" }}>{t("totalCharges")}</td>
                      <td style={{ padding: "12px 0 0 0", textAlign: "right", fontWeight: "700", color: "#df5b2b" }}>₹{formatCurrency(totalCharges)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* SIP CALCULATOR TAB */}
        {activeTab === "sip" && (
          <>
            {/* Inputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                {/* Monthly Investment */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("monthlyInvestment")}</label>
                    <input
                      type="number"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Math.max(100, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Return rate */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("expectedReturn")}</label>
                    <input
                      type="number"
                      value={sipReturn}
                      onChange={(e) => setSipReturn(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={sipReturn}
                    onChange={(e) => setSipReturn(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Years */}
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("timePeriod")}</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={(e) => setSipYears(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>
              </div>
            </div>

            {/* Outputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("investedAmount")}</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>₹{formatCurrency(sipResult.investedAmount)}</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("estReturns")}</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#4caf50" }}>₹{formatCurrency(sipResult.estReturns)}</div>
                </div>
                <hr style={{ margin: "5px 0" }} />
                <div>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>{t("totalValue")}</span>
                  <div style={{ fontSize: "2.2rem", fontWeight: "700", color: "#df5b2b" }}>₹{formatCurrency(sipResult.totalValue)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LUMPSUM CALCULATOR TAB */}
        {activeTab === "lumpsum" && (
          <>
            {/* Inputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                {/* Lumpsum Amount */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("lumpsumInvestment")}</label>
                    <input
                      type="number"
                      value={lumpsumAmt}
                      onChange={(e) => setLumpsumAmt(Math.max(1000, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="5000"
                    value={lumpsumAmt}
                    onChange={(e) => setLumpsumAmt(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Return rate */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("expectedReturn")}</label>
                    <input
                      type="number"
                      value={lumpsumReturn}
                      onChange={(e) => setLumpsumReturn(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={lumpsumReturn}
                    onChange={(e) => setLumpsumReturn(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Years */}
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("timePeriod")}</label>
                    <input
                      type="number"
                      value={lumpsumYears}
                      onChange={(e) => setLumpsumYears(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={lumpsumYears}
                    onChange={(e) => setLumpsumYears(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>
              </div>
            </div>

            {/* Outputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("investedAmount")}</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>₹{formatCurrency(lumpsumResult.investedAmount)}</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("estReturns")}</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#4caf50" }}>₹{formatCurrency(lumpsumResult.estReturns)}</div>
                </div>
                <hr style={{ margin: "5px 0" }} />
                <div>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>{t("totalValue")}</span>
                  <div style={{ fontSize: "2.2rem", fontWeight: "700", color: "#df5b2b" }}>₹{formatCurrency(lumpsumResult.totalValue)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MARGIN CALCULATOR TAB */}
        {activeTab === "margin" && (
          <>
            {/* Inputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                {/* Share Price */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("sharePrice")}</label>
                    <input
                      type="number"
                      value={marginPrice}
                      onChange={(e) => setMarginPrice(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={marginPrice}
                    onChange={(e) => setMarginPrice(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Qty */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="input-label">{t("quantity")}</label>
                    <input
                      type="number"
                      value={marginQty}
                      onChange={(e) => setMarginQty(Math.max(1, Number(e.target.value)))}
                      className="num-input"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5000"
                    step="1"
                    value={marginQty}
                    onChange={(e) => setMarginQty(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#df5b2b" }}
                  />
                </div>

                {/* Product Type Dropdown */}
                <div style={{ marginBottom: "10px" }}>
                  <label className="input-label">{t("productType")}</label>
                  <select
                    value={marginProduct}
                    onChange={(e) => setMarginProduct(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", fontSize: "0.95rem" }}
                  >
                    <option value="MIS">{t("intradayMIS")}</option>
                    <option value="CNC">{t("deliveryCNC")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Outputs Column */}
            <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("turnover")}</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>₹{formatCurrency(marginResult.orderValue)}</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>{t("leverageApplied")}</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>{marginResult.leverageText}</div>
                </div>
                <hr style={{ margin: "5px 0" }} />
                <div>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>{t("marginRequiredLabel")}</span>
                  <div style={{ fontSize: "2.2rem", fontWeight: "700", color: "#df5b2b" }}>₹{formatCurrency(marginResult.marginRequired)}</div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Embedded CSS supporting styles and dark-mode overrides */}
      <style>{`
        .tab-btn {
          padding: 10px 18px;
          border: 1px solid #ddd;
          border-radius: 20px;
          background-color: #fff;
          color: #666;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          background-color: #f7f7f7;
          border-color: #ccc;
        }
        .tab-btn.active {
          background-color: #df5b2b;
          color: #fff;
          border-color: #df5b2b;
        }
        .input-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }
        .num-input {
          width: 80px;
          padding: 5px 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          outline: none;
          text-align: right;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .table-row {
          border-bottom: 1px solid #f2f2f2;
        }
        
        /* Dark Mode compatibility */
        body.dark-mode .card-input {
          background-color: #1a1a1a !important;
          border-color: #2b2b2b !important;
          color: #e0e0e0 !important;
        }
        body.dark-mode .tab-btn {
          background-color: #1a1a1a !important;
          border-color: #2b2b2b !important;
          color: #aaa !important;
        }
        body.dark-mode .tab-btn.active {
          background-color: #df5b2b !important;
          color: #fff !important;
          border-color: #df5b2b !important;
        }
        body.dark-mode .input-label {
          color: #aaa !important;
        }
        body.dark-mode .num-input {
          background-color: #121212 !important;
          border-color: #2b2b2b !important;
          color: #fff !important;
        }
        body.dark-mode select {
          background-color: #121212 !important;
          border-color: #2b2b2b !important;
          color: #fff !important;
        }
        body.dark-mode .table-row {
          border-bottom: 1px solid #2b2b2b !important;
        }
        body.dark-mode hr {
          border-color: #2b2b2b !important;
        }
        body.dark-mode td {
          color: #e0e0e0 !important;
        }
        body.dark-mode strong {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Calculators;
