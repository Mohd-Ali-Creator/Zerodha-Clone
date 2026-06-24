import React, { useState, useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

const Apps = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [activeFilter, setActiveFilter] = useState("all");
  const [connectionStates, setConnectionStates] = useState({
    smallcase: false,
    sensibull: false,
    streak: false,
    goldenpi: false,
    tijori: false,
  });
  const [connecting, setConnecting] = useState({});

  // Developer API states
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [generatingApi, setGeneratingApi] = useState(false);

  const handleConnect = (appId) => {
    if (connectionStates[appId]) {
      // Disconnect
      setConnectionStates((prev) => ({ ...prev, [appId]: false }));
      return;
    }

    // Connect flow with loading simulation
    setConnecting((prev) => ({ ...prev, [appId]: true }));
    setTimeout(() => {
      setConnectionStates((prev) => ({ ...prev, [appId]: true }));
      setConnecting((prev) => ({ ...prev, [appId]: false }));
    }, 1200);
  };

  const handleGenerateKeys = () => {
    setGeneratingApi(true);
    setTimeout(() => {
      // Generate realistic mock API keys
      setApiKey("kite_conn_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10));
      setApiSecret("secret_" + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12));
      setGeneratingApi(false);
    }, 1000);
  };

  const appList = [
    {
      id: "smallcase",
      name: "Smallcase",
      category: "investing",
      descKey: "smallcaseDesc",
      tag: "Thematic Investing",
      logoColor: "#1e88e5",
      logoLetter: "S",
    },
    {
      id: "sensibull",
      name: "Sensibull",
      category: "trading",
      descKey: "sensibullDesc",
      tag: "Options Trading",
      logoColor: "#e53935",
      logoLetter: "Sb",
    },
    {
      id: "streak",
      name: "Streak",
      category: "trading",
      descKey: "streakDesc",
      tag: "Algo Trading",
      logoColor: "#43a047",
      logoLetter: "St",
    },
    {
      id: "goldenpi",
      name: "GoldenPi",
      category: "investing",
      descKey: "goldenpiDesc",
      tag: "Bonds & Yields",
      logoColor: "#ffb300",
      logoLetter: "G",
    },
    {
      id: "tijori",
      name: "Tijori",
      category: "research",
      descKey: "tijoriDesc",
      tag: "Research & Analysis",
      logoColor: "#8e24aa",
      logoLetter: "T",
    },
  ];

  const filteredApps = appList.filter(
    (app) => activeFilter === "all" || app.category === activeFilter
  );

  return (
    <div className="apps-page-container" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontWeight: "600", fontSize: "1.6rem" }}>{t("exploreApps")}</h3>
        <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>{t("exploreDesc")}</p>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        <button
          onClick={() => setActiveFilter("all")}
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("investing")}
          className={`filter-btn ${activeFilter === "investing" ? "active" : ""}`}
        >
          Investing
        </button>
        <button
          onClick={() => setActiveFilter("trading")}
          className={`filter-btn ${activeFilter === "trading" ? "active" : ""}`}
        >
          Options & Algos
        </button>
        <button
          onClick={() => setActiveFilter("research")}
          className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
        >
          Research
        </button>
      </div>

      {/* Grid List */}
      <div className="apps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        {filteredApps.map((app) => (
          <div key={app.id} className="app-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff", transition: "all 0.2s" }}>
            <div>
              {/* Card Header: Icon and Label */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: app.logoColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.1rem" }}>
                    {app.logoLetter}
                  </div>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{app.name}</span>
                </div>
                <span className="app-tag" style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", color: "#666", padding: "4px 8px", borderRadius: "12px", fontWeight: "600" }}>
                  {app.tag}
                </span>
              </div>
              <p style={{ margin: "0 0 20px 0", fontSize: "0.85rem", color: "#555", lineHeight: "1.4" }}>
                {t(app.descKey)}
              </p>
            </div>
            
            {/* Action connect button */}
            <div>
              <button
                onClick={() => handleConnect(app.id)}
                disabled={connecting[app.id]}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid",
                  borderColor: connectionStates[app.id] ? "#4caf50" : "#4184f3",
                  borderRadius: "4px",
                  backgroundColor: connectionStates[app.id] ? "#e8f5e9" : "#fff",
                  color: connectionStates[app.id] ? "#2e7d32" : "#4184f3",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                {connecting[app.id] ? (
                  <span className="spinner" style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid", borderRadius: "50%", borderTopColor: "transparent", animation: "spin 1s linear infinite" }}></span>
                ) : connectionStates[app.id] ? (
                  <>✓ {t("connected")}</>
                ) : (
                  <>{t("connect")}</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Developer API panel */}
      <div className="api-panel" style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fafafa" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{t("kiteconnectDesc")}</h4>
        <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.85rem" }}>
          Generate your sandbox API Credentials to connect custom trading scripts, algos, and excel terminals with the simulated trading platform.
        </p>

        {apiKey ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
            <div>
              <span className="api-label" style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#666" }}>API KEY</span>
              <div className="api-val" style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fff", fontSize: "0.85rem", wordBreak: "break-all", fontFamily: "monospace" }}>
                {apiKey}
              </div>
            </div>
            <div>
              <span className="api-label" style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#666" }}>API SECRET</span>
              <div className="api-val" style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fff", fontSize: "0.85rem", wordBreak: "break-all", fontFamily: "monospace" }}>
                {apiSecret}
              </div>
            </div>
            <button onClick={() => { setApiKey(""); setApiSecret(""); }} style={{ border: "none", backgroundColor: "transparent", color: "#d32f2f", cursor: "pointer", fontWeight: "bold", textAlign: "left", padding: "5px 0", fontSize: "0.85rem" }}>
              Revoke Keys
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateKeys}
            disabled={generatingApi}
            className="action-btn"
            style={{
              padding: "10px 20px",
              backgroundColor: "#df5b2b",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: generatingApi ? 0.6 : 1
            }}
          >
            {generatingApi ? "Generating..." : "Generate API Keys"}
          </button>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 20px;
          background-color: #fff;
          color: #666;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          background-color: #f7f7f7;
        }
        .filter-btn.active {
          background-color: #df5b2b;
          color: #fff;
          border-color: #df5b2b;
        }
        
        .app-card:hover {
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
          border-color: #df5b2b !important;
        }

        /* Dark Mode overrides */
        body.dark-mode .app-card, body.dark-mode .api-panel {
          background-color: #1a1a1a !important;
          border-color: #2b2b2b !important;
          color: #e0e0e0 !important;
        }
        body.dark-mode .filter-btn {
          background-color: #1a1a1a !important;
          border-color: #2b2b2b !important;
          color: #aaa !important;
        }
        body.dark-mode .filter-btn.active {
          background-color: #df5b2b !important;
          color: #fff !important;
          border-color: #df5b2b !important;
        }
        body.dark-mode p {
          color: #bbb !important;
        }
        body.dark-mode .app-tag {
          background-color: #2b2b2b !important;
          color: #bbb !important;
        }
        body.dark-mode .api-label {
          color: #aaa !important;
        }
        body.dark-mode .api-val {
          background-color: #121212 !important;
          border-color: #2b2b2b !important;
          color: #fff !important;
        }
        body.dark-mode button {
          border-color: #2b2b2b;
        }
        body.dark-mode .app-card button:not(.connected-btn) {
          background-color: #1a1a1a;
        }
      `}</style>

    </div>
  );
};

export default Apps;