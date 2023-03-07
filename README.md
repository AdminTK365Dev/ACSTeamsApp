# ACS Teams App 
The projects in the repo demonstrate how ACS can be used in a custom Teams app that is installed in the Teams client. The app is used by Woodgrove Bank employees to communicate with bank customers who use a web portal.  The communication leverages ACS chat instead of standard Teams chat.

1. TeamsApp: Contains the app manifest and icons used for creating the app package used for configuration and installation of the Teams app. More information [Create Teams app package](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/apps-package)
1. WebApi: An ASP.NET Web API that exposes various APIs used by the Teams app, customer portal, and the mobile app. These APIs interact with the ACS Identity service, ACS Call Automation, and ACS Chat service. This uses ASP.NET minimal APIs. [Minimal APIs overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview?view=aspnetcore-7.0)
1. WebApp: An ASP.NET MVC web application that serves that serves HTML/Javacript/React needed by the Teams app as well as the customer portal. [Overview of ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-7.0)

## Prerequisites

- A Communication resource has been provisioned in an Azure subscription. [Quickstart: Create and manage Communication Services resources](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp)
- A Teams tenant.  You will need to retrieve the Azure AD object ID of any Teams users that you want to leverage the Teams app.
- [Visual Studio 2022 Preview](https://visualstudio.microsoft.com/vs/preview/) version 17.5 Preview 2 or later. This allows you to use [Visual Studio dev tunnels](https://learn.microsoft.com/en-us/aspnet/core/test/dev-tunnels?view=aspnetcore-7.0) for the WebApp and WebApi, which need public facing URLs if you want to allow others to use the app against your local dev machine without first deploying the WebAPI and WebApp to Azure.
- Alternatively, you can use [NGROK tunnels](https://ngrok.com/). 
- Install the latest version of .NET 6 and node.js.

## Setup and  Configuration

Each project contains a README file with details for setup and  configuration.
