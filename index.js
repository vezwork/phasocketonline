var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usercount = 0;
var userhashmap = {};
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use('/assets', express.static('assets'));
app.use('/js', express.static('js'));
//404
app.use(function(req, res, next) {
    res.status(404).send('404: Sorry cant find that!');
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