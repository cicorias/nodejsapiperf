using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace MainWeb.Controllers
{
    public class ClientTicketController : ApiController
    {

        [AllowAnonymous]
        [Route("api/account/ClientTicket")]
        // GET: api/ClientTicket
        public HttpResponseMessage Get()
        {
            var clientid = "foobar" + Guid.NewGuid().ToString("N");
            var ticketdata = Convert.ToBase64String( Encoding.UTF8.GetBytes(clientid));
            var ticketResponse = new { ticket = ticketdata };
            return Request.CreateResponse(ticketResponse);
        }

        //// GET: api/ClientTicket/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/ClientTicket
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/ClientTicket/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/ClientTicket/5
        //public void Delete(int id)
        //{
        //}
    }
}
