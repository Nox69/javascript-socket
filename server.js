function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {

		socket.on('register', (data) => {
			const message = 'Welcome ' + data.username + ' !!';
			socket.emit('welcomeMessage', message);

			data.channels.map((channel) => {
				socket.join(channel);
				socket.emit('addedToChannel', {'channel': channel});
			});
			socket.on('message', (data) => {
				socket.to(data.channel).emit('newMessage', data);
			});
			socket.on('joinChannel', (data) => {
				socket.emit('addedToChannel', {'channel': data.channel});
			})
			socket.on('leaveChannel', (data) => {
				socket.leave(data.channel);
				socket.emit('removedFromChannel', {'channel' : data.channel});
			});
		});
	});
}
module.exports = bootstrapSocketServer;
