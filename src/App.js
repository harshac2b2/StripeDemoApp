import React, { useEffect, useState, Component } from "react";
import logo from './logo.svg';
import './App.css';
import { Products } from "./Products";
import axios from 'axios';
import { Button, CardHeader, FormControl, FormHelperText, Grid, TextField } from "@material-ui/core";
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from 'react-stripe-checkout';
import NumberFormat from 'react-number-format';


const PAGE_PRODUCTS ='products';
const PAGE_CART = 'cart';
const PAGE_CHECKOUT = 'checkout';
const PAGE_CONFIRMATION = 'confirm';
const PAGE_FAILURE = 'failure';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');


function App() {
  const fetch_data_url="http://localhost:50087/api/stripe/products"
  const[products, setProduct] =useState(null)
  const[cart, setCart] =useState([])
  const[page, setPage] =useState(PAGE_PRODUCTS)
  const[id, setId] = useState('')
  const[error, setError] = useState('')
  const[amtCharged, setAmt] = useState('')
  

  useEffect( () => {
    axios.get(fetch_data_url)
    .then(response=> {      
      setProduct(response.data)
    })

  },[fetch_data_url])

 
   if(products)
   {
      const addToCart = (product) => 
      {
      console.log("items added to cart")
      setCart([...cart,{...product}]);
      navigateTo(PAGE_CART);
      }

      const navigateTo =(nextPage) =>
      {
        setPage(nextPage);
      }      

      const removeFromCart =(productToRemove) =>
      {
        setCart(cart.filter(product => product!=productToRemove));
      }
      
      
      async function handleToken(token, addresses, products) 
      {
        console.log(cart)         
        const response = await axios.post(
          "http://localhost:50087/api/stripe/charge",
          {            
            amount: Number(cart[0].product_cost)*100,
            currency: "usd",
            description: "Purchased "+cart[0].product_name,            
            recipientEmail: document.getElementById("email").value,
            shipping:{
              name: document.getElementById("fullname").value,
              address:{
                line1:document.getElementById("addressline1").value,
                line2:null,
                city:document.getElementById("city").value,
                country:"USA",
                postal_code:document.getElementById("postalcode").value
              }

            }
          }
        );
        const { status } = response.data;
        console.log("Response:", response.data);
        console.log("Status Value:", status);
        if (status === "Success") {          
          setId(response.data.response_id)
          setAmt(response.data.amount_charged)
          navigateTo(PAGE_CONFIRMATION)
          removeFromCart(cart[0])
        } else {
          setError(response.data.error)
          navigateTo(PAGE_FAILURE)
        }      
      }

      const renderProducts = () =>(
        <>    
        <h1>Products</h1>    
        <div className="products">                
        {          
          products.map(product =>
          <div key={product.id}>
              <h2>{product.product_name}</h2>
              <h3>${product.product_cost}</h3>
              <img src={product.product_image} alt={product.product_name}/>
              <Button 
                  color='primary'
                  variant='contained'
                  size='small'
                  onClick={() => addToCart(product)}>Add to Cart</Button>
              {/* <button>Add to Cart</button> */}
              </div>)
        }
        </div>
        </>

      );

      const renderCart = () =>(
        <>
        <h1>Cart</h1>       
        <Button 
                  color='secondary'
                  variant='contained'
                  size='large'
                  onClick={() => navigateTo(PAGE_CHECKOUT)}>Check Out</Button>

        <div className="products">                
        {          
          cart.map(product =>
          <div key={product.id}>
              <h2>{product.product_name}</h2>
              <h3>${product.product_cost}</h3>
              <img src={product.product_image} alt={product.product_name}/>
              <Button 
                  color='primary'
                  variant='contained'
                  size='small'
                  onClick={() => removeFromCart(product)}>Remove from Cart</Button>
              {/* <button>Add to Cart</button> */}
              </div>)
        }
        </div>
        </>

      );

      const renderConfirmation = () =>(
        <>
        <h1>Payment Successful</h1> 
        <h2>ConfirmationID: {id}</h2>  
        <h3>AmountCharged: {amtCharged}</h3>    
        <Button 
                  color='secondary'
                  variant='contained'
                  size='large'
                  onClick={() => navigateTo(PAGE_PRODUCTS)}>Return to Products</Button>        
        </>
      );

      const renderFailure = () =>(
        <>
        <h1>Payment Failed!</h1> 
        <h2>Do not re-attempt payment, reach out to customer care for more questions</h2> 
        <h3>Error: {error}</h3>  
           
        <Button 
                  color='secondary'
                  variant='contained'
                  size='large'
                  onClick={() => navigateTo(PAGE_PRODUCTS)}>Return to Products</Button>        
        </>
      );

      const renderCheckout = () =>(
        <>
        <h1>Check Out</h1>         
        <Grid container spacing={1} alignContent='flex-start'>
        <Grid item xs={12} align="center">
            <FormControl>              
                <TextField
                  required
                  id="fullname"
                  label="Full Name"
                  defaultValue=""
                  variant="outlined"                                
                />                          
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>             
                <TextField
                  required
                  id="email"
                  label="Email Address"
                  defaultValue=""
                  variant="outlined"                  
                />
                          
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>              
                <TextField
                  required
                  id="addressline1"
                  label="Address Line1"
                  defaultValue=""
                  variant="outlined"
                />
                          
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>              
                <TextField
                  required
                  id="city"
                  label="City"
                  defaultValue=""
                  variant="outlined"
                />
                          
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>             
                <TextField
                  required
                  id="state"
                  label="State"
                  defaultValue=""
                  variant="outlined"
                />
                          
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>             
            <FormControl>             
                <TextField
                  required
                  id="postalcode"
                  label="Zip Code"
                  defaultValue=""
                  variant="outlined"
                />
                          
            </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                label="Credit Card Number"
                name="ccnumber"
                variant="outlined"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}                
                />
        </Grid>
        <Grid item xs={6} sm={3}>
            <TextField
                label="Expiration Date"
                name="ccexp"
                variant="outlined"
                required
                fullWidth
                // InputProps={<NumberFormat format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']}/>}
                InputLabelProps={{ shrink: true }}
            />
        </Grid>
        <Grid item xs={6} sm={2}>
            <TextField
                label="CVC"
                name="cvc"
                variant="outlined"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
            />
        </Grid>
          <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={handleToken}>Pay</Button>              
          </Grid>
        </Grid>
        {/* <StripeCheckout
         stripeKey="pk_test_51ILqcxAnO5xZOvcMywIxCFIOZ0Lvku5k99BcD1nhT25g0gw6X00KoDtneffHuqz8tsEzJdhB5mUzOKKuGZUapofY00moJMEvVm"
         
         amount={cart.map(product => product.product_cost * 100)}
         name={cart.map(product => product.product_name)}
         billingAddress
         shippingAddress
         onClick={handleToken(cart.map(product => product))}
        
        />        */}
        </>

      );
      
     return(
      <div className="App">       
        <header>
        <Button 
            color='secondary'
            variant='contained'
            size ='large'
            onClick={() => navigateTo(PAGE_CART)}
        >Go to Cart ({cart.length})</Button>
        
        <Button 
            color='secondary'
            variant='contained'
            size ='large'
            onClick={() => navigateTo(PAGE_PRODUCTS)}
        >View Products</Button>
        <h1>Doorbell Cameras</h1>
        </header>
        {page === PAGE_PRODUCTS && renderProducts()}   
        {page === PAGE_CART && renderCart()}  
        {page === PAGE_CHECKOUT && renderCheckout()} 
        {page === PAGE_CONFIRMATION && renderConfirmation()}  
        {page === PAGE_FAILURE && renderFailure()}
         
      </div>
     )
   
  }
  return (
    <div className="App">
      {/* <h1>{product.product_name}</h1> */}    
    </div>
  );
}

export default App;
