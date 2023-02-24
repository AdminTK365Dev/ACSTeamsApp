# Web API
A basic ASP.NET Web API that exposes various APIs used by the Teams app, customer portal, and the mobile app. These APIs interact with the ACS Identity service, ACS Call Automation, and ACS Chat service. Static JSON files are used as the user directory to simplify the demo implementation. A persistent datastore would be necessary in a production implementation.

- GET /customer
- GET /employee
- GET /accessToken
- GET customerChatThread

## Setup and Configuration

- Open the solution WebApi.sln in [Visual Studio 2022 Preview](https://visualstudio.microsoft.com/vs/preview/) version 17.5 Preview 2 or later.  You will be opening the WebApp project in a separate instance of Visual Studio.
- Install the necessary nuget packages.
    - Azure.Communication.Chat
    - Azure.Communication.Common
    - Azure.Communication.Identity
    - Swashbuckle.AspNetCore
- Update the files data/customer.json (ACS users) and data/employee.json (Teams users with a mapped ACS ID) with values from your Teams tenant and ACS resource.  You need at least one customer and one employee. These files correspond to the classed model/Customer.cs and model/Employee.cs
- Update the AcsServiceClient with the endpointUri and connectionString from your ACS resource.
- F5 to start the project locally.  This should launch a broweser with the Swagger for the API allowing you to test the APIs.
