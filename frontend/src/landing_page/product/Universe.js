import React from "react";

function Universe(){
return (
<div className="container text-center"> 
<div className='row'> 
    <h2 className="text-small text-muted"> Want to know more about our technology stack? Check out the <a href=" /">Zerodha.tech</a> blog.</h2>
<h1> The Zerodha Universe</h1>
<p>
    Extend your trading and investment experience even further with our partner platforms
</p>


    <div className='col-4 p-3 mt-5'>
        <img src='media/images/smallcase-logo.png'/>
        <p className="text-small text-muted">Thematic investment platform</p>
    </div>
    <div className='col-4 p-3 mt-5'>
        <img src='media/images/streak-logo.png' style={{ width: "40%" }}/>
        <p className="text-small text-muted">Algo & strategy platform</p>
    </div>
    <div className='col-4 p-3 mt-5'>
        <img src='media\images\sensibull-logo.svg' style={{ width: "60%" }}/>
        <p className="text-small text-muted">Options trading platform</p>
    </div>

     <div className='col-4 p-3 mt-5'>
        <img src='media\images\zerodhafundhouse.png' style={{ width: "40%"}}/>
        <p className="text-small text-muted">Asset management</p>
    </div>
    <div className='col-4 p-3 mt-5'>
        <img src='media/images/tijori.svg' style={{ width: "40%"}}/>
        <p className="text-small text-muted">Fundamental research platform</p>
    </div>
    <div className='col-4 p-3 mt-5'>
        <img src='media/images/ditto-logo.png' style={{ width: "40%"}}/>
        <p className="text-small text-muted">Insurance</p>
    </div>

    <button className='p-2 btn btn-primary fs-5 mb-5' style={{ width: "15%", margin: "0 auto" }}>Sign up now</button>

</div>
</div>
)
}

export default Universe;


