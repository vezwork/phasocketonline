var file=module.parent.exports;

var sockets=[];
var userhashmap={};

var add=function(socket) {
	socket.data={};
	socket.data.loged=false;
	sockets.push(socket);
	
	console.log('Adding ' + socket.id);
	listConnectedSockets();
};

var remove=function(socket) {
	file.Utils.removeA(sockets, socket);
	
	console.log('Removing ' + socket.id);
	listConnectedSockets();
};

var updateInfo=function(socket, msg) {
	socket.data.loged=true;
	socket.data.info=msg;
};

var listConnectedSockets=function() {
	console.log("users: " + sockets.length);

	for (var i = 0; i < sockets.length; i++) {	//list connected sockets whenever someone leaves
		var user=sockets[i];
		console.log(" |  " + user.id);
	}
};

var getUserHashMap=function() {
	return userhashmap;
};

var setHashmap=function() {
	hashmap={};
	for (var i = 0; i < sockets.length; i++) {	//list connected sockets whenever someone leaves
		var user=sockets[i];
		if(user.data.loged) {
			hashmap[user.id]=user.data.info;
		}
	}
	userhashmap=hashmap;
};


module.exports.add=add;
module.exports.updateInfo=updateInfo;
module.exports.getUserHashMap=getUserHashMap;
module.exports.setHashmap=setHashmap;
module.exports.remove=remove;
module.exports.sockets=sockets;