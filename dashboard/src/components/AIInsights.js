import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

const AIInsights = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => translations[language][key] || key;

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: t("aiDefaultGreeting"),
      time: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Sync scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Clear input if sending from input box
    if (!textToSend) {
      setInputText("");
    }

    // Add user message
    const userMsg = {
      sender: "user",
      text: text,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3002/ai-insights",
        { question: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMsg = {
        sender: "ai",
        text: response.data.answer,
        time: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Insights API failed:", error);
      const errorMsg = {
        sender: "ai",
        text: "I apologize, but I am currently unable to process your request. Please check that the backend server is running and try again.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const suggestions = [
    t("suggestion1"),
    t("suggestion2"),
    t("suggestion3"),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh", fontFamily: "sans-serif", padding: "10px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px", borderBottom: "1px solid #eee", backgroundColor: "#fff" }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: "600", color: "#444" }}>{t("aiTitle")}</h4>
          <span style={{ fontSize: "0.75rem", color: "#4caf50", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4caf50", display: "inline-block" }}></span>
            {t("aiStatus")}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "15px", backgroundColor: "#fcfcfc", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === "user" ? "#4184f3" : "#fff",
                color: msg.sender === "user" ? "#fff" : "#333",
                padding: "12px 16px",
                borderRadius: msg.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                fontSize: "0.9rem",
                border: msg.sender === "ai" ? "1px solid #f1f1f1" : "none",
              }}
            >
              {msg.text}
            </div>
            <span
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                fontSize: "0.7rem",
                color: "#999",
                marginTop: "4px",
              }}
            >
              {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "12px 16px",
                borderRadius: "12px 12px 12px 2px",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f1f1f1",
                display: "flex",
                gap: "5px",
                alignItems: "center"
              }}
            >
              <div className="spinner-bubble" style={{ width: "6px", height: "6px", backgroundColor: "#888", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out" }}></div>
              <div className="spinner-bubble" style={{ width: "6px", height: "6px", backgroundColor: "#888", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out", animationDelay: "0.2s" }}></div>
              <div className="spinner-bubble" style={{ width: "6px", height: "6px", backgroundColor: "#888", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out", animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div style={{ display: "flex", gap: "10px", padding: "10px 15px", overflowX: "auto", backgroundColor: "#fff", borderTop: "1px solid #eee" }}>
          {suggestions.map((sug, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(sug)}
              style={{
                padding: "8px 14px",
                border: "1px solid #4184f3",
                borderRadius: "20px",
                backgroundColor: "#f5f8ff",
                color: "#4184f3",
                fontSize: "0.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4184f3";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f5f8ff";
                e.target.style.color = "#4184f3";
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ display: "flex", gap: "10px", padding: "12px 15px", borderTop: "1px solid #eee", backgroundColor: "#fff", alignItems: "center" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t("aiPlaceholder")}
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #e0e0e0",
            borderRadius: "24px",
            fontSize: "0.9rem",
            outline: "none",
            backgroundColor: "#fafafa"
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputText.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#df5b2b",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.85rem",
            opacity: loading || !inputText.trim() ? 0.6 : 1,
          }}
        >
          {t("send")}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};

export default AIInsights;
