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



var roomMessage = {
  "name": "teste",
  "role": "client"
}





var socket = io.connect(url);

socket.on("connect", function(json){

  socket.emit("register", roomMessage);

});

function chamarTeste(id){

  socket.on(id, function(value){

    console.log("Responded");
    console.log(value);

  })

  socket.emit("request", {
    "body": "body",
    "id": id
  });

  id++;

  setTimeout(function(){

    chamarTeste(id);

  }, 500);

}


chamarTeste(0);
