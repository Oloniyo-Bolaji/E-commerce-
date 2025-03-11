import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ShopProvider } from './Context.jsx'
import Shop from './Components/Shop.jsx'
import Navbar from './Components/Navbar.jsx'
import Cart from './Components/Cart.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <ShopProvider>
      <Router>  
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/cart' element={<Cart />}/>
      </Routes>
      <ToastContainer autoClose={2000} position = 'top-center'/> 
      </Router>
    </ShopProvider>
  );
}

export default App;