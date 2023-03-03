using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Microsoft.Teams.Samples.HelloWorld.Web.Controllers
{
    public class AcsClientChatsController : Controller
    {
        [Route("AcsClientChats")]
        public ActionResult AcsClientChats()
        {
            return View();
        }

    }
}