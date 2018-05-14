var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var socket_router = require('.');

var app = express();
var server = http.Server(app);
var io = socketio(server);
var router = new socket_router(io);
var port = 8080;

process.argv.forEach(function (val, index, array) {

  try{

    if(val.startsWith("port=")){

      port = val.substr(5);

      console.log("Port number " + port);

    }

  }catch(error){

    console.log("port parameter was not recognized, attempting on 8080");

  }

});

server.listen(port);
