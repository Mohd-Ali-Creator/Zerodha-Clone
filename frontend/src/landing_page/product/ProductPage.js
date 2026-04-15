import React from 'react';
import Hero from './Hero';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import Universe from './Universe';

function ProductPage() {
    return (
        <>
            <Hero />
            <RightSection />
            <LeftSection />
            <RightSection />
            <LeftSection />
            <RightSection />

            <Universe />
        </>
    );
}

export default ProductPage;
