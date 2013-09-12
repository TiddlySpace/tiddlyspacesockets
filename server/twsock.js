#!/usr/bin/env node

/*global process:false, require:false, console:false*/
process.title = "twsock";

var io1 = require("socket.io").listen(8080),
    io2 = require("socket.io").listen(8081),
    bs = require("nodestalker"),
    bsClient = bs.Client(),
    TUBE = "socketuri";

var attributes = [
    "modifier",
    "creator",
    "tags",
    "bag"
];

io1.enable("browser client minification");
io1.enable("browser client etag");
io1.enable("browser client gzip");
io1.set("log level", 1);
io2.enable("browser client minification");
io2.enable("browser client etag");
io2.enable("browser client gzip");
io2.set("log level", 1);

var onConnection = function(socket) {
    socket.on("subscribe", function(data) {
        socket.join(data);
        if (data !== "*") {
            socket.leave("*");
        }
    });
    socket.on("unsubscribe", function(data) {
        socket.leave(data);
    });
};

io1.sockets.on("connection", onConnection);
io2.sockets.on("connection", onConnection);

var resJob = function(deleteJobFunction) {
    bsClient.reserve().onSuccess(function(job) {
        console.log("reserved", job.id);

        var tiddler = JSON.parse(job.data);
        attributes.forEach(function(attribute) {
            var value = tiddler[attribute];
            if (Array.isArray(value)) {
                value.forEach(function(item) {
                    io1.sockets.in(attribute + "/" + item).emit("tiddler", tiddler.fields._uri);
                    io2.sockets.in(attribute + "/" + item).emit("tiddler", tiddler.fields._uri);
                });
            } else if (typeof value !== "undefined") {
                io1.sockets.in(attribute + "/" + value).emit("tiddler", tiddler.fields._uri);
                io2.sockets.in(attribute + "/" + value).emit("tiddler", tiddler.fields._uri);
            }
        });
        io1.sockets.in("*").emit("tiddler", tiddler.fields._uri);
        io2.sockets.in("*").emit("tiddler", tiddler.fields._uri);
        deleteJobFunction(job);
    });
};

var deleteJob = function(job) {
    bsClient.deleteJob(job.id).onSuccess(function(deleteMessage) {
        console.log("delmessage", job.id, deleteMessage);
        resJob(deleteJob);
    });
};

var doMain = function() {
    bsClient.watch(TUBE).onSuccess(function() {
        bsClient.ignore("default").onSuccess(function() {
            resJob(deleteJob);
        });
    });
};

var addListeners = function(c) {
    c.addListener("error", function(err) {
        console.log("beanstalk error", err);
    });
    c.addListener("end", function(err) {
        console.log("beanstalk end", err);
    });
    c.addListener("close", function(err) {
        console.log("beanstalk close", err);
        console.log("will retry");
        bsClient = bs.Client();
        addListeners(bsClient);
        doMain();
    });
};

addListeners(bsClient);
doMain();
