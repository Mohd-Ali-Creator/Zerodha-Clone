import React from "react";

function Pricing() {
    return (
        <div className='container mb-5'>
            <div className='row p-5'>
                <div className='col-6'>
                    <h1 className='fs-2 mb-3'>Unbeatable pricing</h1>
                    <p className='text-muted mb-4'>
                        We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.
                    </p>
                    <a href="" className='text-decoration-none'>See pricing <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
                </div>
                <div className='col-6'>
                    <div className='row'>
                        <div className='col-4 p-2'>
                            <img src='media/images/pricing-eq.svg' alt="Free account opening" style={{ width: "100%" }} />
                        </div>
                        <div className='col-4 p-2'>
                            <img src='media/images/pricing-eq2.svg' alt="Free equity delivery" style={{ width: "100%" }} />
                        </div>
                        <div className='col-4 p-2'>
                            <img src='media/images/other-trades.svg' alt="Intraday and F&O" style={{ width: "100%" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Pricing;