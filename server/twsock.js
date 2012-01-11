/* 
 * Needs websocket-server and (eventually) nodestalker, available 
 * from npm.
 */

var ws = require('websocket-server'),
    bs = require('nodestalker');
var server = ws.createServer(),
    bsClient = bs.Client();

var TUBE = 'socketuri';

server.on("connection", function(connection){
    console.log('got connection', connection);
});

var deleteJob = function(job) {
    bsClient.deleteJob(job.id).onSuccess(function(del_msg) {
        console.log('deleted', job);
        console.log('message', del_msg);
        resJob();
    });
};

var resJob = function() {
    bsClient.reserve().onSuccess(function(job) {
        console.log('reserved', job);
        server.broadcast(job.data);
        deleteJob(job);
    });
};

bsClient.watch(TUBE).onSuccess(function(data) {
    bsClient.ignore('default').onSuccess(function(data) {;
        console.log('ignoring');
        resJob();
    });
});

server.listen(8081);
