import React, {useContext} from 'react';
import {ShopContext} from '../Context'
import "../App.css"
import './Cart.css'
import Modal from 'react-modal';
import {Icon} from "semantic-ui-react";
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';


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
    overflowY: 'auto',
    maxHeight: '80vh',
  },
};


Modal.setAppElement('#root');

const Cart = () => {
  const {cartItems, deleteFromCart, addAmount, subAmount, count, openPayment, setOpenPayment,statesNig, user,  shippingDetails, setShippingDetails, cartTotal, total, shippingFee, checkConditions} = useContext(ShopContext)
  
  const showPayment = () => {
    setOpenPayment(true)
  }
  const closePayment = () => {
    setOpenPayment(false)
  }
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_KEY,
    tx_ref: Date.now(),
    amount: total,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      phone_number: shippingDetails.number,
      name: shippingDetails.name,
    },
    customizations: {
      title: 'My store',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Checkout',
    callback: (response) => {
       console.log(response);
      closePaymentModal()
    },
    onClose: () => {},
  };
  
  return(
    <div className="cart-container">
     {count === 0 ? (<div className="empty-cart">
        <h2>Your Cart is empty</h2>
      </div>):
      (<div className=''> 
      {cartItems.map((items) => {
        return(
        <div className='item'>
          <div className='item-image'>
            <div className='img'>
               <img src={items.images[0]} className=''/>
               </div>
               <h4>{items.title}</h4>
          </div>
          
          <div className='quantity'>
               <button onClick={() => {subAmount(items.id)}}>-</button>
               <button>{items.amount}</button>
               <button onClick={() => {addAmount(items.id)}}>+</button>
             </div>
             
         <div className='item-price'>
               <div>
                 <h4>${Math.ceil(items.price) * items.amount}</h4>
               </div>
               <div> 
               <button onClick={() => {deleteFromCart(items.id)}}>
                 <Icon name='trash' />
               </button>
               </div>
             </div>
        </div>
        )
      })}
      <div className="cart-total">
        <div>
          <h3>Total</h3>
          <h3>${cartTotal}</h3>
        </div>
        <p>Shipping fee will be added when checking out</p>
      </div>
      <div className='checkout'>
        <button 
          onClick={showPayment}>Proceed to Payment</button>
      </div>
      </div>)}
      
      
      <Modal
        isOpen={openPayment}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closePayment}
        style={customStyles}
        contentLabel="Example Modal"
      >
       <main className="shipping-container">
         <div className='close-btn flex justify-end'>
           <button onClick={closePayment}>
             <Icon name='close' />
           </button>
         </div>
         <div className="container"> 
         <div className='shipping-details'>
           <h4>Shipping Details</h4>
           <input 
              type='text' 
              placeholder='Enter name' 
              value={shippingDetails.name}
              onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}/>
           <input 
            type='email' 
             placeholder='Enter email' 
            value={shippingDetails.email}
            onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}/>
            <input 
              type='tel' 
              placeholder='Phone No' 
              value={shippingDetails.number}
              onChange={(e) => setShippingDetails({ ...shippingDetails, number: e.target.value })}/>
              <select onClick={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}>
                {statesNig.map((nig, index) => {
                  return(
                    <option key={index}>{nig}</option>
                  )
                })}
              </select>
              <input 
              type='text' 
              placeholder='Address' 
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}/>
          <h3>Coupon code</h3>
          <p>If you have coupon code, apply</p>
          <div>
            <input 
              type="number"
              placeholder="Enter coupon code"
            />
            <button>Apply</button>
          </div>
         </div>
         
         <div className='shipping-info'>
           <h4 className='font-bold'>Order Summary</h4>
           <div className='shipping-items'>
             <div className='shipping-items-list'>
               {cartItems.map((item) => {
               return(
               <div key={item.id} className='shipping-item'>
                 <div>{item.title}(×{item.amount})</div>
                 <div>${Math.ceil(item.price) * item.amount}</div>
               </div>
               )
             })}
             </div>
             <div className="shipping-fee">
               <div className='bordered'>
                 <div><p>Shipping Fee</p></div>
                 <div><h4>${shippingFee}</h4></div>
               </div>
               <div className='bordered'>
                 <div><p>Total</p></div>
                 <div><h4>${total}</h4></div>
               </div>
             </div>
           <div className="pay-btn">
            <FlutterWaveButton 
               {...fwConfig} 
               className="btn" 
               onClick={(e) => {
                e.preventDefault();
                }}/>
             </div>
         </div>
         </div>
         </div>
       </main> 
      </Modal>
    </div>
    )
}


export default Cart;
