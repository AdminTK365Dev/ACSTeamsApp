import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient } from "@azure/communication-chat";

const config = require("./acsclientconfig.json");

const messagesContainer = document.getElementById("messages-container");
const chatBox = document.getElementById("chat-box");
const sendMessageButton = document.getElementById("send-message");
const messagebox = document.getElementById("message-box");

const customerSelect = document.getElementById("customerSelect");
const threadDetail = document.getElementById("threadDetail");
const threadMessagesSpan = document.getElementById("threadMessages");

// customer or employee
const userType = document.getElementById("userType").innerText;
let userTokenCredential;

let employee;
let customer;
let customerThreadId;
let fhlChatClient;
let fhlChatThreadClient;

async function init() {

	if (userType == "employee") {
		fetch(config.apiRootUrl + "/api/employee?aadId=" + document.getElementById("teamsUserId").innerText)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setEmployee(data);
			})
			.catch(error => console.log(error));
	}

	fetch(config.apiRootUrl + "/api/customer")
		.then(response => response.json())
		.then(data => {
			console.log(data);
			populateCustomerSelect(data);
		})
		.catch(error => console.log(error));
}

setTimeout(init, 1000);
//init();

function setEmployee(employeeData) {
	employee = employeeData;
	document.getElementById("teamsUserAcsId").innerText = employee.acsId;
}

function populateCustomerSelect(data) {
	var option = document.createElement("OPTION");
	option.innerHTML = "Select Customer";
	option.value = "";
	customerSelect.options.add(option);

	for (var c of data) {
		var option = document.createElement("OPTION");
		option.innerHTML = c.displayName;
		option.value = c.acsId;
		customerSelect.options.add(option);
	}
}

customerSelect.addEventListener("change", (e) => {
	fetch(config.apiRootUrl + "/api/customer?acsId=" + e.target.value)
		.then(response => response.json())
		.then(data => {
			setCustomer(data);
		})
		.catch(error => console.log(error));
});

function setCustomer(customerData) {
	customer = customerData;
	console.log(customer);

	var customerName = document.createElement('div');
	customerName.innerHTML = `<span class="customer-name-heading">${customer.displayName}</span>`;
	if (customer.customerSince) customerName.innerHTML +=`<span style="font-style:italic; font-size:14px"><br />Customer since ${customer.customerSince}</span>`;
	customerSelect.style.display = "none";
	document.getElementById('customerSelectName').appendChild(customerName);

	var customerDetail = document.createElement('div');
	customerDetail.innerHTML =
		`<span class="customer-info-heading">Customer Information</span>
		<table style="border:none; padding:0px;">
			<tr><td style="width:100px;">Address</td><td>${customer.address}</td></tr>
			<tr><td style="width:100px;"></td><td>${customer.cityStateZip ? customer.cityStateZip : ''}</td></tr>
			<tr><td>Phone</td><td>${customer.primaryPhone}</td></tr>
			<tr><td>SSN</td><td>${customer.ssn ? customer.ssn : ''}</td></tr>
		</table>`
	customerDetail.innerHTML += `<p></p><span class="customer-info-heading">Accounts<br/></span>`;
	if (!customer.accounts) {
		customerDetail.innerHTML += `No accounts.`;
	} else {
		var accountsTable = 
			`<table style="width:40%; border:none; padding:0px;">
			<tr><th>Account Number</th><th>Type</th></tr>`;
		for (var account of customer.accounts) {
			accountsTable += `<tr><td>${account.number}</td><td>${account.type}</td></tr>`;
		}
		accountsTable += `</table>`;
		customerDetail.innerHTML += accountsTable;
	}
	document.getElementById('customer-detail-grid-item').appendChild(customerDetail);

	var customerMeetings = document.createElement('div');
	customerMeetings.innerHTML = '<span class="customer-info-heading">Upcoming meetings<br /></span>';
	if (!customer.meetings) {
		customerMeetings.innerHTML += 'No meetings.';
	} else {
		for (var meeting of customer.meetings) {
			customerMeetings.innerHTML +=
				`<p>${meeting.title}<br /><span style="font-size:smaller;">${meeting.date}<br />
				<a href=".">Join</a> | <a href=".">Reschedule</a> | <a href=".">Cancel</a> </span></p>`;
		}
	}
	customerMeetings.innerHTML += '<p><a href=".">Schedule new meeting</a></p>';
	document.getElementById('customer-meetings-grid-item').appendChild(customerMeetings);

	var customerDocuments = document.createElement('div');
	customerDocuments.innerHTML = '<span class="customer-info-heading">Documents<br /></span>';
	if (!customer.documents) {
		customerDocuments.innerHTML += 'No documents.';
	} else {
		for (var doc of customer.documents) {
			customerDocuments.innerHTML += `<p>${doc.title}<br /><span style="font-size:smaller;">${doc.date}<br /><a href=".">View</a> | <a href=".">Edit</a></span></p>`;
		}
	}
	customerDocuments.innerHTML += '<p><a href=".">Upload new document</a></p>';
	document.getElementById('customer-documents-grid-item').appendChild(customerDocuments);

	document.getElementById('customer-grid-container').style.visibility = "visible";

	// get the chat thread
	// if userType is customer, then only customer acsId is specified
	// if userType is employee, then both customer acdID and employee aadId are specified
	var getChatThreadUrl = config.apiRootUrl + "/api/customerChatThread?customerAcsId=" + customer.acsId;
	if (userType == "employee") getChatThreadUrl += "&employeeAadId=" + employee.aadId;
	fetch(getChatThreadUrl)
		.then(response => response.text())
		.then(data => {
			console.log(data);
			initializeChat(data);
		})
		.catch(error => console.log(error));
}

async function getUserTokenCredential(user) {
	try {
		console.log(`getting token for: ${user.acsId}`);
		var response = await fetch(config.apiRootUrl + "/api/accessToken?acsId=" + user.acsId);
		var tokenData = await response.text();
		console.log(`tokenData: ${tokenData}`);
		userTokenCredential = new AzureCommunicationTokenCredential(tokenData);
	}
	catch (e) {
		console.error(e);
	}
}

async function initializeChat(threadId) {
	customerThreadId = threadId;
	threadDetail.innerHTML = customerThreadId;

	if (userType == "employee") {
		await getUserTokenCredential(employee);
	}
	else {
		await getUserTokenCredential(customer);
	}

	console.log(`userTokenCredential: ${userTokenCredential}`);

	fhlChatClient = new ChatClient(config.endpointUrl, userTokenCredential);
	fhlChatThreadClient = fhlChatClient.getChatThreadClient(customerThreadId);
	var properties = await fhlChatThreadClient.getProperties();
	threadDetail.innerHTML += `<br/>${properties.topic}`;
	var participantsList = fhlChatThreadClient.listParticipants();
	for await (var participant of participantsList) {
		threadDetail.innerHTML += `<br/>${participant.displayName}`;
	}

	document.getElementById('messages-container').hidden = false;
	updateMessages();

	// open notifications channel
	await fhlChatClient.startRealtimeNotifications();
	fhlChatClient.on("chatMessageReceived", (e) => {
		console.log("Notification chatMessageReceived!");
		console.log(e);

		// check whether the notification is intended for the current thread
		if (customerThreadId != e.threadId) {
			return;
		}

		updateMessages();
	});
}

async function updateMessages() {
	var messages = '';
	var currentUserAcsId = (userType == "employee") ? employee.acsId : customer.acsId;
	try {
        let messageList = await fhlChatThreadClient.listMessages();
        for await (var msg of messageList) {
			if (msg.type == "text") {
				if (currentUserAcsId == msg.sender.communicationUserId) {
					messages += `<div class="container darker">${getMessageDisplayDate(msg.createdOn)}<br/>${msg.content.message}</div>`
				}
				else {
					messages += `<div class="container lighter"> <b>${msg.senderDisplayName}</b>&nbsp;&nbsp;${getMessageDisplayDate(msg.createdOn)}<br/>${msg.content.message}</div>`;
				}
            }
		}
		threadMessagesSpan.innerHTML = messages;
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

async function renderReceivedMessage(sender, message) {
	messagesContainer.innerHTML += '<div class="container lighter"> <b>' + sender + '</b><br/>' + message + '</div>';
}

async function renderSentMessage(message) {
	messagesContainer.innerHTML += '<div class="container darker">' + message + '</div>';
}

async function sendMessage() {
	var displayName = (userType == "employee") ? employee.displayName : customer.displayName;
	var sendMessageRequest = { content: messagebox.value };
	var sendMessageOptions = { senderDisplayName: displayName };
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
