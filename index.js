var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usercount = 0;
var userhashmap = {};
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/js/phaser.min.js', function(req, res){
    res.sendFile(__dirname + '/js/phaser.min.js');
});
app.get('/assets/platform.png', function(req, res){
    res.sendFile(__dirname + '/assets/platform.png');
});
app.get('/assets/dude.png', function(req, res){
    res.sendFile(__dirname + '/assets/dude.png');
});
app.get('/assets/sky.png', function(req, res){
    res.sendFile(__dirname + '/assets/sky.png');
});


io.on('connection', function(socket){

    function communicateJoin(status) {
        if (status == '+') {
            usercount += 1;
        } else if (status == '-') {
            usercount -= 1;
            delete userhashmap[socket.id];
        }
        console.log(status + socket.id);
        console.log("users: " + usercount);

        for (var x in userhashmap) {
            console.log(" |  " + x);
        }
    }

    communicateJoin("+");

    setInterval(function () {
        if (usercount > 0) {
            socket.emit('userhashmap', userhashmap);
        }
    }, 100);

    socket.on('disconnect', function() {

        communicateJoin("-");

    });
    socket.on('clientinfo', function(msg) {

        userhashmap[socket.id] = msg;

    });
});


http.listen(port, function(){
    console.log('listening on ' + port);
});