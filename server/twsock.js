/*global process:false, require:false, console:false*/
process.title = "twsock";

var io = require("socket.io").listen(8081),
    bs = require("nodestalker"),
    bsClient = bs.Client(),
    TUBE = "socketuri";

var attributes = [
    "modifier",
    "creator",
    "tags",
    "bag"
];

io.enable("browser client minification");
io.enable("browser client etag");
io.enable("browser client gzip");
io.set("log level", 1);

io.sockets.on("connection", function(socket){
    socket.on("subscribe", function(data) {
        socket.join(data);
        if (data !== "*") {
            socket.leave("*");
        }
    });
    socket.on("unsubscribe", function(data) {
        socket.leave(data);
    });
});

var resJob = function(deleteJobFunction) {
    bsClient.reserve().onSuccess(function(job) {
        console.log("reserved", job.id);

        var tiddler = JSON.parse(job.data);
        attributes.forEach(function(attribute) {
            var value = tiddler[attribute];
            if (Array.isArray(value)) {
                value.forEach(function(item) {
                    io.sockets.in(attribute + "/" + item).emit("tiddler", tiddler.fields._uri);
                });
            } else if (typeof value !== "undefined") {
                io.sockets.in(attribute + "/" + value).emit("tiddler", tiddler.fields._uri);
            }
        });
        io.sockets.in("*").emit("tiddler", tiddler.fields._uri);
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
