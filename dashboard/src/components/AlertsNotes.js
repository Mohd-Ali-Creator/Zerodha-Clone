import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, ChartTooltip, Legend);

const AlertsNotes = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [activeTab, setActiveTab] = useState("reminders");

  // Price Alerts states
  const [alerts, setAlerts] = useState([]);
  const [alertSymbol, setAlertSymbol] = useState("INFY");
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState("above");
  const [alertToast, setAlertToast] = useState(null);

  // Notes states
  const [notes, setNotes] = useState([]);
  const [noteSymbol, setNoteSymbol] = useState("INFY");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // News states
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // History Chart states
  const [chartSymbol, setChartSymbol] = useState("INFY");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const availableStocks = ["INFY", "ONGC", "TCS", "KPITTECH", "QUICKHEAL", "WIPRO", "RELIANCE", "HUL", "SBIN", "HDFCBANK", "BHARTIARTL", "TATAPOWER", "ITC"];

  const token = localStorage.getItem("token");

  // Fetch initial data
  useEffect(() => {
    fetchAlerts();
    fetchNotes();
    fetchNews();
    fetchHistoricalData(chartSymbol);
  }, []);

  // Fetch Alerts
  const fetchAlerts = async () => {
    try {
      const response = await axios.get("http://localhost:3002/alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3002/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch News
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const response = await axios.get("http://localhost:3002/news");
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch Historical Data for selected symbol
  const fetchHistoricalData = async (symbol) => {
    setChartLoading(true);
    try {
      const response = await axios.get(`http://localhost:3002/historical?symbol=${symbol}`);
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setChartLoading(false);
    }
  };

  // Create Alert
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!alertTargetPrice || isNaN(alertTargetPrice)) return;

    try {
      await axios.post(
        "http://localhost:3002/alerts",
        {
          symbol: alertSymbol,
          targetPrice: Number(alertTargetPrice),
          condition: alertCondition
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertTargetPrice("");
      fetchAlerts();
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  // Delete Alert
  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAlerts();
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  // Create Note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    try {
      await axios.post(
        "http://localhost:3002/notes",
        {
          symbol: noteSymbol,
          title: noteTitle,
          content: noteContent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoteTitle("");
      setNoteContent("");
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Poll prices and check alerts every 8 seconds
  useEffect(() => {
    const checkAlertTriggers = async () => {
      const activeAlerts = alerts.filter((a) => a.status === "active");
      if (activeAlerts.length === 0) return;

      const symbols = activeAlerts.map((a) => a.symbol).join(",");
      try {
        const res = await axios.get(`http://localhost:3002/prices?symbols=${symbols}`);
        const prices = res.data;

        for (const alert of activeAlerts) {
          const currentPriceData = prices[alert.symbol];
          if (!currentPriceData) continue;

          const currentPrice = currentPriceData.price;
          let triggered = false;

          if (alert.condition === "above" && currentPrice >= alert.targetPrice) {
            triggered = true;
          } else if (alert.condition === "below" && currentPrice <= alert.targetPrice) {
            triggered = true;
          }

          if (triggered) {
            // Trigger alert on backend
            await axios.put(
              `http://localhost:3002/alerts/${alert._id}`,
              { status: "triggered", triggerPrice: currentPrice },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Display Toast notification
            setAlertToast({
              symbol: alert.symbol,
              targetPrice: alert.targetPrice,
              condition: alert.condition,
              triggerPrice: currentPrice
            });

            // Re-fetch alerts
            fetchAlerts();

            // Clear toast after 6 seconds
            setTimeout(() => {
              setAlertToast(null);
            }, 6000);
          }
        }
      } catch (error) {
        console.error("Error checking alert triggers:", error);
      }
    };

    const interval = setInterval(checkAlertTriggers, 8000);
    return () => clearInterval(interval);
  }, [alerts]);

  const handleChartSymbolChange = (e) => {
    const sym = e.target.value;
    setChartSymbol(sym);
    fetchHistoricalData(sym);
  };

  // Render Line Chart data config
  const lineChartData = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: `${chartSymbol} Price (₹)`,
        data: chartData.map((item) => item.close),
        fill: false,
        backgroundColor: "rgba(223, 91, 43, 0.2)",
        borderColor: "#df5b2b",
        borderWidth: 2,
        tension: 0.15,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f3f3f3" } }
    }
  };

  return (
    <div className="alerts-notes-container" style={{ padding: "20px", fontFamily: "sans-serif", position: "relative" }}>
      
      {/* Toast Alert Banner */}
      {alertToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.3s ease-out"
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            🔔 Price Trigger Reached!
          </span>
          <span style={{ fontSize: "0.85rem", marginTop: "4px" }}>
            {alertToast.symbol} has crossed your alert target of ₹{alertToast.targetPrice} ({alertToast.condition === "above" ? "Above" : "Below"}) at a current price of ₹{alertToast.triggerPrice}.
          </span>
        </div>
      )}

      <h3 style={{ margin: "0 0 20px 0", fontWeight: "600", fontSize: "1.6rem" }}>{t("alertsNotes")}</h3>

      {/* Tabs */}
      <div className="tabs-header" style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("reminders")} className={`tab-btn ${activeTab === "reminders" ? "active" : ""}`}>
          {t("priceReminders")}
        </button>
        <button onClick={() => setActiveTab("notes")} className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}>
          {t("notes")}
        </button>
        <button onClick={() => setActiveTab("news")} className={`tab-btn ${activeTab === "news" ? "active" : ""}`}>
          {t("news")}
        </button>
        <button onClick={() => setActiveTab("chart")} className={`tab-btn ${activeTab === "chart" ? "active" : ""}`}>
          {t("historyChart")}
        </button>
      </div>

      {/* Content Body */}
      <div className="tab-content">
        
        {/* PRICE REMINDERS TAB */}
        {activeTab === "reminders" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
            {/* Create Alert Form Card */}
            <div style={{ flex: "1 1 320px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                <h4 style={{ margin: "0 0 15px 0" }}>{t("createAlert")}</h4>
                <form onSubmit={handleCreateAlert} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label className="input-label">{t("stockTicker")}</label>
                    <select
                      value={alertSymbol}
                      onChange={(e) => setAlertSymbol(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }}
                    >
                      {availableStocks.map((sym) => (
                        <option key={sym} value={sym}>{sym}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">{t("condition")}</label>
                    <select
                      value={alertCondition}
                      onChange={(e) => setAlertCondition(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }}
                    >
                      <option value="above">{t("above")}</option>
                      <option value="below">{t("below")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">{t("targetPrice")}</label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box", outline: "none" }}
                    />
                  </div>
                  <button type="submit" className="action-btn" style={{ padding: "12px", border: "none", backgroundColor: "#df5b2b", color: "#fff", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                    + {t("createAlert")}
                  </button>
                </form>
              </div>
            </div>

            {/* Price Alerts Table List */}
            <div style={{ flex: "2 1 500px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                <h4 style={{ margin: "0 0 15px 0" }}>Active Price Reminders & History</h4>
                {alerts.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>{t("noAlerts")}</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                          <th style={{ padding: "10px" }}>Stock</th>
                          <th style={{ padding: "10px" }}>Condition</th>
                          <th style={{ padding: "10px" }}>Target</th>
                          <th style={{ padding: "10px" }}>{t("alertStatus")}</th>
                          <th style={{ padding: "10px" }}>Trigger Price / Time</th>
                          <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map((a) => (
                          <tr key={a._id} className="table-row" style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px", fontWeight: "bold" }}>{a.symbol}</td>
                            <td style={{ padding: "10px" }}>{a.condition === "above" ? t("above") : t("below")}</td>
                            <td style={{ padding: "10px" }}>₹{a.targetPrice.toFixed(2)}</td>
                            <td style={{ padding: "10px" }}>
                              <span style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                backgroundColor: a.status === "active" ? "#e3f2fd" : "#e8f5e9",
                                color: a.status === "active" ? "#1e88e5" : "#2e7d32"
                              }}>
                                {a.status === "active" ? t("active") : t("triggered")}
                              </span>
                            </td>
                            <td style={{ padding: "10px", color: "#666" }}>
                              {a.status === "triggered" ? (
                                <div>
                                  <strong>₹{a.triggerPrice?.toFixed(2)}</strong>
                                  <div style={{ fontSize: "0.7rem", color: "#999" }}>
                                    {new Date(a.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td style={{ padding: "10px", textAlign: "center" }}>
                              <button onClick={() => handleDeleteAlert(a._id)} style={{ border: "none", backgroundColor: "transparent", color: "#d32f2f", cursor: "pointer", fontWeight: "bold" }}>
                                {t("delete")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>
            {/* Create Note Form Card */}
            <div style={{ flex: "1 1 320px" }}>
              <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                <h4 style={{ margin: "0 0 15px 0" }}>Add Research Note</h4>
                <form onSubmit={handleCreateNote} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label className="input-label">{t("stockTicker")}</label>
                    <select
                      value={noteSymbol}
                      onChange={(e) => setNoteSymbol(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }}
                    >
                      {availableStocks.map((sym) => (
                        <option key={sym} value={sym}>{sym}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">{t("noteTitle")}</label>
                    <input
                      type="text"
                      placeholder="e.g. INFY Growth Outlook"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="input-label">{t("noteContent")}</label>
                    <textarea
                      placeholder="Write your research findings..."
                      rows="4"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <button type="submit" className="action-btn" style={{ padding: "12px", border: "none", backgroundColor: "#df5b2b", color: "#fff", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                    {t("addNote")}
                  </button>
                </form>
              </div>
            </div>

            {/* Notes Grid List */}
            <div style={{ flex: "2 1 500px" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>Saved Stock Notes</h4>
              {notes.length === 0 ? (
                <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>{t("noNotes")}</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "15px" }}>
                  {notes.map((n) => (
                    <div key={n._id} className="card-input" style={{ padding: "15px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ backgroundColor: "#f5f8ff", color: "#4184f3", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                            {n.symbol}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#999" }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: "600" }}>{n.title}</h5>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#555", whiteSpace: "pre-wrap" }}>{n.content}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", borderTop: "1px solid #f9f9f9", paddingTop: "8px" }}>
                        <button onClick={() => handleDeleteNote(n._id)} style={{ border: "none", backgroundColor: "transparent", color: "#d32f2f", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                          {t("delete")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MARKET NEWS TAB */}
        {activeTab === "news" && (
          <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
            <h4 style={{ margin: "0 0 20px 0", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Latest Market News</h4>
            {newsLoading ? (
              <p>Loading news...</p>
            ) : news.length === 0 ? (
              <p>No news available right now.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {news.map((item, index) => (
                  <div key={index} className="news-item" style={{ borderBottom: "1px solid #f5f5f5", paddingBottom: "15px" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: "bold" }}>{item.source}</span>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#ccc" }}></span>
                      <span style={{ fontSize: "0.75rem", color: "#888" }}>{item.date}</span>
                    </div>
                    <h5 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", fontWeight: "600", color: "#333" }}>{item.title}</h5>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>{item.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORICAL CHART TAB */}
        {activeTab === "chart" && (
          <div className="card-input" style={{ padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>{t("historyChart")}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{t("stockTicker")}:</span>
                <select
                  value={chartSymbol}
                  onChange={handleChartSymbolChange}
                  style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }}
                >
                  {availableStocks.map((sym) => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>
            </div>

            {chartLoading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "250px" }}>
                <p>Loading historical chart...</p>
              </div>
            ) : chartData.length === 0 ? (
              <p>No historical data loaded.</p>
            ) : (
              <div>
                <div style={{ height: "300px", position: "relative" }}>
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#888" }}>Max Close:</span>
                    <strong style={{ marginLeft: "5px" }}>
                      ₹{Math.max(...chartData.map((item) => item.close)).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Min Close:</span>
                    <strong style={{ marginLeft: "5px" }}>
                      ₹{Math.min(...chartData.map((item) => item.close)).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Average:</span>
                    <strong style={{ marginLeft: "5px" }}>
                      ₹{(chartData.reduce((acc, item) => acc + item.close, 0) / chartData.length).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Styled definitions */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
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
          margin-bottom: 5px;
          display: block;
        }
        
        /* Dark Mode compatibility overrides */
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
        body.dark-mode select, body.dark-mode input, body.dark-mode textarea {
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
        body.dark-mode td, body.dark-mode th {
          color: #e0e0e0 !important;
        }
        body.dark-mode tr {
          border-color: #2b2b2b !important;
        }
        body.dark-mode .news-item {
          border-bottom-color: #2b2b2b !important;
        }
        body.dark-mode .news-item h5 {
          color: #fff !important;
        }
        body.dark-mode .news-item p {
          color: #bbb !important;
        }
      `}</style>

    </div>
  );
};

export default AlertsNotes;
