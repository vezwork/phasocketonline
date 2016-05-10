var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Utils = require('./utils.js'); module.exports.Utils=Utils;				// Here we are loading the file utils.js like if it were a class
var Sockets = require('./sockets.js'); module.exports.Sockets=Sockets;		// This is really useful for not having a huge cryptic file, and instead a lot of small files

var broadcast_rate = 25; 								// Updates sent per second to the users
var port = process.env.PORT || 3000;                    // Server-fixed port or default port 3000 for localhost

app.get('/', function(req, res){                        // response handler
    res.sendFile(__dirname + '/index.html');            // default response
});

app.use('/assets', express.static('assets'));           // serve the assets folder
app.use('/js', express.static('js'));                   // serve the js folder

app.use(function(req, res, next) {                      // 404 response handler
    res.status(404).send('404: Sorry cant find that!'); // basic 404 response
});                            							


io.on('connection', function(socket){                   // socket.io on connection to client
	Sockets.add(socket);								// We add the socket to the Sockets list
	  
    socket.on('disconnect', function() {                // Someone leaves on socket.on('disconnect', ...

		Sockets.remove(socket);							// We remove the socket from the Sockets list

    });
    socket.on('clientinfo', function(msg) {             // Recieve info about the socket, i.e. their x, y, animation
														// (You should code your security here, or better, in the updateInfo function)
		Sockets.updateInfo(socket, msg);                // and you store the data

    });
});


setInterval(function () {												// Send the list of connected sockets to all sockets
	Sockets.setHashmap();												// Here we update the userhashmap variable in order to sent it to everybody
	for (var i = 0; i < Sockets.sockets.length; i++) {					// Here we do a for loop for every user in the sockets array
		var socket=Sockets.sockets[i];
		if (socket.data.loged) {										// if the user hasn't loged yet, he doesn't care about this atm
			socket.emit('userhashmap', Sockets.getUserHashMap());		// socket.emit sends a message to the target user
		}
	}
}, 1000/broadcast_rate);    											// 1 second / broadcast_rate = miliseconds between every update


http.listen(port, function(){	// http serving
    console.log('Server listening on ' + port);
});