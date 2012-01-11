$.ajax = function(options) {
	if(options.url === "/status") {
		return options.success({
			server_host: {
				host: "tiddlyspace.com",
				scheme: "http",
				port: "80"
			}
		});
	} else {
		var tiddler = {
			title: "disney music",
			modifier: "jon"
		};
		options.success(tiddler);
	}
};
