import React from 'react';

function Mobile() {
    return (
        <div className='container'>

            <div className='text-center p-5 m-5'>
                <h3>Open a free demat and trading account online</h3>
                <h5 className='text-secondary'>Start investing brokerage free and join a community of 1.6+ crore investors and traders</h5>
            </div>

            <div className='row'>
                <div className='col-6 ml-5'>
                    <img src='media/images/account_open.svg' alt='Accout Open' style={{ width: '80%' }}></img>

                </div>
                <div className='col-6'>
                    <h4>Signup now</h4>
                    <h5 className='text-secondary'>Or track your existing application</h5>
                    <input type="number" autofocus min='1000000000' max='9999999999' class='mobile' id='user_mobile' placeholder="Enter the valid 10-digit Number. " required></input>
                    <div>
                        <button className='btn btn-primary mt-3'>Get OTP</button>
                        <p className=" fs-6 mt-3">By proceeding, you agree to the Zerodha terms & privacy policy</p>
                        <p className="border-top fs-6">Looking to open NRI account? Click here</p>

                    </div>

                </div>


            </div>

        </div>


    );
}

export default Mobile;
