import React, { useState } from "react";
import Investment from "./Investment";
import OpenAccount from "../../OpenAccount";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Save token and credentials
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
    <>
      <div className="container py-5">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <img
              src="media/images/account_open.svg"
              alt="Account Open"
              style={{ width: "80%" }}
            />
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="card shadow border-0 rounded-3">
              <div className="card-body p-4 p-sm-5">
                <h3 className="card-title text-center mb-4 fw-bold">Sign up now</h3>
                <h6 className="text-secondary text-center mb-4">
                  Or track your existing application
                </h6>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ fontSize: "14px" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingUsername"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingUsername">Full Name</label>
                  </div>

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
                    {loading ? "Registering..." : "Sign up"}
                  </button>

                  <div className="text-center">
                    <p className="text-secondary" style={{ fontSize: "13px" }}>
                      Already have an account? <a href="/login" style={{ color: "#387ed1", textDecoration: "none" }}>Log in</a>
                    </p>
                    <p className="text-secondary mt-3" style={{ fontSize: "11px" }}>
                      By proceeding, you agree to the Zerodha terms & privacy policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Investment />
      <OpenAccount />
    </>
  );
}

export default Signup;
