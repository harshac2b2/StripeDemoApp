using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StripeChargeAPI.Controllers
{
    //[Route("api/stripe/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        [Route("api/stripe/products")]
        [HttpGet]
        public JsonResult Products()
        {           

            var productsList = new List<Product>()
            {
              new Product("XRYGEF","Ring Video Door Bell",55.99,"https://cdn.shopify.com/s/files/1/2393/8647/products/ring_video_doorbell_wired_1000x1000_099f9c9a-fe6b-4ff5-9543-0757a5a7b5bf.jpg?v=1611611506"),
              new Product("XYZDJF","Google Nest Hello - A better door Bell",159.99,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzcsgVaUKICpvogj-JtY4z4WIai2ngzusJ35U0tTytA522x7rEiSiMxvr1xQbU4DRYyEv0hhg&usqp=CAc"),
              //new Product("MRGDGW","eufy Security Video Door Bell",99.99,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVWtrt6EG2tfR8asJeY_CkXxZ5In2AEO_Gnq9oMpv_3ud9t43kFWJO1WxNiYUUYXnVa7Sz-IX9&usqp=CAc"),
              //new Product("XPRDOP","Arlo Video Doorbell",119.99,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-5cc4pbF6DfSaQMG8VMqpe1orxkbRQo9joSR_fPuY2CwPgcVzOq5sYD5j50VP5PdllOHFa0j&usqp=CAc")

            };            
            
            return new JsonResult(productsList);
        }

        // GET api/<ProductsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }        
        
    }

    public class Product
    {
        public Product(string _product_code, string _product_name, double _product_cost, string _product_image)
        {
            product_code = _product_code;
            product_name = _product_name;
            product_cost = _product_cost;
            product_image = _product_image;
        }
       
        public string product_code { get; set; }
        public string product_name { get; set; }
        public double product_cost { get; set; }
        public string product_image { get; set; }

    }
}
