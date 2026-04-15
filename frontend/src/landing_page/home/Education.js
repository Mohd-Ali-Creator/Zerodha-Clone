import React from "react";

function Education() {
    return (
        <div className='container p-5 mb-5'>
            <div className='row'>
                <div className='col-6'>
                    <img src="media/images/index-education.svg" alt='Eduction Image' style={{ width: "70%", margin: "0 auto", display: "block" }} />
                </div>
                <div className='col-6'>
                    <h2 className='fs-3 mb-4 mt-5'>Free and open market education</h2>
                    <p className='text-muted mb-3'>
                        Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.
                    </p>
                    <a href='https://zerodha.com/varsity/' className='text-decoration-none'>
                        Varsity <i style={{ fontFamily: "Arial" }}>&#8594;</i>
                    </a>

                    <p className='text-muted mt-5 mb-3'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>

                    <a href='https://tradingqna.com/' className='text-decoration-none'>
                        TradingQ&A <i style={{ fontFamily: "Arial" }}>&#8594;</i>
                    </a>
                </div>
            </div>
        </div >
    );
}

export default Education;
