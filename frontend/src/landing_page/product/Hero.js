import React from 'react';

function Hero() {
    return (
        <div className='container text-center m-5 ' >
            <h2>Zerodha Products</h2>
            <h5 className='text-secondary fs-4 p-2'>Sleek, modern, and intuitive trading platforms</h5>
            <p className='fs-8 p-2'>Check out our <a href='https://zerodha.com/varsity/' className='text-decoration-none'>
                investment offerings <i style={{ fontFamily: "Arial" }}>&#8594;</i>
            </a>
            </p>
        </div>
    );
}

export default Hero;
