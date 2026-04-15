import React from 'react';

function Team() {
    return (
        <div className='container'>

            <div className='row'>
                <div className='col-6 text-center'>
                    <img src='media/images/nithin-kamath.jpg' alt='Profile' style={{ borderRadius: "50%", width: "50%" }} ></img>
                    <p className='text-center mt-5'>Nithin Kamath</p>
                    <p className='text-center'>Founder, CEO</p>
                </div>
                <div className='col-6 mt-5 '>
                    <h1 className='fs-3 mb-5 p-5'>People </h1>
                    <p>
                        Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.
                    </p>
                    <p>
                        He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).
                    </p>
                    <p>
                        Playing basketball is his zen.
                    </p>
                    <p>
                        Connect on <a href="/" className='text-decoration-none'>Homepage</a> / <a href="/" className='text-decoration-none'>TradingQnA</a> / <a href="/" className='text-decoration-none'>Twitter</a>
                    </p>
                </div>










                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/Nikhil.jpg' alt='Nikhil Kamath' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Nikhil Kamath</h4>
                    <p className='text-muted'>Co-founder & CFO</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Nikhil is an astute and experienced investor, and he heads financial planning at Zerodha. An avid reader, he always appreciates a good game of chess.</p></li>
                        </ul>
                    </div>
                </div>

                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/Kailash.jpg' alt='Dr. Kailash Nadh' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Dr. Kailash Nadh</h4>
                    <p className='text-muted'>CTO</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Kailash has a PhD in Artificial Intelligence & Computational Linguistics, and is the brain behind all our technology and products. He has been a developer from his adolescence and continues to write code every day.</p></li>
                        </ul>
                    </div>
                </div>

                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/Venu.jpg' alt='Venu Madhav' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Venu Madhav</h4>
                    <p className='text-muted'>COO</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Venu is the backbone of Zerodha taking care of operations and ensuring that we are compliant to rules and regulations. He has over a dozen certifications in financial markets and is also proficient in technical analysis. Workouts, cycling, and adventuring is what he does outside of Zerodha.</p></li>
                        </ul>
                    </div>
                </div>

                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/Seema.jpg' alt='Hananh Seema' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Seema Patil</h4>
                    <p className='text-muted'>Director</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Seema who has lead the quality team since the beginning of Zerodha, is now a director. She is an extremely disciplined fitness enthusiast.</p></li>
                        </ul>
                    </div>
                </div>

                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/karthik.jpg' alt='Karthik Rangappa' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Karthik Rangappa</h4>
                    <p className='text-muted'>Chief of Education</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Karthik has over a decade's experience in trading and investing. He heads Varsity, our educational initiative, and also works closely with the technology team. He is an avid reader and loves photographing moments.</p></li>
                        </ul>
                    </div>
                </div>

                <div className='col-4 mt-5 p-3 text-center'>
                    <img src='media/images/Austin.jpg' alt='Austin Prakesh' style={{ borderRadius: "50%", width: "60%" }} />
                    <h4 className='mt-5'>Austin Prakesh</h4>
                    <p className='text-muted'>Director Strategy</p>
                    <div className="btn-group">
                        <button type="button" className="btn dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">Bio</button>
                        <ul className="dropdown-menu text-muted p-4" style={{ width: "250%" }}>
                            <li><p>Austin is a successful self-made entrepreneur who heads the retail networking team, spreading the Zerodha word out there. He connects with different business groups and builds our presence.</p></li>
                        </ul>
                    </div>
                </div>


            </div>



        </div>
    );
}

export default Team;
