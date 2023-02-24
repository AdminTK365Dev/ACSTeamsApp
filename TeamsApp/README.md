# Teams App
This project contains the manifest file and images necessary for configuration and installation of the Teams app.

## Create the .zip file
Anytime the manifest is updated (such as when the URL for the WebApp changes) a new zip file is required and the app must be uninstalled and reinstalled. The file makemanifest.cmd simply executes the following:

```
powershell.exe Compress-Archive -Path \"Manifest\*\" -DestinationPath \"WoodgroveTeamsApp.zip\" -Force
```

## Install the app
During development, sideloading directly into the Teams client is the easiest and fastest method. [Upload your app in Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload). Once the app is ready for broader distribution among users in a tenant, it can be uploaded to the Teams store for the tenant. [Publish a custom app by uploading an app package](https://learn.microsoft.com/en-us/microsoftteams/upload-custom-apps)

## Send Activity Feed Notifications
You can send activity feed notifications for the app using Graph API. [Send activity feed notifications to users in Microsoft Teams](https://learn.microsoft.com/en-us/graph/teams-send-activityfeednotifications?tabs=http)

The included the desired notification types in the manifest, along with the AAD registered app that has the necessary permissions to send notifications.

```
  "webApplicationInfo": {
    "id": "00000000-0000-0000-0000-000000000000",
    "resource": "https://localhost:3978"
  },
  "activities":
  {
    "activityTypes": [
      {
        "type": "newLoanApplication",
        "description": "New Loan Application",
        "templateText": "You have a new loan application from {customerName}."
      }
    ]
  },
```

A sample Graph API call:

```
POST https://graph.microsoft.com/v1.0/users/[user object id]/teamwork/sendActivityNotification

{
    "topic": {
        "source": "entityUrl",
        "value": "https://graph.microsoft.com/v1.0/users/[user object id]/teamwork/installedApps/YWQ0MTM0MzQtYjQ2ZS00OTJmLWFhODktOWVkOWZiY2JkNDFmIyM1ZmU0NjE2ZC05OTE4LTQ0YzYtYThhYi1iZTdjZmJjODVjYmE="
    },
    "activityType": "newLoanApplication",
    "previewText": {
        "content": "New Loan Application"
    },
    "templateParameters": [
        {
            "name": "customerName",
            "value": "Dakota Sanchez"
        }
    ]
}
```
