/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
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
        curl: {
            "client/assets/simpledate.js":
                "https://raw.github.com/gist/1010595/bd741574e760b170e5cb246ac5cac95bed33b0a3/simpledate.js",
            "client/assets/reset.css": "http://meyerweb.com/eric/tools/css/reset/reset.css",
            "client/assets/jquery.js": "http://tiddlyspace.com/bags/common/tiddlers/jquery.js",
            "client/assets/mustache.js": "https://raw.github.com/janl/mustache.js/master/mustache.js"
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-curl");

    grunt.registerTask("default", ["curl", "jshint"]);
};
