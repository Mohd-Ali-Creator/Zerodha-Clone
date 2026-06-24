import React, { useState, useEffect } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { LanguageProvider } from "./LanguageContext";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for token in URL query string
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");

    let token = tokenFromUrl;

    if (tokenFromUrl) {
      // Save token to localStorage
      localStorage.setItem("token", tokenFromUrl);
      // Clean query parameter from URL without page reload
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      // 2. Check for token in localStorage
      token = localStorage.getItem("token");
    }

    // 3. If no token, redirect to landing page login
    if (!token) {
      window.location.href = "http://localhost:3000/login";
      return;
    }

    // 4. Fetch user profile to verify token and get user details
    axios
      .get("http://localhost:3002/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        localStorage.setItem("username", response.data.username);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        // Token might be expired or invalid, clear and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "http://localhost:3000/login";
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h3>Loading Kite...</h3>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <TopBar user={user} />
      <Dashboard user={user} />
    </LanguageProvider>
  );
};

export default Home;