var _connection_handler = require("./app/connection_handler")

function socket_router(io){

  var connection_handler = new _connection_handler(io);

  console.log(connection_handler);

  io.on('connect', function(socket){

    console.log('Connected');

    connection_handler.onconnection(socket);

  });

}

module.exports = socket_router;
