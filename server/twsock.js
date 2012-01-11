/* 
 * Needs websocket-server and (eventually) nodestalker, available 
 * from npm.
 */

var ws = require('websocket-server');
var server = ws.createServer();

server.on("connection", function(connection){
    console.log('got connection', connection);
});

var counter = 0;

setInterval(function() {
    console.log("wanna send broadcast!");
    counter++;
    server.broadcast("oh you know" + counter);
}, 1000);

server.listen(8080);
