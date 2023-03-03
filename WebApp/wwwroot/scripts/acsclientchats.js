import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient } from "@azure/communication-chat";

const config = require("./acsclientconfig.json");
const apiRootUrl = config.apiRootUrl; // "https://fhl2023.azurewebsites.net";
//const apiRootUrl = "https://localhost:7262";

const sendMessageButton = document.getElementById("send-message");
const messagebox = document.getElementById("message-box");

let selectedThreadId;
const chatThreadListGridItem = document.getElementById("chat-thread-list-grid-item");
const chatThreadDetailGridItem = document.getElementById("chat-thread-detail-grid-item");

// customer or employee
const userType = document.getElementById("userType").innerText;
let userTokenCredential;

let employee;
let fhlChatClient;
let fhlChatThreadClient;

async function init() {

	if (userType == "employee") {
		fetchEmployee();
	}
	setTimeout(initChatClient, 2000);
	//	initChatClient();
	//	loadChatThreads();
}

setTimeout(init, 1000);
//init();

function fetchEmployee() {
	console.log(`${apiRootUrl}/api/employee?aadId=${document.getElementById("teamsUserId").innerText}`);
	fetch(apiRootUrl + "/api/employee?aadId=" + document.getElementById("teamsUserId").innerText)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			initEmployee(data);
		})
		.catch(error => console.log(error));
}

async function initEmployee(employeeData) {
	employee = employeeData;
	document.getElementById("teamsUserAcsId").innerText = employee.acsId;

	try {
		console.log(`getting token for: ${employee.acsId}`);
		var response = await fetch(apiRootUrl + "/api/accessToken?acsId=" + employee.acsId);
		var tokenData = await response.text();
		console.log(`tokenData: ${tokenData}`);
		userTokenCredential = new AzureCommunicationTokenCredential(tokenData);
		console.log(`userTokenCredential: ${userTokenCredential}`);
	}
	catch (e) {
		console.error(e);
	}
}

function initChatClient() {
	console.log("Initializing chat client.");
	fhlChatClient = new ChatClient(config.endpointUrl, userTokenCredential);
	fhlChatClient.startRealtimeNotifications();

	loadChatThreads();

	fhlChatClient.on("chatMessageReceived", (e) => {
		console.log("Notification chatMessageReceived!");
		console.log(e);

		// check whether the notification is intended for the current thread
		if (selectedThreadId != e.threadId) {
			return;
		}

		showThreadMessages(selectedThreadId);
	});
}

async function loadChatThreads() {
	var threadList;
	console.log("Getting threads.");

	try {
		threadList = fhlChatClient.listChatThreads();
		for await (var thread of threadList) {
			//console.log(thread);
			if (thread.id.startsWith("19:meeting")) {
				continue;
			}

			var threadDiv = document.createElement('div');
			if (selectedThreadId == null) {
				selectedThreadId = thread.id;
				threadDiv.className = "selected-chat-thread-div";
			}
			else {
				threadDiv.className = "chat-thread-div";
			}
			threadDiv.id = thread.id;
			threadDiv.onclick = function () { showThreadMessages(this.id); };
			threadDiv.innerHTML = `<b>${thread.topic}</b> ${getMessageDisplayDate(thread.lastMessageReceivedOn)}<br/>Message preview here...`;
			chatThreadListGridItem.appendChild(threadDiv);
		}
		showThreadMessages(selectedThreadId);
	}
	catch (error) {
		console.error(error);
	}
}

async function showThreadMessages(threadId) {

	try {
		document.getElementById(selectedThreadId).className = "chat-thread-div";
		document.getElementById(threadId).className = "selected-chat-thread-div";
		selectedThreadId = threadId;

		chatThreadDetailGridItem.innerHTML = '';

		fhlChatThreadClient = await fhlChatClient.getChatThreadClient(threadId);
		var messages = '';
		var messageList = fhlChatThreadClient.listMessages();
		for await (var msg of messageList) {
			//console.log(msg);
			if (msg.type == "text") {
				if (msg.sender.communicationUserId == employee.acsId) {
					messages += `<div class="container darker">${getMessageDisplayDate(msg.createdOn)}<br/>${msg.content.message}</div>`;
				}
				else {
					messages += `<div class="container lighter"> <b>${msg.senderDisplayName}</b>&nbsp;&nbsp;${getMessageDisplayDate(msg.createdOn)}<br/>${msg.content.message}</div>`;

				}
			}
		}
		chatThreadDetailGridItem.innerHTML = messages;
	}
	catch (error) {
		console.error(error);
	}
}

function getMessageDisplayDate(messageDate) {
	var d = new Date(messageDate);
	var t = new Date();

	var isSameDay = (d.getDate() === t.getDate()
		&& d.getMonth() === t.getMonth()
		&& d.getFullYear() === t.getFullYear());

	return (isSameDay) ? d.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
		: d.toLocaleDateString([], { month: "numeric", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
}

async function sendMessage() {
	if (messagebox.value == '') {
		console.log("not sending");
		return;
	}
	var sendMessageRequest = { content: messagebox.value };
	var sendMessageOptions = { senderDisplayName: employee.displayName };
	var sendChatMessageResult = await fhlChatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
	var messageId = sendChatMessageResult.id;

	messagebox.value = '';
	console.log(`Message sent!, message id:${messageId}`);
}

messagebox.addEventListener("keydown", async (e) => {
	if (e.ctrlKey && e.key === "Enter") {
		await sendMessage();
	}
});

sendMessageButton.addEventListener("click", async () => {
	await sendMessage();
});