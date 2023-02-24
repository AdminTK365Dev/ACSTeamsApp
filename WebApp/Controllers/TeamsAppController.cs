using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Microsoft.Teams.Samples.HelloWorld.Web.Controllers
{
    [Route("teamsapp")]
    public class TeamsAppController : Controller
    {
        [Route("")]
        public ActionResult Index()
        {
            return View("default");
        }

        [Route("default")]
        public ActionResult Default()
        {
            return View();
        }

        [Route("accounts")]
        public ActionResult Accounts()
        {
            return View();
        }

        [Route("chats")]
        public ActionResult Chats()
        {
            return View();
        }

        [Route("configuretab")]
        public ActionResult ConfigureTab()
        {
            return View();
        }
    }
}