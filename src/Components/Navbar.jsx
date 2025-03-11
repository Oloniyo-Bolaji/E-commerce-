import React, {useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {ShopContext} from '../Context.jsx'
import {Icon} from "semantic-ui-react";
import Cart from "./Cart.jsx"
import './Navbar.css'
//import '../App.css'
const Navbar = () => {
  
  const {user, count, search, setSearch, isLogin, setIsLogin, logOut} = useContext(ShopContext)
  
  const handleSearch = () => {
    setSearch(!search)
  }
  
  const openLogin = () => {
    setIsLogin(true)
  }
  
  const handleLogout = async (e) => {
    e.preventDefault()
    await logOut()
  }
  return(
    <nav>
      <div className='nav'>
        <div>
          <h1><Link to="/">Obm Stores</Link></h1>
        </div>
        <div className='nav-icons'>
          <button onClick={openLogin}>
            <Icon name="user" />
          </button>
         
          <button className="cart-icon">
            <Link to="/cart">
             <Icon name="shopping cart" />    
            </Link>
           <span>{count}</span>
          </button>
        </div>
      </div>
    </nav>
    )
}

export default Navbar;