import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "./landing_page/LanguageContext";
import { translations } from "./landing_page/translations";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState("");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { language, setLanguage } = useContext(LanguageContext);

    const t = (key) => translations[language][key] || key;

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setIsLoggedIn(true);
            setToken(storedToken);
        } else {
            setIsLoggedIn(false);
            setToken("");
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setToken("");
        window.location.reload();
    };

    return (
        <div className='container'>
            <nav className="navbar navbar-expand-lg border-bottom">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img src='media/images/logo.svg' alt="logo" style={{ width: "20%" }}></img></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link active animate-text" href={`http://localhost:3001/?token=${token}`}>{t("dashboard")}</a>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className="nav-link active btn btn-link" 
                                            onClick={handleLogout}
                                            style={{ textDecoration: 'none', border: 'none', background: 'none', padding: '8px 0', verticalAlign: 'middle', cursor: 'pointer' }}
                                        >
                                            {t("logout")}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/signup">{t("signup")}</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/login">{t("login")}</Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <Link className="nav-link active" to="/about">{t("about")}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/product">{t("products")}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/pricing">{t("pricing")}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/support">{t("support")}</Link>
                            </li>
                            <li className="nav-item" style={{ alignSelf: 'center', marginLeft: '40px', display: 'flex', alignItems: 'center' }}>
                                <button 
                                    className="btn btn-link nav-link p-0 active" 
                                    onClick={toggleTheme} 
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', textDecoration: 'none', marginRight: '20px' }}
                                    title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                                >
                                    {theme === "light" ? "🌙" : "☀️"}
                                </button>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', fontWeight: '500' }}>
                                    <span style={{ cursor: 'pointer', color: language === 'en' ? '#387ed1' : '#888', fontWeight: language === 'en' ? 'bold' : '500' }} onClick={() => setLanguage('en')}>EN</span>
                                    <span style={{ cursor: 'pointer', color: language === 'hi' ? '#387ed1' : '#888', fontWeight: language === 'hi' ? 'bold' : '500' }} onClick={() => setLanguage('hi')}>HI</span>
                                    <span style={{ cursor: 'pointer', color: language === 'es' ? '#387ed1' : '#888', fontWeight: language === 'es' ? 'bold' : '500' }} onClick={() => setLanguage('es')}>ES</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;