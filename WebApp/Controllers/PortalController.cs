using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Microsoft.Teams.Samples.HelloWorld.Web.Controllers
{
    [Route("portal")]
    public class PortalController : Controller
    {
        [Route("")]
        public ActionResult Portal()
        {
            return View();
        }
    }
}