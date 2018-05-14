var io = require("socket.io-client");

var url;

process.argv.forEach(function (val, index, array) {

  try{

    if(val.startsWith("url=")){

      url = val.substr(4);

      console.log("URL " + url);

    }

  }catch(error){

    throw new Error("url parameter was not recognized");

  }

});

if(!url){
  throw new Error("url parameter is required");
}

var socket = io.connect(url);

var roomMessage = {
  "name": "teste",
  "role": "server"
}

socket.on("connect", function(json){

  console.log("connected");

  socket.emit("register", roomMessage);

});

socket.on("request", function(json){

  console.log(json);

  socket.emit("response", json);

});



socket.emit("request", "service");
