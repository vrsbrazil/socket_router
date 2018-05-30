var _round_robin = require("./round_robin");

function connection_handler(io){

  var client_connections = new Map();
  var server_connections = new Map();

  function routeRequest(message, connection_name, socket){

    try{

      message.client = socket.id;

      var connection = server_connections.get(connection_name);

      if(!connection) throw new Error("No servers found");

      var server = connection.next();

      server.emit("request", message);


    }catch(error){

      console.log(error);

      try{

        message.error = error.message;


        socket.emit(message.id, message);

      }catch(err){

        console.log(err);

      }


    }


  }

  function routeResponse(value, connection_name, socket){

    try{

      var id = value.id;
      var client = value.client;

      var clientSocket = client_connections.get(connection_name).get(client);

      clientSocket.emit(id, value);


    }catch(error){

      console.log(error);

      try{

        message.error = error.message;

        socket.emit("error", value);

      }catch(err){

        console.log(err);

      }

    }

  }

  function handleClientDisconnect(connection_name, socket){

    try{

      client_connections.get(connection_name).delete(socket.id);

    }catch(error){

      console.log(error);

    }


  }

  function handleServerDisconnect(connection_name, socket){

    try{

      server_connections.get(connection_name).elements().delete(socket);

    }catch(error){

      console.log("server deletion failed");
      console.log(error);

    }


  }

  function routeStream(socket, connection_name, value, direction){

    value.service = connection_name;
    value.direction = direction;

    io.to('stream').emit('message',value);

  }

  function clientconnectionWatcher(socket,connection_name){

    socket.on('request', function(value) {

      routeRequest(value, connection_name, socket);
      routeStream(socket, connection_name, value, 'request');

    });

    socket.on('disconnect',function() {

    handleClientDisconnect(connection_name, socket);

  });

  }

  function serverConnectionWatcher(socket,connection_name){

    socket.on('response', function(value) {

      console.log("Service responded on " + connection_name);

      routeResponse(value, connection_name, socket);
      routeStream(socket, connection_name, value, 'response');

    });

    socket.on('disconnect',function() {

    handleServerDisconnect(connection_name, socket);

  });

  }

  function joinCollection(socket,connection_name, collection){

      if(!collection.has(connection_name)){

        collection.set(connection_name, new Map());

      }

      collection.get(connection_name).set(socket.id, socket);


  }

  function joinServerCollection(socket,connection_name, collection){

      if(!collection.has(connection_name)){

        collection.set(connection_name, new _round_robin(new Set()));

      }

      collection.get(connection_name).elements().add(socket);


  }

  function joinClientconnection(socket,connection_name){

      joinCollection(socket,connection_name, client_connections);

      clientconnectionWatcher(socket,connection_name);

  }

  function joinServerConnection(socket,connection_name){

      joinServerCollection(socket,connection_name, server_connections);

      serverConnectionWatcher(socket,connection_name);

  }

  function clientRole(socket, connection){

    joinClientconnection(socket, connection.name);

  }

  function serverRole(socket, connection){

    joinServerConnection(socket,connection.name);

  }

  function streamRole(socket, connection){

    socket.join('stream');

  }

  function checkRole(socket, connection){

    if(!connection.name){
      throw new Error("connection.name is undefined");
    }
    if(!connection.role){
      throw new Error("connection.role is undefined");
    }

    switch(connection.role){
      case 'client':
        clientRole(socket, connection);
      break;
      case 'server':
        serverRole(socket, connection);
      break;
      case 'stream':
        streamRole(socket, connection);
      break;
      default:
        throw new Error("connection.role is not recognized, accepted values: client, server, stream");
    }

  }

  this.onconnection = function(socket){

    socket.on('register', function(connection){
      try{

        console.log(connection);

        checkRole(socket, connection);

      }catch(error){

        console.log(error);

      }


    });

  }

}

module.exports = connection_handler;
