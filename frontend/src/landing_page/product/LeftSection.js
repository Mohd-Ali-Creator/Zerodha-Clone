import React from "react";

function LeftSection({
    imageURL,
    productName,
    productDescription,
    tryDemo,
    learnMore,
    googlePlay,
    appStore
}) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-6 p-3">
                    <img src={imageURL} />
                </div>
                <div className="col-6 p-3">
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <div>
                        <a href={tryDemo}>Try Demo <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
                        <a href={learnMore} style={{ marginLeft: "50px" }}>Learn More <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
                    </div>
                    <div>
                        <a href={googlePlay}><img src="media/images/google-play-badge.svg" /></a>
                        <a href={appStore} style={{ marginLeft: "50px" }}> <img src="media\images\appstore-badge.svg" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSection;