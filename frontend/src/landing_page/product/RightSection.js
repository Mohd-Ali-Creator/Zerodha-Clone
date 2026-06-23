import React from 'react';

function RightSection({
    imageURL,
    productName,
    productDescription,
    learnMore
}) {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-6 p-3'>
                    <img src={imageURL}/>
                </div>
                <div className='col-6 p-3'>
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <div > 
                <a href={learnMore} style={{ marginLeft: "50px" }} >Learn More <i style={{ fontFamily: "Arial" }}>&#8594;</i></a>
            </div>
                </div>
            </div>
            
        </div>
    );
}

export default RightSection;
