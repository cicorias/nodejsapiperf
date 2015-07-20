using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI;

namespace MainWeb.Controllers
{
    [OutputCache(Location = OutputCacheLocation.Server)]
    public class SimpleController : ApiController
    {

        [OutputCache(Location=OutputCacheLocation.Server)]
        // GET: api/Simple
        public IEnumerable<string> Get()
        {
            var length = 5;
            var rv = new string[length];

            for (int i = 0; i < length; i++)
            {
                rv[i] = DateTime.UtcNow.ToString("s");    
            }

            return rv;
        }

        //// GET: api/Simple/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/Simple
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/Simple/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/Simple/5
        //public void Delete(int id)
        //{
        //}
    }
}
