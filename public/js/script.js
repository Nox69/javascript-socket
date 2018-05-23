/* main function to send the message to collect the value of message
   and channel entered and broadcast it */

function sendMessage(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('channel').value;
	const message = document.getElementById('message').value;
	const username = document.getElementById('username').value;
	const chatContainer = document.getElementById('chatContainer');
	const chatMessage = document.createElement('div');
	chatMessage.className = 'col-12';
	chatMessage.innerHTML = `
	<div class="card sent-message">
		<div class="card-body">
			<p class="card-text">Me : ${message} </p>
		</div>
	</div>`;
	//console.log(chatmessage);
	//console.log(channel);
	//console.log(username);// to check the date  retrieve is correct or not
	chatContainer.insertBefore(chatMessage, chatContainer.firstChild);
	document.getElementById('message').value = '';
	document.getElementById('channel').value = '';
	/*code to add user to the channel which he entered but is not registered in */
	if (!document.getElementById('channelsList').innerHTML.includes(channel)) {
		socket.emit('joinChannel', { channel });
	}
	socket.emit('message', { username, channel, message });
}
/*adding the new channel */

function joinChannel(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('newchannel').value;
	if (channel && channel !== '') {
		socket.emit('joinChannel', { channel });
		document.getElementById('newchannel').value = '';
	}
}
/*removing channel*/
function leaveChannel(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('newchannel').value;
	if (channel && channel !== '') {
		socket.emit('leaveChannel', { channel });
		document.getElementById('newchannel').value = '';
	}
}

/* code to display the defalut welcome from system creating
welcome message card*/
function onWelcomeMessageReceived(msg) {
	const chatContainer = document.getElementById('chatContainer');
	const chatMessage = document.createElement('div');

//comment this later when this works - just for temporary purpose
	// function myFunc(theObject) {
	//   chatContainer.className = 'Toyota';
	// }
	//
	// var mycar = {make: 'Honda', model: 'Accord', year: 1998};
	// var x, y;
	//
	// x = mycar.make; 
	//
	// myFunc(mycar);
	// y = mycar.make;

	chatMessage.className = 'col-12';
	chatMessage.innerHTML = `
	<div class="card received-message"><div class="card-body">
			<p class="card-text">System : ${msg}</p>
	</div></div>`;
	chatContainer.appendChild(chatMessage);
}

/*code to display the new message recieved in respective channel*/
function onNewMessageReceived(newMessage) {
	if (newMessage) {
		const chatContainer = document.getElementById('chatContainer');
		const chatMessage = document.createElement('div');
		chatMessage.className = 'col-12';
		chatMessage.innerHTML = `
		<div class="card received-message"><div class="card-body">
				<p class="card-text"> ${newMessage.username} : ${newMessage.message} </p>
		</div></div>`;
		chatContainer.insertBefore(chatMessage, chatContainer.firstChild);
	}
}


/*code to send alert on new channel joining and updating the channellist */
function onAddedToNewChannelReceived(newChannel) {
	if (newChannel) {
		const alertContainer = document.getElementById('alertContainer');
		const alertMsg = document.createElement('div');
		//console.log(alertContainer);
		//console.log(alertMsg);
		alertMsg.className = 'alert alert-success alert-dismissible fade show';
		alertMsg.innerHTML = `You are added to <strong>${newChannel.channel}</strong> successfully!`;
		alertContainer.appendChild(alertMsg);
		const channnelList = document.getElementById('channelsList');
		if (!channnelList.innerHTML.includes(newChannel.channel)) {
			const option = document.createElement('option');
			option.id = `chid-${newChannel.channel}`;
			option.innerHTML = newChannel.channel;
			channnelList.appendChild(option);
		}
	}
}

/*code to send alert on channel leaving and updating the channellist*/
function onRemovedFromChannelReceived(removedChannel) {
	if (removedChannel) {
		const alertContainer = document.getElementById('alertContainer');
		const alertMsg = document.createElement('div');
		alertMsg.className = 'alert alert-success alert-dismissible fade show';
		alertMsg.innerHTML = `You are removed from <strong>${removedChannel.channel}</strong> successfully!`;
		alertContainer.appendChild(alertMsg);
		const option = document.getElementById(`chid-${removedChannel.channel}`);
		const channelsList = document.getElementById('channelsList');
		channelsList.removeChild(option);
	}
}
module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};
// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
