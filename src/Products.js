import React, { useState, Component } from 'react'
import axios from 'axios'
import { Button, Grid } from "@material-ui/core";



export class Products extends Component {    
    
    constructor(props) {
        super(props)        
        this.setCart=null;
        this.state = {           
             products:[],
             cart:[]
                                     
        }
    }
    
      componentDidMount(){
          axios.get("http://localhost:7000/Products/")          
          .then(response=>{
              this.setState({products:response.data});
          })
          .catch(error => {
            console.log(error);
          })

      }
    render() {
        const {products}=this.state
        const {cart,setCart}=this.state
                
        const addToCart = (product) => {
            console.log("items added to cart")
            setCart([...cart,product]);
        }
        return (
            
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
                            onClick={() => addToCart(product)}>Add to Cart</Button>
                       {/* <button>Add to Cart</button> */}
                       </div>)
               }
            </div>
            
        )
    }
}

export default Products
