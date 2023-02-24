using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Microsoft.Teams.Samples.HelloWorld.Web.Controllers
{
    public class AcsClientController : Controller
    {
        [Route("AcsClient")]
        public ActionResult AcsClient()
        {
            return View();
        }
    }
}