#!/usr/local/bin/node
/* 
 * Needs websocket-server and (eventually) nodestalker, available 
 * from npm.
 */

var beanstalkRetries = 0;

var io = require('socket.io').listen(8081),
    bs = require('nodestalker'),
    bsClient = bs.Client(),
    TUBE = 'socketuri';

var addListeners = function(c) {
    c.addListener('error', function(err) {
        console.log('beanstalk error', err);
    });
    c.addListener('end', function(err) {
        console.log('beanstalk end', err);
    });
    c.addListener('close', function(err) {
        console.log('beanstalk close', err);
        console.log('will retry');
        bsClient = bs.Client();
        addListeners(bsClient);
        doMain();
    });
};

io.sockets.on("connection", function(socket){
    console.log('got connection', socket);
    socket.join('*');
    socket.on('subscribe', function(data) {
        socket.join(data);
        if (data !== '*') {
            socket.leave('*');
        }
    });
    socket.on('unsubscribe', function(data) {
        socket.leave(data);
    });
});

var deleteJob = function(job) {
    bsClient.deleteJob(job.id).onSuccess(function(del_msg) {
        console.log('delmessage', job.id, del_msg);
        resJob();
    });
};

var resJob = function() {
    bsClient.reserve().onSuccess(function(job) {
        console.log('reserved', job);

        var tiddler = JSON.parse(job.data);
        ['modifier', 'creator', 'tags'].forEach(function(attribute) {
            var value = tiddler[attribute];
            if (Array.isArray(value)) {
                value.forEach(function(item) {
                    io.sockets.in(attribute + '/' + item)
                        .emit('tiddler', tiddler.fields._uri);
                });
            } else {
                io.sockets.in(attribute + '/' + value)
                        .emit('tiddler', tiddler.fields._uri);
            }
        });
        io.sockets.in('*')
            .emit('tiddler', tiddler.fields._uri);
        deleteJob(job);
    });
};

var doMain = function() {
    bsClient.watch(TUBE).onSuccess(function(data) {
        bsClient.ignore('default').onSuccess(function(data) {
            resJob();
        });
    });
};

addListeners(bsClient);
doMain();
