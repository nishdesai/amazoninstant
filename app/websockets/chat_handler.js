module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
	    socket.on('disconnect', function() {
	    	// do stuff
	    });

		// when the server gets video time, we broadcast it to last joined user
	    // socket.on('get video time', function(room, currentTime, username) {
    	// 	socket.broadcast.emit('give video time', {
	    //         username: username,
	    //         room: room,
	    //         currentTime: currentTime
	    //     });
	    // });
	});
}