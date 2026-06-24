import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState("");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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
                                        <a className="nav-link active animate-text" href={`http://localhost:3001/?token=${token}`}>Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className="nav-link active btn btn-link" 
                                            onClick={handleLogout}
                                            style={{ textDecoration: 'none', border: 'none', background: 'none', padding: '8px 0', verticalAlign: 'middle', cursor: 'pointer' }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="/signup">Signup</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/login">Login</Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <Link className="nav-link active" to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/product">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/pricing">Pricing</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/support">Support</Link>
                            </li>
                            <li className="nav-item" style={{ alignSelf: 'center', marginLeft: '40px' }}>
                                <button 
                                    className="btn btn-link nav-link p-0 active" 
                                    onClick={toggleTheme} 
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', textDecoration: 'none' }}
                                    title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                                >
                                    {theme === "light" ? "🌙" : "☀️"}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;