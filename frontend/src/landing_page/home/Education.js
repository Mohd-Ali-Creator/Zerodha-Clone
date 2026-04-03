import React from "react";

function Education() {
    return (
        <div className='container p-5 mb-5'>
            <div className='row'>
                <div className='col-6'>
                    <img src="media/images/index-education.svg" alt='Eduction Image' style={{ margin: "0 0 30px" }} />
                </div>
                <div className='col-6'>
                    <h2>Free and open market education</h2>
                    <p>
                        Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.
                    </p>
                    <a href='https://zerodha.com/varsity/'>
                        Varsity <i style={{ fontFamily: "Arial" }}>&#8594;</i>
                    </a>

                    <p>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>

                    <a href='https://tradingqna.com/'>
                        TradingQ&A <i style={{ fontFamily: "Arial" }}>&#8594;</i>

                    </a>

                </div>
            </div>
        </div >
    );
}

export default Education;
