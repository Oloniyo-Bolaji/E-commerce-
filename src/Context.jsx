import React,
{createContext, 
useState, 
useEffect} from 'react'
import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import { getAuth, 
createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged} from "firebase/auth";
import { getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  getDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import { categoryData } from './categoryData.jsx'

const ShopContext = createContext();

const ShopProvider = ({children}) => {
  const [categories, setCategories] = useState(categoryData)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [viewedProduct, setViewedProduct] = useState({})
  const [isViewed, setIsViewed] = useState(false)
  const [indexValue, setIndexValue] = useState(0)
  const [review, setReview] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState(
    {
      email:'',
      password:'', 
      cpassword:''
    }
  )
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email:'',
    number: '',
    address: '',
    state: ''
  })
  const [shippingFee, setShippingFee] = useState(0)
  const [activeTab, setActiveTab] = useState('signup');
  const [cartItems, setCartItems] = useState([])
  const [count, setCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [openPayment, setOpenPayment] = useState(false)
  const [statesNig, setStatesNig] = useState([])
  
  
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_API_ID,
  measurementId: "G-SB5C2S1NTC"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)
 const checkConditions = () => {
   if (shippingDetails.name === "" && shippingDetails.address === "" && shippingDetails.number === ""){
     return false;
   }
   return true;
 }
const signIn = async () => {
  try {
    if(user.email !== ""  && 
      user.password !== "" && user.password === user.cpassword){
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
      toast.success('Sign Up Successful')
      setActiveTab('login')
      setUser({password: '', email: '', cpassword: ''})
    }else{
      toast.error('Fill in the Required inputs')
    }
  }catch(err){
    console.error("Error code:", err.code);
    if (err.code === 'auth/email-already-in-use') {
      toast.error('Email address already in use');
    } else if (err.code === 'auth/weak-password') {
      toast.error('The password is too weak. Please use at least 6 characters.');
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
  }
}
const logIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
    toast.success('Login Successful')
  }catch(err){
    console.log(err)
    console.error("Error code:", err.code);
    if (err.code === 'auth/invalid-credential') {
      toast.error('Invalid Credentials');
    }else {
      toast.error('An unexpected error occurred. Please try again.');
    }
  }
}
const resetPassword = async (email) => {
  try{
    await sendPasswordResetEmail(auth, user.email)
  }catch(error){
    console.log(error.message)
  }
}
const logOut = async () => {
  try {
    await signOut(auth)
    setUser({
      email: '',
      password: '',
      cpassword: '',
    });
    toast.error('Signed Out')
  }catch(err){
    console.log(err)
  }
}

//fetching the products based on the category
const getCategoryProducts = async (cat) => {
  const response = await fetch(`https://dummyjson.com/products/category/${cat}`);
  const data = await response.json();
  setLoading(false)
  setProducts(data.products)
}
const addToCart = async (item) => {
  //check is user is signed up
  if (!auth.currentUser) {
    toast.error('Sign up please');
    return;
  }
  const userId = auth.currentUser.uid;
  const orderRef = collection(db, `customers/${userId}/orders`); 
  try {
    //checking if the item is alreafy in cart
    const q = query(orderRef, where("id", "==", item.id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error('Item already exists in the cart');
      return;
    }
    // Add item to Firestore if it doesn't exist
    await addDoc(orderRef, { ...item, amount: 1 });
    toast.success('Item added to cart');
  } catch (error) {
    console.error("Error checking/adding item:", error);
    toast.error('Failed to add item');
  }
};
const deleteFromCart = async (itemId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return;
  }
  try {
    const orderRef = collection(db, `customers/${userId}/orders`);
    // Query Firestore to find the document with the given item ID
    const q = query(orderRef, where("id", "==", itemId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Item not found in Cart");
      return;
    }
    const docId = querySnapshot.docs[0].id; 
    await deleteDoc(doc(orderRef, docId));
    toast.error("Item deleted from Cart");
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.error(error.message);
  }
};
const addAmount = async (itemId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    toast.error("You must be signed in");
    return;
  }
  try {
    const orderRef = collection(db, `customers/${userId}/orders`);
    const q = query(orderRef, where("id", "==", itemId)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Item not found in cart");
      return;
    }
    const docId = querySnapshot.docs[0].id;
    const itemRef = doc(db, `customers/${userId}/orders`, docId);
    const currentData = querySnapshot.docs[0].data();
    const newAmount = (currentData.amount || 0) + 1;
    await updateDoc(itemRef, {
      amount: newAmount,
      updatedAt: new Date(),
    });
    setCartItems(prevCartItems =>
      prevCartItems.map(item =>
        item.id === itemId ? { ...item, amount: newAmount } : item
      )
    );
  } catch (error) {
    console.error("Error updating item:", error);
    toast.error(error.message);
  }
};
const subAmount = async (itemId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    toast.error("You must be signed in");
    return;
  }
  try {
    const orderRef = collection(db, `customers/${userId}/orders`);
    const q = query(orderRef, where("id", "==", itemId)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Item not found in cart");
      return;
    }

    const docId = querySnapshot.docs[0].id;
    const itemRef = doc(db, `customers/${userId}/orders`, docId);
    const currentData = querySnapshot.docs[0].data();

    const newAmount = (currentData.amount || 0) - 1;

if (newAmount === 0) {
      // Delete item from cart
      await deleteDoc(itemRef);
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
      toast.error("Item removed from cart!");
    } else {
      // Update item amount
      await updateDoc(itemRef, { amount: newAmount, updatedAt: new Date() });
      setCartItems(prevCartItems => prevCartItems.map(item => item.id === itemId ? { ...item, amount: newAmount } : item));
    }
  } catch (error) {
    console.error("Error updating item:", error);
    toast.error(error.message);
  }
};
const calculateTotal = () => {
    let totalPrice = 0
    cartItems.forEach((item) => { 
      totalPrice += Math.ceil(item.price) * item.amount
    })
   let shipping = 0 
   shipping =  Math.ceil(0.05 * totalPrice)
   setShippingFee(shipping)
   setCartTotal(totalPrice)
   setTotal(totalPrice + shipping)
  }
const getStates = async () => {
  const response = await fetch(`https://nga-states-lga.onrender.com/fetch`);
  const data = await response.json();
  setStatesNig(data)
}
 useEffect(() => {
  let unsubscribeOrders;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setCartItems([]); 
      return;
    }

    const userId = user.uid;
    const ordersRef = collection(db, `customers/${userId}/orders`); 
    const q = query(ordersRef);

    unsubscribeOrders = onSnapshot(q, (querySnapshot) => {
      const arrayOfOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCartItems(arrayOfOrders);
      setCount(arrayOfOrders.length)
    });
  });

  return () => {
    if (unsubscribeOrders) unsubscribeOrders();
    unsubscribeAuth();
  };
}, []);
 useEffect(() => {
  getCategoryProducts('mens-shirts')
}, [])
 useEffect(() => {
  calculateTotal()
}, [cartItems])
 useEffect(() => {
  getStates()
}, [])

  return(
    <ShopContext.Provider 
       value = {{
          categories, 
          getCategoryProducts, 
          products, 
          isViewed, 
          setIsViewed, viewedProduct, setViewedProduct, indexValue, setIndexValue, review, setReview,showReview, setShowReview, isLogin, setIsLogin, shippingFee, activeTab, setActiveTab, cartItems, addToCart, signIn, logIn, resetPassword, logOut, user, setUser, deleteFromCart, addAmount, subAmount, count,openPayment, setOpenPayment, statesNig, shippingDetails, setShippingDetails, cartTotal, total, loading, checkConditions}}>
      {children}
    </ShopContext.Provider>
    )
}


export {ShopContext, ShopProvider} 



 
 