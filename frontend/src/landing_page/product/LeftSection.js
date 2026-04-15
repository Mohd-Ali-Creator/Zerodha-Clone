import React from 'react';

function LeftSection() {
    return (
        <div className='container mt-5 p-5'>
            <div className='row '>
                <div className='col-md-6 mt-5'>
                    <h2>Console</h2>
                    <p>
                        The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.
                    </p>
                    <a href="/" className='text-decoration-none' >Learn More
                        <i style={{ fontFamily: "Arial" }}>&#8594;</i> </a>
                </div>
                <div className='col-md-6' >
                    <img src='media/images/products-console.png' alt="product-console" />

                </div>
            </div>
        </div>
    );
}

export default LeftSection;
