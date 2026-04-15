import React from 'react';

function RightSection() {
    return (
        <div className='container'>
            <div className='row g-4 align-items-center border-top p-4 '>
                <div className='col-md-6'>
                    <img src='media/images/products-kite.png' alt='product-kite' />
                </div>
                <div className='col-md-6' >
                    <h2 className='mb-4'>Kite</h2>
                    <p>Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.</p>
                    <div className='row mt-3 g-4'>
                        <div className='col-6'>
                            <a href='https://zerodha.com/varsity/' className='text-decoration-none'>
                                Try Demo <i style={{ fontFamily: "Arial" }}>&#8594;</i>
                            </a>

                        </div>
                        <div className='col-6'>
                            <a href='https://zerodha.com/varsity/' className='text-decoration-none'>
                                Learn More <i style={{ fontFamily: "Arial" }}>&#8594;</i>
                            </a>

                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-6'>
                            <img src="media/images/google-play-badge.svg" alt='google-badge' />
                        </div>
                        <div className='col-6'>
                            <img src="media/images/appstore-badge.svg" alt='apple-badge' />
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}

export default RightSection;
