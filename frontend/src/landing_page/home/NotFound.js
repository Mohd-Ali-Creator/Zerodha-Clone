import React from "react";

import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='container text-center'>
            <div className='row p-5 mb-5'>
                <h2>404</h2>
                <h1>Kiaan couldn’t find that page</h1>
                <p>We couldn’t find the page you were looking for. Visit <Link to="/">Zerodha’s home page</Link></p>
            </div>
        </div >
    );
}

export default NotFound;