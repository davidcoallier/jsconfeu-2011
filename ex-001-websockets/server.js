var express = require('express');
var app = express.createServer();

var io = require('socket.io').listen(app);
var fs = require('fs');
app.listen(80);

app.configure(function(){
    app.set("view options", {layout: false});
});


app.use(express.static(__dirname + '/'));



app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});
var nicknames = {};

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
