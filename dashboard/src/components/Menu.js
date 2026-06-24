import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "./LanguageContext";
import { translations } from "../data/translations";

const Menu = ({ user }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "http://localhost:3000/login";
  };

  const t = (key) => translations[language][key] || key;

  const username = user ? user.username : t("username");
  const avatarInitials = user 
    ? user.username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : t("avatar");

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Dashboard logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                {t("dashboard")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                {t("orders")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                {t("holdings")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                {t("positions")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                {t("funds")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                {t("apps")}
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/ai-insights"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                {t("aiInsights")}
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile-container">
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">{avatarInitials}</div>
            <p className="username">{username}</p>
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 12px", borderBottom: "1px solid #eee", fontSize: "0.8rem", color: "#888" }}>
                <span style={{ cursor: "pointer", fontWeight: language === "en" ? "bold" : "normal", color: language === "en" ? "#df5b2b" : "#666" }} onClick={() => setLanguage("en")}>EN</span>
                <span style={{ cursor: "pointer", fontWeight: language === "hi" ? "bold" : "normal", color: language === "hi" ? "#df5b2b" : "#666" }} onClick={() => setLanguage("hi")}>HI</span>
                <span style={{ cursor: "pointer", fontWeight: language === "es" ? "bold" : "normal", color: language === "es" ? "#df5b2b" : "#666" }} onClick={() => setLanguage("es")}>ES</span>
              </div>
              <button className="profile-dropdown-item" onClick={toggleTheme}>
                {theme === "light" ? `🌙 ${t("darkMode")}` : `☀️ ${t("lightMode")}`}
              </button>
              <button className="profile-dropdown-item" onClick={handleLogout}>
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
