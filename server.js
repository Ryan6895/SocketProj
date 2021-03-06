const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

var users = [];

app.use(express.static(path.join(__dirname,"public")));

io.on('connection', function(socket) {
  console.log('new connection made');

  socket.on('get-users',function() {
      socket.emit('all-users',users);
  })

    socket.on('join', function(data){
        console.log(data);
        console.log(users);
        socket.nickname = data.nickname;
        users[socket.nickname] = socket;
        var userObj = {
            nickname: data.nickname,
            socketid: socket.id
        }
        users.push(userObj);
        io.emit('all-users', users);
    });

    //broadcast the event
    socket.on('send-message', function(data){
        //socket.broadcast.emit('message-recieved', data);
        io.emit('message-received', data);
    });

    socket.on('send-like', function(data){
        console.log(data);
        socket.broadcast.to(data.like).emit('user-liked',data);
    })
});

server.listen(port,function(){
    console.log(`Listening on port ${port}`);
});