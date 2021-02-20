using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Stripe;
using Microsoft.Extensions.Configuration;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StripeChargeAPI.Controllers
{
    [ApiController]
    //[Route("api/stripe/charge")]    
    public class StripeCreateChargeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public StripeCreateChargeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [Route("api/stripe/test")]
        public IEnumerable<string> Get()
        {
            return new string[] { "test1", "test2" };
        }

        [Route("api/stripe/charge")]
        [HttpPost] 
        public JsonResult Charge([FromBody]ChargeRequest request)
        {
            string apiKey = _configuration.GetSection("StripeApiKey").Value;
            if(string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Stripe Api Key is invalid/ missing from the API Configuration");
            }

            StripeConfiguration.ApiKey = apiKey;            

            ChargeShippingOptions shippingOptions = new ChargeShippingOptions();
            AddressOptions addressOptions = new AddressOptions();
            ChargeCreateOptions options = new ChargeCreateOptions();
            ChargeResponse response = new ChargeResponse();         


            try
            {
                options.Amount = request.amount;
                options.Currency = request.currency;
                options.Source = "tok_visa";
                options.Description = request.description;
                options.ReceiptEmail = request.receiptEmail;
                addressOptions.City = request.shipping.Address.City;
                addressOptions.State = request.shipping.Address.State;
                addressOptions.Line1 = request.shipping.Address.Line1;
                addressOptions.PostalCode = request.shipping.Address.PostalCode;
                addressOptions.Country = request.shipping.Address.Country;
                shippingOptions.Address = addressOptions;
                shippingOptions.Name = request.shipping.Name;         
                

                shippingOptions.Address = addressOptions;
                options.Shipping = shippingOptions;

                var service = new ChargeService();
                Charge chargeResponse = service.Create(options);


                if(chargeResponse == null)
                {
                    throw new Exception("Payment not successfull! Call customer support for more details");                   
                }

                response.response_id = chargeResponse.Id;
                double amountCharged = (double)chargeResponse.AmountCaptured/100;
                response.amount_charged = "$"+amountCharged.ToString();
                response.status = "Success";
                return new JsonResult(response);

            }
            catch(Exception ex)
            {
                response.error = ex.Message;
                response.status = "ERROR";
                return new JsonResult(response);
            }



        }        
    }

    public class ChargeRequest
    {

        public long amount { get; set; }
        public string currency { get; set; }
        public string description { get; set; }
        //public string source { get; set; }
        public string receiptEmail { get; set; }
        public Shipping shipping { get; set; }
        public string name { get; set; }
    }

    public class ChargeResponse
    {
        public string response_id { get; set; }
        public string amount_charged { get; set; }
        public string status { get; set; }
        public string error { get; set; }
    }
}
