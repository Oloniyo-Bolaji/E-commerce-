import React, {useContext} from 'react';
import {ShopContext} from '../Context.jsx'
import Rating from './Rating.jsx'
import Modal from 'react-modal';
import ReactLoading from 'react-loading';
import {Icon} from "semantic-ui-react";
import './Shop.css';
import '../App.css'
import {
  Dropdown, DropdownMenu, DropdownItem
} from 'semantic-ui-react';

 
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)', 
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    maxWidth: '80%',
    background: 'white',
    border:'none',
  },
};


Modal.setAppElement('#root');

const Shop = () => {
  
  
const {categories, getCategoryProducts, products,  isViewed, setIsViewed, viewedProduct, setViewedProduct, indexValue, setIndexValue, review, setReview, showReview, setShowReview, isLogin, setIsLogin, activeTab, setActiveTab,cartItems, addToCart, signIn, logIn, resetPassword, logOut, user, setUser, loading} = useContext(ShopContext)
  
  const viewProd = (product) => {
    setIsViewed(true)
    setViewedProduct(product)
    setReview(product.reviews)
  }
  
  const revealReview = () => {
    setShowReview(!showReview)
  }
  
  const closeLogin = () => {
    setIsLogin(false)
  }
  
  const handleSignin = async (e) => {
    e.preventDefault()
    await signIn()
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    await logIn()
    closeLogin()
  }
  const handleLogout = async (e) => {
    e.preventDefault()
    await logOut()
  }
  const handleReset = async (e) => {
    e.preventDefault()
    await resetPassword()
  }
  
  return(
  <div className='shop-container'>
  {isViewed ? 
   (<div className='viewed-container'>
    <div>
     <button 
     className='bck-btn'
      onClick= {() => {setIsViewed(false)}}>
       <Icon name='caret left'/>
       Back
     </button>
    </div>
    <div className='viewed'>
      <div className='viewed-images'>
        <div className='small-images'>
        {viewedProduct.images.map((img, index) => (<div 
            key={index} 
            onClick={() => {setIndexValue(index)}}>
            <img src={img} />
         </div>))}
        </div>
        <div className='big-images'>
          <img 
           src={viewedProduct.images[indexValue]} 
           />
        </div>
      </div>
           
      <div className='viewed-info'>
         <h4>{viewedProduct.title}</h4>
         <h3>${Math.ceil(viewedProduct.price)}</h3>
         <p className='rating'>{<Rating  rating={viewedProduct.rating}/>}</p>
         <p 
          className='availability'>{viewedProduct.availabilityStatus}
         </p>
         <p className='info-desc'>{viewedProduct.description}</p>
          <div className='info-quantity'>
            <h6>Quantity</h6>
              <div>
               <button>-</button>
               <button>0</button>
               <button>+</button>
              </div>
             </div>
             <div className='reviews'>
               <div className='review-title'>
                 <h6>Reviews</h6>
                 <button 
                   onClick={revealReview}
                   >
                   {showReview ? (<Icon name="angle up" />) : (<Icon name="angle down" />)}
                 </button>
               </div>
               {showReview && <div className='review'>
                 {review.map((rev, index) => (
                   <div className='review-div'>
                     <span>{rev.comment}</span>
                     <h5>{rev.reviewerName}</h5>
                     <div>
                     <h6>{rev.reviewerEmail}</h6>
                     <h6>{rev.date.slice(0, 10)}</h6>   
                     </div>
                   </div>
                 ))}
               </div>}
               <div className='cart-btn'>
                 <button 
                  onClick={() => {addToCart(viewedProduct)}}>Add to Cart</button>
               </div>
             </div>
             
           </div>
         </div>

       </div>):
   (
    loading ?     
   (
    <div className="loading">
      <ReactLoading 
     type="spin" 
     color="#cd45cd" 
     height={100} 
     width={50}
     />
    </div>
    ):
    ( <div> 
     <header style={{backgroundImage: `url('./Images/images.jpeg')`}}>
        <div>
        <h2>Welcome to Obm Stores</h2>
        <p>Your one stop store for affordable items</p>
        </div>
      </header>
      
     <div className='categories'>
         {categories.map((category, index) => (
           <Dropdown 
             text={category.category} 
             key={category.id}
             className="dropdown">
            <DropdownMenu>
              {category.subCategories.map((sub, index) => (
              <DropdownItem 
               text={sub.name} 
               onClick={() => {getCategoryProducts(sub.slug)}}/>
              ))}
          </DropdownMenu>
        </Dropdown>
         ))}
      </div>
     <main className='product-main'>
      <div className='products'>
         {products.map((product,index) => (
         <div 
          key={index} 
          className='product'>
           <div className='product-img'>
            <img src={product.images[0]} alt='image of product' /> 
           </div>
           <h6 
           >{product.title}</h6>
           <p>${Math.ceil(product.price)}</p>
           <div className='product-btn'>
           <button 
             className='product-cart-btn'
             onClick={() => {addToCart(product)}}>
            <Icon name='shopping cart' />
           </button>
             <button 
             className='view'
             onClick={() => {viewProd(product)}}>View</button>
           </div>
         </div>
        ))}
        </div>
      </main>
     <footer>
        <div className='footer'>
        <div>
          <h4>ABOUT US</h4>
          <p>At Obm Stores, we're passionate about providing high-quality, fashion-forward shoes and clothes for men and women. Our curated collection features the latest trends and timeless classics, ensuring you always look and feel your best.</p>
        </div>
        <div>
          <h4>CONTACT</h4>
          <ul className='contact'>
            <li><Icon name="map marker alternate" /> Opp Sunchine Estate Ilekun, Akure, Ondo State</li>
            <li><Icon name="phone" />+2347031939715</li>
            <li><Icon name="envelope" /> ayoolabolaji12@yahoo.com</li>
          </ul>
        </div>
        <div className="">
          <h4>CONNECT WITH US</h4>
          <ul className='socials'>
            <li style={{color: "purple"}}><Icon name="instagram" /> </li>
            <li style={{color: "lightGreen"}}><Icon name="whatsapp" /> </li>
            <li style={{color: "blue"}}><Icon name="facebook f" /></li>
            <li style={{color: "skyblue"}}><Icon name="twitter" /></li>
          </ul>
        </div> 
        </div>
        <div className="copy">
          <h4>© BeejayCodes, {new Date().getFullYear()}</h4>
        </div>
      </footer>
     </div>)
     )}
     <Modal
        isOpen={isLogin}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeLogin}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className='close-btn'> 
        <button onClick={closeLogin}>
          <Icon name="close" />
        </button>
        </div>
        <main className="">
        <div className='active'>
          <button onClick={() => setActiveTab('signup')}>Sign-Up</button>
          <button onClick={() => setActiveTab('login')}>Login</button>
        </div>
        {/*contents*/}
        
        <div className=''>
        {activeTab === 'signup' ? 
        (<div>
          <form>
            <label>Email</label>
            <input 
              type='text' 
              placeholder='Email' 
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}/>
            <label>Password</label>
            <input
              type='password' 
              placeholder='Password' 
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}/>
            <label>Confirm Password</label>
            <input 
              type='password' 
              placeholder='Confirm Password' 
              value={user.cpassword}
              onChange={(e) => setUser({ ...user, cpassword: e.target.value })}/>
            <button className='signup'onClick={handleSignin}>Sign Up</button>
          </form>
        </div>):
        (<div className=''>
          <form>
            <label>Email</label>
            <input 
              type='text' 
              placeholder='Email' 

              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}/>
            <label>Password</label>
            <input 
              type='password' 
              placeholder='Password' 
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}/>
            <button className='forget' onClick={handleReset}>Forgot Password?</button>
            <button className='login' onClick={handleLogin}>Login</button>
          </form>
          
        </div>)}
        </div>
        
      </main>
      </Modal>
    </div>
    )
}

export default Shop;


  
  