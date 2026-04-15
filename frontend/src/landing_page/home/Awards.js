import React from "react"

function Awards() {
    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-6 p-5 mt-5'>
                    <h1 className='fs-2 mb-5'>Trust with confidence</h1>
                    <h2 className='fs-4'>Customer-first always</h2>
                    <p className='text-muted'>That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments, making us India’s largest broker; contributing to 15% of daily retail exchange volumes in India.</p>

                    <h2 className='fs-4 mt-5'>No spam or gimmicks</h2>
                    <p className='text-muted'>No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like.<a href='https://zerodha.com/about/philosophy'> Our philosophies.</a></p>

                    <h2 className='fs-4 mt-5'>The Zerodha universe</h2>
                    <p className='text-muted'>Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>

                    <h2 className='fs-4 mt-5'>Do better with money</h2>
                    <p className='text-muted'>With initiatives like <a href=''>Nudge</a> and <a href=''>Kill Switch</a>, we don't just facilitate transactions, but actively help you do better with your money.</p>
                </div>
                <div className='col-6 p-5'>
                    <img src='media/images/ecosystem.png' alt="Ecosystem Image" style={{ width: "90%" }} />
                    <div className='text-center mt-3'>
                        <a href="" className='mx-5 text-decoration-none'>Explore our products <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
                        <a href="" className='text-decoration-none'>Try Kite demo <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
                    </div>
                </div>
            </div>
            <div className='text-center mb-5 mt-5'>
                <img src='media/images/press-logos.png' alt="press logos" />
            </div>
        </div>
    );
}

export default Awards;