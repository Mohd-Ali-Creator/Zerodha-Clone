import React from "react";

function Investment() {
    return (
        <div className="container m-5 p-5">
            <h3 className="mb-4">
                Investment options with Zerodha demat account
            </h3>

            <div className="row g-4">

                {/* Stocks */}
                <div className="col-6 d-flex align-items-start">
                    <div className="icon-box me-3">📊</div>
                    <div>
                        <h5 className="fw-bold">Stocks</h5>
                        <p className="text-muted">
                            Invest in all exchange-listed securities
                        </p>
                    </div>
                </div>

                {/* Mutual Funds */}
                <div className="col-6 d-flex align-items-start">
                    <div className="icon-box me-3">🏦</div>
                    <div>
                        <h5 className="fw-bold">Mutual funds</h5>
                        <p className="text-muted">
                            Invest in commission-free direct mutual funds
                        </p>
                    </div>
                </div>

                {/* IPO */}
                <div className="col-6 d-flex align-items-start">
                    <div className="icon-box me-3">💳</div>
                    <div>
                        <h5 className="fw-bold">IPO</h5>
                        <p className="text-muted">
                            Apply to the latest IPOs instantly via UPI
                        </p>
                    </div>
                </div>

                {/* Futures & Options */}
                <div className="col-6 d-flex align-items-start">
                    <div className="icon-box me-3">📈</div>
                    <div>
                        <h5 className="fw-bold">Futures & options</h5>
                        <p className="text-muted">
                            Hedge and mitigate market risk through simplified F&O trading
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Investment;