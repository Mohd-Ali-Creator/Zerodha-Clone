import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Store token and redirect to dashboard with token in query params
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      
      // Redirect to the dashboard (running on port 3001) with the token
      window.location.href = `http://localhost:3001/?token=${data.token}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-4 p-sm-5">
              <h3 className="card-title text-center mb-4 fw-bold">Login to Kite</h3>
              
              {error && (
                <div className="alert alert-danger" role="alert" style={{ fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingEmail">Email address</label>
                </div>
                
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <button
                  className="w-100 btn btn-lg btn-primary mb-3"
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center">
                  <p className="text-secondary" style={{ fontSize: "14px" }}>
                    Don't have an account? <a href="/signup" style={{ color: "#387ed1", textDecoration: "none" }}>Sign up now</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
