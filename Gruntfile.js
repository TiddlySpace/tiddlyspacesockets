/*global module:false, require:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                quotmark: "double",
                trailing: true,
                maxlen: 120,
                undef: true,
                unused: true,
                boss: true,
                browser: true,
                es5:true,
                sub: true,
                globals: {
                }
            },
            gruntfile: {
                src: "Gruntfile.js"
            },
            server: {
                src: ["server/*.js"]
            },
            client: {
                src: ["client/assets/embed.js", "client/assets/ts-sockets.js", "client/assets/mockjax.js"]
            }
        },
        clean: [
            "client/assets/mustache.js", "client/assets/simpledate.js", "client/assets/reset.css",
            "client/assets/jquery.js", "client/assets/mustache.js"
        ],
        wget: {
            "client/assets/simpledate.js":
                "https://raw.github.com/gist/1010595/bd741574e760b170e5cb246ac5cac95bed33b0a3/simpledate.js",
            "client/assets/reset.css": "http://tiddlyspace.com/bags/common/tiddlers/reset.css",
            "client/assets/jquery.js": "http://tiddlyspace.com/bags/common/tiddlers/jquery.js",
            "client/assets/mustache.js": "https://raw.github.com/janl/mustache.js/master/mustache.js"
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["wget", "jshint"]);

    grunt.registerTask("wget", "Download external resources", function() {

        var shell = require("shelljs");
        var config = grunt.config.get("wget");

        for(var key in config) {
            if(config.hasOwnProperty(key)) {
                var value = config[key];
                shell.exec("wget " + value + " -O " + key);
            }
        }
    });

    grunt.registerTask("package", "package up twsock into an executable node application", function() {

        var shell = require("shelljs");
        shell.exec("npm pack");
    });

    grunt.registerTask("install", "install twsock as a node application, available globally", function() {

        var shell = require("shelljs");
        var version = grunt.config.get("pkg").version;

        shell.exec("npm install -g twsock-" + version + ".tgz");
    });
};
