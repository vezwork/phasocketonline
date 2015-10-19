var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usercount = 0;
var userhashmap = {};                                   //stores client information
var port = process.env.PORT || 3000;                    //heroku port or default port 3000

app.get('/', function(req, res){                        //response handler
    res.sendFile(__dirname + '/index.html');            //default response
});
app.use('/assets', express.static('assets'));           //serve the assets folder
app.use('/js', express.static('js'));                   //serve the js folder
//404
app.use(function(req, res, next) {                      //404 response handler
    res.status(404).send('404: Sorry cant find that!'); //basic 404 response
});


io.on('connection', function(socket){                   //socket.io on connection to client

    function communicateJoin(status) {                  //function for handling socket io connections
        if (status == '+') {                            //status just checks if you want the function to handle a join
                                                        //or a leave
            usercount += 1;                             //if a user joins add 1 to the usercount
        } else if (status == '-') {
            usercount -= 1;
            delete userhashmap[socket.id];              //get rid of the info of the logged in socket when they leave
        }
        console.log(status + socket.id);
        console.log("users: " + usercount);

        for (var x in userhashmap) {                    //list connected sockets whenever someone leaves or joins
            console.log(" |  " + x);
        }
    }

    communicateJoin("+");                               //someone joins on io.on('connection', ...

    setInterval(function () {                           //send out the list of connected sockets to all sockets
        if (usercount > 0) {
            socket.emit('userhashmap', userhashmap);
        }
    }, 100);                                            //every 100 ms

    socket.on('disconnect', function() {                //someone leaves on socket.on('disconnect', ...

        communicateJoin("-");

    });
    socket.on('clientinfo', function(msg) {             //recieve info about the socket, i.e. their x, y, animation

        userhashmap[socket.id] = msg;                   //and put it in userhashmap associated with their socket id

    });
});


http.listen(port, function(){                           //http serving
    console.log('listening on ' + port);
});