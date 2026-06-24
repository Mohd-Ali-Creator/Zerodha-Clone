import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./landing_page/home/HomePage";
import Signup from './landing_page/signup/Signup';
import Login from './landing_page/login/Login';
import About from './landing_page/about/AboutPage';
import Products from './landing_page/product/ProductPage';
import Pricing from './landing_page/pricing/PricingPage';
import Support from './landing_page/support/SupportPage';

import NotFound from './landing_page/home/NotFound';

import Navbar from './Navbar';
import Footer from './Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/about' element={<About />} />
      <Route path='/product' element={<Products />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/support' element={<Support />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    < Footer />
  </BrowserRouter>
);


