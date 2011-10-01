var express = require('express');
var nodephp = require('nodephp');

var app = express.createServer();

var io = require('socket.io').listen(app);
var fs = require('fs');
app.listen(80);

// Disable the layout.
app.configure(function(){
    app.set("view options", {layout: false});
});

// Allow to retrieve static files from the root (now)
app.use(express.static(__dirname + '/'));

// First route
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

// Ajax call to the PHP script.
app.get('/translate/pirate', function(req, res) {
    nodephp.servePhp(
        '/pirate.php', __dirname + '/php', req, res, {}, {
            "fcgi": { 
                host: "127.0.0.1",
                port: 9000
            }
        }
    );
});

var nicknames = {};

// Chat app.
io.sockets.on('connection', function (socket) {
   socket.on('user message', function (msg) {
       socket.broadcast.emit('user message', socket.nickname, msg);
   });

   socket.on('nickname', function (nick, fn) {
       if (nicknames[nick]) {
           fn(true);
       } else {
           fn(false);
           nicknames[nick] = socket.nickname = nick;
           socket.broadcast.emit('announcement', nick + ' connected');
           io.sockets.emit('nicknames', nicknames);
       }
   });

   socket.on('disconnect', function () {
       if (!socket.nickname) {
           return;
       }

       delete nicknames[socket.nickname];
       socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
       socket.broadcast.emit('nicknames', nicknames);
   });
});
