# Teams App
A basic ASP.NET MVC web application that serves that serves HTML/Javacript needed by the Teams app as well as the customer portal. There are three controllers:
- AcsClientController. This serves the HTML and Javascript for the working SPA.  This includes JavaScript that uses the ACS Chat SDK for Javascript, and that has been minified using webpack. It also leverages the Teams SDK for Javascript which allows you to grab the logged in Teams user context.  ALternatively, can hard code the Teams user ID while testing in a browser outside the Teams client.
- PortalControl. This serves effectively the same content as the AcsClientController, but does not require a Teams user ID since this is for the customers.
- TeamsAppController. This serves the static HTML for the non-functional tabs in the Teams app.

## Setup and Configuration

- Install the npm modules. This will use the packages.json file to download the ACS npm modules and dependencies to the node_modules folder.  This will also download the modules necessary for webpack.
``` 
npm install
```

- Bundle/minify the Javascript. This will use the webpack.config and convert the file www/scripts/acsclient.js into www/scripts/acsclientbundle.js.
  - You will need to rebundle any time you update the file acsclient.js. (And you might have to clear browser history.)
```
npx webpack
```

- Open the solution WebApi.sln in [Visual Studio 2022 Preview](https://visualstudio.microsoft.com/vs/preview/) version 17.5 Preview 2 or later.  You will be opening the WebApi project in a separate instance of Visual Studio.
- Update the file wwwroot/scripts/acsclientconfig.json with the endpoint URL for your ACS resource.
- This same file has the Web API root URL which defaults to "https://localhost:7262". Update this appropriately if you switch to using a tunnel or deploy the API t Azure.

- F5.  The WebApi project should be running in a separate instance of Visual Studio. You should see the portal loaded in the browser (https://localhost:3978/portal) and if it successfully connected to the Web API, the dropdown will be populated with the customers from the customer.json file in the WebApi project.


